import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Play } from "lucide-react";

export function DemoModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border border-stone-800 shadow-2xl sm:rounded-xl">
        <div className="relative aspect-video bg-stone-950 flex items-center justify-center group">
          
          {/* Close Button Override */}
          <button 
            onClick={() => onClose(false)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* REPLACE THIS WITH YOUR VIDEO SOURCE */}
          {/* Example: Local video or YouTube Embed */}
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&rel=0&modestbranding=1" 
            title="Recepta Demo" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="w-full h-full"
          ></iframe>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}