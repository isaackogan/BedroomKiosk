"use client";

import { FC, useEffect, useState, useRef } from "react";
import styles from "./ProgressBar.module.css";

interface IProgressBar {
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
}

const ProgressBar: FC<IProgressBar> = ({ isPlaying, progressMs, durationMs }) => {
  const [progress, setProgress] = useState((progressMs / durationMs) * 100);
  const progressRef = useRef(progressMs); // Track progressMs reference

  useEffect(() => {
    progressRef.current = progressMs; // Keep the ref updated with the latest prop value
  }, [progressMs]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        // Update progress based on the latest progressMs from the ref
        setProgress(((progressRef.current + 1000) / durationMs) * 100);
        progressRef.current += 1000; // Increment progressMs in the ref
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setProgress((progressMs / durationMs) * 100)
    }
  }, [isPlaying, durationMs]);

  return (
      <div className={styles.progressBarContainer}>
        <span className={styles.progressBarCurrentTime}>{formatTime(progressRef.current)}</span>
        <div className={styles.progressBar}>
          <div className={styles.progressBarFill} style={{ width: `${Math.min(progress, 100)}%` }}>&nbsp;</div>
        </div>
        <span className={styles.progressBarSongLength}>{formatTime(durationMs)}</span>
      </div>
  );
};

export default ProgressBar;

// Helper function to format time in mm:ss
function formatTime(milliseconds: number): string {
  const seconds = milliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
