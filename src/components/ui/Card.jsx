import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div whileHover={hover ? { y: -5, scale: 1.01 } : undefined} transition={{ type: 'spring', stiffness: 220, damping: 20 }} className={`rounded-[1.25rem] border border-slate-200/80 bg-white shadow-[0_12px_35px_-20px_rgba(30,58,95,0.25)] ${className}`.trim()}>
      {children}
    </motion.div>
  );
};

export default Card;
