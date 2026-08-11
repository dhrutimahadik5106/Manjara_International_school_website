import { motion } from 'framer-motion';
import { CalendarDays, ArrowRight } from 'lucide-react';

const NewsCard = ({ image, title, description, date }) => {
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6, scale: 1.01 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays size={16} /> {date}
        </div>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
          Read More <ArrowRight size={16} />
        </button>
      </div>
    </motion.article>
  );
};

export default NewsCard;
