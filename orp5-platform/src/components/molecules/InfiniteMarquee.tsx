"use client"

import { PartnerCard } from "./PartnerCard";

interface InfiniteMarqueeProps {
  partners: any[];
  speed?: "slow" | "normal" | "fast";
}

export function InfiniteMarquee({ partners, speed = "normal" }: InfiniteMarqueeProps) {
  if (!partners || partners.length === 0) return null;

  // Duplicate the array to create a seamless loop
  const duplicatedPartners = [...partners, ...partners];

  // Adjust animation duration based on speed prop and item count
  const speedMap = {
    slow: 40,
    normal: 25,
    fast: 15,
  };
  
  // Calculate a dynamic duration to ensure speed stays consistent regardless of item count
  const baseDuration = speedMap[speed];
  const dynamicDuration = Math.max(15, (partners.length * baseDuration) / 5);

  return (
    <div className="w-full overflow-hidden flex relative group pt-4 pb-8">
      {/* Left and Right fades for aesthetics */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Primary Marquee Track */}
      <div
        className="flex min-w-max gap-8 md:gap-16 pr-8 md:pr-16 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${dynamicDuration}s` }}
      >
        {duplicatedPartners.map((partner, index) => (
          <div key={`${partner.id || index}-${index}`} className="flex-shrink-0">
            <PartnerCard
              name={partner.name}
              logoUrl={partner.logoUrl}
              website={partner.website}
              delay={0} // Disable initial animation for marquee items
            />
          </div>
        ))}
      </div>

      {/* Secondary Marquee Track (Aria-hidden for accessibility, creates the infinite loop) */}
      <div
        className="flex min-w-max gap-8 md:gap-16 pr-8 md:pr-16 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${dynamicDuration}s` }}
        aria-hidden="true"
      >
        {duplicatedPartners.map((partner, index) => (
          <div key={`dup-${partner.id || index}-${index}`} className="flex-shrink-0">
            <PartnerCard
              name={partner.name}
              logoUrl={partner.logoUrl}
              website={partner.website}
              delay={0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
