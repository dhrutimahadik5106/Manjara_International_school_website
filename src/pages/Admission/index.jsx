
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import PageHero from '../../components/common/PageHero.jsx';
import EnquiryForm from '../../components/common/EnquiryForm.jsx';
import FaqAccordion from '../../components/common/FaqAccordion.jsx';
import CTA from '../../components/common/CTA.jsx';
import { imageAssets } from '../../data/images.js';

import {
  GraduationCap,
  FileText,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  ClipboardList,
  Users,
  ShieldCheck
} from 'lucide-react';

const admissionSteps = [
  'Submit an enquiry form through the website or contact the school directly.',
  'Receive guidance from the admissions team regarding the next steps and availability.',
  'Complete the required school interaction and documentation process.',
  'Secure admission once the school confirms the process details.'
];

const admissionJourney = [
  {
    title: 'Submit Your Enquiry',
    description:
      "Fill in the enquiry form with your child's details.",
    icon: ClipboardList
  },
  {
    title: 'Connect With Our Team',
    description:
      'Our admissions team will guide you regarding availability and the next steps.',
    icon: Users
  },
  {
    title: 'Understand the Requirements',
    description:
      'Receive information about eligibility, documents, fees and admission policies.',
    icon: FileText
  },
  {
    title: 'Complete the Admission Process',
    description:
      'Proceed with the required steps once the school confirms the details.',
    icon: ShieldCheck
  }
];

const faqItems = [
  {
    question: 'Admission for AY 2026–27',
    answer:
      'Please contact the admissions team for the latest information about admissions for the academic year 2026–27.'
  },
  {
    question: 'What is the admission process?',
    answer:
      'Begin by submitting the admission enquiry form. The school will guide you regarding the next steps, required interaction and documentation.'
  },
  {
    question: 'Where can I get the fee structure?',
    answer:
      'Please contact the school for the latest confirmed class-wise fee structure and payment information.'
  },
  {
    question: 'What are the eligibility requirements?',
    answer:
      'Eligibility requirements depend on the class and the applicable school admission policy. Please contact the admissions team for confirmation.'
  }
];

const admissionHelplines = [
  {
    label: '+91 9175518919',
    href: 'tel:+919175518919'
  },
  {
    label: '+91 9130722285',
    href: 'tel:+919130722285'
  },
  {
    label: '+91 8830005678',
    href: 'tel:+918830005678'
  }
];

const WHATSAPP_MESSAGE =
  'Hello Manjara International School, I would like to enquire about admission for my child. Please share the admission process, available classes and fee details. Thank you.';

const WHATSAPP_URL =
  `https://wa.me/919175518919?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

const AdmissionsPage = () => {
  return (
    <>
      <Helmet>
        <title>
          Admissions | Manjara International School
        </title>
        <meta
          name="description"
          content="Explore admissions at Manjara International School, Latur. Learn about the admission process and submit an enquiry."
        />
      </Helmet>

      {/* PAGE HERO */}
      <PageHero
        title="Admissions"
        subtitle="A transparent and welcoming admissions experience for prospective families."
        backgroundImage={imageAssets.About}
        breadcrumb={['Admissions']}
      />

      {/* ADMISSION OVERVIEW */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:px-8">

          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#245B8F]">
              Admissions
            </p>

            <h2 className="text-3xl font-extrabold text-mis-navy sm:text-4xl">
              We welcome families to begin the journey with
              clarity and confidence.
            </h2>

            <p className="text-base leading-8 text-slate-600">
              Our admissions team is here to help prospective
              families understand the process, admission
              requirements and next steps.
            </p>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-5 flex items-center gap-3">
                <GraduationCap
                  size={25}
                  className="text-mis-blue"
                />
                <h3 className="text-xl font-bold text-mis-navy">
                  Admission Process
                </h3>
              </div>

              <div className="space-y-4">
                {admissionSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mis-soft text-sm font-extrabold text-mis-blue">
                      {index + 1}
                    </span>

                    <p className="pt-1 text-sm leading-relaxed text-slate-600">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ADMISSION IMAGE */}
          <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm">
            <img
              src={imageAssets.About}
              alt="Manjara International School admission overview"
              className="h-full min-h-[320px] w-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* ADMISSION ENQUIRY SECTION */}
      <section
        id="admission-enquiry"
        className="bg-surface py-16 sm:py-20"
      >
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">

          {/* LEFT: ADMISSION INFORMATION */}
          <div className="rounded-[2rem] border border-slate-200 bg-[#F7FAFC] p-6 shadow-soft sm:p-8">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mis-blue/15 bg-mis-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-mis-blue-dark">
              <GraduationCap
                size={15}
                className="text-mis-gold"
              />
              Admission Guidance
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-mis-navy sm:text-3xl">
              Your Child's Admission Journey
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Every child's educational journey begins with
              the right guidance. Here's how our team can
              help you take the next step.
            </p>

            {/* JOURNEY STEPS */}
            <div className="relative mt-7 space-y-5">

              {admissionJourney.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-mis-blue shadow-sm">
                      <Icon size={21} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-mis-navy">
                        {index + 1}. {step.title}
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* IMPORTANT NOTE */}
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-blue-100 bg-white p-4">
              <Info
                size={19}
                className="mt-0.5 shrink-0 text-mis-blue"
              />

              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                Admission availability, eligibility,
                documents, fee structure and official
                policies will be confirmed by the school.
              </p>
            </div>

            {/* CONTACT HELPLINES */}
            <div className="mt-7 border-t border-slate-200 pt-6">

              <div className="mb-4 flex items-center gap-2">
                <Phone
                  size={19}
                  className="text-mis-gold"
                />

                <h3 className="text-base font-extrabold text-mis-navy">
                  Admission Helplines
                </h3>
              </div>

              <div className="space-y-2">
                {admissionHelplines.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-mis-blue"
                  >
                    <CheckCircle2
                      size={15}
                      className="text-mis-blue"
                    />
                    {phone.label}
                  </a>
                ))}
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-7 space-y-3">

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#20ba5a]"
              >
                <MessageCircle size={19} />
                Enquire on WhatsApp
                <ArrowRight size={17} />
              </a>

              <Link
                to="/admissions/fee-structure"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-mis-navy transition hover:bg-slate-100"
              >
                <FileText size={18} />
                Fee Structure Information
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>

          {/* RIGHT: EXISTING ENQUIRY FORM */}
          <div>
            <EnquiryForm
              title="Enquire Now"
              description="Share your details and receive the next step from our admissions team."
            />
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#245B8F]">
              Frequently Asked Questions
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-mis-navy sm:text-4xl">
              Helpful guidance for prospective families.
            </h2>
          </div>

          <FaqAccordion items={faqItems} />

        </div>
      </section>

      {/* BOTTOM CTA */}
      <CTA
        title="Begin your child's admission journey today"
        description="Start with confidence and let the admissions team guide you with the next step."
        buttonLabel="Contact Us"
        href="/contact"
      />

    </>
  );
};

export default AdmissionsPage;
