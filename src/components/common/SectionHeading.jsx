import { motion } from 'framer-motion';

const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-secondary">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-[-0.01em] text-primary sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p> : null}
    </motion.div>
  );
};

export default SectionHeading;
