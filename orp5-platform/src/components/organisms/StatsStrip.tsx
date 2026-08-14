'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { Globe, Layers, Trophy, Calendar, BookOpen } from 'lucide-react';
import { useEffect, useRef } from 'react';

function AnimatedCounter({ from = 0, to, duration = 2 }: { from?: number, to: number, duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const spring = useSpring(from, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    if (isInView) {
      spring.set(to);
    }
  }, [isInView, spring, to]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function StatsStrip() {
  const stats = [
    {
      icon: <Globe size={28} className="text-rice-gold" />,
      value: 5,
      suffix: "th",
      label: "Global Edition",
      sublabel: "France • Italy • Brazil • Japan • India",
    },
    {
      icon: <Layers size={28} className="text-rice-gold" />,
      value: 9,
      suffix: "",
      label: "Thematic Tracks",
      sublabel: "From Soil to Policy",
    },
    {
      icon: <Trophy size={28} className="text-rice-gold" />,
      value: 80,
      suffix: "+",
      label: "Awards & Prizes",
      sublabel: "National & Global Honors",
    },
    {
      icon: <Calendar size={28} className="text-rice-gold" />,
      value: 5,
      suffix: " Days",
      label: "Deliberation",
      sublabel: "21–25 September 2026",
    },
    {
      icon: <BookOpen size={28} className="text-rice-gold" />,
      value: 100,
      suffix: "%",
      label: "Scopus Publication",
      sublabel: "Peer Reviewed Proceedings",
    }
  ];

  return (
    <section className="bg-earth-green-deep text-white py-16 relative overflow-hidden border-y border-white/10">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-sapling-green/10 blur-[140px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col items-center p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-rice-gold/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-1 flex items-center justify-center tracking-tight">
                <span className="gradient-text-gold"><AnimatedCounter to={stat.value} /></span>
                <span className="gradient-text-gold">{stat.suffix}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-[11px] text-white/50 mt-1 font-light hidden sm:block">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
