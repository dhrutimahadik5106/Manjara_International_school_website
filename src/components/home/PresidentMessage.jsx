import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import { imageAssets } from '../../data/images.js';

const PresidentMessage = () => {
  return (
    <section className="bg-[#EAF3F8] py-28 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
          <img src={imageAssets.principal} alt="Dr. S. S. Bellale" className="h-full min-h-[380px] w-full object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.08 }} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#245B8F]">From the Desk of President</p>
          <h2 className="mt-4 text-3xl font-semibold text-primary">A message of care, growth, and purposeful learning.</h2>
          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-[#F7FAFC] p-6">
            <div className="flex items-start gap-3 text-[#123B5D]">
              <Quote size={22} className="mt-1 shrink-0" />
              <p className="text-lg leading-8 text-slate-700">At MIS, we believe education is not just about academics—it’s about building strong character, sparking creativity, and preparing children for a successful life. We’re proud to offer a warm and supportive environment with smart classrooms, well-equipped labs, a rich library, and excellent sports facilities. Here, learning goes beyond books. It’s about growing as individuals.</p>
            </div>
            <p className="mt-6 text-lg leading-8 text-slate-700">Our MIS curriculum is designed to help students grow in every way—not just academically, but also spiritually, socially, emotionally, and physically. We also encourage extracurricular activities that build confidence, leadership, and teamwork.</p>
          </div>
          
          <div className="mt-6 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-primary">Dr. S. S. Bellale</p>
              <p className="text-sm text-slate-500">President, BMSD Society</p>
            </div>
            <a href="/about/chairman" className="inline-flex items-center gap-2 text-sm font-semibold text-[#245B8F]">
              Read More <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PresidentMessage;
