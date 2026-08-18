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
  { title: 'Academic Growth', description: 'A balanced learning culture that supports curiosity, discipline, and confidence.', image: imageAssets.classroom },
  { title: 'Student Leadership', description: 'Celebrating initiative, responsibility, and purpose through school life.', image: imageAssets.students },
];

const Achievements = () => {
  return (
    <section className="bg-background py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Our Achievements</p>
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Milestones that reflect our commitment to purposeful growth.</h2>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-slate-50">
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary"><Icon size={20} /></div>
                <div className="text-3xl font-semibold text-primary">{stat.value}</div>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {achievementCards.map((card, index) => (
            <motion.article key={card.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
              <img src={card.image} alt={card.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
