import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';

const AlumniPage = () => {
  return (
    <>
      <Helmet><title>Alumni | Manjara International School</title></Helmet>
      <PageHero title="Alumni" subtitle="A community of learners, leaders, and proud contributors to the Manjara journey." backgroundImage={imageAssets.students} breadcrumb={['Alumni']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Alumni introduction</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">Manjara continues to inspire its community beyond school years.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">The school will share alumni stories and achievements as the community grows. Until then, this space presents a professional placeholder for future engagement.</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-[#EAF3F8] p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Alumni stories</p>
            <p className="mt-4 text-lg leading-8 text-slate-600">Alumni stories and achievements will be updated here as the school provides curated content.</p>
          </div>
        </div>
      </section>
      <CTA title="Stay connected with the Manjara community" description="Join the alumni network and remain part of the school’s continued story." buttonLabel="Contact Us" href="/contact" />
    </>
  );
};

export default AlumniPage;
