import { motion } from 'framer-motion';

const TeamCard = ({ name, role, image }) => {
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6, scale: 1.01 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
      <img src={image} alt={name} className="h-56 w-full object-cover" />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-primary">{name}</h3>
        <p className="mt-2 text-sm text-slate-600">{role}</p>
      </div>
    </motion.article>
  );
};

export default TeamCard;
