import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';

const pillars = [
  { title: 'Our Story', description: 'Founded in 2018–19 under the aegis of BMSDS, MIS brings together academic depth, values, and a nurturing campus environment.' },
  { title: 'BMSD Society', description: 'Established by Hon. Dr. Sidheshwar Bellale, the society has grown into a network of educational institutions across the region.' },
  { title: 'President\'s Message', description: 'A warm, student-centered culture grounded in character, creativity, and purposeful growth.' },
  { title: 'Managing Team', description: 'Dedicated leadership with a shared commitment to student wellbeing and institutional excellence.' },
];

const AboutPage = () => {
  return (
    <>
      <Helmet><title>About Us | Manjara International School</title></Helmet>
      <PageHero title="About Manjara" subtitle="A school built on values, purpose, and a calm environment for every child to grow with confidence." backgroundImage={imageAssets.schoolCampus} breadcrumb={['About Us']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">About Manjara</p>
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Manjara International School is a premium, nature-rich campus that supports holistic development.</h2>
            <p className="text-lg leading-8 text-slate-600">Manjara International School (MIS) was founded in the year 2018–2019 with UDISE 27280101009 under the aegis of BMSDS (Balaghat Mathematical Sciences Development Society), established by Hon’ Dr. Sidheshwar Bellale. Located in a serene and natural environment, far from urban chaos and distractions, MIS provides the perfect platform for holistic education.</p>
            <p className="text-lg leading-8 text-slate-600">At MIS, we are committed to delivering a comprehensive and continuous learning experience—intellectually, emotionally, socially, and physically.</p>
          </div>
          <img src={imageAssets.About} alt="About Manjara" className="block h-auto max-h-[520px] w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-[1.75rem] border border-slate-200 bg-[#F7FAFC] p-8 shadow-soft">
                <h3 className="text-xl font-semibold text-primary">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">President’s Message</p>
            <p className="mt-5 text-lg leading-8 text-slate-600">“At MIS, we believe education is not just about academics—it’s about building strong character, sparking creativity, and preparing children for a successful life. We’re proud to offer a warm and supportive environment with smart classrooms, well-equipped labs, a rich library, and excellent sports facilities. Here, learning goes beyond books. It’s about growing as individuals.”</p>
            <p className="mt-6 font-semibold text-primary">Dr. S. S. Bellale</p>
            <p className="text-sm text-slate-500">President, BMSD Society</p>
          </div>
          <img src={imageAssets.president} alt="President portrait" className="h-full w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">UDISE / ICSE Information</p>
            <h2 className="mt-3 text-3xl font-semibold text-primary sm:text-4xl">Accredited and future-focused</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-slate-200 bg-[#F7FAFC] p-8 shadow-soft"><p className="text-sm uppercase tracking-[0.3em] text-slate-400">UDISE</p><p className="mt-3 text-2xl font-semibold text-primary">27280101009</p></div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-[#F7FAFC] p-8 shadow-soft"><p className="text-sm uppercase tracking-[0.3em] text-slate-400">Pattern</p><p className="mt-3 text-2xl font-semibold text-primary">ICSE</p></div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-[#F7FAFC] p-8 shadow-soft"><p className="text-sm uppercase tracking-[0.3em] text-slate-400">Accreditation</p><p className="mt-3 text-2xl font-semibold text-primary">CISCE</p></div>
          </div>
        </div>
      </section>
      <CTA title="Plan a visit to our campus" description="Explore the environment, facilities, and learning culture that shape the Manjara experience." buttonLabel="Enquire Now" href="/admissions" />
    </>
  );
};

export default AboutPage;
