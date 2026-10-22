"use client";

import { useId, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { Globe, Loader2, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./dashboard.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "a@x.com, b@y.com\nc@z.com" → ["a@x.com", "b@y.com", "c@z.com"] */
const splitEmails = (text: string) =>
  text
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

/**
 * Who may open the QR besides its owner, as email chips. Each change saves at
 * once; no emails means anyone who scans it can open it.
 */
export function AccessPanel({
  emails,
  ownerEmail,
  onSave,
}: {
  emails: string[];
  ownerEmail: string;
  /** Saves the whole list; resolves true when it worked. */
  onSave: (emails: string[]) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputId = useId();
  const hintId = useId();
  const restricted = emails.length > 0;

  const save = async (next: string[]) => {
    setSaving(true);
    const saved = await onSave(next);
    setSaving(false);
    return saved;
  };

  const add = async (text: string) => {
    const added = splitEmails(text).filter((email) => !emails.includes(email));
    if (!added.length) return void setDraft("");
    const bad = added.find((email) => !EMAIL.test(email));
    if (bad) return setError(`"${bad}" doesn't look like an email.`);
    if (added.includes(ownerEmail.toLowerCase())) return setError("You can always open your own gift.");
    setError(null);
    if (await save([...emails, ...added])) setDraft("");
  };

  const onKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      void add(draft);
    } else if (event.key === "Backspace" && !draft && emails.length) {
      void save(emails.slice(0, -1));
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text");
    if (/[\s,;]/.test(text.trim())) {
      event.preventDefault();
      void add(text);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 rounded-[20px] border-2 border-line-soft bg-paper p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid h-10 w-10 flex-none place-items-center rounded-xl",
            restricted ? "bg-plum text-gold" : "bg-mint text-mint-ink"
          )}
          aria-hidden="true"
        >
          {restricted ? <Lock size={18} strokeWidth={2.5} /> : <Globe size={18} strokeWidth={2.5} />}
        </span>
        <div className="min-w-0">
          <label htmlFor={inputId} className="block font-display text-lg font-extrabold tracking-display">
            Who can open this gift?
          </label>
          <p id={hintId} className="m-0 text-sm text-plum-body">
            {restricted
              ? `Only ${emails.length === 1 ? "this person" : `these ${emails.length} people`} and you. They sign in with Google to open it.`
              : "Leave this empty and anyone who scans the QR can open it."}
          </p>
        </div>
      </div>

      <div className={cn(styles.field, styles.chipField)} onClick={() => document.getElementById(inputId)?.focus()}>
        {emails.map((email) => (
          <span key={email} className={styles.chip}>
            <span className="truncate">{email}</span>
            <button
              type="button"
              className={styles.chipRemove}
              aria-label={`Remove ${email}`}
              disabled={saving}
              onClick={(event) => {
                event.stopPropagation();
                void save(emails.filter((other) => other !== email));
              }}
            >
              <X size={13} strokeWidth={3} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="off"
          aria-describedby={hintId}
          className="min-w-[180px] flex-1 border-0 bg-transparent py-2 text-base outline-none placeholder:text-plum-mute"
          placeholder={restricted ? "Add another email" : "friend@gmail.com"}
          value={draft}
          disabled={saving}
          onChange={(event) => {
            setDraft(event.target.value);
            setError(null);
          }}
          onKeyDown={onKey}
          onPaste={onPaste}
          onBlur={() => draft.trim() && void add(draft)}
        />
        {saving && <Loader2 size={18} className="flex-none animate-spin text-plum-mute" aria-label="Saving" />}
      </div>
      {error && (
        <p role="alert" className="m-0 text-sm font-semibold text-ribbon-dark">
          {error}
        </p>
      )}
    </div>
  );
}
