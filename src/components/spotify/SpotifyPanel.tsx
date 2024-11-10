"use client";

import sdk from "@/lib/spotify-sdk/ClientInstance";

import styles from "./SpotifyPanel.module.css";
import ProgressBar from "@/components/spotify/ProgressBar";
import {useEffect, useRef, useState} from "react";
import {PlaybackState} from "@spotify/web-api-ts-sdk";

export default function () {

  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapCount = useRef(0);

  async function updatePlaybackState() {
    const state = await sdk.player.getCurrentlyPlayingTrack();
    setPlaybackState(state);
  }

  useEffect(() => {
    updatePlaybackState();
    const interval = setInterval(() => {
      sdk.player.getCurrentlyPlayingTrack().then(state => {
        setPlaybackState(state);

        // How many seconds until the song ends
        const remainingTime = (state.item.duration_ms - state.progress_ms) / 1000;

        // If remaining time is less than the interval, update the state at the end of the song
        if (remainingTime < 10) {
          setTimeout(() => {
            updatePlaybackState();
          }, remainingTime * 1000);
        }

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
    const artistNames = (playbackState?.item as any)?.artists[0];

    // if there are multiple artists, display the first & then "and x more"
    if ((playbackState?.item as any)?.artists.length > 1) {
      return `${artistNames.name} and ${(playbackState?.item as any)?.artists.length - 1} more`;
    }

    return artistNames.name;
  }

  function getAlbumCover() {
    return (playbackState?.item as any)?.album.images[0].url
  }

  function getTrackName() {

    // truncate
    const trackName = (playbackState?.item as any)?.name;

    return trackName.length > 80 ? trackName.substring(0, 80) + "..." : trackName
  }

  async function getActiveDevice() {
    const devices = await sdk.player.getAvailableDevices();
    return devices.devices.find(device => device.is_active);
  }

  /**
   * Pause or play on single tap
   */
  async function onSingleTap() {
    const playbackState = await sdk.player.getCurrentlyPlayingTrack();
    const device = await getActiveDevice();
    if (device) {
      if (playbackState.is_playing) {
        try {
          await sdk.player.pausePlayback(device.id!);
        } catch (ex) {
          // spotify is broken and sometimes throws an error when
        }
      } else {
        try {
          await sdk.player.startResumePlayback(device.id!);
        } catch (ex) {
          // spotify is broken and sometimes throws an error when
        }
      }
      await updatePlaybackState();

    }
  }

  /**
   * Skip to next song on double tap
   */
  async function onDoubleTap() {
    const device = await getActiveDevice();
    if (device) {
      console.log('gotem', device.id
      )
      try {
        await sdk.player.skipToNext(device.id!);
      } catch (e) {
        // spotify is broken and sometimes throws an error when skipping to next song
      }
      await updatePlaybackState();
    }
  }

  /**
   * Skip to previous song on triple tap
   */
  async function onTripleTap() {
    const device = await getActiveDevice();
    if (device) {
      try {
        await sdk.player.skipToPrevious(device.id!);
      } catch (e) {
        // spotify is broken and sometimes throws an error when skipping to previous song
      }
      await updatePlaybackState();
    }
  }

  const tapDelay = 300;

  const handleTap = () => {
    tapCount.current += 1;

    console.log('Tap #:', tapCount.current)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a timeout to process the taps
    timeoutRef.current = setTimeout(async () => {
      if (tapCount.current === 1) {
        await onSingleTap();
      }
      if (tapCount.current === 2) {
        await onDoubleTap();
      } else if (tapCount.current === 3) {
        await onTripleTap();
      }
      // Reset tap count after processing
      tapCount.current = 0;
    }, tapDelay);

    // If more than 3 taps are detected within the delay, reset immediately
    if (tapCount.current > 3) {
      tapCount.current = 0;
      clearTimeout(timeoutRef.current);
    }
  };

  return (
      <div id={"spotify-panel"} className={"panel h-[100%] select-none"} onClick={handleTap}>
        <div className={"flex gap-y-1.5 flex-col items-center p-6 h-[100%] justify-center"}>
          <img className={styles.albumCover} src={getAlbumCover()}/>
          <span className={"font-bold text-2xl mt-4 text-center"}>{getTrackName()}</span>
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