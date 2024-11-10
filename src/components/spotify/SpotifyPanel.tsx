"use client";

import sdk from "@/lib/spotify-sdk/ClientInstance";

import styles from "./SpotifyPanel.module.css";
import ProgressBar from "@/components/spotify/ProgressBar";
import {useEffect, useState} from "react";
import {Artist, PlaybackState} from "@spotify/web-api-ts-sdk";

export default function () {

  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);

  async function updatePlaybackState() {
    const state = await sdk.player.getCurrentlyPlayingTrack();
    setPlaybackState(state);
  }

  useEffect(() => {
    updatePlaybackState();
    const interval = setInterval(() => {
      sdk.player.getCurrentlyPlayingTrack().then(state => {
        setPlaybackState(state);
      });
    }, 10 * 1000);
    return () => clearInterval(interval);
  }, [sdk]);


  if (!playbackState) {
    return (
        <div className={"panel h-[100%]"}>
          <div className={"flex gap-y-1.5 flex-col items-center p-6 h-[100%] justify-center"}>
            <span className={"font-bold text-3xl mt-4 text-center"}>Nothing Playing :)</span>
          </div>
        </div>
    );
  }

  function getArtists() {
    return (playbackState?.item as any)?.artists.map((artist: Artist) => artist.name).join(", ");
  }

  function getAlbumCover() {
    return (playbackState?.item as any)?.album.images[0].url
  }

  return (
      <div className={"panel h-[100%]"}>
        <div className={"flex gap-y-1.5 flex-col items-center p-6 h-[100%] justify-center"}>
          <img className={styles.albumCover} src={getAlbumCover()}/>
          <span className={"font-bold text-2xl mt-4 text-center"}>{playbackState.item.name}</span>
          <span className={"text-gray-69 text-lg text-center"}>{getArtists()}</span>
          <ProgressBar
              isPlaying={playbackState.is_playing}
              progressMs={playbackState.progress_ms}
              durationMs={playbackState.item.duration_ms}
          />
        </div>
      </div>
  );
}