import { motion } from 'framer-motion';
import { MessageCircle, ArrowUp, Sparkles } from 'lucide-react';

const FloatingActions = () => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <motion.a whileHover={{ scale: 1.05 }} href="#" className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(37,211,102,0.55)]">
        <MessageCircle size={18} /> WhatsApp
      </motion.a>
      <motion.a whileHover={{ scale: 1.05 }} href="#top" className="rounded-full border border-slate-200 bg-white p-3 text-primary shadow-[0_14px_30px_-18px_rgba(45,55,72,0.25)]">
        <ArrowUp size={18} />
      </motion.a>
      <motion.a whileHover={{ scale: 1.05 }} href="#admissions" className="flex items-center gap-2 rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(201,162,39,0.55)]">
        <Sparkles size={18} /> Quick Enquiry
      </motion.a>
    </div>
  );
};

export default FloatingActions;
