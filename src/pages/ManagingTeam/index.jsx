
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';
import {
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter
} from 'lucide-react';

const teamMembers = [
  {
    name: 'Dr. S. S. Bellale',
    role: 'President',
    image: imageAssets.president,
    highlight: 'Leadership & Vision',
    social: {
      instagram: 'https://www.instagram.com/sidheshwarbellale/',
      facebook: 'https://www.facebook.com/sbellale',
      youtube: 'https://www.youtube.com/@sidheshwarbellale'
    }
  },
  {
    name: 'Mr. Ram Bellale',
    role: 'Vice President',
    image: imageAssets.ramBellale,
    highlight: 'Institutional Growth',
    social: {
      instagram: 'https://www.instagram.com/rambellale/',
      facebook: 'https://www.facebook.com/ram.bellale.9'
    }
  },
  {
    name: 'Mrs. Jyoti Kadwade',
    role: 'Secretary',
    image: imageAssets.jyotiKadwade,
    highlight: 'Administration',
    social: {}
  },
  {
    name: 'Dr. Dilip Palimkar',
    role: 'Member',
    image: imageAssets.dilipPalimkar,
    highlight: 'Academic Guidance',
    social: {
      instagram: 'https://www.instagram.com/palimkardilip/',
      facebook: 'https://www.facebook.com/dilip.palimkar.5',
      youtube: 'https://www.youtube.com/@dspalimkar'
    }
  },
  {
    name: 'Mr. Sandesh Bellale',
    role: 'Treasurer | Managing Director',
    image: imageAssets.sandeshBellale,
    highlight: 'Operations & Development',
    social: {
      instagram: 'https://www.instagram.com/bsandeshh_/',
      linkedin: 'https://www.linkedin.com/in/sandesh-bellale-6a55672bb/',
      twitter: 'https://x.com/SandeshBellale'
    }
  }
];

// Social media icon configuration
const socialPlatforms = [
  {
    key: 'instagram',
    label: 'Instagram',
    Icon: Instagram,
    color: 'bg-[#E4405F]'
  },
  {
    key: 'facebook',
    label: 'Facebook',
    Icon: Facebook,
    color: 'bg-[#1877F2]'
  },
  {
    key: 'youtube',
    label: 'YouTube',
    Icon: Youtube,
    color: 'bg-[#FF0000]'
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    Icon: Linkedin,
    color: 'bg-[#0A66C2]'
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    Icon: Twitter,
    color: 'bg-[#1DA1F2]'
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
        subtitle="The dedicated leadership behind the school's values, direction, and growth."
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

            <p className="mt-5 text-lg leading-8 text-slate-600">
              A team of visionary leaders dedicated to academic
              excellence, innovation, and holistic student
              development, ensuring a nurturing and progressive
              learning environment.
            </p>
          </div>

          {/* TEAM GRID */}
          <div className="flex flex-wrap justify-center gap-6">
            {teamMembers.map((member) => (
              <div
  key={member.name}
  className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
>

                {/* MEMBER PHOTO */}
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
                    Balaghat Mathematical Sciences Development Society
                  </p>

                  {/* SOCIAL MEDIA LINKS */}
                  {Object.keys(member.social).length > 0 && (
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">

                      {socialPlatforms.map((platform) => {
                        const url = member.social[platform.key];

                        if (!url) return null;

                        const Icon = platform.Icon;

                        return (
                          <a
                            key={platform.key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} - ${platform.label}`}
                            title={platform.label}
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-md ${platform.color}`}
                          >
                            <Icon size={18} strokeWidth={2} />
                          </a>
                        );
                      })}

                    </div>
                  )}

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
