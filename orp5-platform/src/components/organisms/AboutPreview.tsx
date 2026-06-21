import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { ArrowRight, MapPin, Calendar, Users, Building } from 'lucide-react';

export function AboutPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-6">
              About ORP-5
            </h2>
            <div className="text-gray-600 text-lg leading-relaxed mb-8 space-y-4">
              <p>
                Building on a strong legacy of international symposia held in France (2012), Italy (2015), Brazil (2018), and Japan (2023), the 5th International Conference on Organic and Natural Rice Production Systems (ORP-5) is coming to India.
              </p>
              <p>
                The conference brings together scientists, farmers, policymakers, and industry stakeholders to advance sustainable, climate-resilient rice production systems globally.
              </p>
            </div>
            <Link href="/about">
              <Button variant="outline" className="group">
                Learn More About ORP-5
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Right Column - At a Glance Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-rice-gold/10 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
            <div className="bg-[#FFFDF7] border border-rice-gold rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-charcoal mb-6 border-b border-gray-100 pb-4">
                Conference at a Glance
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-earth-green/10 flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-earth-green" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Dates</p>
                    <p className="text-charcoal font-bold">21–25 September 2026</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-earth-green/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-earth-green" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Venue</p>
                    <p className="text-charcoal font-bold">A.P. Shinde Symposium Hall</p>
                    <p className="text-gray-500 text-sm">NASC Complex, New Delhi</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-earth-green/10 flex items-center justify-center shrink-0">
                    <Building size={20} className="text-earth-green" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Jointly Organized By</p>
                    <p className="text-charcoal font-bold text-sm">AIASA • UAS Raichur • IPB University</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
