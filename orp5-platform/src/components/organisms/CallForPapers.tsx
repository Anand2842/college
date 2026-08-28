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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm font-bold mb-6 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                SUBMISSIONS CLOSED (25 AUGUST 2026)
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
                Share Your Research with the World
              </h2>
              
              <p className="text-gray-600 text-lg mb-8">
                The ORP-5 Scientific Committee has concluded receiving abstracts. All submitted abstracts for oral, poster, and video presentations are currently undergoing a double-blind peer review process.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Abstracts up to 500 words",
                  "PDF/DOCX file upload",
                  "Double-blind peer review",
                  "Published in Souvenir & Abstract Book",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 size={18} className="text-earth-green shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content - CTAs & Status */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-[#FFFDF7] p-6 rounded-2xl border border-gray-100 text-center">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-100">
                    <Clock size={14} className="animate-spin text-emerald-600" />
                    Peer Review in Progress
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Abstract submissions closed on 25 August 2026. Authors will receive status updates shortly.
                  </p>
                </div>
                
                <h3 className="font-bold text-charcoal mb-2">Check Your Review Status</h3>
                <p className="text-sm text-gray-500 mb-6">Enter your submission email to track review decisions and download receipts.</p>
                
                <div className="flex flex-col gap-3">
                  <Link href="/ticket-status?tab=abstract" className="w-full">
                    <Button className="w-full bg-earth-green hover:bg-green-800 text-white font-bold h-12 text-base">
                      <FileText className="mr-2" size={18} />
                      Track Abstract Status
                    </Button>
                  </Link>
                  
                  <Link href="/submission-guidelines" className="w-full">
                    <Button variant="outline" className="w-full h-12">
                      <Download className="mr-2" size={18} />
                      Download Guidelines
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
