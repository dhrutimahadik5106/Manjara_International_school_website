import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const posts = [
  {
    title: 'Campus Innovation Week',
    date: 'Content to be updated',
    description: 'Client-ready stories and event highlights will be published here as the school shares them.',
    image: imageAssets.news[0],
  },
  {
    title: 'Sports Festival Highlights',
    date: 'Content to be updated',
    description: 'Upcoming events and celebrations will be showcased with imagery and details once available.',
    image: imageAssets.news[1],
  },
  {
    title: 'Parent Interaction Session',
    date: 'Content to be updated',
    description: 'News and announcements will be added here as the school provides updated content.',
    image: imageAssets.news[2],
  },
];

const NewsSection = () => {
  return (
    <section className="bg-background py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Latest News</p>
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Fresh updates and school stories will be shared here.</h2>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-slate-50">
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article key={post.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
              <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <div className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays size={16} /> {post.date}
                </div>
                <h3 className="text-xl font-semibold text-primary">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{post.description}</p>
                <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#245B8F]">
                  Read More <ArrowRight size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
