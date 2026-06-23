'use client';

export default function CustomerDashboardLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-8 bg-white border-b-4 border-black shadow-nb">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-[#d4ede9] border-2 border-black shimmer"></div>
          <div>
            <div className="h-6 w-48 bg-[#d4ede9] border-2 border-black shimmer mb-2"></div>
            <div className="h-4 w-32 bg-[#d4ede9] border-2 border-black shimmer"></div>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS SKELETON ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { color: "bg-nb-cyan" },
            { color: "bg-nb-yellow" },
            { color: "bg-nb-green" },
            { color: "bg-nb-orange" }
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} border-[3px] border-black shadow-nb p-6 flex flex-col gap-6`}>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-white border-2 border-black shimmer"></div>
                <div className="h-5 w-10 bg-white border-2 border-black shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-black/20 border-2 border-black shimmer"></div>
                <div className="h-8 w-32 bg-black/20 border-2 border-black shimmer"></div>
              </div>
              <div className="h-6 w-full bg-black/10 border-t-2 border-black pt-2 shimmer"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN (2/3) ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Payments Table Skeleton */}
            <div className="bg-white border-[4px] border-black shadow-nb overflow-hidden">
              <div className="p-6 bg-white border-b-[2px] border-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#d4ede9] border-2 border-black shimmer"></div>
                  <div className="h-5 w-40 bg-[#d4ede9] border-2 border-black shimmer"></div>
                </div>
                <div className="h-4 w-28 bg-[#d4ede9] border-2 border-black shimmer"></div>
              </div>

              <div className="overflow-x-auto">
                <div className="grid grid-cols-[120px_1fr_120px_120px_100px] gap-4 px-6 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[600px]">
                  <div>Bill ID</div>
                  <div>Order Ref</div>
                  <div>Amount</div>
                  <div>Due Date</div>
                  <div className="text-right">Status</div>
                </div>

                <div className="divide-y-[2px] divide-black bg-white min-w-[600px]">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="grid grid-cols-[120px_1fr_120px_120px_100px] gap-4 items-center px-6 py-4">
                      <div className="h-4 w-20 bg-[#d4ede9] border-2 border-black shimmer"></div>
                      <div className="h-4 w-32 bg-[#d4ede9] border-2 border-black shimmer"></div>
                      <div className="h-4 w-16 bg-[#d4ede9] border-2 border-black shimmer"></div>
                      <div className="h-4 w-20 bg-[#d4ede9] border-2 border-black shimmer"></div>
                      <div className="h-6 w-16 bg-[#d4ede9] border-2 border-black shimmer ml-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Quotations Skeleton */}
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="h-7 w-48 bg-[#d4ede9] border-2 border-black shimmer"></div>
                <div className="h-4 w-24 bg-[#d4ede9] border-2 border-black shimmer"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white border-[3px] border-black shadow-nb p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <div className="h-3 w-28 bg-[#d4ede9] border-2 border-black shimmer"></div>
                        <div className="h-6 w-36 bg-[#d4ede9] border-2 border-black shimmer"></div>
                        <div className="h-3 w-16 bg-[#d4ede9] border-2 border-black shimmer mt-1"></div>
                      </div>
                      <div className="h-6 w-16 bg-[#d4ede9] border-2 border-black shimmer"></div>
                    </div>
                    <div className="flex justify-between items-center pt-5 border-t-[3px] border-black border-dashed">
                      <div className="space-y-2">
                        <div className="h-3 w-20 bg-[#d4ede9] border-2 border-black shimmer"></div>
                        <div className="h-7 w-24 bg-[#d4ede9] border-2 border-black shimmer"></div>
                      </div>
                      <div className="w-10 h-10 bg-black border-2 border-black shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN (1/3) ────────────────────────── */}
          <div className="space-y-8">
            {/* Recent Activity Skeleton */}
            <div className="bg-white border-[4px] border-black shadow-nb overflow-hidden">
              <div className="p-6 bg-white border-b-[2px] border-black flex items-center gap-3">
                <div className="w-5 h-5 bg-[#d4ede9] border-2 border-black shimmer"></div>
                <div className="h-5 w-40 bg-[#d4ede9] border-2 border-black shimmer"></div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 border-[2px] border-black bg-white">
                    <div className="w-10 h-10 border-[2px] border-black bg-[#d4ede9] shimmer"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-[#d4ede9] border-2 border-black shimmer"></div>
                      <div className="h-3 w-20 bg-[#d4ede9] border-2 border-black shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help/Support Box Skeleton */}
            <div className="p-6 bg-nb-cyan border-[3px] border-black shadow-nb flex flex-col gap-4">
              <div className="w-12 h-12 bg-white border-[2px] border-black shimmer"></div>
              <div className="h-6 w-32 bg-[#d4ede9] border-2 border-black shimmer"></div>
              <div className="h-4 w-full bg-[#d4ede9] border-2 border-black shimmer"></div>
              <div className="h-10 w-full bg-black border-2 border-black shimmer"></div>
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
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
          background-position: -600px 0;
        }
      `}</style>
    </div>
  )
}
