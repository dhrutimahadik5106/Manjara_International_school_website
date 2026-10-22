
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';
import { ShieldCheck } from 'lucide-react';

const teamMembers = [
  {
    name: 'Dr. S. S. Bellale',
    role: 'President',
    image: imageAssets.president,
    highlight: 'Leadership & Vision'
  },
  {
    name: 'Mr. Ram Bellale',
    role: 'Vice President',
    image: imageAssets.ramBellale,
    highlight: 'Institutional Growth'
  },
  {
    name: 'Mrs. Jyoti Kadwade',
    role: 'Secretary',
    image: imageAssets.jyotiKadwade,
    highlight: 'Administration'
  },
  {
    name: 'Dr. Dilip Palimkar',
    role: 'Member',
    image: imageAssets.dilipPalimkar,
    highlight: 'Academic Guidance'
  },
  {
    name: 'Mr. Sandesh Bellale',
    role: 'Treasurer | Managing Director',
    image: imageAssets.sandeshBellale,
    highlight: 'Operations & Development'
  }
];

const ManagingTeamPage = () => {
  return (
    <>
      <Helmet>
        <title>
          Managing Team | Manjara International School
        </title>

        <meta
          name="description"
          content="Meet the dedicated leadership team and society office bearers guiding Manjara International School towards academic excellence."
        />
      </Helmet>

      {/* PAGE BANNER */}
      <PageHero
        title="Managing Team"
        subtitle="The dedicated leadership behind the school’s values, direction, and growth."
        backgroundImage={imageAssets.schoolCampus}
        breadcrumb={['About Us', 'Managing Team']}
      />

      {/* MANAGING TEAM SECTION */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="section-shell">

          {/* SECTION HEADING */}
          <div className="mb-10 max-w-3xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-mis-blue/15 bg-mis-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-mis-blue-dark">
              <ShieldCheck
                size={14}
                className="text-mis-gold"
              />
              BMSD Society Leadership
            </span>

            <h2 className="text-2xl font-extrabold tracking-tight text-mis-navy sm:text-4xl">
              Guided by experience, wisdom, and dedication
              to youth education.
            </h2>
          </div>

          {/* TEAM GRID */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* COMPACT PHOTO CONTAINER */}
                <div className="relative h-[280px] w-full overflow-hidden bg-slate-100 sm:h-[300px]">

                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  {/* SUBTLE GRADIENT */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mis-navy/50 via-transparent to-transparent" />

                  {/* LEADERSHIP LABEL */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="inline-block rounded-md bg-mis-gold px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-mis-navy shadow-sm">
                      {member.highlight}
                    </span>
                  </div>

                </div>

                {/* MEMBER DETAILS */}
                <div className="flex flex-1 flex-col p-5">

                  <h3 className="text-lg font-extrabold text-mis-navy transition-colors duration-200 group-hover:text-mis-blue">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-mis-blue">
                    {member.role}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-mis-muted">
                    Balwadi & Shikshan Mandal Society, Latur
                  </p>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <CTA
        title="Meet the school leadership"
        description="Discover the people and values shaping the Manjara experience."
        buttonLabel="Contact Us"
        href="/contact"
      />
    </>
  );
};

export default ManagingTeamPage;
