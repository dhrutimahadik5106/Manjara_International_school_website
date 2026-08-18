import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';

const schema = z.object({
  guardianName: z.string().min(2, 'Guardian name is required'),
  guardianEmail: z.string().email('Please enter a valid email'),
  childName: z.string().min(2, 'Child name is required'),
  childAge: z.string().min(1, 'Child age is required'),
  classGrade: z.string().min(1, 'Please share the grade'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Please share a short message'),
});

const EnquiryForm = ({ title = 'Begin Your Child\'s Journey at Manjara', description = 'Share a few details and our admissions team will contact you with the next step.' }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    console.log('Enquiry submitted', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-28px_rgba(18,59,93,0.28)] sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">Enquiry Form</p>
        <h3 className="mt-2 text-2xl font-semibold text-primary">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Guardian Name</label>
          <input {...register('guardianName')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
          {errors.guardianName ? <p className="mt-1 text-sm text-red-600">{errors.guardianName.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Guardian Email</label>
          <input type="email" {...register('guardianEmail')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
          {errors.guardianEmail ? <p className="mt-1 text-sm text-red-600">{errors.guardianEmail.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Child Name</label>
          <input {...register('childName')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
          {errors.childName ? <p className="mt-1 text-sm text-red-600">{errors.childName.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Child Age</label>
          <input {...register('childAge')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
          {errors.childAge ? <p className="mt-1 text-sm text-red-600">{errors.childAge.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Class / Grade</label>
          <input {...register('classGrade')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
          {errors.classGrade ? <p className="mt-1 text-sm text-red-600">{errors.classGrade.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
          <input {...register('phoneNumber')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
          {errors.phoneNumber ? <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p> : null}
        </div>
      </div>
      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
        <textarea rows="4" {...register('message')} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" />
        {errors.message ? <p className="mt-1 text-sm text-red-600">{errors.message.message}</p> : null}
      </div>
      <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-white transition hover:bg-[#173b5a]">
        Submit Enquiry <ArrowRight size={16} />
      </button>
    </form>
  );
};

export default EnquiryForm;
