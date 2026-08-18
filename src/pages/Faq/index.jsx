import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import FaqAccordion from '../../components/common/FaqAccordion.jsx';
import CTA from '../../components/common/CTA.jsx';

const faqItems = [
  { question: 'What academic pattern does the school follow?', answer: 'MIS follows the ICSE pattern and is accredited by CISCE.' },
  { question: 'What grades are currently open for admission?', answer: 'Admission is open for Nursery to 8th Grade.' },
  { question: 'How can I begin the admission process?', answer: 'You can start by completing the enquiry form on this website or contacting the school directly.' },
  { question: 'Where is the school located?', answer: 'The school is located at Khadgaon-Pakharsangvi Road, Latur.' },
];

const FaqPage = () => {
  return (
    <>
      <Helmet><title>FAQ | Manjara International School</title></Helmet>
      <PageHero title="Frequently Asked Questions" subtitle="Helpful answers for prospective families and community members." backgroundImage="/images/school-campus.svg" breadcrumb={['FAQ']} />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FaqAccordion items={faqItems} />
        </div>
      </section>
      <CTA title="Still have a question?" description="Reach out to the team for direct assistance and guidance." buttonLabel="Contact Us" href="/contact" />
    </>
  );
};

export default FaqPage;
