export function AdminContentSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="h-7 w-40 rounded-lg bg-hope-midnight/10 motion-reduce:animate-none animate-pulse" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2, 3].map((row) => (
          <div
            key={row}
            className="flex items-center gap-3 rounded-2xl border border-hope-midnight/10 p-4"
          >
            <div className="size-4 rounded bg-hope-midnight/10 motion-reduce:animate-none animate-pulse" />
            <div className="flex-1">
              <div
                className="h-3.5 rounded bg-hope-midnight/10 motion-reduce:animate-none animate-pulse"
                style={{ width: `${58 + row * 9}%` }}
              />
              <div
                className="mt-2 h-3 w-2/5 rounded bg-hope-midnight/5 motion-reduce:animate-none animate-pulse"
              />
            </div>
            <div className="hidden size-11 rounded-lg bg-hope-midnight/5 motion-reduce:animate-none animate-pulse sm:block" />
            <div className="size-11 rounded-lg bg-hope-midnight/5 motion-reduce:animate-none animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
