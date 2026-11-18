"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Image with shimmer while loading and a graceful initial fallback if the URL breaks. */
export function ProfileImage({ src, name, className }: { src: string; name: string; className?: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const imgRef = useRef<HTMLImageElement>(null);

  // Server-rendered images can finish loading before React attaches onLoad/onError,
  // so check the element's real state after hydration.
  useEffect(() => {
    setState("loading");
    const img = imgRef.current;
    if (img?.complete) setState(img.naturalWidth > 0 ? "loaded" : "error");
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-ivory-deep", className)}>
      {state !== "loaded" && (
        <div
          role={state === "error" ? "img" : undefined}
          aria-label={state === "error" ? `${name} (photo unavailable)` : undefined}
          className={cn(
            "absolute inset-0 grid place-items-center",
            state === "error" ? "bg-gradient-to-br from-rose-soft to-ivory-deep" : "animate-pulse",
          )}
        >
          {state === "error" && <span className="font-display text-6xl text-rose/70">{name.charAt(0)}</span>}
        </div>
      )}
      {state !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={name}
          draggable={false}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
          className={cn(
            "size-full select-none object-cover transition-opacity duration-500",
            state === "loaded" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
