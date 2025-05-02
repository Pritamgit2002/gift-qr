import Image from "next/image";
import React from "react";

type Props = {};
const arr = [
  "/images/one.webp",
  "/images/two.jpg",
  "/images/three.jpg",
  "/images/four.jpg",
  "/images/five.jpg",
  "/images/six.jpg",
];

export const SectionTwo = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-start pt-24 md:pt-40 bg-[#fff9f9] w-full min-h-screen">
      <div className="space-y-4 px-4 text-center">
        <span className="text-3xl md:text-5xl lg:text-6xl font-semibold">
          Share Joy with Personalized Qr
        </span>
        <p className="text-base md:text-lg leading-snug text-gray-700 max-w-xl mx-auto">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia
          incidunt veritatis et cupiditate labore natus aspernatur cumque, minus
          doloribus blanditiis adipisci eos fugiat dicta tempore.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center px-4 mt-10 w-full max-w-7xl">
        {arr.map((item, index) => (
          <Image
            src={item}
            alt="gift"
            width={800}
            height={800}
            key={index}
            className="w-full max-w-xs h-auto object-cover rounded-xl bg-red-600"
          />
        ))}
      </div>
    </div>
  );
};
