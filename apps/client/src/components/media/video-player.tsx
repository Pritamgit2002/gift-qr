"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpeedControl } from "./speed-control";
import { formatTime, usePlayer } from "./use-player";
import styles from "./media.module.css";

/** How long the controls stay up after the pointer last moved while playing. */
const IDLE_MS = 2500;

/** A video with its own controls: play/pause, seek, time, speed, mute and fullscreen. */
export function VideoPlayer({ src, name, className }: { src: string; name: string; className?: string }) {
  const { ref, playing, current, duration, speed, muted, failed, toggle, seek, setSpeed, toggleMute } =
    usePlayer<HTMLVideoElement>();
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const idle = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Controls hide while it plays and the pointer rests, and come back when paused.
  const wake = () => {
    setActive(true);
    clearTimeout(idle.current);
    idle.current = setTimeout(() => setActive(false), IDLE_MS);
  };
  useEffect(() => () => clearTimeout(idle.current), []);
  const showControls = !playing || active;

  const fullscreen = () => {
    const video = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) return void document.exitFullscreen();
    if (frame.current?.requestFullscreen) return void frame.current.requestFullscreen().catch(() => {});
    // iPhone Safari only lets the video element itself go fullscreen.
    video?.webkitEnterFullscreen?.();
  };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("input, [role=menu]")) return;
    const actions: Record<string, () => void> = {
      " ": toggle,
      k: toggle,
      ArrowRight: () => seek(current + 5),
      ArrowLeft: () => seek(current - 5),
      m: toggleMute,
      f: fullscreen,
    };
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
      wake();
    }
  };

  return (
    <div
      ref={frame}
      className={cn(styles.videoFrame, className)}
      onPointerMove={wake}
      onKeyDown={onKey}
      data-controls={showControls ? "shown" : "hidden"}
    >
      <video
        ref={ref}
        src={src}
        preload="metadata"
        playsInline
        className="block h-full w-full bg-plum object-contain"
        aria-label={name}
        onClick={() => {
          toggle();
          wake();
        }}
      />

      {failed && (
        <span className="absolute inset-0 grid place-items-center bg-plum/80 p-4 text-center text-sm font-semibold text-white">
          This video couldn&apos;t load. Reload the page to try again.
        </span>
      )}

      {!playing && !failed && (
        <button type="button" className={styles.bigPlay} aria-label={`Play ${name}`} onClick={toggle}>
          <Play size={30} fill="currentColor" strokeWidth={0} className="ml-1" aria-hidden="true" />
        </button>
      )}

      <div className={cn(styles.videoBar, !showControls && styles.videoBarHidden)} onFocus={wake}>
        <button
          type="button"
          className={styles.videoIcon}
          aria-label={playing ? "Pause" : "Play"}
          disabled={failed}
          onClick={toggle}
        >
          {playing ? (
            <Pause size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          ) : (
            <Play size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          )}
        </button>
        <input
          type="range"
          className={styles.seek}
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          aria-label={`Seek ${name}`}
          aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
          style={{ "--progress": `${duration ? (current / duration) * 100 : 0}%` } as CSSProperties}
          onChange={(event) => seek(Number(event.target.value))}
        />
        <span className="flex-none text-xs font-semibold tabular-nums text-white">
          {formatTime(current)} / {formatTime(duration)}
        </span>
        <SpeedControl speed={speed} onChange={setSpeed} tone="dark" />
        <button type="button" className={styles.videoIcon} aria-label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
          {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
        </button>
        <button type="button" className={styles.videoIcon} aria-label="Fullscreen" onClick={fullscreen}>
          <Maximize size={17} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
