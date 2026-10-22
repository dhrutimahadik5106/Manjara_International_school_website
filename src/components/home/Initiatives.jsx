import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
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
    <section className="bg-white py-16 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
            <Sparkles size={14} className="text-mis-gold" />
            Manjara Initiatives
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
            Learning that extends beyond the classroom and into life.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {initiatives.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="card-surface overflow-hidden group flex flex-col justify-between"
            >
              <div>
                {/* Reserved Image Container */}
                <div className="reserved-image-container aspect-[16/10] w-full rounded-t-2xl rounded-b-none border-0 border-b border-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-mis-navy group-hover:text-mis-blue transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-mis-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="/gallery"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-mis-blue hover:text-mis-navy transition-colors"
                >
                  <span>Explore Initiatives</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Initiatives;
