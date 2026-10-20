"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Link as LinkIcon, Loader2, MessageSquare, Mic, Music, Trash2, Upload } from "lucide-react";
import type { PaymentTarget } from "@giftqr/shared";
import { buttonVariants } from "@/components/brand/button";
import { cn } from "@/lib/utils";
import { itemsOf, type GiftList, type Item, type ItemKind, type useGiftLists } from "./use-gift-lists";
import { summarize, toneClass } from "./summary";
import { QrPanel } from "./qr-panel";
import { LinkBrand } from "./link-brand";
import { AudioMini } from "@/components/audio/audio-player";
import styles from "./dashboard.module.css";

type Actions = ReturnType<typeof useGiftLists>;

const tabs: { kind: ItemKind; label: string; icon: ReactNode; mark: string }[] = [
  { kind: "links", label: "Links", icon: <LinkIcon size={16} strokeWidth={2.5} aria-hidden="true" />, mark: "L" },
  { kind: "messages", label: "Messages", icon: <MessageSquare size={16} strokeWidth={2.5} aria-hidden="true" />, mark: "M" },
  { kind: "images", label: "Photos", icon: <ImageIcon size={16} strokeWidth={2.5} aria-hidden="true" />, mark: "P" },
  { kind: "audios", label: "Audio", icon: <Mic size={16} strokeWidth={2.5} aria-hidden="true" />, mark: "A" },
];

/** What the upload zone takes, per file tab. */
const uploads = {
  images: { accept: "image/*", multiple: true, noun: "Photos", idle: "Drop photos here, or click to upload", hint: null },
  audios: {
    accept: "audio/*",
    multiple: true,
    noun: "Audio clips",
    idle: "Drop a voice note or song, or click to upload",
    hint: "MP3, M4A or WAV · up to 10 MB",
  },
};

const addCopy = {
  links: { label: "Add a link", placeholder: "Paste a link, e.g. open.spotify.com/…" },
  messages: { label: "Add a message", placeholder: "Write a note they will love" },
};

export function ListEditor({
  list,
  ownerEmail,
  actions,
  paying,
  onPay,
}: {
  list: GiftList;
  ownerEmail: string;
  actions: Actions;
  paying: PaymentTarget | null;
  onPay: (target: PaymentTarget) => void;
}) {
  const [tab, setTab] = useState<ItemKind>("links");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const panelId = useId();
  const summary = summarize(list);
  const items = itemsOf(list, tab);
  const toDraft = list.paid && !actions.isGuest;

  // A new list starts on links with an empty field.
  useEffect(() => {
    setTab("links");
    setText("");
    setConfirmDelete(false);
  }, [list.name]);

  // The delete button asks once, then resets if they don't follow through.
  useEffect(() => {
    if (!confirmDelete) return;
    const timer = setTimeout(() => setConfirmDelete(false), 4000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  const run = async (key: string, action: () => Promise<{ ok: boolean; message?: string }>) => {
    setBusy(key);
    try {
      const result = await action();
      if (result.ok) {
        if (result.message) toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      return result.ok;
    } finally {
      setBusy(null);
    }
  };

  const submitText = async (event: FormEvent) => {
    event.preventDefault();
    if (tab === "images" || tab === "audios") return;
    const kind = tab;
    if (await run("add", () => actions.addText(list, kind, text))) setText("");
  };

  const uploadFiles = async (files: FileList | null) => {
    for (const file of Array.from(files ?? [])) {
      await run("add", () => (tab === "audios" ? actions.addAudio(list, file) : actions.addPhoto(list, file)));
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  const remove = (item: Item) => run(`remove:${item.key}`, () => actions.removeItem(list, item));

  const deleteList = () => {
    if (!confirmDelete) return setConfirmDelete(true);
    void run("delete", () => actions.deleteList(list.name));
  };

  return (
    <section
      aria-label="List editor"
      className="flex min-w-0 flex-[999_1_560px] flex-col gap-[22px] rounded-[32px] border-2 border-plum bg-white p-5 shadow-hard-lg sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-sm font-semibold text-plum-mute">Editing</span>
          <h2 className="m-0 break-words font-display text-[34px] font-extrabold leading-[1.05] tracking-display">{list.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("whitespace-nowrap rounded-full px-2.5 py-[5px] text-xs font-bold", toneClass[summary.tone])}>
            {summary.status}
          </span>
          <button
            type="button"
            className={cn(styles.iconButton, confirmDelete && "!w-auto bg-peach px-3 text-sm font-bold !text-ribbon-dark")}
            aria-label={confirmDelete ? `Confirm deleting ${list.name}` : `Delete ${list.name}`}
            disabled={busy === "delete"}
            onClick={deleteList}
          >
            {confirmDelete ? "Tap again to delete" : <Trash2 size={18} strokeWidth={2.2} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="Item type" className="flex flex-wrap gap-1.5 rounded-[18px] bg-paper p-1.5">
        {tabs.map((t) => {
          const count = { links: summary.links, messages: summary.messages, images: summary.photos, audios: summary.audios }[t.kind];
          return (
            <button
              key={t.kind}
              type="button"
              role="tab"
              aria-selected={tab === t.kind}
              aria-controls={panelId}
              className={styles.tab}
              onClick={() => {
                setTab(t.kind);
                setText("");
              }}
            >
              {t.icon}
              {t.label} · {count}
            </button>
          );
        })}
      </div>

      <div id={panelId} role="tabpanel" className="flex flex-col gap-[22px]">
        {toDraft && (
          <p className="m-0 rounded-2xl bg-gold-soft px-4 py-3 text-[15px] text-plum-body">
            This list is live, so anything new goes into a draft. Pay for the draft to add it to the same QR code.
          </p>
        )}

        {tab === "links" || tab === "messages" ? (
          <form className="flex flex-wrap gap-2.5" onSubmit={submitText}>
            <label htmlFor={inputId} className="flex flex-[1_1_260px] flex-col gap-1.5 text-sm font-semibold">
              {addCopy[tab].label}
              <input
                id={inputId}
                className={cn(styles.field, "w-full")}
                type="text"
                inputMode={tab === "links" ? "url" : "text"}
                autoComplete="off"
                placeholder={addCopy[tab].placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
            <button type="submit" className={cn(buttonVariants({ variant: "dark" }), "self-end")} disabled={busy === "add"}>
              {busy === "add" ? <Loader2 size={18} className="animate-spin" aria-label="Adding" /> : "Add"}
            </button>
          </form>
        ) : actions.isGuest ? (
          <p className="m-0 rounded-[18px] bg-shell px-5 py-6 text-center font-semibold text-ribbon-deep">
            {uploads[tab].noun} are for Google accounts. Sign in with Google to add them.
          </p>
        ) : (
          <>
            <input
              ref={fileInput}
              type="file"
              key={tab}
              accept={uploads[tab].accept}
              multiple={uploads[tab].multiple}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={(e) => void uploadFiles(e.target.files)}
            />
            <button
              type="button"
              className={cn(styles.drop, dragging && styles.dropActive)}
              disabled={busy === "add"}
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                void uploadFiles(e.dataTransfer.files);
              }}
            >
              {busy === "add" ? (
                <>
                  <Loader2 size={24} className="animate-spin" aria-hidden="true" />
                  Uploading…
                </>
              ) : (
                <span className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-3">
                    {tab === "audios" ? (
                      <Music size={26} strokeWidth={2.4} aria-hidden="true" />
                    ) : (
                      <Upload size={26} strokeWidth={2.4} aria-hidden="true" />
                    )}
                    {uploads[tab].idle}
                  </span>
                  {uploads[tab].hint && <span className="text-sm font-medium text-ribbon-dark">{uploads[tab].hint}</span>}
                </span>
              )}
            </button>
          </>
        )}

        <ul className="m-0 flex min-h-[120px] list-none flex-col gap-2.5 p-0">
          {items.map((item) => (
            <li key={item.key} className={styles.item}>
              {item.audio ? (
                <AudioMini src={item.audio.url} name={item.text} duration={item.audio.duration} />
              ) : item.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- user photos live on S3
                <img src={item.image.url} alt="" className="h-[52px] w-[52px] flex-none rounded-xl object-cover" />
              ) : item.kind === "links" ? (
                <LinkBrand link={item.text} />
              ) : (
                <span
                  className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-shell font-extrabold text-ribbon-deep"
                  aria-hidden="true"
                >
                  {tabs.find((t) => t.kind === item.kind)?.mark}
                </span>
              )}
              {!item.audio && <span className="min-w-0 flex-1 truncate text-base">{item.text}</span>}
              {item.draft && <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold">draft</span>}
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`Remove ${item.text}`}
                disabled={busy === `remove:${item.key}`}
                onClick={() => void remove(item)}
              >
                <Trash2 size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="flex flex-col items-center gap-1.5 rounded-[18px] bg-paper p-[26px] text-center">
              <span className="font-hand text-[28px] font-bold text-ribbon-deep">nothing here yet</span>
              <span className="text-plum-body">Add the first one above.</span>
            </li>
          )}
        </ul>
      </div>

      <QrPanel
        list={list}
        summary={summary}
        ownerEmail={ownerEmail}
        isGuest={actions.isGuest}
        paying={paying}
        onPay={onPay}
      />
    </section>
  );
}
