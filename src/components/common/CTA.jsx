
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTA = ({
  title,
  description,
  buttonLabel = 'Get Started',
  href = '/admissions'
}) => {
  return (
    <section className="bg-[#123b5d] py-16 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

        {/* CTA TEXT */}
        <div className="max-w-2xl">

          {/* HEADING - FIXED WHITE TEXT */}
          <h2 className="text-3xl font-extrabold tracking-tight !text-white sm:text-4xl">
            {title}
          </h2>

          {/* DESCRIPTION */}
          <p className="mt-4 text-base leading-relaxed !text-slate-200 sm:text-lg">
            {description}
          </p>

        </div>

        {/* CTA BUTTON */}
        <Link
          to={href}
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#123b5d] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-lg lg:self-auto"
        >
          {buttonLabel}
          <ArrowRight size={18} />
        </Link>

      </div>
    </section>
  );
};

export default CTA;
