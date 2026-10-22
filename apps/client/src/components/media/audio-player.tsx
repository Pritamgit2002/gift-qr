"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { flatPeaks } from "@/lib/waveform";
import { cn } from "@/lib/utils";
import { SpeedControl } from "./speed-control";
import { formatTime, usePlayer } from "./use-player";
import styles from "./media.module.css";

/**
 * An audio clip as a waveform: tap a bar to jump there, with play/pause, the
 * time, and a speed menu. `compact` fits a dashboard row; `full` is the reveal card.
 */
export function AudioPlayer({
  src,
  name,
  peaks,
  variant = "full",
}: {
  src: string;
  name: string;
  peaks?: number[];
  variant?: "compact" | "full";
}) {
  const { ref, playing, current, duration, speed, failed, toggle, seek, setSpeed } = usePlayer<HTMLAudioElement>();
  const bars = peaks?.length ? peaks : flatPeaks();
  const progress = duration ? current / duration : 0;
  const compact = variant === "compact";

  const seekTo = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    seek(((event.clientX - box.left) / box.width) * duration);
  };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const jump = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }[event.key];
    if (jump !== undefined) {
      event.preventDefault();
      seek(current + jump);
    } else if (event.key === "Home") {
      event.preventDefault();
      seek(0);
    } else if (event.key === "End") {
      event.preventDefault();
      seek(duration);
    }
  };

  return (
    <div className={cn("flex w-full min-w-0 items-center", compact ? "gap-2.5" : "gap-3.5")}>
      <audio ref={ref} src={src} preload="metadata" />
      <button
        type="button"
        className={cn(styles.playButton, compact ? "h-10 w-10" : "h-14 w-14")}
        aria-label={playing ? `Pause ${name}` : `Play ${name}`}
        disabled={failed}
        onClick={toggle}
      >
        {playing ? (
          <Pause size={compact ? 16 : 22} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        ) : (
          <Play size={compact ? 16 : 22} fill="currentColor" strokeWidth={0} className="ml-0.5" aria-hidden="true" />
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Seek ${name}`}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
          aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
          className={cn(styles.wave, compact ? "h-8" : "h-14")}
          onPointerDown={seekTo}
          onKeyDown={onKey}
        >
          {bars.map((peak, i) => (
            <span
              key={i}
              className={cn(styles.waveBar, (i + 0.5) / bars.length <= progress && styles.waveBarPlayed)}
              style={{ height: `${Math.max(10, peak * 100)}%` }}
            />
          ))}
        </div>
        <span className="flex items-center justify-between text-xs font-semibold tabular-nums text-plum-mute">
          {failed ? (
            <span className="text-ribbon-dark">This clip couldn&apos;t load. Reload the page to try again.</span>
          ) : (
            <>
              <span>{formatTime(current)}</span>
              <span>{duration ? formatTime(duration) : <Loader2 size={12} className="animate-spin" aria-label="Loading" />}</span>
            </>
          )}
        </span>
      </div>

      <SpeedControl speed={speed} onChange={setSpeed} placement={compact ? "down" : "up"} />
    </div>
  );
}
