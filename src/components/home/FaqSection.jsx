import FaqAccordion from '../common/FaqAccordion.jsx';

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
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Frequently Asked Questions</p>
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Answers to common questions for prospective families.</h2>
        </div>
        <FaqAccordion items={faqItems} />
      </div>
    </section>
  );
};

export default FaqSection;
