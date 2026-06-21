'use client';

import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { Globe, Layers, Trophy, Calendar, BookOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
      icon: <Globe size={32} className="text-rice-gold mb-3" />,
      value: 5,
      suffix: "",
      label: "Countries Hosted",
    },
    {
      icon: <Layers size={32} className="text-rice-gold mb-3" />,
      value: 9,
      suffix: "",
      label: "Conference Themes",
    },
    {
      icon: <Trophy size={32} className="text-rice-gold mb-3" />,
      value: 80,
      suffix: "+",
      label: "Awards & Prizes",
    },
    {
      icon: <Calendar size={32} className="text-rice-gold mb-3" />,
      value: 5,
      suffix: "",
      label: "Days Event",
    },
    {
      icon: <BookOpen size={32} className="text-rice-gold mb-3" />,
      value: 1,
      suffix: "",
      label: "Scopus Journal",
    }
  ];

  return (
    <section className="bg-earth-green text-white py-12 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              {stat.icon}
              <div className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 flex items-center justify-center">
                <AnimatedCounter to={stat.value} />
                <span>{stat.suffix}</span>
              </div>
              <p className="text-sm md:text-base text-gray-300 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
