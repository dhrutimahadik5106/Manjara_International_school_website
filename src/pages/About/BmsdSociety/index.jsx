import { Helmet } from 'react-helmet-async';
import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const institutions = [
  'Bellale\'s Mathematics Institution, Ahmedpur',
  'CBSE and ICSE schools',
  'Junior colleges',
  'Research hubs',
  'Mathematics institutions',
];

const BmsdSocietyPage = () => {
  return (
    <>
      <Helmet><title>BMSD Society | Manjara International School</title></Helmet>
      <PageHero title="BMSD Society / Our Legacy" subtitle="A visionary educational journey rooted in the Marathwada region and driven by purpose." backgroundImage={imageAssets.schoolCampus} breadcrumb={['About Us', 'BMSD Society']} />
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Our Legacy</p>
            <h2 className="mt-4 text-3xl font-semibold text-primary">A journey rooted in higher education, research, and regional progress.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">Twenty three years ago, as a visionary leader and after a brief political career, Dr. Sidheshwar Bellale, along with other distinguished leaders from various fields across the Marathwada region—Dr. Bapurao Dhage, Prof. Rajkumar Kawade, Dr. Dillip Palimkar, Dr. Bhalchandra Karande, Sou. Jyoti Kadwade, Prof. Ram Bellale, Prof. Bapurao Shinde, and Sou. Meenabai Khedkar—recognized the need for higher education and research to drive regional progress and prosperity.</p>
            <p className="mt-5 text-lg leading-8 text-slate-700">The journey began in 1999 with the establishment of Bellale’s Mathematics Institution in Ahmedpur. The society expanded into CBSE and ICSE schools, junior colleges, research hubs, and mathematics institutions.</p>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
            <img src={imageAssets.schoolHero} alt="BMSD Society" className="h-full min-h-[340px] w-full object-cover" />
          </div>
        </div>
      </section>
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Institutions Operated</p>
            <h2 className="mt-3 text-3xl font-semibold text-primary">A growing network of institutions guided by the same mission.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {institutions.map((institution) => (
              <div key={institution} className="rounded-[1.75rem] border border-slate-200 bg-[#F7FAFC] p-8 shadow-soft">
                <p className="text-lg font-semibold text-primary">{institution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA title="Learn more about the school’s ethos" description="Explore the campus, values, and facilities that support the society’s educational vision." buttonLabel="Explore Facilities" href="/facilities" />
    </>
  );
};

export default BmsdSocietyPage;
