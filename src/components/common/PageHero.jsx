import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const PageHero = ({ title, subtitle, backgroundImage = '/images/hero-2.jpg', breadcrumb = ['Home'] }) => {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 py-28 sm:py-36">
      <img src={backgroundImage} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/75 to-slate-950/45" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.nav initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-200">
          <a href="/" className="inline-flex items-center gap-2 hover:text-white"><Home size={16} /> Home</a>
          {breadcrumb.map((item, index) => (
            <span key={item} className="flex items-center gap-2">
              <span>/</span>
              <span className={index === breadcrumb.length - 1 ? 'font-semibold text-white' : ''}>{item}</span>
            </span>
          ))}
        </motion.nav>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-accent">Manjara International School</p>
          <h1 className="text-4xl font-semibold leading-[1.08] text-white sm:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-6 text-lg leading-8 text-slate-300">{subtitle}</p> : null}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
