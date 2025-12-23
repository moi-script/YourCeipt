import React from 'react';
import videoPath from '../../assets/vidAnimated.mp4';

export default function VideoLoader() {
  return (
    // Background: Pure White
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        
        {/* Container: White with a subtle shadow for separation */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8">
          
          <video
            className="w-full h-auto rounded-2xl"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="mt-6 text-center">
            {/* Text: Dark grey/Black for high contrast against the white */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Loading...
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Please wait while we prepare your content
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}