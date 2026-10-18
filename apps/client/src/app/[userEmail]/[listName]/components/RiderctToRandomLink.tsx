"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RedirectToRandomLink = ({ randomLink }: { randomLink: string }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(randomLink);
    }, 0);

    return () => clearTimeout(timer);
  }, [randomLink, router]);

  return <p>Redirecting to {randomLink} in a moment...</p>;
};

export default RedirectToRandomLink;
