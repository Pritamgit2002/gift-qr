"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { ITEM_PRICES, MIN_LIST_ITEMS, type PaymentTarget, type SessionUser } from "@giftqr/shared";
import { Logo } from "@/components/brand/logo";
import { Sparkle } from "@/components/brand/art";
import { buttonVariants } from "@/components/brand/button";
import { addCurrentUser, deleteCurrentUser } from "@/lib/api/users";
import { checkout } from "@/lib/checkout";
import { cn } from "@/lib/utils";
import { GUEST_LIMITS, useGiftLists } from "./use-gift-lists";
import { ListCard } from "./list-card";
import { ListEditor } from "./list-editor";
import { Party } from "./party";
import styles from "./dashboard.module.css";

export function Dashboard({ user }: { user: SessionUser }) {
  const router = useRouter();
  const actions = useGiftLists(user);
  const { lists, loading, loadError, isGuest } = actions;
  const [selected, setSelected] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [paying, setPaying] = useState<PaymentTarget | null>(null);
  const [parties, setParties] = useState(0);
  const [signingOut, setSigningOut] = useState(false);
  const nameId = useId();

  const name = user.name.trim() || (isGuest ? "Guest" : "there");
  const firstName = name.split(" ")[0];

  // Save the account the first time it signs in; an existing one answers 409, which is fine.
  useEffect(() => {
    void addCurrentUser();
  }, []);

  // Keep a list selected: the chosen one, else the first.
  const current = lists.find((list) => list.name === selected) ?? lists[0];

  const createList = async (event: FormEvent) => {
    event.preventDefault();
    setCreating(true);
    const result = await actions.createList(newName);
    setCreating(false);
    if (!result.ok) return void toast.error(result.message);
    toast.success(result.message);
    setSelected(newName.trim());
    setNewName("");
  };

  const pay = async (target: PaymentTarget) => {
    if (!current) return;
    setPaying(target);
    const outcome = await checkout({
      listName: current.name,
      target,
      prefill: { name, email: isGuest ? undefined : user.email },
      onFailedAttempt: (message) => toast.error(message),
    });
    setPaying(null);
    if (outcome.status === "dismissed") return;
    if (outcome.status === "failed") return void toast.error(outcome.message);
    await actions.reload();
    setParties((n) => n + 1);
    toast.success(target === "list" ? "Paid. Your QR code is ready!" : "New items added to your QR code");
  };

  const logOut = async () => {
    setSigningOut(true);
    // A guest's account goes with them.
    if (isGuest) await deleteCurrentUser();
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-paper">
      <header className="border-b-2 border-line-soft bg-paper py-[18px]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 sm:px-8">
          <Logo size={36} />
          <div className="flex items-center gap-3.5">
            <span className="flex items-center gap-2.5">
              <span
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-plum bg-gold font-display text-lg font-extrabold"
                aria-hidden="true"
              >
                {firstName.charAt(0).toUpperCase()}
              </span>
              <span className="flex flex-col leading-tight">
                <b className="text-[15px]">{name}</b>
                <span className="text-[13px] text-plum-mute">{isGuest ? "Guest" : "Google account"}</span>
              </span>
            </span>
            <button
              type="button"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              disabled={signingOut}
              onClick={() => void logOut()}
            >
              {signingOut ? "Logging out…" : "Log out"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 pb-[60px] pt-10 sm:px-8">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-hand text-[28px] font-bold text-ribbon-deep">welcome back, {firstName}</span>
            <h1 className="mb-0 mt-0.5 font-display text-[clamp(34px,4vw,52px)] font-extrabold leading-none tracking-display">
              What are we wrapping today?
            </h1>
          </div>
          <form className="flex flex-wrap items-end gap-2.5" onSubmit={createList}>
            <label htmlFor={nameId} className="flex flex-col gap-1.5 text-sm font-semibold">
              New list name
              <input
                id={nameId}
                className={cn(styles.field, "w-[280px] max-w-full")}
                type="text"
                autoComplete="off"
                placeholder="e.g. Dad's retirement"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </label>
            <button type="submit" className={buttonVariants()} disabled={creating}>
              {creating ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              ) : (
                <Plus size={18} strokeWidth={3} aria-hidden="true" />
              )}
              Create list
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-start gap-7">
          <aside aria-label="Your lists" className="flex min-w-0 flex-[1_1_340px] flex-col gap-3.5">
            <h2 className="mb-1 mt-0 font-display text-[22px] font-extrabold tracking-display">
              Your lists{" "}
              <span className="ml-1.5 inline-grid h-[30px] min-w-[30px] place-items-center rounded-full bg-plum px-2 text-sm text-white">
                {lists.length}
              </span>
            </h2>
            {loading && <p className="m-0 text-plum-body">Unwrapping your lists…</p>}
            {loadError && (
              <p role="alert" className="m-0 rounded-[18px] bg-peach px-[18px] py-4 font-semibold text-ribbon-dark">
                {loadError}
              </p>
            )}
            {lists.map((list) => (
              <ListCard
                key={list.name}
                list={list}
                selected={list.name === current?.name}
                onSelect={() => setSelected(list.name)}
              />
            ))}
            <div className="mt-2.5 flex animate-float-sm items-center gap-3.5 rounded-[22px] bg-blush p-[18px]">
              <Sparkle size={40} stroke="#23142E" className="flex-none" />
              <span className="text-[15px] leading-normal text-plum-body">
                {isGuest
                  ? `Guest lists are free: up to ${GUEST_LIMITS.lists} lists, with ${GUEST_LIMITS.links} links and ${GUEST_LIMITS.messages} messages each.`
                  : `Every list needs ${MIN_LIST_ITEMS} items to unlock. Links and messages are ₹${ITEM_PRICES.link}, photos and audio ₹${ITEM_PRICES.image}.`}
              </span>
            </div>
          </aside>

          {current ? (
            <ListEditor list={current} ownerEmail={user.email} actions={actions} paying={paying} onPay={(t) => void pay(t)} />
          ) : (
            !loading && (
              <section
                aria-label="List editor"
                className="flex min-w-0 flex-[999_1_560px] flex-col items-center gap-2 rounded-[32px] border-2 border-dashed border-line-dash bg-white px-7 py-16 text-center"
              >
                <span className="font-hand text-[34px] font-bold text-ribbon-deep">your first gift starts here</span>
                <p className="m-0 max-w-[420px] text-lg leading-relaxed text-plum-body">
                  Name a list above, then pack it with links, messages, photos and audio.
                </p>
              </section>
            )
          )}
        </div>
      </main>

      {parties > 0 && <Party key={parties} />}
    </div>
  );
}
