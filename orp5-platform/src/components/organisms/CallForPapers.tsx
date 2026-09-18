"use client"

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { FileText, Download, CheckCircle2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CallForPapers() {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const deadline = new Date("2026-08-15T23:59:59").getTime();
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = deadline - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-14 bg-gradient-to-br from-rice-gold/10 via-[#FFF8E1] to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rice-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-earth-green/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="bg-white border border-rice-gold/30 rounded-3xl p-8 md:p-12 shadow-sm shadow-rice-gold/10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold mb-6 border border-red-200">
                <Clock size={14} className="text-red-600" />
                ABSTRACT SUBMISSIONS CLOSED
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
                Abstract Submissions are Now Closed
              </h2>
              
              <p className="text-gray-600 text-lg mb-8">
                The ORP-5 Scientific Committee has closed abstract intake. Submitted abstracts are currently undergoing blind peer review. Authors will be notified of decisions via email.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Blind peer review in progress",
                  "Scopus-indexed publication",
                  "Oral & Poster sessions scheduled",
                  "Published in Souvenir & Abstract Book",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 size={18} className="text-earth-green shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content - CTAs */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-[#FFFDF7] p-6 rounded-2xl border border-gray-100 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 font-bold">
                  <CheckCircle2 size={24} />
                </div>
                
                <h3 className="font-bold text-charcoal mb-2 text-lg">Already Submitted?</h3>
                <p className="text-sm text-gray-500 mb-6">Track your review decision or complete your mandatory delegate registration.</p>
                
                <div className="flex flex-col gap-3">
                  <Link href="/ticket-status?tab=abstract" className="w-full">
                    <Button className="w-full bg-[#123125] hover:bg-earth-green text-white font-bold h-12 text-base">
                      <FileText className="mr-2" size={18} />
                      Track Abstract Status
                    </Button>
                  </Link>
                  
                  <Link href="/registration" className="w-full">
                    <Button className="w-full bg-[#24C535] hover:bg-green-600 text-white font-bold h-12 text-base">
                      <CheckCircle2 className="mr-2" size={18} />
                      Delegate Registration
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
