import {authURL, refreshAccessToken} from "./refreshToken";
import {Account, NextAuthConfig} from "next-auth";
import {JWT} from "next-auth/jwt";
import Spotify from "@auth/core/providers/spotify";

export interface AuthUser extends JWT {
  name: string;
  email: string;
  image: string;
  access_token: string;
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id: string;
}

const authOptions: NextAuthConfig = {
  providers: [
    Spotify(
        {
          authorization: authURL.toString()
        }
    )
  ],
  session: {
    maxAge: 7 * 24 * 60 * 60, // 30 Days
  },
  callbacks: {
    async jwt({token, account}: { token: JWT; account: Account | null }) {
      console.log('Called JWT Endpoint');

      // When a sign-in to Spotify is done, 'account' is populated
      // If no new sign-in occurs, 'account' is null and the *current* token is returned as is
      if (!account) {
        return token;
      }

      // When a new sign-in occurs, the token is updated with the new account information
      const authUser = {
        ...token,
        access_token: account?.access_token,
        token_type: account?.token_type,
        expires_at: account?.expires_at ?? Date.now() / 1000,
        expires_in: (account?.expires_at ?? 0) - Date.now() / 1000,
        refresh_token: account?.refresh_token,
        scope: account?.scope,
        id: account?.providerAccountId,
      } as AuthUser;

      if (Date.now() / 1000 > authUser.expires_at) {
        return refreshAccessToken(authUser);
      }

      return authUser;
    },

    async session({session, token}: { session: { user: any, expires: any }; token: any }) {
      console.log('Called Session Endpoint');

      session.user = {
        ...session.user,
        access_token: token.access_token,
        token_type: token.token_type,
        expires_at: token.expires_at,
        expires_in: token.expires_in,
        refresh_token: token.refresh_token,
        scope: token.scope,
        id: token.id,
      };

      // If the token is expired, refresh
      if (Date.now() / 1000 > session.user.expires_at) {
        console.log('Refreshing expired token!');

        const newToken = await refreshAccessToken(session.user);
        session.user = {
          ...session.user,
          access_token: newToken.access_token,
          token_type: newToken.token_type,
          expires_at: newToken.expires_at,
          expires_in: newToken.expires_in,
          refresh_token: newToken.refresh_token,
          scope: newToken.scope,
          id: newToken.id,
          error: (newToken as any).error,
        };
      } else {
        console.log('Token is not expired, not refreshing!');
      }

      (session as any).error = token.error;
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;