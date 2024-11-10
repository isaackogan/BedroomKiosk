import {JWT} from "next-auth/jwt";

export const authURL = (() => {
  const url = new URL("https://accounts.spotify.com/authorize");

  const scopes = [
    "user-read-playback-state",
    "user-modify-playback-state"
  ];

  url.searchParams.append("scope", scopes.join(" "));
  return url;
})();

export async function refreshAccessToken(token: JWT) {
  console.log('Refreshing token...');

  try {
    const response = await fetch(authURL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      token_type: refreshedTokens.token_type,
      expires_at: refreshedTokens.expires_at,
      expires_in: (refreshedTokens.expires_at ?? 0) - Date.now() / 1000,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      scope: refreshedTokens.scope,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}