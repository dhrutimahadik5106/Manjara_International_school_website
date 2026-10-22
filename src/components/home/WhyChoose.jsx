import React from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck, BrainCircuit, GraduationCap, HandHeart, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  { title: 'The Right Curriculum', description: 'A balanced academic framework designed for depth, engagement, and measurable growth.', icon: BookOpenCheck },
  { title: 'The Right Faculty', description: 'Dedicated mentors who guide, encourage, and inspire every child with care.', icon: GraduationCap },
  { title: 'The Right Environment', description: 'A safe, vibrant campus that supports focus, wellbeing, and confidence.', icon: ShieldCheck },
  { title: 'The Right Approach', description: 'Learning that values curiosity, reflection, and personal excellence.', icon: BrainCircuit },
  { title: 'The Right Skills', description: 'Communication, collaboration, and creativity nurtured through lived experience.', icon: Sparkles },
  { title: 'The Right Future', description: 'A clear path for students to grow into resilient, purposeful global citizens.', icon: HandHeart },
];

const WhyChoose = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
            <Sparkles size={14} className="text-mis-gold" />
            Why Choose Manjara
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
            Six elements that define a meaningful education.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="card-surface p-7 group flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 inline-flex rounded-xl bg-mis-soft p-3 text-mis-blue group-hover:bg-mis-blue group-hover:text-white transition-colors">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-mis-navy group-hover:text-mis-blue transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-mis-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
