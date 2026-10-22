
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  FileText,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';

import PageHero from '../../../components/common/PageHero.jsx';
import CTA from '../../../components/common/CTA.jsx';
import { imageAssets } from '../../../data/images.js';

const WHATSAPP_MESSAGE =
  'Hello Manjara International School, I would like to know the latest fee structure and admission details for my child. Please guide me.';

const WHATSAPP_URL =
  `https://wa.me/919175518919?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

const FeeStructurePage = () => {
  return (
    <>
      <Helmet>
        <title>
          Fee Structure | Manjara International School
        </title>
        <meta
          name="description"
          content="Contact Manjara International School for official admission fees, fee structure and payment information."
        />
      </Helmet>

      <PageHero
        title="Fee Structure"
        subtitle="Get accurate and up-to-date fee information directly from our admissions team."
        backgroundImage={imageAssets.About}
        breadcrumb={['Admissions', 'Fee Structure']}
      />

      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-mis-soft px-4 py-2 text-xs font-bold uppercase tracking-wider text-mis-blue-dark">
              <IndianRupee size={16} className="text-mis-gold" />
              Fee Information
            </span>

            <h2 className="mt-5 text-3xl font-extrabold text-mis-navy sm:text-4xl">
              Plan Your Child's Education With Confidence
            </h2>

            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Our admissions team is available to guide parents
              through the latest school fee information and
              admission-related requirements.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">

            {/* LEFT: FEE INFORMATION */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-5 inline-flex rounded-2xl bg-mis-soft p-3 text-mis-blue">
                <FileText size={28} />
              </div>

              <h3 className="text-2xl font-extrabold text-mis-navy">
                Official Fee Structure
              </h3>

              <p className="mt-4 leading-relaxed text-slate-600">
                The detailed fee structure will be shared
                directly by the school once finalised.
                Please contact the admissions team for the
                latest confirmed information.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  'Class-wise fee information',
                  'Admission-related charges',
                  'Available payment options',
                  'Applicable school fee policies'
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-mis-blue"
                    />
                    <span className="text-sm text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <Info
                  size={20}
                  className="mt-0.5 shrink-0 text-mis-blue"
                />
                <p className="text-sm leading-relaxed text-slate-700">
                  Fee amounts and policies may vary by class.
                  Please rely on information confirmed by the
                  school before making any payment.
                </p>
              </div>

            </div>

            {/* RIGHT: CONTACT ADMISSIONS */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <h3 className="text-2xl font-extrabold text-mis-navy">
                Request Fee Details
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Connect with our admissions team using your
                preferred contact method.
              </p>

              <div className="mt-7 space-y-4">

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 transition hover:bg-emerald-100"
                >
                  <MessageCircle
                    size={24}
                    className="shrink-0 text-[#25D366]"
                  />

                  <div>
                    <p className="font-bold text-emerald-900">
                      WhatsApp Admissions
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      +91 9175518919
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="ml-auto text-emerald-700"
                  />
                </a>

                <a
                  href="tel:+919175518919"
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <Phone
                    size={23}
                    className="shrink-0 text-mis-blue"
                  />

                  <div>
                    <p className="font-bold text-mis-navy">
                      Call Admission Helpline
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      +91 9175518919
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="ml-auto text-mis-blue"
                  />
                </a>

                <a
                  href="mailto:manjaraschool@gmail.com?subject=Fee%20Structure%20Enquiry"
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <Mail
                    size={23}
                    className="shrink-0 text-mis-blue"
                  />

                  <div className="min-w-0">
                    <p className="font-bold text-mis-navy">
                      Email the School
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-600">
                      manjaraschool@gmail.com
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="ml-auto shrink-0 text-mis-blue"
                  />
                </a>

              </div>

              <Link
                to="/admissions"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-mis-navy px-6 py-4 text-sm font-bold text-white transition hover:bg-mis-blue"
              >
                Submit an Admission Enquiry
                <ArrowRight size={18} />
              </Link>

            </div>
          </div>
        </div>
      </section>

      <CTA
        title="Need help with admission fees?"
        description="Our admissions team is here to help you understand the next steps."
        buttonLabel="Contact Us"
        href="/contact"
      />
    </>
  );
};

export default FeeStructurePage;
