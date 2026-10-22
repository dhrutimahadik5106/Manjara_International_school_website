import { motion } from 'framer-motion';
import Button from '../ui/Button.jsx';

const SectionCTA = ({ eyebrow, title, description, primaryLabel = 'Learn More', secondaryLabel = 'Contact Us' }) => {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-r from-primary to-[#2d698b] p-8 text-white shadow-[0_18px_45px_-24px_rgba(35,78,112,0.4)] sm:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-accent">{eyebrow}</p> : null}
          <h3 className="text-2xl font-semibold sm:text-3xl">{title}</h3>
          {description ? <p className="mt-3 text-sm leading-8 text-slate-300">{description}</p> : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" as="a" href="#admissions">{primaryLabel}</Button>
          <Button variant="outline" as="a" href="#contact" className="border-white/20 bg-white/10 text-white hover:bg-white/20">{secondaryLabel}</Button>
        </div>
      </div>
    </motion.section>
  );
};

export default SectionCTA;
