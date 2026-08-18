import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const initiatives = [
  {
    title: 'Celebrating Our Culture',
    description: 'Creating meaningful connections with our culture and traditions through celebrations and shared experiences.',
    image: imageAssets.initiatives[0],
  },
  {
    title: 'Sports Excellence',
    description: 'Discipline, teamwork, and confidence shaped through purposeful physical activity.',
    image: imageAssets.initiatives[1],
  },
  {
    title: 'Environmental Activities',
    description: 'Responsible citizenship nurtured through sustainability and awareness.',
    image: imageAssets.initiatives[2],
  },
  {
    title: 'Creativity & Expression',
    description: 'Providing space for imagination, creativity, and individual expression to flourish.',
    image: imageAssets.initiatives[3],
  },
  {
    title: 'Community & Togetherness',
    description: 'Building a strong school community where students, teachers, and families grow together.',
    image: imageAssets.initiatives[4],
  },
  {
    title: 'Celebrations & School Life',
    description: 'Making school life memorable through celebrations, events, and experiences shared together.',
    image: imageAssets.initiatives[5],
  },
];

const Initiatives = () => {
  return (
    <section className="bg-surface py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Manjara Initiatives</p>
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Learning that extends beyond the classroom and into life.</h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {initiatives.map((item, index) => (
            <motion.article key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.06 }} whileHover={{ y: -6, scale: 1.01 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
              <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#245B8F]">
                  Learn More <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Initiatives;
