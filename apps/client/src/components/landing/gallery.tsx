import Image, { type StaticImageData } from "next/image";
import teaTable from "../../../public/images/five.jpg";
import weddingSign from "../../../public/images/four.jpg";
import byTheFlowers from "../../../public/images/one.webp";
import inACard from "../../../public/images/six.jpg";
import onAnEasel from "../../../public/images/three.jpg";
import tableTent from "../../../public/images/two.jpg";
import styles from "./landing.module.css";

const photos: { src: StaticImageData; alt: string; caption: string; tilt: number }[] = [
  { src: teaTable, alt: "A pink scan-me sign with a QR code on a table", caption: "on the tea table", tilt: -3 },
  { src: weddingSign, alt: "A green share-the-love sign with a QR code", caption: "wedding welcome sign", tilt: 2 },
  { src: byTheFlowers, alt: "A capture-the-love sign with a QR code beside flowers", caption: "next to the flowers", tilt: -2 },
  { src: inACard, alt: "Two printed cards with QR codes", caption: "tucked in a card", tilt: 3 },
  { src: onAnEasel, alt: "A pink share-the-love sign on an easel", caption: "on an easel", tilt: -3 },
  { src: tableTent, alt: "A pink table sign with a QR code", caption: "party table tent", tilt: 2 },
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
          {[...photos, ...photos].map((photo, i) => {
            const copy = i >= photos.length;
            return (
              <figure
                key={i}
                className={styles.polaroid}
                style={{ transform: `rotate(${photo.tilt}deg)` }}
                aria-hidden={copy || undefined}
              >
                <Image
                  src={photo.src}
                  alt={copy ? "" : photo.alt}
                  className="block h-[216px] w-[216px] rounded object-cover"
                  sizes="216px"
                />
                <figcaption className="mt-2 text-center font-hand text-2xl font-bold">{photo.caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
