import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FaqAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_-24px_rgba(18,59,93,0.28)]">
            <button type="button" onClick={() => setOpenIndex(isOpen ? -1 : index)} className="flex w-full items-center justify-between text-left">
              <span className="text-lg font-semibold text-primary">{item.question}</span>
              <ChevronDown className={`transition ${isOpen ? 'rotate-180' : ''}`} size={18} />
            </button>
            {isOpen ? <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
