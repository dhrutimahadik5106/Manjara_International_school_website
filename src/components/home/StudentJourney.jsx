import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Compass, Crown, Goal, Sparkles, Trophy } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const milestones = [
  { title: 'Discover', description: 'A warm introduction to school life and personal growth.', icon: Compass, image: imageAssets.journey[0] },
  { title: 'Learn', description: 'Curiosity-led learning supported by engaged mentors.', icon: BookOpen, image: imageAssets.journey[1] },
  { title: 'Celebrate', description: 'Celebrating our culture, traditions, and the joy of learning together.', icon: Sparkles, image: imageAssets.journey[2] },
  { title: 'Create', description: 'Opportunities to innovate, perform, and express ideas.', icon: Trophy, image: imageAssets.journey[3] },
  { title: 'Grow', description: 'Confidence and resilience shaped through reflection and practice.', icon: Goal, image: imageAssets.journey[4] },
  { title: 'Participate', description: 'Building confidence, resilience, teamwork, and a healthy spirit through activity.', icon: Crown, image: imageAssets.journey[5] },
];

const StudentJourney = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
            <Sparkles size={14} className="text-mis-gold" />
            A Glimpse into a Student's Journey
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
            Every stage of a child’s growth is shaped with care, challenge, and purpose.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {milestones.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
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
                    <div className="mb-3.5 inline-flex rounded-xl bg-mis-soft p-2.5 text-mis-blue">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-mis-navy group-hover:text-mis-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-mis-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StudentJourney;
