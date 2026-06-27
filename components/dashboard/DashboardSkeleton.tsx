"use client";
import { motion } from "framer-motion";

function Bone({ className }: { className: string }) {
  return <div className={`bg-slate-800/60 rounded animate-pulse ${className}`} />;
}

export default function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Company Overview Skeleton */}
      <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-slate-700">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <Bone className="h-5 w-28 rounded-full" />
              <Bone className="h-5 w-16 rounded-full" />
              <Bone className="h-5 w-24 rounded-full" />
            </div>
            <Bone className="h-10 w-64" />
            <div className="space-y-2">
              <Bone className="h-3.5 w-full" />
              <Bone className="h-3.5 w-5/6" />
              <Bone className="h-3.5 w-3/4" />
            </div>
          </div>
          <Bone className="w-44 h-40 rounded-xl flex-shrink-0" />
        </div>
      </div>

      {/* Score + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Bone className="h-72 rounded-xl" />
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-slate-800/60 space-y-4">
          <Bone className="h-4 w-36" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => <Bone key={i} className="h-20 rounded-xl" />)}
          </div>
        </div>
      </div>

      {/* Strengths + Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((col) => (
          <div key={col} className="glass-card rounded-xl p-5 border border-slate-800/50 space-y-3">
            <Bone className="h-4 w-40" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Bone className="h-5 w-5 rounded-full flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <Bone className="h-3 w-full" />
                  <Bone className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* News */}
      <div className="glass-card rounded-xl p-5 border border-slate-800/60 space-y-4">
        <Bone className="h-4 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-slate-800/50 rounded-lg p-4 space-y-2.5">
              <Bone className="h-4 w-16 rounded-full" />
              <Bone className="h-3.5 w-full" />
              <Bone className="h-3.5 w-4/5" />
              <div className="space-y-1.5">
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning */}
      <div className="glass-card rounded-xl p-5 border border-slate-800/60 space-y-3">
        <Bone className="h-4 w-64" />
        {Array.from({ length: 7 }).map((_, i) => (
          <Bone key={i} className={`h-3.5 ${i === 6 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </motion.div>
  );
}
