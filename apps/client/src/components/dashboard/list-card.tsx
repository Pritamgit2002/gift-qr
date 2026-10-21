import { cn } from "@/lib/utils";
import type { GiftList } from "./use-gift-lists";
import { summarize, toneClass } from "./summary";
import styles from "./dashboard.module.css";

export function ListCard({ list, selected, onSelect }: { list: GiftList; selected: boolean; onSelect: () => void }) {
  const s = summarize(list);
  return (
    <button
      type="button"
      className={cn(styles.listCard, selected && styles.listCardSelected)}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <span className="mb-3 flex items-center justify-between gap-2.5">
        <span className="min-w-0 truncate font-display text-xl font-extrabold tracking-display">{list.name}</span>
        <span className={cn("whitespace-nowrap rounded-full px-2.5 py-[5px] text-xs font-bold", toneClass[s.tone])}>
          {s.status}
        </span>
      </span>
      <span className="mb-3 flex flex-wrap gap-x-3.5 gap-y-1 text-sm text-plum-body">
        <span>{s.links} links</span>
        <span>{s.messages} messages</span>
        <span>{s.photos} photos</span>
      </span>
      <span className={styles.barTrack}>
        <span className={styles.barFill} style={{ width: `${s.progress}%` }} />
      </span>
    </button>
  );
}
