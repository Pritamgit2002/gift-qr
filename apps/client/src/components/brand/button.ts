import { cva, type VariantProps } from "class-variance-authority";

/** Pill buttons. Use on <button> and <a>/<Link> alike. */
export const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full font-sans font-bold " +
    "transition-[transform,box-shadow,background-color] duration-350 ease-pop " +
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[.96] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "btn-shine bg-ribbon text-white shadow-cta hover:shadow-cta-hover",
        ghost: "bg-white text-plum shadow-outline hover:bg-blush",
        gold: "bg-gold text-plum shadow-gold-cta",
        dark: "bg-plum text-white",
        // Looks like a button, does nothing: a goal still to reach.
        off: "cursor-not-allowed bg-line text-plum-mute hover:translate-y-0",
      },
      size: {
        sm: "min-h-11 px-5 text-[15px]",
        md: "min-h-12 px-[22px] text-base",
        lg: "min-h-[52px] px-[26px] text-[17px] hover:translate-y-[-3px] hover:-rotate-1 active:rotate-0",
        xl: "min-h-[60px] px-8 text-[19px] hover:translate-y-[-3px] hover:-rotate-1 active:rotate-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
