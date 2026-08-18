import { motion } from 'framer-motion';
import { BookOpen, Compass, Crown, Goal, Sparkles, Trophy, Users } from 'lucide-react';
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
    <section className="bg-surface py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">A Glimpse into a Student's Journey</p>
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Every stage of a child’s growth is shaped with care, challenge, and purpose.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {milestones.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ y: -6, scale: 1.01 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
                <div className="p-6">
                  <div className="mb-3 inline-flex rounded-2xl bg-primary/10 p-2 text-primary">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
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
