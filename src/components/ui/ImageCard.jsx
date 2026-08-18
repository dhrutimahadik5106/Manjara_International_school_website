import { ArrowRight } from 'lucide-react';

const ImageCard = ({ image, title, description, cta, href = '#' }) => {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_40px_-24px_rgba(18,59,93,0.28)]">
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        <a href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
          {cta} <ArrowRight size={16} />
        </a>
      </div>
    </article>
  );
};

export default ImageCard;
