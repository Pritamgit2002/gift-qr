"use client";

import { useEffect, useRef, useState } from "react";

/** "1:05", "12:40", "1:02:03" */
export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = String(whole % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

// Starting one player pauses the others on the page.
const PLAY_EVENT = "giftqr:media-play";

/** Play state, time and speed for an <audio> or <video>, and the controls for them. */
export function usePlayer<T extends HTMLMediaElement>() {
  const ref = useRef<T>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeedState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = ref.current;
    if (!media) return;
    const sync = () => {
      setPlaying(!media.paused);
      setCurrent(media.currentTime);
      setDuration(Number.isFinite(media.duration) ? media.duration : 0);
      setMuted(media.muted);
    };
    const onPlay = () => {
      sync();
      window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: media }));
    };
    const onOtherPlay = (event: Event) => {
      if ((event as CustomEvent).detail !== media) media.pause();
    };
    const onError = () => setFailed(true);
    const events = ["pause", "timeupdate", "loadedmetadata", "durationchange", "ended", "volumechange"] as const;
    events.forEach((name) => media.addEventListener(name, sync));
    media.addEventListener("play", onPlay);
    media.addEventListener("error", onError);
    window.addEventListener(PLAY_EVENT, onOtherPlay);
    sync();
    return () => {
      events.forEach((name) => media.removeEventListener(name, sync));
      media.removeEventListener("play", onPlay);
      media.removeEventListener("error", onError);
      window.removeEventListener(PLAY_EVENT, onOtherPlay);
    };
  }, []);

  const toggle = () => {
    const media = ref.current;
    if (!media) return;
    if (media.paused) void media.play().catch(() => setFailed(true));
    else media.pause();
  };

  const seek = (seconds: number) => {
    const media = ref.current;
    if (!media || !duration) return;
    media.currentTime = Math.min(Math.max(seconds, 0), duration);
    setCurrent(media.currentTime);
  };

  const setSpeed = (value: number) => {
    const media = ref.current;
    if (media) {
      // A reload resets playbackRate to the default, so set both.
      media.defaultPlaybackRate = value;
      media.playbackRate = value;
    }
    setSpeedState(value);
  };

  const toggleMute = () => {
    if (ref.current) ref.current.muted = !ref.current.muted;
  };

  return { ref, playing, current, duration, speed, muted, failed, toggle, seek, setSpeed, toggleMute };
}
