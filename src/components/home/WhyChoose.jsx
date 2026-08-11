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
    <section className="bg-background py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-secondary">Why Choose Manjara</p>
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Six elements that define a meaningful education.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.06 }} whileHover={{ y: -6, scale: 1.01 }} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-soft">
                <div className="mb-4 inline-flex rounded-2xl bg-secondary/10 p-3 text-secondary">
                  <Icon size={22} />
                </div>
                <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
