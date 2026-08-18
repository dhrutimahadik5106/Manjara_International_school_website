import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const timeline = [
  { step: '1', title: 'Submit Enquiry', description: 'Begin by sharing your details through the enquiry form or by contacting the school directly.' },
  { step: '2', title: 'Admission Discussion', description: 'A school representative will guide the next steps and provide the support you need.' },
  { step: '3', title: 'Documentation', description: 'The family is guided through the required documentation and school interaction process.' },
  { step: '4', title: 'Admission Confirmation', description: 'Once the process is complete, admission is confirmed with the school’s guidance.' },
];

const AdmissionAyPage = () => {
  return (
    <>
      <Helmet><title>Admission AY 2026–27 | Manjara International School</title></Helmet>
      <PageHero title="Admission for AY 2026–27" subtitle="Admission Open!! Nursery to 8th Grade" backgroundImage={imageAssets.classroom} breadcrumb={['Admissions', 'AY 2026–27']} />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Admission Open</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">A professional and welcoming admissions experience for the coming academic year.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">Families are invited to begin the process early and receive the support needed to make an informed decision. The school will update the official admission details as necessary.</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {timeline.map((item) => (
              <div key={item.step} className="rounded-[1.75rem] border border-slate-200 bg-[#F7FAFC] p-6 shadow-soft">
                <div className="text-3xl font-semibold text-primary">{item.step}</div>
                <h3 className="mt-3 text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA title="Begin the admissions journey" description="Get in touch with the admissions team and receive the next step for your child’s enrollment." buttonLabel="Enquire Now" href="/admissions" />
    </>
  );
};

export default AdmissionAyPage;
