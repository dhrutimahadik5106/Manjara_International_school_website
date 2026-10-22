import React from 'react';
import { motion } from 'framer-motion';
import { HandHeart, HeartHandshake, Sparkles } from 'lucide-react';

const values = [
  {
    title: 'Holistic Development',
    description: 'We nurture the student academically, emotionally, socially, and physically in a balanced learning environment.',
    icon: HandHeart,
  },
  {
    title: 'Age-Appropriate Curriculum',
    description: 'Learning experiences are thoughtfully structured to match developmental readiness and curiosity.',
    icon: HeartHandshake,
  },
  {
    title: '21st Century Skill-Based Education',
    description: 'We support communication, collaboration, creativity, and problem-solving through meaningful learning.',
    icon: Sparkles,
  },
];

const Values = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
            <Sparkles size={14} className="text-mis-gold" />
            Other Things We Care About at Manjara
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
            A school culture shaped by responsibility, warmth, and purposeful guidance.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.article
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="card-surface p-8 group flex flex-col justify-between"
              >
                <div>
                  <div className="mb-5 inline-flex rounded-xl bg-mis-soft p-3.5 text-mis-blue group-hover:bg-mis-blue group-hover:text-white transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-mis-navy group-hover:text-mis-blue transition-colors">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-mis-muted leading-relaxed">
                    {value.description}
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

export default Values;
