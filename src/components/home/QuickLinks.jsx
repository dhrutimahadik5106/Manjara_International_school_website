import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, BriefcaseBusiness, Camera, FileText, GraduationCap, Home, Mail, School, Truck, Users, Sparkles } from 'lucide-react';

const links = [
  { title: 'Admissions', href: '/admissions', icon: Home },
  { title: 'Facilities', href: '/facilities', icon: School },
  { title: 'Gallery', href: '/gallery', icon: Camera },
  { title: 'Contact', href: '/contact', icon: Mail },
  { title: 'News', href: '/news', icon: BookOpen },
  { title: 'Careers', href: '/careers', icon: BriefcaseBusiness },
  { title: 'Alumni', href: '/alumni', icon: Users },
  { title: 'FAQs', href: '/faq', icon: FileText },
  { title: 'Academics', href: '/academics', icon: GraduationCap },
  { title: 'Transport', href: '/facilities', icon: Truck },
];

const QuickLinks = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="section-shell">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mis-soft text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15">
            <Sparkles size={14} className="text-mis-gold" />
            Quick Links
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
            Easy access to everything families need.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.title}
                href={link.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="card-surface p-4 flex items-center gap-3.5 group hover:border-mis-blue/30"
              >
                <div className="rounded-xl bg-mis-soft p-2.5 text-mis-blue group-hover:bg-mis-blue group-hover:text-white transition-colors">
                  <Icon size={18} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-mis-navy group-hover:text-mis-blue transition-colors">
                  {link.title}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
