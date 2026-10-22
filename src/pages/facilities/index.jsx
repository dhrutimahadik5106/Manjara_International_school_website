import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';
import { BookOpen, Trophy, ShieldCheck, Laptop, Bus, Leaf, Sparkles } from 'lucide-react';

const facilities = [
  {
    title: 'Academic Facilities',
    description: 'Smart board-equipped classrooms, well-stocked library with digital resources, science and computer labs, and an AV room for interactive learning.',
    image: imageAssets.facilities[0],
    icon: BookOpen
  },
  {
    title: 'Sports & Recreation',
    description: 'Environment-friendly playgrounds, indoor sports complex, and outdoor fields for football, cricket, and track activities.',
    image: imageAssets.facilities[1],
    icon: Trophy
  },
  {
    title: 'Health & Safety',
    description: 'Medical room, trained nurse support, fire safety measures, and 24/7 CCTV surveillance for campus security.',
    image: imageAssets.facilities[2],
    icon: ShieldCheck
  },
  {
    title: 'Technology & Digital Infrastructure',
    description: 'High-speed Wi-Fi, smart classrooms with projectors, and school management software for attendance and fees.',
    image: imageAssets.facilities[3],
    icon: Laptop
  },
  {
    title: 'Transport & Accessibility',
    description: 'GPS-tracked school buses, properly maintained vehicles, and disabled-friendly ramps and elevators.',
    image: imageAssets.facilities[4],
    icon: Bus
  },
  {
    title: 'Environmental Sustainability',
    description: 'Green campus with trees and gardens, solar power, and a segregated waste management system.',
    image: imageAssets.facilities[5],
    icon: Leaf
  },
];

const FacilitiesPage = () => {
  return (
    <>
      <Helmet>
        <title>Facilities | Manjara International School</title>
        <meta name="description" content="Explore campus facilities at Manjara International School: smart classrooms, science & IT labs, sports fields, transport, and green campus infrastructure." />
      </Helmet>

      <PageHero
        title="Facilities"
        subtitle="Thoughtfully designed spaces that support both academic excellence and holistic development."
        backgroundImage={imageAssets.schoolCampus}
        breadcrumb={['Facilities']}
      />

      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="section-shell">
          <div className="max-w-3xl mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
              <Sparkles size={14} className="text-mis-gold" />
              Campus Infrastructure
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight">
              Modern amenities built for inspiring, safe, and holistic education.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => {
              const IconComp = facility.icon;
              return (
                <div
                  key={facility.title}
                  className="card-surface overflow-hidden group flex flex-col justify-between"
                >
                  <div>
                    {/* Reserved Image Container */}
                    <div className="reserved-image-container aspect-[16/10] w-full rounded-t-2xl rounded-b-none border-0 border-b border-slate-100">
                      <img
                        src={facility.image}
                        alt={facility.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6">
                      <div className="mb-3.5 inline-flex rounded-xl bg-mis-soft p-2.5 text-mis-blue">
                        <IconComp size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-mis-navy group-hover:text-mis-blue transition-colors">
                        {facility.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-mis-muted leading-relaxed">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTA
        title="Discover the campus experience"
        description="Learn how our facilities create a calm, safe, and inspiring environment for every child."
        buttonLabel="Visit Us"
        href="/contact"
      />
    </>
  );
};

export default FacilitiesPage;
