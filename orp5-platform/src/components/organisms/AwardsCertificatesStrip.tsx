import { SectionTitle } from "@/components/atoms/SectionTitle";
import { PhotoMarquee, MarqueePhoto } from "@/components/molecules/PhotoMarquee";
import galleryData from "@/data/gallery.json";

// Certificate handovers that sit outside the "Awards & Honours" gallery category
const CERTIFICATE_PHOTOS = [
  "11_Day2_Sessions_02",
  "11_Day2_Sessions_03",
  "11_Day2_Sessions_04",
  "11_Day2_Sessions_05",
  "06_Technical_Session_VIII_03",
  "07_Technical_Session_IX_03",
];

type Photo = { id: string; thumbnail?: string; caption?: string; category?: string };

const toMarquee = (p: Photo): MarqueePhoto => ({ id: p.id, thumbnail: p.thumbnail || "", caption: p.caption || "" });

const photos = galleryData.mainGallery as Photo[];
const awards = photos.filter((p) => p.category === "Awards & Honours").map(toMarquee);
const certificates = photos
  .filter((p) => CERTIFICATE_PHOTOS.some((name) => p.thumbnail?.endsWith(`/${name}-thumb.webp`)))
  .map(toMarquee);
// Only 6 certificate photos: repeat them so one pass is wider than any screen and the loop has no gap
const certificateTrack = [...certificates, ...certificates, ...certificates];

export function AwardsCertificatesStrip() {
  return (
    <section id="awards-certificates" className="py-10 md:py-16 bg-[#FAF9F5] border-y border-gray-200/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <SectionTitle
          badge="Recognition"
          title="Awards & Certificates"
          subtitle="Honours presented at ORP-5, 21–25 September 2026."
          centered
        />
      </div>
      <PhotoMarquee title="Awards & Honours" items={awards} durationSeconds={90} />
      <PhotoMarquee title="Certificate Distribution" items={certificateTrack} durationSeconds={80} reverse />
    </section>
  );
}
