
import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';

const pillars = [
  {
    title: 'Our Story',
    description:
      'Founded in 2018–19 under BMSDS, Manjara International School brings together academic excellence, values, and a nurturing campus environment.',
  },
  {
    title: 'BMSD Society',
    description:
      'Established by Hon. Dr. Sidheshwar Bellale, the society has developed a network of educational institutions across the region.',
  },
  {
    title: 'Managing Team',
    description:
      'Dedicated leadership committed to student wellbeing, quality education, and institutional excellence.',
  },
];

const institutions = [
  'Shri Saraswati Nursery, LKG, UKG (ICSE) School, Ahmedpur',
  'Shri Saraswati Primary & Secondary (ICSE) School, Ahmedpur',
  'Shri Saraswati Junior College, Ahmedpur',
  'Shri Saraswati (ICSE) Pre-Primary School, Ahmedpur',
  'Balaghat Mathematical Sciences IIT/JEE Institute, Ahmedpur',
  'Shri Saraswati Nursery, LKG, UKG (ICSE) School, Savergaon',
  'Shri Saraswati Primary & Secondary (ICSE) School, Savergaon',
  'Shri Saraswati Junior College, Savergaon',
  'Manjara International School (MIS), Ahmedpur',
];

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Manjara International School</title>
      </Helmet>

      <PageHero
        title="About Manjara"
        subtitle="Nurturing young minds through quality education, strong values, and holistic development."
        backgroundImage={imageAssets.schoolCampus}
        breadcrumb={['About Us']}
      />

      {/* ABOUT MANJARA */}
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">

          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">
              About Manjara
            </p>

            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">
              Nurturing Excellence Through Education and Values
            </h2>

            <p className="text-lg leading-8 text-slate-600">
              Manjara International School (MIS) was founded in
              2018–2019 under the aegis of Balaghat Mathematical
              Sciences Development Society (BMSDS), established
              by Hon. Dr. Sidheshwar Bellale.
            </p>

            <p className="text-lg leading-8 text-slate-600">
              Located in a serene and natural environment,
              away from urban distractions, MIS provides
              a supportive setting for holistic education.
            </p>

            <p className="text-lg leading-8 text-slate-600">
              We are committed to delivering a comprehensive
              learning experience that supports intellectual,
              emotional, social, and physical development.
            </p>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-semibold text-[#0B2742]">
                UDISE: 27280101009
              </p>
            </div>
          </div>

          <img
            src={imageAssets.About}
            alt="Manjara International School campus"
            className="block h-auto max-h-[520px] w-full rounded-[2rem] object-cover"
          />
        </div>
      </section>

      {/* SCHOOL VALUES */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-[1.75rem] border border-slate-200 bg-[#F7FAFC] p-8 shadow-soft"
              >
                <h3 className="text-xl font-semibold text-primary">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATIONAL INSTITUTIONS */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#245B8F]">
              BMSDS Educational Network
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-primary sm:text-4xl">
              Our Educational Institutions
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Balaghat Mathematical Sciences Development Society
              supports a network of educational institutions
              dedicated to providing quality education across
              different stages of learning.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {institutions.map((institution, index) => (
              <div
                key={institution}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4F8] font-bold text-[#245B8F]">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <h3 className="text-lg font-semibold leading-7 text-primary">
                  {institution}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UDISE AND ICSE INFORMATION */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#245B8F]">
              School Information
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-primary sm:text-4xl">
              UDISE & ICSE Education
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Manjara International School (MIS), UDISE
              27280101009, follows the ICSE pattern of education.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              MIS has been described as the second school in
              Latur to have a proposal for ICSE education
              from Playgroup to Grade 12.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              The Council for the Indian School Certificate
              Examinations (CISCE) is the educational council
              associated with the ICSE curriculum.
              The school's current affiliation status
              should be confirmed with the administration.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-soft">
              <p className="text-sm uppercase tracking-widest text-slate-500">
                UDISE Number
              </p>
              <p className="mt-3 text-2xl font-semibold text-primary">
                27280101009
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-soft">
              <p className="text-sm uppercase tracking-widest text-slate-500">
                Education Pattern
              </p>
              <p className="mt-3 text-2xl font-semibold text-primary">
                ICSE
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-soft">
              <p className="text-sm uppercase tracking-widest text-slate-500">
                Proposed Classes
              </p>
              <p className="mt-3 text-2xl font-semibold text-primary">
                Playgroup to Grade 12
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ADMISSION CTA */}
      <CTA
        title="Plan a Visit to Our Campus"
        description="Explore the environment, facilities, and learning culture that shape the Manjara experience."
        buttonLabel="Enquire Now"
        href="/admissions"
      />
    </>
  );
};

export default AboutPage;
