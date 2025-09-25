"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function CarouselWithThumbs({ images }: { images: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleThumbClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="mx-auto w-full select-none">
      {/* Main carousel: each slide centers the full image (object-contain) */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images?.map((image, index) => (
            <CarouselItem key={index}>
              <div
                className="w-full rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center"
                style={{ minHeight: 300, maxHeight: "56vh" }} // keeps good visible area
              >
                <img
                  src={image}
                  alt={`image-${index}`}
                  className="max-h-[56vh] w-auto object-contain"
                // object-contain ensures the whole image is visible
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Thumbnails: simple responsive grid (no arrow buttons) */}
      <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-5 md:grid-cols-5">
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbClick(index)}
            className={cn(
              "rounded-lg overflow-hidden transition-transform focus:outline-none",
              current === index ? "scale-100" : "hover:scale-105"
            )}
            aria-label={`Go to image ${index + 1}`}
          >
            <div
              className={cn(
                "w-full aspect-square flex items-center justify-center bg-white",
                current === index ? "ring-2 ring-indigo-400" : "border border-transparent"
              )}
            >
              <img
                src={image}
                alt={`thumb-${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
