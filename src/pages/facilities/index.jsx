import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';

const facilities = [
  { title: 'Academic Facilities', description: 'Smart board-equipped classrooms, well-stocked library with digital resources, science and computer labs, and an AV room for interactive learning.', image: imageAssets.classroom },
  { title: 'Sports & Recreation', description: 'Environment-friendly playgrounds, indoor sports complex, and outdoor fields for football, cricket, and track activities.', image: imageAssets.sports },
  { title: 'Health & Safety', description: 'Medical room, trained nurse support, fire safety measures, and 24/7 CCTV surveillance for campus security.', image: imageAssets.schoolCampus },
  { title: 'Technology & Digital Infrastructure', description: 'High-speed Wi-Fi, smart classrooms with projectors, and school management software for attendance and fees.', image: imageAssets.laboratory },
  { title: 'Transport & Accessibility', description: 'GPS-tracked school buses, properly maintained vehicles, and disabled-friendly ramps and elevators.', image: imageAssets.schoolHero },
  { title: 'Environmental Sustainability', description: 'Green campus with trees and gardens, solar power, and a segregated waste management system.', image: imageAssets.library },
];

const FacilitiesPage = () => {
  return (
    <>
      <Helmet><title>Facilities | Manjara International School</title></Helmet>
      <PageHero title="Facilities" subtitle="Thoughtfully designed spaces that support both academic excellence and holistic development." backgroundImage={imageAssets.schoolCampus} breadcrumb={['Facilities']} />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {facilities.map((facility) => (
              <div key={facility.title} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
                <img src={facility.image} alt={facility.title} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary">{facility.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA title="Discover the campus experience" description="Learn how our facilities create a calm, safe, and inspiring environment for every child." buttonLabel="Visit Us" href="/contact" />
    </>
  );
};

export default FacilitiesPage;
