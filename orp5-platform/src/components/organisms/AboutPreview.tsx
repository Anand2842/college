import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { ArrowRight, MapPin, Calendar, Building2, Globe2, Sparkles } from 'lucide-react';
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
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Global Legacy Bar */}
        <ScrollReveal variant="fadeUp" margin="-5%">
          <div className="mb-16 p-6 rounded-2xl bg-earth-green-deep text-white border border-white/10 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rice-gold/10 blur-[90px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-3 shrink-0">
              <Globe2 size={22} className="text-rice-gold" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-light">
                Global Symposia Legacy
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-center">
              {legacyEditions.map((ed, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Editorial Text */}
          <div className="lg:col-span-7">
            <ScrollReveal variant="fadeRight">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-earth-green/5 text-earth-green text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-earth-green/10">
              <Sparkles size={13} className="text-rice-gold" />
              The 5th Edition
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6 leading-tight">
              Shaping the Next Frontier in Sustainable Rice Ecosystems
            </h2>
            
            <div className="text-charcoal/75 text-base sm:text-lg leading-relaxed mb-8 space-y-4 font-light">
              <p>
                Building on the distinguished legacy of international symposia held in France, Italy, Brazil, and Japan, the <strong className="text-earth-green font-semibold">5th International Conference on Organic and Natural Rice Production Systems (ORP-5)</strong> convenes in India for the first time.
              </p>
              <p>
                Bringing together leading agronomists, policy architects, organic producers, and research scholars from over 40 countries to deliberate on resilient crop varieties, natural inputs, soil microbiome enhancement, and equitable market access.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
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
            </ScrollReveal>
          </div>

          {/* Right Column - Luxury At a Glance Bento Card */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal variant="fadeLeft" delay={0.2}>
              <div className="bg-[#FAF9F5] border border-earth-green/15 rounded-3xl p-8 shadow-xl relative overflow-hidden luxury-card">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rice-gold/10 rounded-bl-full pointer-events-none" />
              
              <h3 className="text-xl font-serif font-bold text-charcoal mb-6 border-b border-gray-200/80 pb-4 flex items-center justify-between">
                <span>Conference at a Glance</span>
                <span className="text-xs font-sans font-bold uppercase tracking-widest text-rice-gold-dark">Key Details</span>
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0 shadow-sm">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/60 uppercase tracking-wider font-bold">Conference Dates</p>
                    <p className="text-charcoal font-serif font-bold text-lg">21–25 September 2026</p>
                    <p className="text-xs text-earth-green font-medium mt-0.5">5 Full Days • 9 Technical Tracks</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/60 uppercase tracking-wider font-bold">Venue & Host City</p>
                    <p className="text-charcoal font-serif font-bold text-lg">A.P. Shinde Symposium Hall</p>
                    <p className="text-xs text-charcoal/70">NASC Complex, DPS Marg, New Delhi, India</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0 shadow-sm">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-charcoal/60 uppercase tracking-wider font-bold">Jointly Organised By</p>
                    <p className="text-charcoal font-semibold text-sm leading-snug mt-0.5">
                      AIASA • UAS Raichur • IPB University Indonesia
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            </ScrollReveal>
          </div>
          
        </div>
      </div>
    </section>
  );
}
