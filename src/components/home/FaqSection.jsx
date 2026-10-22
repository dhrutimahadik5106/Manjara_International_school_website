import React from 'react';
import FaqAccordion from '../common/FaqAccordion.jsx';
import { Sparkles } from 'lucide-react';

const faqItems = [
  {
    question: 'What is the school’s current academic pattern?',
    answer: 'MIS follows the ICSE pattern and is accredited by CISCE. More detailed academic information will be shared by the school as required.',
  },
  {
    question: 'How can I start the admission process?',
    answer: 'You can begin with the enquiry form on this website or contact the school directly for the next steps. Detailed admission information will be updated by the school.',
  },
  {
    question: 'What facilities are available on campus?',
    answer: 'MIS offers classrooms with digital support, science and computer laboratories, a library, sports areas, and other student facilities. Further details will be updated as available.',
  },
  {
    question: 'How can I get in touch with the school?',
    answer: 'You may reach the school at the listed phone numbers or email address provided in the contact section.',
  },
];

const FaqSection = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="section-shell max-w-4xl">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
            <Sparkles size={14} className="text-mis-gold" />
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
            Answers to common questions for prospective families.
          </h2>
        </div>
        <FaqAccordion items={faqItems} />
      </div>
    </section>
  );
};

export default FaqSection;
