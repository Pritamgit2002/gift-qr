"use client";
import React, { useState } from "react";
import QRcode from "qrcode";
import Image from "next/image";
import { Button } from "./ui/button";

const QrComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [src, setSrc] = useState("");
  const generateQr = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/get-random-url");
      const randomUrl = await response.json();
      const qrData = await QRcode.toDataURL(randomUrl);
      setSrc(qrData);
      setUrl(randomUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Button
        variant="secondary"
        onClick={generateQr}
        className="bg-white text-black px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate QR Code"}
      </Button>
      {src && (
        <Image
          src={src}
          alt="QR Code"
          width={200}
          height={200}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default QrComponent;
