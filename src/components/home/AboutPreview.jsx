import { motion } from 'framer-motion';
import { ArrowRight, Compass, Landmark, NotebookPen, PhoneCall } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const infoCards = [
  {
    title: 'Admission Process',
    description: 'A transparent journey from inquiry to enrollment with guidance at every step.',
    icon: NotebookPen,
    href: '/admissions',
  },
  {
    title: 'Fee Structure',
    description: 'Clear, accessible information for families planning their child’s future.',
    icon: Landmark,
    href: '/admissions/fee-structure',
  },
  {
    title: 'Location',
    description: 'Conveniently situated in a calm and inspiring environment for families.',
    icon: Compass,
    href: '/location',
  },
  {
    title: 'Enquiry Form',
    description: 'Start a conversation with our admissions team and receive prompt guidance.',
    icon: PhoneCall,
    href: '/admissions',
  },
];

const AboutPreview = () => {
  return (
    <section id="about" className="bg-background py-28 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Information on Manjara International School</p>
          <h2 className="text-3xl font-semibold leading-tight text-primary sm:text-4xl">A school that nurtures academic curiosity, values, and lasting confidence.</h2>
          <p className="text-lg leading-8 text-slate-600">Founded in 2018–19, Manjara International School was established under the aegis of BMSDS and continues to shape learners in a calm, nature-rich campus that supports intellectual, emotional, social, and physical growth.</p>
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
            <img src={imageAssets.schoolCampus} alt="The Manjara campus" className="h-56 w-full object-cover" />
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Founded</p>
                <p className="mt-2 text-xl font-semibold text-primary">2018–19</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">UDISE</p>
                <p className="mt-2 text-xl font-semibold text-primary">27280101009</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {infoCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.a key={card.title} href={card.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }} whileHover={{ y: -6, scale: 1.01 }} className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-soft transition">
                <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-primary">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#245B8F]">
                  Learn more <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
