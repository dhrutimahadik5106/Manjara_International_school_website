import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Sparkles } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const posts = [
  {
    title: 'Campus Innovation Week',
    date: 'Content to be updated',
    description: 'Client-ready stories and event highlights will be published here as the school shares them.',
    image: imageAssets.latest_news[0],
  },
  {
    title: 'Sports Festival Highlights',
    date: 'Content to be updated',
    description: 'Upcoming events and celebrations will be showcased with imagery and details once available.',
    image: imageAssets.latest_news[1],
  },
  {
    title: 'Parent Interaction Session',
    date: 'Content to be updated',
    description: 'News and announcements will be added here as the school provides updated content.',
    image: imageAssets.latest_news[2],
  },
];

const NewsSection = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
              <Sparkles size={14} className="text-mis-gold" />
              Latest News
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
              Fresh updates and school stories will be shared here.
            </h2>
          </div>
          <a
            href="/news"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-mis-navy shadow-sm hover:bg-slate-50 transition-colors shrink-0"
          >
            <span>View All News</span>
            <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="card-surface overflow-hidden group flex flex-col justify-between"
            >
              <div>
                {/* Reserved Image Container */}
                <div className="reserved-image-container aspect-[16/10] w-full rounded-t-2xl rounded-b-none border-0 border-b border-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <CalendarDays size={15} className="text-mis-gold" />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-mis-navy group-hover:text-mis-blue transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-mis-muted leading-relaxed">
                    {post.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="/news"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-mis-blue hover:text-mis-navy transition-colors"
                >
                  <span>Read Article</span>
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

export default NewsSection;
