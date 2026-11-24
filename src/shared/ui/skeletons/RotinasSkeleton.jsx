import React from 'react';
import { Skeleton } from '../Skeleton.jsx';

export function RotinasSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-52 h-8 rounded-lg" />
          <Skeleton variant="text" className="w-80 max-w-full h-4 rounded-md" />
        </div>
        <Skeleton variant="rectangular" className="w-48 h-10 rounded-xl" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="bg-yby-surface p-5 rounded-2xl border border-yby-border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton variant="rectangular" className="w-full h-11 rounded-xl" />
          <Skeleton variant="rectangular" className="w-full h-11 rounded-xl" />
          <Skeleton variant="rectangular" className="w-full h-11 rounded-xl" />
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-yby-border/60">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <Skeleton key={d} variant="rectangular" className="w-12 h-7 rounded-full" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-yby-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div className="p-4 border-b border-yby-border/60 bg-yby-surface/40 flex items-center justify-between">
              <Skeleton variant="text" className="w-40 h-4" />
              <Skeleton variant="text" className="w-24 h-4" />
            </div>
            <div className="divide-y divide-yby-border/40">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between gap-4">
                  <Skeleton variant="text" className="w-28 h-4" />
                  <Skeleton variant="text" className="w-36 h-4" />
                  <div className="space-y-1.5">
                    <Skeleton variant="text" className="w-36 h-4" />
                    <Skeleton variant="text" className="w-44 h-3" />
                  </div>
                  <Skeleton variant="rectangular" className="w-24 h-6 rounded-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" className="w-8 h-8" />
                    <Skeleton variant="circular" className="w-8 h-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
