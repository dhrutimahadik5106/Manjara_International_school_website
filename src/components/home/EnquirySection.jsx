import React from 'react';
import EnquiryForm from '../common/EnquiryForm.jsx';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const EnquirySection = () => {
  return (
    <section id="admissions" className="bg-mis-soft/60 py-16 sm:py-24 border-y border-slate-200/60">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-mis-blue-dark text-xs font-bold uppercase tracking-wider mb-3 border border-mis-blue/15 shadow-sm">
                <Sparkles size={14} className="text-mis-gold" />
                Admission Open AY 2026–27
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-mis-navy tracking-tight leading-tight">
                Nursery to 8th Grade
              </h2>
            </div>

            <p className="text-sm sm:text-base text-mis-muted leading-relaxed">
              Begin your child’s journey with a school that balances academic excellence, values, and personal growth in a calm and inspiring environment.
            </p>

            <div className="card-surface p-6 bg-white border border-slate-200/80 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-mis-navy">Why families connect with us</p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-mis-gold shrink-0 mt-0.5" />
                  <span>Calm, nature-rich campus environment</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-mis-gold shrink-0 mt-0.5" />
                  <span>Balanced academic and co-curricular learning</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-mis-gold shrink-0 mt-0.5" />
                  <span>Student-focused support and guided growth</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm
              title="Send an Enquiry"
              description="Share a few details and our team will reach out with the right guidance and next steps."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquirySection;
