import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const AwardsPage = () => {
  return (
    <>
      <Helmet><title>Awards & Recognition | Manjara International School</title></Helmet>
      <PageHero title="Awards & Recognition" subtitle="A section designed to celebrate milestones and achievements with clarity and dignity." backgroundImage={imageAssets.schoolCampus} breadcrumb={['About Us', 'Awards & Recognition']} />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Achievement Gallery</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">Official achievements and recognitions will be added here as they are confirmed.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">The school can publish awards, recognitions, and milestone updates in this space once the official information is available. The layout is already designed to support a polished, premium presentation.</p>
          </div>
        </div>
      </section>
      <CTA title="Stay connected with the school’s updates" description="Explore campus life, news, and admissions while the official recognition content is prepared." buttonLabel="View News" href="/news" />
    </>
  );
};

export default AwardsPage;
