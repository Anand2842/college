import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { ArrowRight, Globe2, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/atoms/ScrollReveal';

export function AboutPreview() {
  const legacyEditions = [
    { year: "2012", city: "Montpellier", country: "France" },
    { year: "2015", city: "Milan", country: "Italy" },
    { year: "2018", city: "Porto Alegre", country: "Brazil" },
    { year: "2023", city: "Niigata", country: "Japan" },
    { year: "2026", city: "New Delhi", country: "India", active: true },
  ];

  return (
    <section className="py-10 md:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        {/* Global Legacy Bar */}
        <ScrollReveal variant="fadeUp" margin="-5%">
          <div className="mb-10 md:mb-14 p-4 md:p-6 rounded-2xl bg-earth-green-deep text-white border border-white/10 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rice-gold/10 blur-[90px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6 relative z-10">
            <div className="flex items-center gap-3 shrink-0">
              <Globe2 size={22} className="text-rice-gold" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light">
                Global Symposia Legacy
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-center">
              {legacyEditions.map((ed, idx) => (
                <div key={idx} className="flex items-center gap-2 sm:gap-3">
                  <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                    ed.active 
                      ? "bg-rice-gold text-earth-green-dark shadow-md scale-105 ring-2 ring-white/30" 
                      : "bg-white/5 text-white/70 border border-white/10"
                  }`}>
                    <span className="font-serif text-sm font-bold block">{ed.year}</span>
                    <span className="text-[10px] tracking-wider uppercase opacity-90">{ed.country}</span>
                  </div>
                  {idx < legacyEditions.length - 1 && (
                    <span className="text-white/20 hidden sm:inline">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* About Text — Full Width */}
        <ScrollReveal variant="fadeUp">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-earth-green/10">
              <Sparkles size={13} className="text-rice-gold" />
              The 5th Edition
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-charcoal mb-5 leading-tight">
              Shaping the Next Frontier in Sustainable Rice Ecosystems
            </h2>
            
            <p className="text-charcoal/75 text-base sm:text-lg leading-relaxed mb-8 font-light">
              Building on symposia held in France, Italy, Brazil, and Japan, <strong className="text-earth-green font-semibold">ORP-5</strong> convenes in India for the first time — bringing together agronomists, policy architects, and organic producers from 40+ countries to deliberate on resilient rice systems.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/about">
                <Button variant="default" size="lg" className="font-bold text-xs uppercase tracking-wider">
                  Learn More About ORP-5
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/committees">
                <Button variant="outline" size="lg" className="font-bold text-xs uppercase tracking-wider">
                  View Committees
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
