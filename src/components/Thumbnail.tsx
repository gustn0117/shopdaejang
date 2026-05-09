"use client";

import Image from "next/image";
import { useState } from "react";
import { STRIPED_BG } from "@/lib/placeholder";

export { STRIPED_BG };

type Props = {
  src?: string | null;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function Thumbnail({ src, alt, fill, sizes, className, priority }: Props) {
  const [failed, setFailed] = useState(false);
  const useFallback = !src || failed;

  if (useFallback) {
    return (
      <div
        aria-label={alt}
        className={className}
        style={{
          backgroundImage: `url("${STRIPED_BG}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: fill ? "100%" : undefined,
          height: fill ? "100%" : undefined,
          position: fill ? "absolute" : "relative",
          inset: fill ? 0 : undefined,
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
