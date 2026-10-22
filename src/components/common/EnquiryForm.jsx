
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '../../services/supabase';

const schema = z.object({
  guardianName: z.string()
    .trim()
    .min(2, 'Guardian name is required')
    .max(100, 'Name is too long'),

  guardianEmail: z.string()
    .trim()
    .email('Please enter a valid email')
    .max(254, 'Email is too long'),

  childName: z.string()
    .trim()
    .min(2, 'Child name is required')
    .max(100, 'Name is too long'),

  childAge: z.string()
    .trim()
    .min(1, 'Child age is required')
    .max(30, 'Please enter a valid age'),

  classGrade: z.string()
    .trim()
    .min(1, 'Please share the grade')
    .max(60, 'Grade is too long'),

  phoneNumber: z.string()
    .trim()
    .min(10, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long')
    .refine(
      (value) => {
        const digits = value.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      },
      'Enter a valid phone number'
    ),

  message: z.string()
    .trim()
    .min(10, 'Please share a short message')
    .max(2000, 'Message is too long')
});

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-mis-blue focus:ring-2 focus:ring-mis-blue/20 outline-none transition';

const EnquiryForm = ({
  title = "Begin Your Child's Journey at Manjara",
  description = 'Share a few details and our admissions team will contact you with the next step.'
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      guardianName: '',
      guardianEmail: '',
      childName: '',
      childAge: '',
      classGrade: '',
      phoneNumber: '',
      message: ''
    }
  });

  const onSubmit = async (data) => {
    setSubmitError('');

    try {
      const enquiry = {
        guardian_name: data.guardianName.trim(),
        guardian_email: data.guardianEmail.trim().toLowerCase(),
        child_name: data.childName.trim(),
        child_age: data.childAge.trim(),
        class_grade: data.classGrade.trim(),
        phone_number: data.phoneNumber.trim(),
        message: data.message.trim()
      };

      // Save enquiry to Supabase database.
      const { error } = await supabase
        .from('enquiries')
        .insert(enquiry);

      if (error) {
        console.error('Enquiry submission failed:', {
          code: error.code,
          message: error.message
        });

        throw new Error('Unable to submit enquiry');
      }

      // The backend email notification will be
      // triggered separately when configured.
      // Do not send email API keys from React.

      setSubmitted(true);
      reset();

    } catch (error) {
      console.error('Admission enquiry error:', error);

      setSubmitError(
        'We could not submit your enquiry right now. Please try again or contact the school admissions office.'
      );
    }
  };

  const fieldError = (name) =>
    errors[name] ? (
      <p
        role="alert"
        className="mt-1 text-xs text-red-600 font-medium"
      >
        {errors[name].message}
      </p>
    ) : null;

  return (
    <div className="card-surface p-6 sm:p-8 bg-white border border-slate-200/90">

      {/* FORM HEADER */}
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-mis-blue mb-1">
          <Sparkles
            size={14}
            className="text-mis-gold"
          />
          Enquiry Form
        </span>

        <h3 className="text-xl sm:text-2xl font-extrabold text-mis-navy tracking-tight">
          {title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-mis-muted leading-relaxed">
          {description}
        </p>
      </div>

      {submitted ? (

        /* SUCCESS MESSAGE */
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">

          <CheckCircle2
            size={44}
            className="text-emerald-600 mx-auto"
          />

          <h4 className="text-lg font-bold text-emerald-900">
            Thank You for Your Enquiry!
          </h4>

          <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
            Your admission enquiry has been submitted successfully
            to Manjara International School. Our admissions team
            will contact you regarding the next steps.
          </p>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setSubmitError('');
              reset();
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
          >
            Submit Another Enquiry
          </button>

        </div>

      ) : (

        /* ENQUIRY FORM */
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >

          <div className="grid gap-4 sm:grid-cols-2">

            {/* GUARDIAN NAME */}
            <div>
              <label
                htmlFor="guardianName"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                Guardian Name <span className="text-red-500">*</span>
              </label>

              <input
                id="guardianName"
                placeholder="e.g. Rajesh Patil"
                autoComplete="name"
                maxLength={100}
                {...register('guardianName')}
                className={inputClass}
              />

              {fieldError('guardianName')}
            </div>

            {/* GUARDIAN EMAIL */}
            <div>
              <label
                htmlFor="guardianEmail"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                Guardian Email <span className="text-red-500">*</span>
              </label>

              <input
                id="guardianEmail"
                type="email"
                placeholder="e.g. rajesh@example.com"
                autoComplete="email"
                maxLength={254}
                {...register('guardianEmail')}
                className={inputClass}
              />

              {fieldError('guardianEmail')}
            </div>

            {/* CHILD NAME */}
            <div>
              <label
                htmlFor="childName"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                Child Name <span className="text-red-500">*</span>
              </label>

              <input
                id="childName"
                placeholder="e.g. Aarav Patil"
                maxLength={100}
                {...register('childName')}
                className={inputClass}
              />

              {fieldError('childName')}
            </div>

            {/* CHILD AGE */}
            <div>
              <label
                htmlFor="childAge"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                Child Age <span className="text-red-500">*</span>
              </label>

              <input
                id="childAge"
                placeholder="e.g. 7 Years"
                maxLength={30}
                {...register('childAge')}
                className={inputClass}
              />

              {fieldError('childAge')}
            </div>

            {/* CLASS / GRADE */}
            <div>
              <label
                htmlFor="classGrade"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                Class / Grade Seeking <span className="text-red-500">*</span>
              </label>

              <input
                id="classGrade"
                placeholder="e.g. Grade 2"
                maxLength={60}
                {...register('classGrade')}
                className={inputClass}
              />

              {fieldError('classGrade')}
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="mb-1.5 block text-xs font-bold text-slate-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>

              <input
                id="phoneNumber"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                autoComplete="tel"
                maxLength={20}
                {...register('phoneNumber')}
                className={inputClass}
              />

              {fieldError('phoneNumber')}
            </div>

          </div>

          {/* MESSAGE */}
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-xs font-bold text-slate-700"
            >
              Message / Specific Requirements{' '}
              <span className="text-red-500">*</span>
            </label>

            <textarea
              id="message"
              rows={3}
              maxLength={2000}
              placeholder="Tell us about your admission requirements or questions..."
              {...register('message')}
              className={inputClass}
            />

            {fieldError('message')}
          </div>

          {/* SUBMISSION ERROR */}
          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700"
            >
              <AlertCircle
                size={18}
                className="shrink-0 mt-0.5"
              />

              <p className="text-xs sm:text-sm">
                {submitError}
              </p>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-mis-navy hover:bg-mis-blue text-white px-6 py-3 text-xs sm:text-sm font-bold transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Submitting...
              </>
            ) : (
              <>
                <span>Submit Admission Enquiry</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

        </form>
      )}
    </div>
  );
};

export default EnquiryForm;
