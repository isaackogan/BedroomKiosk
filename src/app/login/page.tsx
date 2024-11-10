"use client";

import {signIn} from "next-auth/react";

export default function LogIn() {
  return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-5xl mb-6 font-bold">Log Into Spotify</h1>
        <button onClick={() => signIn("spotify",
            {
              redirectTo: "/",
            })} className="mt-4 px-4 py-2 w-60 h-20 text-3xl bg-foreground text-background rounded-md">Sign In
        </button>
      </div>
  );
}