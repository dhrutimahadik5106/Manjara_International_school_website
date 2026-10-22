import { motion } from 'framer-motion';

const GalleryCard = ({ image, title, description }) => {
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6, scale: 1.01 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
      <img src={image} alt={title} className="h-52 w-full object-cover transition duration-500 hover:scale-105" />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p> : null}
      </div>
    </motion.article>
  );
};

export default GalleryCard;
