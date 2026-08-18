import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const ChairmanMessagePage = () => {
  return (
    <>
      <Helmet><title>Chairman's Message | Manjara International School</title></Helmet>
      <PageHero title="Chairman's Message" subtitle="A values-led message from the leadership guiding the school’s purpose and direction." backgroundImage={imageAssets.president} breadcrumb={['About Us', "Chairman's Message"]} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
            <img src={imageAssets.president} alt="Dr. S. S. Bellale" className="h-[480px] w-full object-cover" />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">From the leadership</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">A heartfelt message of growth, care, and purpose</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">At MIS, we believe education is not just about academics—it’s about building strong character, sparking creativity, and preparing children for a successful life. We’re proud to offer a warm and supportive environment with smart classrooms, well-equipped labs, a rich library, and excellent sports facilities. Here, learning goes beyond books. It’s about growing as individuals.</p>
            <p className="mt-5 text-lg leading-8 text-slate-700">Our MIS curriculum is designed to help students grow in every way—not just academically, but also spiritually, socially, emotionally, and physically. We also encourage extracurricular activities that build confidence, leadership, and teamwork.</p>
            <p className="mt-5 text-lg leading-8 text-slate-700">Warm regards!!</p>
            <p className="mt-3 font-semibold text-primary">Dr. S. S. Bellale</p>
            <p className="text-sm text-slate-500">President, BMSD Society</p>
          </div>
        </div>
      </section>
      <CTA title="Plan a visit to the campus" description="Discover the environment, facilities, and values that shape the Manjara experience." buttonLabel="Enquire Now" href="/admissions" />
    </>
  );
};

export default ChairmanMessagePage;
