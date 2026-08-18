import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const CurriculumPage = () => {
  return (
    <>
      <Helmet><title>The Right Curriculum | Manjara International School</title></Helmet>
      <PageHero title="The Right Curriculum" subtitle="A balanced academic framework designed for depth, engagement, and meaningful growth." backgroundImage={imageAssets.classroom} breadcrumb={['Why Manjara', 'Curriculum']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Curriculum Approach</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">A structured learning environment that values logical thinking, enquiry, and personal growth.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">At MIS, students are guided in logical thinking, social awareness, and purposeful research. The learning experience is designed to support a steady balance of academic depth and values-based growth.</p>
          </div>
          <img src={imageAssets.library} alt="Curriculum learning environment" className="h-full w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <CTA title="Discover how the school shapes learning" description="Explore academics, facilities, and the campus environment that support purposeful growth." buttonLabel="Explore Facilities" href="/facilities" />
    </>
  );
};

export default CurriculumPage;
