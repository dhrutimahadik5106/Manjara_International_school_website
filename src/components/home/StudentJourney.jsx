import { motion } from 'framer-motion';
import { BookOpen, Music4, Landmark, Trophy, Salad, Sparkles, GraduationCap, Users } from 'lucide-react';

const milestones = [
  { title: 'Morning Assembly', icon: Sparkles, image: '/images/journey-1.jpg' },
  { title: 'Smart Learning', icon: BookOpen, image: '/images/journey-2.jpg' },
  { title: 'STEM Activities', icon: Trophy, image: '/images/journey-3.jpg' },
  { title: 'Sports', icon: Landmark, image: '/images/journey-4.jpg' },
  { title: 'Arts & Music', icon: Music4, image: '/images/journey-5.jpg' },
  { title: 'Library', icon: BookOpen, image: '/images/journey-6.jpg' },
  { title: 'Lunch Break', icon: Salad, image: '/images/journey-7.jpg' },
  { title: 'Club Activities', icon: Users, image: '/images/journey-8.jpg' },
  { title: 'Celebrations', icon: Sparkles, image: '/images/journey-9.jpg' },
  { title: 'Graduation', icon: GraduationCap, image: '/images/journey-10.jpg' },
];

const StudentJourney = () => {
  return (
    <section className="bg-surface py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-secondary">Student Journey</p>
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl">A glimpse into the rhythm of a joyful learning experience.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {milestones.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }} whileHover={{ y: -6, scale: 1.01 }} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-soft">
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <div className="mb-3 inline-flex rounded-2xl bg-primary/10 p-2 text-primary">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
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
