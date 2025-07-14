"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { FlyerAd } from "@/lib/generated/prisma"
import Image from "next/image"
import Link from "next/link"
import type { FC } from "react"


export const FlyerCarousel: FC<{ flyers: FlyerAd[] }> = ({ flyers }) => {
  if (flyers.length === 0) return null

  return (
    <div className=" max-w-xs md:max-w-lg w-full flex justify-center mx-auto py-2 px-4">
      <Carousel className="h-full flex justify-center w-full" opts={{ loop: true }}>
        <CarouselContent className="h-full  w-full">
          {flyers.map((flyer) => (
            <CarouselItem className="h-96 w-96 md:h-140 md:w-140" key={flyer.id}>
              <div className="flex  h-full w-full justify-center items-center">
                {flyer.linkUrl ? (
                  <Link href={flyer.linkUrl} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={flyer.imageUrl}
                      alt="Flyer"
                      width={1000}
                      height={1000}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </Link>
                ) : (
                  <Image
                    src={flyer.imageUrl}
                    alt="Flyer"
                    width={1000}
                    height={1000}
                    className="rounded-lg object-cover w-full h-full"
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
