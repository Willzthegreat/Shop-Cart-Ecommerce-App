
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  images?: string[];
  isStock?: number;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full md:w-1/2">
        <div className="w-full min-h-[450px] border border-darkColor/10 rounded-md flex items-center justify-center">
          <p>No image available</p>
        </div>
      </div>
    );
  }

  const activeImage = images[active];

  return (
    <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ duration: 0.5 }}
          className="w-full max-h-[550px] min-h-[450px] border border-darkColor/10 rounded-md group overflow-hidden"
        >
          <Image
            src={activeImage}
            alt="productImage"
            width={700}
            height={700}
            priority
            className={`w-full h-96 object-contain group-hover:scale-110 hoverEffect rounded-md ${
              isStock === 0 ? "opacity-50" : ""
            }`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Image thumbnails */}
      <div className="flex py-3 px-1 gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            className={`w-20 h-20 shrink-0 border rounded-md overflow-hidden ${
              active === index ? "ring-1 ring-shop-dark-green/40 shadow-sm border-darkColor" : "border-darkColor/10 opacity-80"
            }`}
          >
            <Image
              src={image}
              alt={`Product image ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;