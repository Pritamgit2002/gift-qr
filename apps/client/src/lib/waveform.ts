import { WAVEFORM_BARS } from "@giftqr/shared";

/**
 * Loudness bars for an audio file, each 0–1, worked out here before upload: the
 * bucket is private, so the page can't read the file back later to draw them.
 * Undefined when the browser can't decode it; the player then draws flat bars.
 */
export async function peaksOf(file: File): Promise<number[] | undefined> {
  try {
    // An offline context decodes without asking to play sound.
    const context = new OfflineAudioContext(1, 1, 44100);
    const audio = await context.decodeAudioData(await file.arrayBuffer());
    const samples = audio.getChannelData(0);
    const step = Math.max(1, Math.floor(samples.length / WAVEFORM_BARS));

    const peaks = Array.from({ length: WAVEFORM_BARS }, (_, bar) => {
      let sum = 0;
      const end = Math.min(samples.length, (bar + 1) * step);
      for (let i = bar * step; i < end; i++) sum += samples[i] * samples[i];
      return Math.sqrt(sum / Math.max(1, end - bar * step));
    });
    const loudest = Math.max(...peaks) || 1;
    return peaks.map((peak) => Math.round((peak / loudest) * 1000) / 1000);
  } catch {
    return undefined;
  }
}

/** Bars for a clip that has none stored. */
export const flatPeaks = (): number[] => Array.from({ length: WAVEFORM_BARS }, () => 0.35);
