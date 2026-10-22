
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const institutions = [
  "Bellale's Mathematics Institution, Ahmedpur",
  'CBSE and ICSE schools',
  'Junior colleges',
  'Research hubs',
  'Mathematics institutions',
];

// The image must exist inside public/images/
const SCHOOL_BUILDING_IMAGE = '/images/bmsd-school-building.png';

const BmsdSocietyPage = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <Helmet>
        <title>BMSD Society | Manjara International School</title>
        <meta
          name="description"
          content="Discover the history, founders and educational legacy of BMSD Society, Latur."
        />
      </Helmet>

      {/* PAGE HERO */}
      <PageHero
        title="BMSD Society / Our Legacy"
        subtitle="A visionary educational journey rooted in the Marathwada region and driven by purpose."
        backgroundImage={imageAssets.schoolCampus}
        breadcrumb={['About Us', 'BMSD Society']}
      />

      {/* OUR LEGACY SECTION */}
      <section className="bg-background py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

          {/* LEFT: LEGACY CONTENT */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#245B8F]">
              Our Legacy
            </p>

            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-mis-navy sm:text-3xl">
              A journey rooted in higher education,
              research, and regional progress.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-700">
              Twenty three years ago, as a visionary leader
              and after a brief political career,
              Dr. Sidheshwar Bellale, along with other
              distinguished leaders from various fields
              across the Marathwada region—Dr. Bapurao
              Dhage, Prof. Rajkumar Kawade, Dr. Dillip
              Palimkar, Dr. Bhalchandra Karande,
              Sou. Jyoti Kadwade, Prof. Ram Bellale,
              Prof. Bapurao Shinde, and Sou. Meenabai
              Khedkar—recognized the need for higher
              education and research to drive regional
              progress and prosperity.
            </p>

            <p className="mt-5 text-base leading-8 text-slate-700">
              The journey began in 1999 with the
              establishment of Bellale’s Mathematics
              Institution in Ahmedpur. The society
              expanded into CBSE and ICSE schools,
              junior colleges, research hubs, and
              mathematics institutions.
            </p>
          </div>

          {/* RIGHT: SCHOOL BUILDING PHOTO */}
          <div className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">

            <div className="relative min-h-[300px] flex-1 overflow-hidden bg-slate-100 sm:min-h-[400px]">

              <img
                src={
                  imageError
                    ? imageAssets.schoolCampus
                    : SCHOOL_BUILDING_IMAGE
                }
                alt="Manjara International School building"
                loading="lazy"
                onError={() => {
                  if (!imageError) {
                    setImageError(true);
                  }
                }}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

            </div>

            <div className="border-t border-slate-100 bg-white px-6 py-4">
              <p className="text-base font-extrabold text-mis-navy">
                Manjara International School
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Building a legacy of excellence in education
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* INSTITUTIONS SECTION */}
      <section className="bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#245B8F]">
              Institutions Operated
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-mis-navy sm:text-3xl">
              A growing network of institutions guided
              by the same mission.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {institutions.map((institution) => (
              <div
                key={institution}
                className="rounded-[1.75rem] border border-slate-200 bg-[#F7FAFC] p-7 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-lg font-bold text-mis-navy">
                  {institution}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <CTA
        title="Learn more about the school’s ethos"
        description="Explore the campus, values, and facilities that support the society’s educational vision."
        buttonLabel="Explore Facilities"
        href="/facilities"
      />
    </>
  );
};

export default BmsdSocietyPage;
