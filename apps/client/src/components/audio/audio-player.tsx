"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/** "0:07", "1:42" */
export const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/** A waveform that looks the same for the same file every time. */
function barsFor(seed: string, count: number): number[] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Array.from({ length: count }, (_, i) => {
    const wave = Math.abs(Math.sin((i + (h % 97)) * 1.7) * Math.cos((i + (h % 13)) * 0.45));
    return 25 + Math.round(70 * wave);
  });
}

// One clip at a time: starting one pauses whichever was playing.
let current: HTMLAudioElement | null = null;
function claim(audio: HTMLAudioElement) {
  if (current && current !== audio) current.pause();
  current = audio;
}

/** Playback state of one <audio>, replayable as often as the listener likes. */
function useAudio(src: string, knownDuration?: number) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(knownDuration ?? 0);
  const [plays, setPlays] = useState(0);
  const [failed, setFailed] = useState(false);
  const ended = !playing && duration > 0 && time >= duration - 0.05;

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    const sync = () => setTime(audio.currentTime);
    const meta = () => Number.isFinite(audio.duration) && setDuration(audio.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setFailed(true);
    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("loadedmetadata", meta);
    audio.addEventListener("durationchange", meta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onPause);
    audio.addEventListener("error", onError);
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", sync);
      audio.removeEventListener("loadedmetadata", meta);
      audio.removeEventListener("durationchange", meta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onPause);
      audio.removeEventListener("error", onError);
    };
  }, [src]);

  const start = (fromTop: boolean) => {
    const audio = ref.current;
    if (!audio) return;
    if (fromTop || audio.ended || audio.currentTime >= audio.duration - 0.05) audio.currentTime = 0;
    if (audio.currentTime === 0) setPlays((n) => n + 1);
    claim(audio);
    audio.play().catch(() => setFailed(true));
  };

  return {
    ref,
    playing,
    time,
    duration,
    plays,
    failed,
    ended,
    toggle: () => (ref.current?.paused ? start(false) : ref.current?.pause()),
    replay: () => start(true),
    seek: (to: number) => {
      if (ref.current) ref.current.currentTime = to;
      setTime(to);
    },
  };
}

/** The reveal's player: waveform, seek bar, play/pause and play-from-the-start. */
export function AudioPlayer({ src, name, duration: knownDuration }: { src: string; name: string; duration?: number }) {
  const a = useAudio(src, knownDuration);
  const bars = useMemo(() => barsFor(src, 32), [src]);
  const played = a.duration ? Math.round((a.time / a.duration) * bars.length) : 0;
  const PlayIcon = a.playing ? Pause : a.ended ? RotateCcw : Play;

  return (
    <div className="flex flex-col gap-4">
      <audio ref={a.ref} src={src} preload="metadata" />
      <div className="flex h-16 items-center gap-[3px]" aria-hidden="true">
        {bars.map((height, i) => (
          <span
            key={i}
            className={cn("block flex-1 rounded-[3px] transition-colors", i < played ? "bg-ribbon" : "bg-line")}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <label className="flex flex-col gap-1">
        <span className="sr-only">Seek in {name}</span>
        <input
          type="range"
          className="h-6 w-full cursor-pointer accent-ribbon"
          min={0}
          max={a.duration || 0}
          step={0.1}
          value={Math.min(a.time, a.duration || 0)}
          disabled={!a.duration}
          onChange={(e) => a.seek(Number(e.target.value))}
        />
        <span className="flex justify-between text-[13px] tabular-nums text-plum-body">
          <span>{formatTime(a.time)}</span>
          <span>{a.duration ? formatTime(a.duration) : "–:––"}</span>
        </span>
      </label>
      <div className="flex items-center justify-center gap-[22px]">
        <button
          type="button"
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-plum bg-white text-plum transition-transform duration-300 ease-pop hover:-rotate-[30deg]"
          aria-label="Play from the start"
          onClick={a.replay}
        >
          <RotateCcw size={20} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="grid h-[76px] w-[76px] place-items-center rounded-full border-2 border-plum bg-ribbon text-white shadow-hard-sm transition-transform duration-300 ease-pop hover:scale-105 active:scale-95"
          aria-label={a.playing ? "Pause" : a.ended ? "Play again" : "Play"}
          onClick={a.toggle}
        >
          <PlayIcon
            size={28}
            strokeWidth={a.ended ? 2.6 : 0}
            fill={a.ended ? "none" : "currentColor"}
            className={cn(!a.playing && !a.ended && "translate-x-0.5")}
            aria-hidden="true"
          />
        </button>
        <span className="w-12 text-center text-[13px] font-bold text-plum-body" aria-live="polite">
          {a.plays > 1 ? `×${a.plays}` : ""}
        </span>
      </div>
      <span className="text-center text-sm text-plum-body">
        {a.failed ? "This clip didn't load. Try scanning again." : "Play it as many times as you like."}
      </span>
    </div>
  );
}

/** A list row's player: a round play/pause button, the clip's name and its time. */
export function AudioMini({ src, name, duration: knownDuration }: { src: string; name: string; duration?: number }) {
  const a = useAudio(src, knownDuration);
  const showProgress = a.playing || (a.time > 0 && !a.ended);
  return (
    <>
      <audio ref={a.ref} src={src} preload="metadata" />
      <button
        type="button"
        className="grid h-11 w-11 flex-none place-items-center rounded-full bg-ribbon text-white transition-transform duration-300 ease-pop hover:scale-110"
        aria-label={a.playing ? `Pause ${name}` : `Play ${name}`}
        onClick={a.toggle}
      >
        {a.playing ? (
          <Pause size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        ) : (
          <Play size={16} fill="currentColor" strokeWidth={0} className="translate-x-px" aria-hidden="true" />
        )}
      </button>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-base">{name}</span>
        <span className="text-[13px] tabular-nums text-plum-mute">
          {a.failed
            ? "Can't play this file"
            : showProgress
              ? `${formatTime(a.time)} / ${formatTime(a.duration)}`
              : a.duration
                ? formatTime(a.duration)
                : "Audio"}
        </span>
      </span>
    </>
  );
}
