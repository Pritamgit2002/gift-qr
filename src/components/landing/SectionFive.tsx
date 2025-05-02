import Image from "next/image";
import React from "react";

export const SectionFive = () => {
  return (
    <section className="w-full px-6 md:px-12 lg:px-24 py-12 bg-white">
      <div className="flex flex-col items-start justify-center gap-4 mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
          Story Behind <span className="text-yellow-500">GiftQr</span>
        </h2>
        <p className="text-xl text-gray-600">Our Mission & Vision</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="lg:w-1/2 text-gray-700 text-lg leading-relaxed">
          <p className="mb-4">
            At <span className="font-semibold text-slate-800">GiftQr</span>, we
            aim to simplify gifting by allowing anyone to create unique,
            meaningful digital experiences. Whether it’s a birthday,
            anniversary, or a spontaneous moment of appreciation, we empower you
            to share love through customized QR codes — enriched with personal
            messages, links, and cherished photos.
          </p>
          <p>
            Our vision is to be the most heartfelt and innovative way people
            express love, memories, and connection — one personalized QR code at
            a time. Every scan should tell a story, spark emotion, and create
            lasting memories.
          </p>
        </div>

        <div className="lg:w-1/2 w-full rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/images/pp.jpg"
            alt="GiftQr story"
            width={800}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};
