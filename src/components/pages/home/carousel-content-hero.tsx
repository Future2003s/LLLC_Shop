"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import Image2 from "../../../../public/images/hero/AQ0P0541.jpg";
import Image from "next/image";

export default function CarouselContentHero(): React.JSX.Element {
  return (
    <React.Fragment>
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
      >
        <CarouselContent className="h-[20.5rem]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className=" md:basis-1/2">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-2">
                    <Image
                      alt="img"
                      src={Image2}
                      className="aspect-3/2 w-full rounded-lg object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </React.Fragment>
  );
}
