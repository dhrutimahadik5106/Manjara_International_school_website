import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const initiatives = [
  { title: 'Innovation Programs', description: 'Hands-on learning that encourages inquiry and creative problem solving.', image: '/images/initiative-1.jpg' },
  { title: 'Sports Excellence', description: 'Discipline, teamwork, and confidence built through purposeful physical activity.', image: '/images/initiative-2.jpg' },
  { title: 'Environmental Activities', description: 'Responsible citizenship nurtured through sustainability and awareness.', image: '/images/initiative-3.jpg' },
  { title: 'STEM Learning', description: 'Experiments and discovery that bring science and technology to life.', image: '/images/initiative-4.jpg' },
  { title: 'Community Outreach', description: 'Service-minded learning that connects students to the wider community.', image: '/images/initiative-5.jpg' },
  { title: 'Student Leadership', description: 'Opportunities to lead, empathise, and contribute with confidence.', image: '/images/initiative-6.jpg' },
];

const Initiatives = () => {
  return (
    <section className="bg-surface py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-secondary">Manjara Initiatives</p>
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Learning that extends beyond the classroom.</h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {initiatives.map((item, index) => (
            <motion.article key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.06 }} whileHover={{ y: -6, scale: 1.01 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
              <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
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
