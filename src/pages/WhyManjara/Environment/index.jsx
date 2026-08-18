import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const EnvironmentPage = () => {
  return (
    <>
      <Helmet><title>The Right Environment | Manjara International School</title></Helmet>
      <PageHero title="The Right Environment" subtitle="A serene campus designed to help children grow with comfort, focus, and confidence." backgroundImage={imageAssets.schoolCampus} breadcrumb={['Why Manjara', 'Environment']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Campus Setting</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">A serene, nature-rich environment that supports calm, healthy, and purposeful learning.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">Located away from urban chaos and distractions, the campus provides an atmosphere that encourages concentration, wellbeing, and confidence. It is designed to help students feel safe, comfortable, and motivated every day.</p>
          </div>
          <img src={imageAssets.schoolHero} alt="Campus environment" className="h-full w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <CTA title="Experience the campus atmosphere" description="Discover facilities, safety, and student support in a calm school setting." buttonLabel="Explore Facilities" href="/facilities" />
    </>
  );
};

export default EnvironmentPage;
