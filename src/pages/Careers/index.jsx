import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';

const CareersPage = () => {
  return (
    <>
      <Helmet><title>Careers | Manjara International School</title></Helmet>
      <PageHero title="Careers" subtitle="A professional community where educators and support staff can grow with purpose." backgroundImage={imageAssets.career} breadcrumb={['Careers']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Why work at Manjara</p>
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">A values-led workplace that supports student growth and professional wellbeing.</h2>
            <p className="text-lg leading-8 text-slate-600">We are committed to building a culture of care, collaboration, and excellence. Current opportunities will be updated by the school when available.</p>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
              <h3 className="text-xl font-semibold text-primary">Opportunities</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Current opportunities will be updated by the school.</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-[#EAF3F8] p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Culture</p>
            <p className="mt-4 text-lg leading-8 text-slate-600">We believe in professionalism, empathy, and a shared commitment to the growth of children and the broader school community.</p>
          </div>
        </div>
      </section>
      <CTA title="Join the Manjara community" description="Share your interest with the school and stay connected for future opportunities." buttonLabel="Get in Touch" href="/contact" />
    </>
  );
};

export default CareersPage;
