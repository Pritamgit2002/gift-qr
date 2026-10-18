import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export const LandingPage = () => {
  return (
    <div className="w-full bg-[#fff9f9] pt-16 px-4 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-6 font-display">
          <div className=" w-96 space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Make Gifting Fun and Easy
            </h1>
            <p className="text-base md:text-lg text-gray-700 max-w-xl">
              Welcome to{" "}
              <span className="font-semibold text-black">GiftQr</span> — the
              simplest way to share love through personalized QR codes. Create a
              unique gift by adding your favorite links, heartfelt messages, and
              memorable photos. Whether it’s for a birthday, anniversary, or
              just because —{" "}
              <span className="font-semibold text-black">GiftQr</span> makes
              every moment special.
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:from-red-500 hover:to-yellow-500 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 ease-in-out text-lg font-serif">
            <Link href="/form">Get Started</Link>
          </Button>
          <Image
            src="/images/gg.webp"
            alt="gift"
            width={800}
            height={800}
            className="w-full object-cover rounded-xl mt-6"
          />
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/images/qr.webp"
            alt="gift qr"
            width={800}
            height={800}
            className="w-full h-screen object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
