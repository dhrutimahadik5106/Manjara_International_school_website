import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Sparkles, Building2, BookOpen } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-mis-navy text-white">
      {/* Background Media & Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-mis-navy via-mis-navy/90 to-mis-navy/70 z-10" />
        <img
          src={imageAssets.schoolHero}
          alt="Manjara International School campus background"
          className="h-full w-full object-cover object-center opacity-40 filter brightness-90"
        />
      </div>

      <div className="relative z-10 section-shell py-12 sm:py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: School Messaging */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 max-w-2xl"
          >
            {/* Tagline Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-mis-gold/40 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              <Sparkles size={15} className="text-mis-gold" />
              <span className="tracking-wide">Rising Towards Excellence</span>
            </div>

            {/* School Name Header */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Manjara International School
            </h1>

            {/* Subheadings */}
            <div className="mt-4 inline-block rounded-xl bg-mis-gold/20 border border-mis-gold/40 px-4 py-2 backdrop-blur-sm">
              <p className="text-base sm:text-lg font-bold text-mis-gold-soft">
                Admissions Open for Nursery to 8th Grade (AY 2026–27)
              </p>
            </div>

            <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
              A premium school environment rooted in academic excellence, values, and a calm campus experience for every child.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/admissions"
                className="inline-flex items-center gap-2 rounded-full bg-mis-gold hover:bg-amber-400 px-6 py-3.5 text-sm font-bold text-mis-navy transition-colors shadow-lg shadow-amber-500/20"
              >
                Enquire Now <ArrowRight size={18} />
              </a>
              <a
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors"
              >
                <BookOpen size={16} />
                Explore Manjara
              </a>
            </div>

            {/* Key Feature Pills */}
            <div className="mt-8 flex flex-wrap gap-3 text-xs sm:text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-sm">
                <BadgeCheck size={16} className="text-mis-gold" /> Holistic ICSE pattern education
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-sm">
                <BadgeCheck size={16} className="text-mis-gold" /> Safe & inspiring campus
              </span>
            </div>
          </motion.div>

          {/* Right Column: Hero Showcase Image Frame */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3.5 shadow-2xl backdrop-blur-md">
              <div className="reserved-image-container aspect-[4/3] sm:aspect-[16/11] rounded-2xl">
                <img
                  src={imageAssets.About}
                  alt="Students at Manjara International School"
                  className="h-full w-full object-cover rounded-2xl"
                />
              </div>
              <div className="absolute top-6 left-6 rounded-full border border-white/20 bg-mis-navy/80 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                School Life & Learning
              </div>
              <div className="mt-3 rounded-2xl border border-white/15 bg-mis-navy/90 p-4 text-white">
                <p className="text-[11px] font-bold uppercase tracking-widest text-mis-gold">Admissions Open</p>
                <p className="text-base font-bold mt-0.5">Nursery to 8th Grade</p>
                <p className="text-xs text-slate-300 mt-1">Nurturing tomorrow's global leaders in Latur</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
