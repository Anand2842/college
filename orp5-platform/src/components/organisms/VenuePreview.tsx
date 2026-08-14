import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { SectionTitle } from '@/components/atoms/SectionTitle';
import { MapPin, Plane, Train, Navigation, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/atoms/ScrollReveal';

export function VenuePreview({ venue }: { venue?: any }) {
  const title = venue?.title || "World-Class Conference Venue";
  const description = venue?.description || "Convening at the premier National Agricultural Science Complex (NASC), New Delhi — India's apex hub for agricultural leadership and international dialogue.";
  const image = venue?.image1 || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920";

  return (
    <section className="py-16 bg-[#FAF9F5] border-y border-gray-200/60 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <ScrollReveal variant="fadeUp">
          <SectionTitle
            badge="Host Facility"
            title={title}
            subtitle={description}
            centered
          />
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.1}>
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-earth-green/10 flex flex-col lg:flex-row luxury-card mt-12">
          
          {/* Left Column - Image */}
          <div className="lg:w-1/2 min-h-[320px] lg:min-h-[440px] relative overflow-hidden group">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth-green-deep/90 via-earth-green-dark/40 to-transparent flex items-end p-8 sm:p-10">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-rice-gold-light mb-3">
                  <MapPin size={14} className="text-rice-gold" />
                  <span>New Delhi, India</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
                  A.P. Shinde Symposium Hall
                </h3>
                <p className="text-white/80 text-sm font-light">NASC Complex, Dev Prakash Shastri Marg</p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rice-gold-dark mb-2 block">
              Connectivity & Travel
            </span>
            <h4 className="text-2xl font-serif font-bold text-charcoal mb-6">Effortless Global Accessibility</h4>
            
            <ul className="space-y-5 mb-10">
              <li className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
                  <Plane size={20} />
                </div>
                <div>
                  <p className="font-bold text-charcoal text-sm">Indira Gandhi International Airport (DEL)</p>
                  <p className="text-xs text-charcoal/70 mt-0.5">Approx. 16 km. Connected via Express Metro & App-based Cabs (25–35 min).</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
                  <Train size={20} />
                </div>
                <div>
                  <p className="font-bold text-charcoal text-sm">Major Railway Terminals</p>
                  <p className="text-xs text-charcoal/70 mt-0.5">Direct arterial access to New Delhi (NDLS), Hazrat Nizamuddin & Old Delhi.</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-earth-green/10 text-earth-green flex items-center justify-center shrink-0">
                  <Navigation size={20} />
                </div>
                <div>
                  <p className="font-bold text-charcoal text-sm">City Metro Network</p>
                  <p className="text-xs text-charcoal/70 mt-0.5">Rapid connectivity via Blue & Pink Metro lines with direct station shuttles.</p>
                </div>
              </li>
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link href="/venue">
                <Button variant="default" className="font-bold text-xs uppercase tracking-wider">
                  Explore Venue
                </Button>
              </Link>
              <Link href="/accommodation">
                <Button variant="outline" className="font-bold text-xs uppercase tracking-wider">
                  Hotel & Accommodation
                  <ArrowRight size={15} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
