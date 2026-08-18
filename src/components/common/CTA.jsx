import { ArrowRight } from 'lucide-react';

const CTA = ({ title, description, buttonLabel = 'Get Started', href = '/admissions' }) => {
  return (
    <section className="bg-[#123b5d] py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold">{title}</h2>
          <p className="mt-3 text-lg leading-8 text-slate-200">{description}</p>
        </div>
        <a href={href} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-primary transition hover:bg-slate-100">
          {buttonLabel} <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
};

export default CTA;
