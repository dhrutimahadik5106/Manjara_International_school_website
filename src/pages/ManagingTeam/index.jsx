import { Helmet } from 'react-helmet-async';
import PageHero from '../../components/common/PageHero.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';

const teamMembers = [
  { name: 'Dr. S. S. Bellale', role: 'President', image: imageAssets.president },
  { name: 'Mr. Ram Bellale', role: 'Vice President', image: imageAssets.ramBellale },
  { name: 'Mrs. Jyoti Kadwade', role: 'Secretary', image: imageAssets.jyotiKadwade },
  { name: 'Dr. Dilip Palimkar', role: 'Member', image: imageAssets.dilipPalimkar },
  { name: 'Mr. Sandesh Bellale', role: 'Managing Director', image: imageAssets.sandeshBellale },
];

const ManagingTeamPage = () => {
  return (
    <>
      <Helmet><title>Managing Team | Manjara International School</title></Helmet>
      <PageHero title="Managing Team" subtitle="The dedicated leadership behind the school’s values, direction, and growth." backgroundImage={imageAssets.schoolCampus} breadcrumb={['About Us', 'Managing Team']} />
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
                <img src={member.image} alt={member.name} className="h-64 w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary">{member.name}</h3>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-[#245B8F]">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA title="Meet the school leadership" description="Discover the people and values shaping the Manjara experience." buttonLabel="Contact Us" href="/contact" />
    </>
  );
};

export default ManagingTeamPage;
