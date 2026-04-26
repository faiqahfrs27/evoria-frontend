function EventCardSkeleton() {
  return (
    <div className="evoria-card animate-pulse overflow-hidden rounded-[1.1rem]">
      <div className="h-44 bg-[rgba(249,243,232,0.06)]" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-3/4 rounded-full bg-[rgba(249,243,232,0.08)]" />
        <div className="h-3 w-1/2 rounded-full bg-[rgba(249,243,232,0.06)]" />
        <div className="h-px w-full bg-[rgba(212,169,74,0.12)]" />
        <div className="h-4 w-1/3 rounded-full bg-[rgba(249,243,232,0.08)]" />
      </div>
    </div>
  );
}

export default EventCardSkeleton;
