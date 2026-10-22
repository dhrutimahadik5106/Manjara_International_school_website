import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Landmark, NotebookPen, PhoneCall, Sparkles } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const infoCards = [
  {
    title: 'Admission Process',
    description: 'A transparent journey from inquiry to enrollment with guidance at every step.',
    icon: NotebookPen,
    href: '/admissions',
  },
  {
    title: 'Fee Structure',
    description: 'Clear, accessible information for families planning their child’s future.',
    icon: Landmark,
    href: '/admissions/fee-structure',
  },
  {
    title: 'Location',
    description: 'Conveniently situated in a calm and inspiring environment for families.',
    icon: Compass,
    href: '/location',
  },
  {
    title: 'Enquiry Form',
    description: 'Start a conversation with our admissions team and receive prompt guidance.',
    icon: PhoneCall,
    href: '/admissions',
  },
];

const AboutPreview = () => {
  return (
    <section id="about" className="bg-slate-50 py-16 sm:py-24">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Side: Overview & Campus Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
                <Sparkles size={14} className="text-mis-gold" />
                Information on Manjara International School
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
                A school that nurtures academic curiosity, values, and lasting confidence.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-mis-muted leading-relaxed">
              Founded in 2018–19, Manjara International School was established under the aegis of BMSDS and continues to shape learners in a calm, nature-rich campus that supports intellectual, emotional, social, and physical growth.
            </p>

            {/* Reserved Image Container for Campus */}
            <div className="card-surface overflow-hidden p-3.5">
              <div className="reserved-image-container aspect-[16/9] sm:aspect-[16/8] rounded-xl overflow-hidden mb-3">
                <img
                  src={imageAssets.schoolCampus}
                  alt="The Manjara campus"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Founded</p>
                  <p className="mt-1 text-lg font-extrabold text-mis-navy">2018–19</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">UDISE Code</p>
                  <p className="mt-1 text-lg font-extrabold text-mis-blue">27280101009</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Quick Action Cards */}
          <div className="lg:col-span-6 grid gap-4 sm:grid-cols-2">
            {infoCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.a
                  key={card.title}
                  href={card.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="card-surface group flex flex-col justify-between p-6 hover:border-mis-blue/30"
                >
                  <div>
                    <div className="inline-flex rounded-xl bg-mis-soft p-3 text-mis-blue group-hover:bg-mis-blue group-hover:text-white transition-colors mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-mis-navy group-hover:text-mis-blue transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-mis-muted leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-mis-blue">
                    <span>Learn more</span>
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
