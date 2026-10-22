import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FaqAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.question} className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-soft">
          <button onClick={() => setOpenIndex(openIndex === index ? -1 : index)} className="flex w-full items-center justify-between px-5 py-4 text-left">
            <span className="font-semibold text-primary">{item.question}</span>
            <ChevronDown className={`transition ${openIndex === index ? 'rotate-180' : ''}`} size={18} />
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index ? (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-5 pb-4">
                <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
