import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Trophy, ArrowRight } from 'lucide-react';

export function AwardsPreview() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-gradient-to-r from-[#FFFDF7] to-white border border-rice-gold/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-rice-gold/10 flex items-center justify-center shrink-0 border border-rice-gold/20">
              <Trophy size={32} className="text-rice-gold" />
            </div>
            
            <div>
              <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">Awards & Prizes</h3>
              <p className="text-gray-600 text-sm md:text-base">
                80+ Awards across 15 categories including <span className="font-semibold text-earth-green">Dr. M.S. Swaminathan Awards</span>, Young Scientist, and Best Poster.
              </p>
            </div>
          </div>
          
          <div className="shrink-0 w-full md:w-auto">
            <Link href="/awards" className="w-full">
              <Button variant="outline" className="w-full border-rice-gold text-charcoal hover:bg-rice-gold/5">
                View All Awards
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}
