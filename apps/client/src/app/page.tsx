"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthButtons from "@/components/AuthButtons";
import { LandingPage } from "@/components/landing/LandingPage";
import { SectionTwo } from "@/components/landing/sectionTwo";
import SectionThree from "@/components/landing/SectionThree";
import { SectionFour } from "@/components/landing/SectionFour";
import { SectionFive } from "@/components/landing/SectionFive";

const Home = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/create-qr");
    }
  }, [status, router]);

  return (
    <div className=" bg-[#fff9f9] max-w-6xl mx-auto flex flex-col items-center justify-center min-h-screen">
      <LandingPage />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <AuthButtons />
    </div>
  );
};

export default Home;
