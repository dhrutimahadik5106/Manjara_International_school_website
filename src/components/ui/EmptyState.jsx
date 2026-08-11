const EmptyState = ({ title, description }) => {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
};

export default EmptyState;
