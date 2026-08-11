import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6, scale: 1.01 }} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-soft">
      <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
        {Icon ? <Icon size={22} /> : null}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-primary">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </motion.article>
  );
};

export default FeatureCard;
