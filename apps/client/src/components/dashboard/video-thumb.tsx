"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Play, X } from "lucide-react";
import { VideoPlayer } from "@/components/media/video-player";
import styles from "./dashboard.module.css";

/** A video's first frame in a list row; tapping it plays the video in a dialog. */
export function VideoThumb({ src, name }: { src: string; name: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={styles.videoThumb} aria-label={`Play ${name}`}>
        {/* #t=0.1 makes browsers show a frame instead of black */}
        <video src={`${src}#t=0.1`} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true" />
        <span className="absolute inset-0 grid place-items-center bg-plum/25">
          <Play size={16} fill="#fff" strokeWidth={0} aria-hidden="true" />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-plum/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex w-[min(860px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-[24px] border-2 border-plum bg-white p-3 shadow-hard-lg sm:p-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <Dialog.Title className="m-0 truncate font-display text-xl font-extrabold tracking-display">{name}</Dialog.Title>
            <Dialog.Close className={styles.iconButton} aria-label="Close">
              <X size={20} strokeWidth={2.5} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Video preview</Dialog.Description>
          <VideoPlayer src={src} name={name} className="aspect-video max-h-[70vh] w-full" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
