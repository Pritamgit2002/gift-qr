"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./media.module.css";

export const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

/** "1×", "1.25×" */
export const speedLabel = (speed: number) => `${speed}×`;

/** A button showing the playback speed that opens a menu of speeds. */
export function SpeedControl({
  speed,
  onChange,
  tone = "light",
  placement = "up",
}: {
  speed: number;
  onChange: (speed: number) => void;
  /** "dark" sits on video; "light" on the paper cards. */
  tone?: "light" | "dark";
  placement?: "up" | "down";
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  // Close on a click elsewhere or on Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative flex-none">
      <button
        type="button"
        className={cn(styles.speedButton, tone === "dark" && styles.speedButtonDark)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Playback speed ${speedLabel(speed)}`}
        onClick={() => setOpen((value) => !value)}
      >
        {speedLabel(speed)}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Playback speed"
          className={cn(styles.speedMenu, placement === "up" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]")}
        >
          {SPEEDS.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={option === speed}
              className={styles.speedOption}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              <span>{option === 1 ? "Normal" : speedLabel(option)}</span>
              {option === speed && <Check size={15} strokeWidth={3} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
