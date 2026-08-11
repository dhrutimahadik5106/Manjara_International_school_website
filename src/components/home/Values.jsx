import { motion } from 'framer-motion';
import { HandHeart, HeartHandshake, Sparkles } from 'lucide-react';

const values = [
  {
    title: 'We Don’t Take Interviews',
    description: 'Our admissions approach is fair, transparent, and centered on student potential rather than pressure.',
    icon: HandHeart,
    accent: 'bg-primary/10 text-primary',
  },
  {
    title: 'We Don’t Take Donations',
    description: 'Every child deserves a place in a supportive learning environment without barriers or bias.',
    icon: HeartHandshake,
    accent: 'bg-secondary/10 text-secondary',
  },
  {
    title: 'We Groom. We Nurture.',
    description: 'We support holistic growth through values, discipline, empathy, character, and joyful learning.',
    icon: Sparkles,
    accent: 'bg-accent/10 text-accent',
  },
];

const Values = () => {
  return (
    <section className="bg-surface py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-secondary">What We Care About</p>
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Principles that shape our community and our admissions ethos.</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.article key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }} className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-soft">
                <div className={`inline-flex rounded-2xl p-3 ${value.accent}`}>
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-primary">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{value.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Values;
