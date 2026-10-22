import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const FacultyPage = () => {
  return (
    <>
      <Helmet><title>The Right Faculty | Manjara International School</title></Helmet>
      <PageHero title="The Right Faculty" subtitle="Dedicated mentors who support each child with care, encouragement, and guidance." backgroundImage={imageAssets.faculty.main} breadcrumb={['Why Manjara', 'Faculty']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Faculty Philosophy</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">Warm support, strong guidance, and a commitment to each child’s wellbeing.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">The school’s faculty approach is centered on encouraging curiosity, personal growth, and responsibility. Every child is supported in an environment that is both nurturing and academically purposeful.</p>
          </div>
          <img src={imageAssets.faculty.second} alt="Faculty and student environment" className="h-full w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <CTA title="Discover the wider school environment" description="See how the campus and facilities support a meaningful, balanced student experience." buttonLabel="Explore Facilities" href="/facilities" />
    </>
  );
};

export default FacultyPage;
