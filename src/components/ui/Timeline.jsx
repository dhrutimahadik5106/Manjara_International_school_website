import { motion } from 'framer-motion';

const Timeline = ({ items }) => {
  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <motion.div key={item.title} initial={{ opacity: 0, x: index % 2 === 0 ? -12 : 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary" />
          <div>
            <h3 className="font-semibold text-primary">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
