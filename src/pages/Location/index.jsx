import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';

const LocationPage = () => {
  return (
    <>
      <Helmet><title>Location | Manjara International School</title></Helmet>
      <PageHero title="Location" subtitle="A calm campus setting that supports focused learning and a healthy school experience." backgroundImage={imageAssets.schoolCampus} breadcrumb={['Location']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Visit Us</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">Khadgaon-Pakharsangvi Road, Latur</h2>
            <div className="mt-6 space-y-3 text-lg text-slate-700">
              <p>Phone: +91 9175518919</p>
              <p>Phone: +91 9130722285</p>
              <p>Phone: +91 8830005678</p>
              <p>Email: manjaraschool@gmail.com</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#EAF3F8] p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Map Placeholder</p>
            <p className="mt-4 text-lg leading-8 text-slate-700">A map or embedded location view can be added here when the school shares the official Google Maps link.</p>
          </div>
        </div>
      </section>
      <CTA title="Plan a visit to the campus" description="Connect with the school and discover the environment that shapes the Manjara experience." buttonLabel="Contact Us" href="/contact" />
    </>
  );
};

export default LocationPage;
