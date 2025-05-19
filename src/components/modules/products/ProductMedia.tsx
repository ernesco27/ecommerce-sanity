//import { ProductImage } from "@prisma/client";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";
import type { Swiper as SwiperType } from "swiper";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  Product,
  SanityImageCrop,
  SanityImageHotspot,
} from "../../../../sanity.types";
import { urlFor } from "@/sanity/lib/image";
import "./style.css";

type SanityImage = {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
  };
  media?: unknown;
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  alt?: string;
  _type: "image";
  _key?: string;
};

type ProcessedImage = {
  url: string;
  alt?: string;
  dimensions?: {
    _type: "sanity.imageDimensions";
    aspectRatio: number;
    height: number;
    width: number;
  };
  lqip?: string;
};

type ImageType = SanityImage | ProcessedImage;

const isProcessedImage = (image: ImageType): image is ProcessedImage => {
  return "url" in image;
};

const getImageUrl = (image: ImageType): string => {
  if (isProcessedImage(image)) {
    return image.url;
  }
  return urlFor(image).url();
};

const getImageAlt = (image: ImageType): string => {
  return image.alt || "";
};

const getImageKey = (image: ImageType | undefined): string => {
  if (!image) return "";
  if (isProcessedImage(image)) {
    return image.url;
  }
  return image._key || image.asset?._ref || "";
};

const ProductMedia = ({ media }: { media: Product["images"] }) => {
  const defaultImage = media?.primary || media?.gallery?.[0];
  const [selectedMedia, setSelectedMedia] = useState<ImageType | undefined>(
    defaultImage,
  );
  const mainSwiperRef = useRef<SwiperType | null>(null);

  if (!media) return null;

  const handleThumbnailClick = (img: ImageType, index: number) => {
    setSelectedMedia(img);
    mainSwiperRef.current?.slideTo(index);
  };

  return (
    <div className="w-full">
      {/* Main Image Swiper */}
      <div className="relative">
        <Swiper
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={0}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation, Pagination]}
          className="w-full h-[500px] lg:h-[700px]"
        >
          {media.gallery?.map((img) => (
            <SwiperSlide key={getImageKey(img)}>
              <div className="w-full h-full flex items-center justify-center">
                <Zoom>
                  <img
                    src={getImageUrl(img)}
                    alt={getImageAlt(img)}
                    className="w-full h-full object-contain"
                  />
                </Zoom>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Swiper */}
      <div className="mt-4">
        <Swiper
          breakpoints={{
            360: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            575: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            1280: {
              slidesPerView: 7,
              spaceBetween: 10,
            },
          }}
          navigation={true}
          modules={[Navigation]}
          className="w-full"
        >
          {media.gallery?.map((img, index) => (
            <SwiperSlide key={getImageKey(img)}>
              <div
                className={cn(
                  "cursor-pointer p-1 m-2 rounded-lg transition-all duration-200",
                  getImageKey(selectedMedia) === getImageKey(img)
                    ? "ring-2 ring-yellow-600"
                    : "hover:ring-2 hover:ring-gray-300",
                )}
                onClick={() => handleThumbnailClick(img, index)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={getImageUrl(img)}
                    alt={getImageAlt(img)}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 360px) 33vw, (max-width: 575px) 25vw, (max-width: 768px) 20vw, (max-width: 1024px) 16vw, 14vw"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductMedia;
