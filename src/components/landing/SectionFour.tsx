import React from "react";
import { Button } from "../ui/button";

export const SectionFour = () => {
  return (
    <div className="w-max flex items-center justify-center gap-24 p-3 bg-slate-400 shadow-xl transform skew-x-[12deg] relative py-8 h-max group my-10 ">
      <div className="w-max flex items-center justify-center gap-24 p-6 bg-slate-900 shadow-xl transform skew-x-[-24deg] relative overflow-hidden">
        {/* Inner content should be un-skewed */}
        <div className="flex items-center justify-center gap-24 transform skew-x-[12deg] w-full">
          <span className="text-4xl font-medium text-gray-50">
            Now Get Started with the Gift Qr
          </span>
          <div className="mt-16">
            <Button className="bg-gradient-to-r from-yellow-500 to-red-500 text-white hover:from-red-500 hover:to-yellow-500 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 ease-in-out text-lg font-serif">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
