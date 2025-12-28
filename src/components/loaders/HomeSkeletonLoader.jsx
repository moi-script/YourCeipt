import React from 'react';

// --- CUSTOM SKELETON PRIMITIVES ---

// The container card matching the "Organic" look
const SkeletonCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md border border-white/50 dark:border-white/5 bg-white/60 dark:bg-stone-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden ${className}`}>
    {children}
  </div>
);

// The actual "bone" component
const Skeleton = ({ className = "", variant = "default" }) => {
  const baseClasses = "animate-pulse bg-stone-200 dark:bg-stone-800";
  const variants = {
    default: "h-4 rounded-full",
    text: "h-3 w-3/4 rounded-full",
    title: "h-8 w-1/2 rounded-lg",
    circle: "rounded-full",
    button: "h-10 w-24 rounded-full"
  };
  
  // If variant is not in keys, assumes className handles width/height/rounding
  const variantClass = variants[variant] || "";
  
  return <div className={`${baseClasses} ${variantClass} ${className}`} />;
};

export default function TransactionDashboardSkeleton() {
  return (
    // 1. BACKGROUND: Warm bone (Light) / Deep Stone (Dark)
    <main className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden font-sans p-4 sm:p-6 transition-colors duration-300">
      
      {/* Decorative Blobs (Static) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="w-32 h-6" /> {/* Tag */}
            <Skeleton className="w-64 h-12 rounded-xl" /> {/* H1 Title */}
            <Skeleton className="w-48 h-4" /> {/* Subtitle */}
          </div>
          <Skeleton variant="button" className="w-full sm:w-32" />
        </div>
        
        {/* Stats Grid - "Floating Pebbles" */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} className="hover:bg-white/80 dark:hover:bg-stone-800/60 transition-colors">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="w-20 h-3" /> {/* Label */}
                    <Skeleton className="w-32 h-8 rounded-lg" /> {/* Value */}
                    <Skeleton className="w-16 h-4" /> {/* Badge */}
                  </div>
                  <Skeleton className="w-12 h-12 rounded-2xl" /> {/* Icon Box */}
                </div>
              </div>
            </SkeletonCard>
          ))}
        </div>

        {/* Tabs Navigation Skeleton */}
        <div className="w-full">
          <div className="bg-white/40 dark:bg-stone-900/40 border border-white/50 dark:border-white/5 backdrop-blur-md p-1.5 rounded-full inline-flex gap-2 mb-6">
            <Skeleton className="w-24 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/20" />
            <Skeleton className="w-24 h-9 rounded-full bg-transparent border border-stone-200 dark:border-stone-800" />
            <Skeleton className="w-24 h-9 rounded-full bg-transparent border border-stone-200 dark:border-stone-800" />
          </div>

          {/* Transactions List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="space-y-2">
                 <Skeleton className="w-40 h-8" />
                 <Skeleton className="w-60 h-4" />
               </div>
               <Skeleton variant="button" className="w-10 h-10 rounded-full" /> {/* Add Button Circle */}
            </div>

            {/* Grid of Transaction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} className="flex flex-col">
                  {/* Image/Map Placeholder */}
                  <div className="h-32 w-full bg-stone-200 dark:bg-stone-800/50 p-2">
                     <Skeleton className="w-full h-full rounded-[1.5rem] bg-stone-300 dark:bg-stone-800" />
                  </div>
                  
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    {/* Title & Date */}
                    <div className="space-y-2">
                      <Skeleton className="w-3/4 h-5" />
                      <Skeleton className="w-1/2 h-3" />
                    </div>
                    
                    {/* Tags */}
                    <div className="flex gap-2">
                      <Skeleton className="w-16 h-5 rounded-md" />
                      <Skeleton className="w-16 h-5 rounded-md" />
                    </div>
                    
                    <div className="h-px w-full bg-stone-100 dark:bg-stone-800 my-1" />
                    
                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-auto">
                       <Skeleton className="w-8 h-8 rounded-full" />
                       <div className="flex gap-2">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <Skeleton className="w-8 h-8 rounded-full" />
                       </div>
                    </div>
                  </div>
                </SkeletonCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}