"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface MarqueePhoto {
  id: string;
  thumbnail: string;
  caption: string;
}

interface PhotoMarqueeProps {
  title: string;
  items: MarqueePhoto[];
  reverse?: boolean;
  durationSeconds?: number;
}

// Auto-running photo strip. Images are only requested, and the animation only runs,
// once the strip is near the viewport — so it costs nothing on initial page load.
export function PhotoMarquee({ title, items, reverse = false, durationSeconds = 80 }: PhotoMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  const track = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className={`flex min-w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused] ${reverse ? "[animation-direction:reverse]" : ""}`}
      style={{ animationDuration: `${durationSeconds}s`, animationPlayState: inView ? undefined : "paused" }}
    >
      {items.map((item, idx) => (
        <Link
          key={`${item.id}-${idx}`}
          href="/gallery"
          tabIndex={hidden ? -1 : undefined}
          className="shrink-0 w-[260px] sm:w-[320px] mr-4 rounded-2xl overflow-hidden bg-white border border-earth-green/10 shadow-sm"
        >
          <div className="w-full aspect-[3/2] bg-earth-green/5">
            {loaded && (
              <img
                src={item.thumbnail}
                alt={hidden ? "" : item.caption || title}
                width={600}
                height={400}
                decoding="async"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="mt-10">
      <h3 className="container mx-auto px-6 max-w-7xl text-lg sm:text-xl font-serif font-bold text-charcoal mb-4">
        {title}
      </h3>
      <div className="group flex overflow-hidden">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
