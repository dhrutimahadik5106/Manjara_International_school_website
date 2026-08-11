import { motion } from 'framer-motion';
import { ArrowRight, Compass, Landmark, NotebookPen, PhoneCall } from 'lucide-react';

const infoCards = [
  {
    title: 'Admission Process',
    description: 'A transparent journey from inquiry to enrollment with guidance at every step.',
    icon: NotebookPen,
    href: '#admissions',
  },
  {
    title: 'Fee Structure',
    description: 'Clear, accessible information to support confident family planning.',
    icon: Landmark,
    href: '#admissions',
  },
  {
    title: 'School Location',
    description: 'Conveniently situated in a calm environment with easy access for families.',
    icon: Compass,
    href: '#contact',
  },
  {
    title: 'Quick Enquiry',
    description: 'Start a conversation with our admissions team and receive prompt guidance.',
    icon: PhoneCall,
    href: '#contact',
  },
];

const AboutPreview = () => {
  return (
    <section id="about" className="bg-background py-28 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-secondary">About Manjara</p>
          <h2 className="text-3xl font-semibold leading-tight text-primary sm:text-4xl">A school that nurtures academic curiosity and human values.</h2>
          <p className="text-lg leading-8 text-slate-600">Founded 2018–19, Manjara International School blends modern pedagogy with a warm, community-centered culture. Our campus is designed to inspire confidence, creativity, and purposeful growth from early years to senior grades.</p>
          <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Founded</p>
              <p className="mt-2 text-xl font-semibold text-primary">2018–19</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">UDISE</p>
              <p className="mt-2 text-xl font-semibold text-primary">27280101009</p>
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
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
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
