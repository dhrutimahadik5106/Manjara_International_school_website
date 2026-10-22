import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatsCounter = ({ value, label }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="text-3xl font-semibold text-primary">
        <CountUp end={value} duration={2.5} />
      </div>
      <p className="mt-2 text-sm text-slate-600">{label}</p>
    </motion.div>
  );
};

export default StatsCounter;
