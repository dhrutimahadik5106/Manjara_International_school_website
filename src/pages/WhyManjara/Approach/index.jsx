import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const ApproachPage = () => {
  return (
    <>
      <Helmet><title>The Right Approach | Manjara International School</title></Helmet>
      <PageHero title="The Right Approach" subtitle="A learner-centered approach that blends inquiry, care, and meaningful growth." backgroundImage={imageAssets.laboratory} breadcrumb={['Why Manjara', 'Approach']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Learning Style</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">A balanced method of teaching that promotes curiosity, reflection, and confidence.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">The school believes in supporting every child through a thoughtful blend of academics, co-curricular activities, and values-led development. The goal is to build habits of enquiry, responsibility, and purposeful action.</p>
          </div>
          <img src={imageAssets.classroom} alt="Learning approach" className="h-full w-full rounded-[2rem] object-cover" />
        </div>
      </section>
      <CTA title="Learn more about the school’s educational experience" description="Explore the wider campus, co-curricular learning, and values-based growth that shape the school." buttonLabel="Explore Facilities" href="/facilities" />
    </>
  );
};

export default ApproachPage;
