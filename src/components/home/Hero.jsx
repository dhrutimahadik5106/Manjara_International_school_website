import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const heroImages = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
];

const schema = z.object({
  parentName: z.string().min(2, 'Parent name is required'),
  mobileNumber: z.string().min(10, 'Please enter a valid mobile number'),
  email: z.string().email('Please enter a valid email'),
  studentName: z.string().min(2, 'Student name is required'),
  currentClass: z.string().min(1, 'Please select a class'),
  admissionGrade: z.string().min(1, 'Please choose a grade'),
  message: z.string().min(10, 'Please share a short message'),
});

const Hero = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    console.log('Enquiry submitted', data);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,162,39,0.18),transparent_35%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/40" />
        <img src={heroImages[0]} alt="Students learning in a welcoming campus" className="h-full w-full object-cover" />
      </div>
      <div className="relative mx-auto grid min-h-[92vh] max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col justify-center text-white">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles size={16} className="text-accent" />
            <span>Rising Towards Excellence</span>
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
            <span className="block">Manjara International School</span>
            <span className="mt-3 block text-slate-200">Where learning blossoms with purpose and confidence.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            A premium, future-ready campus experience designed for curious minds, confident learners, and families seeking a nurturing academic environment.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#admissions" className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:scale-[1.02]">
              Apply Now <ArrowRight size={18} />
            </a>
            <a href="#about" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">
              Explore Campus
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2"><BadgeCheck size={16} className="text-accent" /> Holistic education</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2"><BadgeCheck size={16} className="text-accent" /> Modern learning spaces</span>
          </div>
        </motion.div>

        <motion.form initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} onSubmit={handleSubmit(onSubmit)} className="rounded-[1.75rem] border border-slate-200/80 bg-surface/95 p-6 shadow-[0_22px_50px_-24px_rgba(45,55,72,0.35)] backdrop-blur sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">Enquire Now</p>
            <h2 className="mt-2 text-2xl font-semibold text-primary">Plan your child’s next chapter</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Parent Name</label>
              <input {...register('parentName')} className="w-full rounded-[1.125rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0" />
              {errors.parentName && <p className="mt-1 text-sm text-red-600">{errors.parentName.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</label>
              <input {...register('mobileNumber')} className="w-full rounded-[1.125rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0" />
              {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" {...register('email')} className="w-full rounded-[1.125rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0" />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Student Name</label>
              <input {...register('studentName')} className="w-full rounded-[1.125rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0" />
              {errors.studentName && <p className="mt-1 text-sm text-red-600">{errors.studentName.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Current Class</label>
              <input {...register('currentClass')} className="w-full rounded-[1.125rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0" />
              {errors.currentClass && <p className="mt-1 text-sm text-red-600">{errors.currentClass.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Admission Grade</label>
              <input {...register('admissionGrade')} className="w-full rounded-[1.125rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0" />
              {errors.admissionGrade && <p className="mt-1 text-sm text-red-600">{errors.admissionGrade.message}</p>}
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
            <textarea {...register('message')} rows="4" className="w-full rounded-[1.125rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0" />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
          </div>
          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-white transition hover:scale-[1.01] hover:bg-[#1c4462]">
            Submit Enquiry <ArrowRight size={18} />
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Hero;
