export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center bg-nb-bg">
      <div className="border-[3px] border-black shadow-[6px_6px_0px_0px_#000] bg-nb-yellow px-8 py-4">
        <p className="font-display font-black text-black text-lg tracking-tight animate-pulse">
          Loading…
        </p>
      </div>
    </div>
  )
}
