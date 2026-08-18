import { motion } from 'framer-motion';
import { BookOpen, BriefcaseBusiness, Camera, FileText, GraduationCap, Home, Mail, School, Truck, Users } from 'lucide-react';

const links = [
  { title: 'Admissions', href: '/admissions', icon: Home },
  { title: 'Facilities', href: '/facilities', icon: School },
  { title: 'Gallery', href: '/gallery', icon: Camera },
  { title: 'Contact', href: '/contact', icon: Mail },
  { title: 'News', href: '/news', icon: BookOpen },
  { title: 'Careers', href: '/careers', icon: BriefcaseBusiness },
  { title: 'Alumni', href: '/alumni', icon: Users },
  { title: 'FAQs', href: '/admissions', icon: FileText },
  { title: 'Academics', href: '/academics', icon: GraduationCap },
  { title: 'Transport', href: '/facilities', icon: Truck },
];

const QuickLinks = () => {
  return (
    <section className="bg-surface py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">Quick Links</p>
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Easy access to everything families need.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a key={link.title} href={link.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.04 }} whileHover={{ y: -4, scale: 1.01 }} className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-soft">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon size={18} /></div>
                <span className="font-semibold text-slate-700">{link.title}</span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
