const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
      <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
      <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
      <div className="h-36 animate-pulse rounded-[1.75rem] bg-slate-200" />
    </div>
  );
};

export default LoadingSkeleton;
