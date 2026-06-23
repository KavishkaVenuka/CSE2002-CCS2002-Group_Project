'use client';

interface SkeletonBlockProps {
  width?: string;
  height?: string;
}

const SkeletonBlock = ({ width = 'w-full', height = 'h-4' }: SkeletonBlockProps) => (
  <div className={`${width} ${height} bg-[#d4ede9] border-[2px] border-black shimmer rounded-none`}></div>
);

const HeaderSkeleton = () => (
  <div className="flex items-center justify-between p-8 bg-white border-b-[2px] border-black rounded-none">
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
      <div className="space-y-2">
        <SkeletonBlock width="w-48" height="h-6" />
        <SkeletonBlock width="w-32" height="h-4" />
      </div>
    </div>
  </div>
);

const StatCardSkeleton = ({ color }: { color: string }) => (
  <div className={`${color} border-[3px] border-black p-6 flex items-center gap-5 rounded-none`}>
    <div className="w-12 h-12 bg-white border-[2px] border-black flex items-center justify-center rounded-none">
      <div className="w-6 h-6 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
    </div>
    <div className="flex-1 space-y-2">
      <SkeletonBlock width="w-24" height="h-3" />
      <SkeletonBlock width="w-16" height="h-8" />
    </div>
  </div>
);

const RequestTableRowSkeleton = () => (
  <div className="grid grid-cols-[1fr_120px_150px_1fr_60px] gap-4 px-6 py-6 items-start bg-white rounded-none border-b-[2px] border-black last:border-b-0">
    <SkeletonBlock height="h-12" />
    <SkeletonBlock height="h-12" />
    <SkeletonBlock height="h-12" />
    <SkeletonBlock height="h-12" />
    <div className="flex justify-end pt-2">
      <SkeletonBlock width="w-8" height="h-8" />
    </div>
  </div>
);

export default function SendRequirementsLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#fdfcfb]">
      <HeaderSkeleton />

      <main className="flex-1 overflow-auto p-8 space-y-10">
        {/* ── PREMIUM HEADER BANNER SKELETON ─────────────────────────────── */}
        <div className="bg-black border-[4px] border-black p-10 relative overflow-hidden rounded-none">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
              <div className="w-32 h-6 bg-[#A5E6DC] border-[2px] border-black shimmer rounded-none"></div>
              <SkeletonBlock width="w-96" height="h-12" />
              <SkeletonBlock width="w-[32rem] max-w-full" height="h-4" />
              <SkeletonBlock width="w-[28rem] max-w-full" height="h-4" />
            </div>
            <div className="p-6 bg-white/5 border-[2px] border-white/10 flex flex-col items-center justify-center min-w-[160px] rounded-none space-y-2">
              <div className="w-20 h-3 bg-[#A5E6DC] border-[2px] border-black shimmer rounded-none"></div>
              <div className="w-24 h-10 bg-[#A5E6DC] border-[2px] border-black shimmer rounded-none"></div>
            </div>
          </div>
        </div>

        {/* ── STATS ROW SKELETON ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton color="bg-nb-cyan" />
          <StatCardSkeleton color="bg-nb-green" />
          <StatCardSkeleton color="bg-nb-yellow" />
          <StatCardSkeleton color="bg-nb-red" />
        </div>

        {/* ── NEW REQUEST SECTION SKELETON ──────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black border-[2px] border-black rounded-none"></div>
              <SkeletonBlock width="w-48" height="h-8" />
            </div>
            <div className="w-40 h-12 bg-white border-[3px] border-black rounded-none"></div>
          </div>

          <div className="bg-white border-[4px] border-black overflow-hidden rounded-none">
            <div className="grid grid-cols-[1fr_120px_150px_1fr_60px] gap-4 px-6 py-4 bg-black border-b-[2px] border-black text-white">
              <div className="w-32 h-4 bg-white/20 border-[2px] border-black shimmer rounded-none"></div>
              <div className="w-20 h-4 bg-white/20 border-[2px] border-black shimmer rounded-none"></div>
              <div className="w-24 h-4 bg-white/20 border-[2px] border-black shimmer rounded-none"></div>
              <div className="w-32 h-4 bg-white/20 border-[2px] border-black shimmer rounded-none"></div>
              <div className="w-12 h-4 bg-white/20 border-[2px] border-black shimmer rounded-none ml-auto"></div>
            </div>

            <div className="divide-y-[2px] divide-black">
              {[1, 2].map((i) => (
                <RequestTableRowSkeleton key={i} />
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t-[2px] border-black flex flex-col sm:flex-row items-center justify-between gap-4 rounded-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                <div className="space-y-2">
                  <SkeletonBlock width="w-32" height="h-4" />
                  <SkeletonBlock width="w-48" height="h-3" />
                </div>
              </div>
              <div className="w-32 h-10 bg-white border-[2px] border-black rounded-none"></div>
            </div>
          </div>
        </div>

        {/* ── DISPATCH FOOTER SKELETON ─────────────────────────────────── */}
        <div className="bg-nb-cyan border-[4px] border-black p-8 flex flex-col md:flex-row justify-between items-center gap-6 rounded-none">
          <div className="space-y-3">
            <SkeletonBlock width="w-64" height="h-8" />
            <SkeletonBlock width="w-96" height="h-4" />
          </div>
          <div className="w-64 h-14 bg-black border-[2px] border-black rounded-none"></div>
        </div>

        {/* ── ACTIVITY LOG SKELETON ────────────────────────────────────── */}
        <div className="bg-white border-[4px] border-black overflow-hidden rounded-none">
          <div className="p-6 bg-white border-b-[2px] border-black flex items-center gap-3">
            <div className="w-6 h-6 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
            <SkeletonBlock width="w-40" height="h-6" />
            <div className="ml-2 w-20 h-5 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-[150px_1fr_150px_100px_80px] gap-4 px-6 py-4 bg-gray-100 border-b-[2px] border-black min-w-[700px]">
              <div className="w-24 h-4 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
              <div className="w-32 h-4 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
              <div className="w-24 h-4 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
              <div className="w-16 h-4 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none ml-auto"></div>
              <div className="w-12 h-4 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none ml-auto"></div>
            </div>

            <div className="divide-y-[2px] divide-black bg-white min-w-[700px]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="grid grid-cols-[150px_1fr_150px_100px_80px] gap-4 px-6 py-4 items-center">
                  <SkeletonBlock width="w-28" height="h-4" />
                  <SkeletonBlock width="w-48" height="h-4" />
                  <SkeletonBlock width="w-24" height="h-6" />
                  <div className="flex justify-end">
                    <SkeletonBlock width="w-8" height="h-4" />
                  </div>
                  <div className="flex justify-end">
                    <SkeletonBlock width="w-8" height="h-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -600px 0;
          }
          100% {
            background-position: 600px 0;
          }
        }

        .shimmer {
          background-image: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 600px 100%;
          animation: shimmer 1.5s infinite linear;
          background-position: -600px 0;
        }
      `}</style>
    </div>
  );
}
