import {JWT} from "next-auth/jwt";
import {env} from "../../../../../env.mjs";

export const authURL = (() => {
  const url = new URL("https://accounts.spotify.com/authorize");

  const scopes = [
    "user-read-playback-state",
    "user-modify-playback-state"
  ];

  url.searchParams.append("scope", scopes.join(" "));
  return url;
})();


export interface ExpandedJWT  extends JWT {
  access_token?: string;
  token_type?: string;
  expires_at: number;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  id?: string;
}

export async function refreshAccessToken(token: ExpandedJWT) {
  console.log('Refreshing token...', token.refresh_token);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refresh_token!,
        client_id: env.AUTH_SPOTIFY_ID,
      })
    });

    const refreshToken = await response.json();

    if (!response.ok) {
      throw refreshToken;
    }

    return {
      ...token,
      access_token: refreshToken.access_token,
      token_type: refreshToken.token_type,
      expires_in: refreshToken.expires_in,
      expires_at: Date.now() / 1000 + refreshToken.expires_in,
      refresh_token: refreshToken.refresh_token,
      scope: refreshToken.scope,
    };
  } catch (error) {
    console.error('Failed to refresh token!', error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}