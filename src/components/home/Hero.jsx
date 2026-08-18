import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0B2942]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(199,164,93,0.16),transparent_30%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2942]/95 via-[#0B2942]/85 to-[#123B5D]/70" />
        <img src={imageAssets.schoolHero} alt="Manjara campus and student life" className="h-full w-full object-cover" />
      </div>
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl text-white">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles size={16} className="text-[#C7A45D]" />
              <span>Rising Towards Excellence</span>
            </div>
            <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              <span className="block">Manjara International School</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">
              Admission Open!! For Nursery to 8th Grade
            </p>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
              A premium school environment rooted in academic excellence, values, and a calm campus experience for every child.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/admissions" className="inline-flex items-center gap-2 rounded-full bg-[#C7A45D] px-6 py-3 font-semibold text-[#123B5D] transition hover:bg-[#b8924d]">
                Enquire Now <ArrowRight size={18} />
              </a>
              <a href="/about" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Explore Manjara
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2"><BadgeCheck size={16} className="text-[#C7A45D]" /> Holistic education</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2"><BadgeCheck size={16} className="text-[#C7A45D]" /> Safe and inspiring campus</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#C7A45D]/20 to-transparent blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 p-4 shadow-[0_24px_70px_-24px_rgba(11,41,66,0.6)] backdrop-blur">
              <img src={imageAssets.students} alt="A living image space for school life" className="h-[420px] w-full rounded-[1.75rem] object-cover" />
              <div className="absolute left-8 top-8 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">School Life & Learning</div>
              <div className="absolute bottom-8 right-8 rounded-[1.25rem] border border-white/20 bg-[#0B2942]/70 px-5 py-4 text-white backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C7A45D]">Admission Open</p>
                <p className="mt-2 text-xl font-semibold">Nursery to 8th Grade</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
