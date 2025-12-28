import React from 'react';

// Reusing the Organic Card base style for the skeleton container to ensure layout match
const SkeletonCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md border border-white/50 dark:border-white/5 bg-white/60 dark:bg-stone-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden ${className}`}>
    {children}
  </div>
);

export function DashboardSkeleton() {
  return (
    // 1. BACKGROUND: Warm bone (Light) / Deep Stone (Dark)
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 p-4 md:p-8 font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Blobs (Static for skeleton) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            {/* Tag bone */}
            <div className="h-6 w-32 bg-stone-300 dark:bg-stone-800 rounded-full mb-3 opacity-50"></div>
            {/* Title bone */}
            <div className="h-10 w-64 bg-stone-300 dark:bg-stone-700 rounded-lg mb-2"></div>
            {/* Subtitle bone */}
            <div className="h-4 w-48 bg-stone-200 dark:bg-stone-800 rounded"></div>
          </div>
          {/* Action Button bone */}
          <div className="h-12 w-full sm:w-40 bg-stone-300 dark:bg-stone-800 rounded-full"></div>
        </div>

        {/* Stats Cards Skeleton - "Floating Pebbles" */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} className="h-32">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                   {/* Title */}
                   <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded"></div>
                   {/* Icon */}
                   <div className="h-4 w-4 bg-stone-200 dark:bg-stone-800 rounded"></div>
                </div>
                {/* Value */}
                <div className="h-9 w-16 bg-stone-300 dark:bg-stone-700 rounded-lg mb-2"></div>
                {/* Subtext */}
                <div className="h-3 w-32 bg-stone-200 dark:bg-stone-800 rounded"></div>
              </div>
            </SkeletonCard>
          ))}
        </div>

        {/* Model List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i}>
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
                  
                  {/* Left Side: Icon + Titles */}
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    {/* Status Icon Bone */}
                    <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 shrink-0"></div>
                    <div className="space-y-2">
                      {/* Name Bone */}
                      <div className="h-5 w-40 bg-stone-300 dark:bg-stone-700 rounded"></div>
                      {/* Provider Bone */}
                      <div className="h-3 w-24 bg-stone-200 dark:bg-stone-800 rounded"></div>
                    </div>
                  </div>

                  {/* Right Side: Metrics & Actions */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 w-full md:w-auto">
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:gap-12 w-full md:w-auto">
                      {/* Latency */}
                      <div className="flex flex-col items-start md:items-center w-24 space-y-2">
                        <div className="h-6 w-16 bg-stone-300 dark:bg-stone-700 rounded"></div>
                        <div className="h-3 w-10 bg-stone-200 dark:bg-stone-800 rounded"></div>
                      </div>

                      {/* Requests */}
                      <div className="flex flex-col items-start md:items-center w-24 space-y-2">
                        <div className="h-6 w-12 bg-stone-300 dark:bg-stone-700 rounded"></div>
                        <div className="h-3 w-12 bg-stone-200 dark:bg-stone-800 rounded"></div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t border-stone-100 dark:border-stone-800 pt-4 md:pt-0 mt-2 md:mt-0">
                        {/* Status Badge */}
                        <div className="h-7 w-20 bg-stone-200 dark:bg-stone-800 rounded-full"></div>

                        {/* Buttons */}
                        <div className="flex space-x-2">
                          <div className="h-9 w-20 bg-stone-200 dark:bg-stone-800 rounded-full"></div>
                          <div className="h-9 w-16 bg-stone-300 dark:bg-stone-700 rounded-full"></div>
                        </div>
                    </div>

                  </div>
                </div>

                {/* Footer Divider Bone */}
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800/50 flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-stone-300 dark:bg-stone-700"></div>
                   <div className="h-3 w-32 bg-stone-200 dark:bg-stone-800 rounded"></div>
                </div>
              </div>
            </SkeletonCard>
          ))}
        </div>

      </div>
    </div>
  );
}