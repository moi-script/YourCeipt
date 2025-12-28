import React from 'react';
import videoPath from '../../assets/vidAnimated.mp4';

export default function VideoLoader() {
  return (
    // 1. BACKGROUND: Warm bone (Light) / Deep Stone (Dark)
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Container: Organic Glass Card */}
        <div className="backdrop-blur-md border border-white/50 dark:border-white/5 bg-white/60 dark:bg-stone-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden p-8 text-center transition-all duration-300">
          
          {/* Video Container with rounded corners to match organic theme */}
          <div className="rounded-[1.5rem] overflow-hidden shadow-sm mb-8 border border-white/20 dark:border-white/5">
            <video
              className="w-full h-auto block"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={videoPath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="space-y-2">
            {/* Typography: Serif Italic for Heading */}
            <h2 className="text-3xl font-serif italic text-stone-800 dark:text-stone-100 tracking-tight">
              Loading...
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-lg">
              Please wait while we prepare your content
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}