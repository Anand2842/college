"use client"

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { FileText, Download, CheckCircle2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CallForPapers() {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const deadline = new Date("2026-06-30T23:59:59").getTime();
    
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
    <section className="py-20 bg-gradient-to-br from-rice-gold/10 via-[#FFFBF0] to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rice-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-earth-green/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="bg-white border border-rice-gold/30 rounded-3xl p-8 md:p-12 shadow-sm shadow-rice-gold/10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-bold mb-6 border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                DEADLINE: 30 JUNE 2026
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
                Share Your Research with the World
              </h2>
              
              <p className="text-gray-600 text-lg mb-8">
                The ORP-5 Scientific Committee invites abstracts for oral, poster, and video presentations. All submissions undergo a blind peer review process.
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
            
            {/* Right Content - CTAs & Countdown */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-[#FFFDF7] p-6 rounded-2xl border border-gray-100 text-center">
                {timeLeft && (
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-red-600 mb-3">
                      <Clock size={18} className="animate-pulse" />
                      <span className="text-sm font-bold uppercase tracking-wider">Abstracts Close In</span>
                    </div>
                    <div className="flex justify-center gap-3">
                      {[
                        { label: 'Days', value: timeLeft.days },
                        { label: 'Hrs', value: timeLeft.hours },
                        { label: 'Min', value: timeLeft.minutes },
                        { label: 'Sec', value: timeLeft.seconds }
                      ].map((unit, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xl font-bold text-charcoal shadow-sm">
                            {unit.value.toString().padStart(2, '0')}
                          </div>
                          <span className="text-[10px] text-gray-500 font-bold uppercase mt-1">{unit.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <h3 className="font-bold text-charcoal mb-2">Ready to submit?</h3>
                <p className="text-sm text-gray-500 mb-6">Create an account or login to access the submission portal.</p>
                
                <div className="flex flex-col gap-3">
                  <Link href="/submission" className="w-full">
                    <Button className="w-full bg-earth-green hover:bg-green-800 text-white font-bold h-12 text-lg">
                      <FileText className="mr-2" size={20} />
                      Submit Abstract Now
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
