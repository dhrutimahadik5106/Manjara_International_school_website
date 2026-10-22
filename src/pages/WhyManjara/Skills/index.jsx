import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const SkillsPage = () => {
  return (
    <>
      <Helmet><title>The Right Skills | Manjara International School</title></Helmet>
      <PageHero title="The Right Skills" subtitle="Preparing students with the confidence, adaptability, and capabilities needed for the future." backgroundImage={imageAssets.skill.cover} breadcrumb={['Why Manjara', 'Skills']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Skill-Based Learning</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">Communication, collaboration, creativity, and problem-solving are nurtured through lived experiences.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">The school aims to prepare students for the future by supporting 21st-century skills, leadership habits, and responsible citizenship. Learning is shaped around confidence, inquiry, and meaningful participation.</p>
          </div>
          <img src={imageAssets.skill.right} alt="Skill-based learning" className="h-full w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <CTA title="Explore the school’s broader learning experience" description="Discover the campus, facilities, and values that support these life and learning skills." buttonLabel="Explore Facilities" href="/facilities" />
    </>
  );
};

export default SkillsPage;
