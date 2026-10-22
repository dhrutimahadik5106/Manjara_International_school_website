import { motion } from 'framer-motion';

const TestimonialCard = ({ quote, name, role }) => {
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6, scale: 1.01 }} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-soft">
      <p className="text-base leading-8 text-slate-600">“{quote}”</p>
      <div className="mt-6">
        <h3 className="font-semibold text-primary">{name}</h3>
        <p className="text-sm text-slate-500">{role}</p>
      </div>
    </motion.article>
  );
};

export default TestimonialCard;
