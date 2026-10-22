import { motion } from 'framer-motion';

const PageSection = ({ children, className = '' }) => {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={className}>
      {children}
    </motion.section>
  );
};

export default PageSection;
