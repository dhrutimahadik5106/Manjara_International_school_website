import { motion } from 'framer-motion';
import { HandHeart, HeartHandshake, Sparkles } from 'lucide-react';

const values = [
  {
    title: 'Holistic Development',
    description: 'We nurture the student academically, emotionally, socially, and physically in a balanced learning environment.',
    icon: HandHeart,
    accent: 'bg-primary/10 text-primary',
  },
  {
    title: 'Age-Appropriate Curriculum',
    description: 'Learning experiences are thoughtfully structured to match developmental readiness and curiosity.',
    icon: HeartHandshake,
    accent: 'bg-[#245B8F]/10 text-[#245B8F]',
  },
  {
    title: '21st Century Skill-Based Education',
    description: 'We support communication, collaboration, creativity, and problem-solving through meaningful learning.',
    icon: Sparkles,
    accent: 'bg-[#C7A45D]/10 text-[#C7A45D]',
  },
];

const Values = () => {
  return (
    <section className="bg-surface py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Other Things We Care About at Manjara</p>
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl">A school culture shaped by responsibility, warmth, and purposeful guidance.</h2>
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
