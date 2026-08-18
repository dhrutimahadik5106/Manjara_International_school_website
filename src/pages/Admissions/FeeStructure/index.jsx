import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const FeeStructurePage = () => {
  return (
    <>
      <Helmet><title>Fee Structure | Manjara International School</title></Helmet>
      <PageHero title="Fee Structure" subtitle="Official fee details will be shared directly by the school once finalised." backgroundImage={imageAssets.classroom} breadcrumb={['Admissions', 'Fee Structure']} />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Fee Information</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">The official fee structure is currently being finalised.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">Please get in touch with the school for the latest details regarding admission-related fee information. This page is ready to be updated with the final official structure when available.</p>
          </div>
        </div>
      </section>
      <CTA title="Request the latest fee details" description="Reach out to the admissions team for official information and support." buttonLabel="Contact Us" href="/contact" />
    </>
  );
};

export default FeeStructurePage;
