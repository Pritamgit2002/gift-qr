import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const arr = [
  {
    title: "Create a List",
    desc: "Create a list by clicking the Add List button. Provide a unique name for each list.",
  },
  {
    title: "Provide Items",
    desc: "Provide items like links, messages, and images to your list. We accept any kind of link, message and images. So, feel free to add as many as you want.",
  },
  {
    title: "Get Qr",
    desc: "Once you have added all the items to your list, click the Get Qr button to generate a QR code. You can share this QR code with your friends and family to share your list with them.",
  },
];

const SectionThree = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation functions
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === arr.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? arr.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-max bg-gradient-to-br from-rose-50 to-red-50 overflow-hidden py-16 ">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24 flex flex-col md:flex-row min-h-max">
        {/* Left side - Image column (on desktop) */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/process.jpg"
              alt="Process visualization"
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-6 text-white">
                <span className="bg-rose-500 text-white text-sm px-3 py-1 rounded-full">
                  Step {currentIndex + 1}/{arr.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center md:pl-12">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8">
            Our Process
          </h1>

          {/* Current step content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-rose-600 mb-4">
              {arr[currentIndex].title}
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              {arr[currentIndex].desc}
            </p>

            {/* Progress indicators */}
            <div className="flex items-center justify-between mt-6">
              {/* Step indicators */}
              <div className="flex space-x-2">
                {arr.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-rose-600 w-8" : "bg-gray-300"
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                  aria-label="Previous step"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition-colors"
                  aria-label="Next step"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile view: All steps list */}
          {isMobile && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                All Steps
              </h3>
              <div className="space-y-3">
                {arr.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-rose-100 border-l-4 border-rose-500"
                        : "bg-white/60 hover:bg-white"
                    }`}
                  >
                    <p className="font-medium text-gray-900">{step.title}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionThree;
