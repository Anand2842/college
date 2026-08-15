import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { MapPin, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/atoms/ScrollReveal';

export function VenuePreview({ venue }: { venue?: any }) {
  const image = venue?.image1 || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920";

  return (
    <section className="py-10 md:py-16 bg-[#FAF9F5] border-y border-gray-200/60 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <ScrollReveal variant="fadeUp">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-earth-green/10 relative group luxury-card">
            {/* Background Image */}
            <div className="relative min-h-[200px] md:min-h-[280px]">
              <img 
                src={image} 
                alt="Conference Venue" 
                className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-earth-green-deep/95 via-earth-green-dark/60 to-earth-green-deep/30" />
              
              {/* Content Overlay */}
              <div className="relative z-10 flex flex-col items-center justify-end text-center p-6 md:p-10 min-h-[200px] md:min-h-[280px]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-rice-gold-light mb-3">
                  <MapPin size={14} className="text-rice-gold" />
                  <span>New Delhi, India</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white mb-1">
                  A.P. Shinde Symposium Hall
                </h3>
                <p className="text-white/70 text-sm mb-5">NASC Complex, Dev Prakash Shastri Marg • 21–25 September 2026</p>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/venue">
                    <Button variant="premium" size="sm" className="font-bold text-xs uppercase tracking-wider">
                      Explore Venue
                      <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                  <Link href="/accommodation">
                    <Button variant="glass" size="sm" className="font-bold text-xs uppercase tracking-wider border-white/30 text-white hover:border-rice-gold/60">
                      Hotels & Stay
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
