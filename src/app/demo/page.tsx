"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);

  const handleMakePayment = () => {
    setOpenA(false); // Close Dialog A
    setTimeout(() => {
      setOpenB(true); // Then open Dialog B
    }, 100); // slight delay to allow A to close before opening B
  };

  const handleProceedPayment = () => {
    setOpenB(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {/* Dialog A */}
      <Dialog open={openA} onOpenChange={setOpenA}>
        <DialogTrigger asChild>
          <Button>Add More</Button>
        </DialogTrigger>

        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Dialog A</h2>
          <Button onClick={handleMakePayment}>Make Payment</Button>

          {/* Dialog B nested inside A */}
          <Dialog open={openB} onOpenChange={setOpenB}>
            <DialogContent>
              <h2 className="text-lg font-semibold mb-4">Dialog B</h2>
              <Button onClick={handleProceedPayment}>Proceed Payment</Button>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    </div>
  );
}
