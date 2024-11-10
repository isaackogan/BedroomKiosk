"use server";

import TopPanel from "@/components/TopPanel";
import SpotifyPanel from "@/components/spotify/SpotifyPanel";
import "./globals.css"
import RomePanel from "@/components/RomePanel";
import WeatherPanel from "@/components/WeatherPanel";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login")
  }

  console.log('sess', session);

  return (
      <div className={"flex flex-col gap-3 p-3 h-[100%]"}>
        <TopPanel/>
        <main className={"flex flex-grow gap-3"}>
          <div className={"flex w-[50%] h-[100%]"}><SpotifyPanel/></div>
          <div className={"flex w-[50%] h-[100%] flex-col gap-3"}>
            <RomePanel/>
            <WeatherPanel/>
          </div>
        </main>
      </div>
  );
}
