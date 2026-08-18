import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import EnquiryForm from '../../components/common/EnquiryForm.jsx';
import FaqAccordion from '../../components/common/FaqAccordion.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';

const admissionSteps = [
  'Submit an enquiry form through the website or contact the school directly.',
  'Receive guidance from the admissions team regarding the next steps and availability.',
  'Complete the required school interaction and documentation process.',
  'Secure admission once the school confirms the process details.',
];

const faqItems = [
  { question: 'Admission for AY 2026–27', answer: 'Details to be updated by the school.' },
  { question: 'Admission Process', answer: 'Details to be updated by the school.' },
  { question: 'Fee Structure', answer: 'Details to be updated by the school.' },
  { question: 'Eligibility', answer: 'Details to be updated by the school.' },
];

const AdmissionsPage = () => {
  return (
    <>
      <Helmet><title>Admissions | Manjara International School</title></Helmet>
      <PageHero title="Admissions" subtitle="A transparent and welcoming admissions experience for prospective families." backgroundImage={imageAssets.schoolCampus} breadcrumb={['Admissions']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Admission AY 2026–27</p>
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">We welcome families to begin the journey with clarity and confidence.</h2>
            <p className="text-lg leading-8 text-slate-600">The school will share the latest admission guidance, fee structure, and policy updates directly. Until then, the information below provides a professional placeholder for the admissions experience.</p>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-primary">Admission Process</h3>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                {admissionSteps.map((step) => <li key={step}>• {step}</li>)}
              </ul>
            </div>
          </div>
          <img src={imageAssets.classroom} alt="Admission overview" className="h-full w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-[#F7FAFC] p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Important Information</p>
            <h3 className="mt-4 text-2xl font-semibold text-primary">Details to be updated by the school</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Eligibility, fee structure, documents, and official admission policies will be shared directly by the school once finalised.</p>
          </div>
          <EnquiryForm title="Enquire Now" description="Share your details and receive the next step from our admissions team." />
        </div>
      </section>
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Frequently Asked Questions</p>
            <h2 className="mt-3 text-3xl font-semibold text-primary sm:text-4xl">Helpful guidance for prospective families.</h2>
          </div>
          <FaqAccordion items={faqItems} />
        </div>
      </section>
      <CTA title="Begin your child’s admission journey today" description="Start with confidence and let the admissions team guide you with the next step." buttonLabel="Contact Us" href="/contact" />
    </>
  );
};

export default AdmissionsPage;
