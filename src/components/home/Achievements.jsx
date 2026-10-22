import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, Medal, Sparkles, Users } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const stats = [
  { label: 'Student community', value: '250+', icon: Users },
  { label: 'Achievement information to be updated', value: '—', icon: Award },
  { label: 'Performance information to be updated', value: '—', icon: Medal },
  { label: 'Activities', value: '40+', icon: BookOpen },
  { label: 'Years of experience', value: '7+', icon: Sparkles },
];

const achievementCards = [
  { title: 'Academic Growth', description: 'A balanced learning culture that supports curiosity, discipline, and confidence.', image: imageAssets.our_achievemnts[0]},
  { title: 'Student Leadership', description: 'Celebrating initiative, responsibility, and purpose through school life.', image: imageAssets.our_achievemnts[1]},
];

const Achievements = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
              <Sparkles size={14} className="text-mis-gold" />
              Our Achievements
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
              Milestones that reflect our commitment to purposeful growth.
            </h2>
          </div>
          <a
            href="/about/awards"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-mis-navy shadow-sm hover:bg-slate-50 transition-colors shrink-0"
          >
            <span>View All Awards</span>
            <ArrowRight size={15} />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card-surface p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-3 inline-flex rounded-xl bg-mis-soft p-2.5 text-mis-blue">
                    <Icon size={18} />
                  </div>
                  <div className="text-2xl font-extrabold text-mis-navy">{stat.value}</div>
                </div>
                <p className="mt-2 text-xs font-medium text-mis-muted leading-tight">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Highlight Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {achievementCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="card-surface overflow-hidden group flex flex-col sm:flex-row"
            >
              <div className="reserved-image-container sm:w-1/2 aspect-[16/10] sm:aspect-auto rounded-none">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 sm:w-1/2 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-mis-navy group-hover:text-mis-blue transition-colors">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-mis-muted leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
