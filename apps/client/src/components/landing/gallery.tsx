import {
  BirthdayCardScene,
  EnvelopeScene,
  FridgeNoteScene,
  GiftTagScene,
  TableTentScene,
  WelcomeSignScene,
  type Scene,
} from "@/components/brand/scenes";
import styles from "./landing.module.css";

const ideas: { Scene: Scene; alt: string; caption: string; tilt: number }[] = [
  { Scene: BirthdayCardScene, alt: "A birthday card with a QR code inside", caption: "inside a birthday card", tilt: -3 },
  { Scene: GiftTagScene, alt: "A gift tag with a QR code, tied to a wrapped box", caption: "on the gift tag", tilt: 2 },
  { Scene: WelcomeSignScene, alt: "A welcome sign with a QR code on an easel", caption: "wedding welcome sign", tilt: -2 },
  { Scene: TableTentScene, alt: "A table card with a QR code next to a cup of tea", caption: "party table tent", tilt: 3 },
  { Scene: EnvelopeScene, alt: "A letter with a QR code sliding out of an envelope", caption: "sealed in an envelope", tilt: -3 },
  { Scene: FridgeNoteScene, alt: "A note with a QR code held on a fridge by a heart magnet", caption: "stuck on the fridge", tilt: 2 },
];

export function Gallery() {
  return (
    <section aria-labelledby="ideas-heading" className="pb-[60px] pt-[90px]">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-end justify-between gap-5 px-4 sm:px-8">
        <h2
          id="ideas-heading"
          className="scroll-rise m-0 max-w-[680px] font-display text-[clamp(38px,5vw,64px)] font-extrabold leading-none tracking-display"
        >
          Print it. Frame it. Hide it in the box.
        </h2>
        <p className="scroll-rise-2 m-0 max-w-[380px] text-lg leading-relaxed text-plum-body">
          A GiftQR works anywhere a scan can happen: welcome signs, cards, table tents, gift tags.
        </p>
      </div>
      <div className="mt-[30px] overflow-hidden">
        {/* The second copy keeps the loop seamless and stays out of the accessibility tree. */}
        <div className={styles.track}>
          {[...ideas, ...ideas].map((idea, i) => {
            const copy = i >= ideas.length;
            return (
              <figure
                key={i}
                className={styles.polaroid}
                style={{ transform: `rotate(${idea.tilt}deg)` }}
                aria-hidden={copy || undefined}
              >
                <idea.Scene className="block h-[216px] w-[216px] rounded" label={copy ? undefined : idea.alt} />
                <figcaption className="mt-2 text-center font-hand text-2xl font-bold">{idea.caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
