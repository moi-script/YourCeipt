import React, { useState, useRef } from "react";
import { ScanLine, Loader2, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroScannerDemo = () => {
  const [scanState, setScanState] = useState('idle'); // idle, uploading, processing, complete, error
  const [demoData, setDemoData] = useState(null);
  const fileInputRef = useRef(null);

  // Trigger hidden file input
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Start UI Animation
    setScanState('uploading');

    const formData = new FormData();
    formData.append("myImages", file); // Ensure this matches your multer config

    try {
      // 2. Simulate "Upload" delay for realism
      setTimeout(() => setScanState('processing'), 1500);

      // 3. Hit the Mock Endpoint
      const response = await fetch("http://localhost:3000/extract/mockazure", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.code === 200) {
         // 4. Show Result after a slight "AI Thinking" delay
         setTimeout(() => {
             setDemoData(data.contents);
             setScanState('complete');
         }, 2500); 
      } else {
         setScanState('error');
      }

    } catch (err) {
      console.error(err);
      setScanState('error');
    }
  };

  const reset = () => {
    setScanState('idle');
    setDemoData(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="relative group w-full max-w-sm mx-auto mt-8 sm:mt-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:border-emerald-500/30">
        
        {/* Hidden Input */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
        />

        {/* Header */}
        <div className="bg-stone-50 dark:bg-stone-950/50 border-b border-stone-100 dark:border-stone-800 p-3 flex items-center justify-between">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                {scanState === 'idle' ? 'AI Ready' : 'AI Active'}
            </span>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[260px] flex flex-col items-center justify-center text-center relative">
            
            {/* STATE: IDLE */}
            {scanState === 'idle' && (
                <div className="animate-in fade-in zoom-in duration-300 w-full">
                    <div 
                        onClick={handleBoxClick}
                        className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-dashed border-emerald-200 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform cursor-pointer"
                    >
                        <UploadCloud className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Try the Demo</p>
                    <p className="text-xs text-stone-500 mb-6 max-w-[200px] mx-auto">Upload any receipt image to see our AI extraction in real-time.</p>
                    <Button size="sm" onClick={handleBoxClick} className="rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors">
                        Upload Receipt
                    </Button>
                </div>
            )}

            {/* STATE: UPLOADING / PROCESSING */}
            {(scanState === 'uploading' || scanState === 'processing') && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-stone-900/95 z-10 p-6">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin relative z-10" />
                    </div>
                    
                    <div className="space-y-2 w-full max-w-[200px]">
                        <p className="text-sm font-bold text-stone-800 dark:text-stone-200 animate-pulse">
                            {scanState === 'uploading' ? 'Uploading Image...' : 'analyzing_receipt.json'}
                        </p>
                        
                        {/* Fake Progress Steps */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-[10px] text-stone-500">
                                <CheckCircle2 className={`w-3 h-3 ${scanState === 'processing' ? 'text-emerald-500' : 'text-stone-300'}`} />
                                <span>Image Recognition</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-stone-500">
                                <CheckCircle2 className={`w-3 h-3 ${scanState === 'processing' ? 'text-emerald-500' : 'text-stone-300'}`} />
                                <span>Extracting Merchant</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-stone-500">
                                <Loader2 className={`w-3 h-3 animate-spin ${scanState === 'processing' ? 'text-emerald-500' : 'text-transparent'}`} />
                                <span>Calculating Totals</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STATE: COMPLETE */}
            {scanState === 'complete' && demoData && (
                <div className="w-full text-left animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Extraction Complete
                        </span>
                        <button onClick={reset} className="text-[10px] text-stone-400 hover:text-stone-600 underline">Try Another</button>
                    </div>

                    <div className="space-y-0 relative">
                         {/* Receipt Paper Effect */}
                         <div className="absolute -left-3 -right-3 top-0 bottom-0 bg-stone-50 dark:bg-stone-800/50 -z-10 rounded-xl border border-stone-100 dark:border-stone-800" />
                         
                         <div className="flex justify-between items-start border-b border-dashed border-stone-300 dark:border-stone-700 pb-3 mb-3">
                            <div>
                                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Merchant</p>
                                <p className="font-serif font-bold text-lg text-stone-800 dark:text-stone-100 leading-none mt-1">
                                    {demoData.store || "Unknown Store"}
                                </p>
                                <p className="text-[10px] text-stone-400 mt-1">{demoData.address?.city || "Location detected"}</p>
                            </div>
                            {demoData.metadata?.image_source && (
                                <img src={demoData.metadata.image_source} alt="Mini preview" className="w-10 h-10 object-cover rounded-md border border-stone-200" />
                            )}
                         </div>

                         <div className="space-y-2 mb-3">
                             {demoData.items?.slice(0, 2).map((item, i) => (
                                 <div key={i} className="flex justify-between text-xs">
                                     <span className="text-stone-600 dark:text-stone-300">{item.description}</span>
                                     <span className="font-mono text-stone-500">${item.price}</span>
                                 </div>
                             ))}
                             {demoData.items?.length > 2 && <p className="text-[10px] text-stone-400 italic">...and {demoData.items.length - 2} more items</p>}
                         </div>

                         <div className="flex justify-between items-center pt-2 border-t border-dashed border-stone-300 dark:border-stone-700">
                            <span className="text-sm font-bold text-stone-500">Total</span>
                            <span className="font-bold text-xl text-emerald-600">${demoData.total}</span>
                         </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                        <p className="text-[9px] text-stone-400">
                            *This data is temporary and will auto-delete in 1 minute.
                        </p>
                    </div>
                </div>
            )}
             
            {/* STATE: ERROR */}
            {scanState === 'error' && (
                 <div className="text-center animate-in zoom-in">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                    <p className="text-stone-800 dark:text-stone-200 font-bold">Extraction Failed</p>
                    <p className="text-stone-500 text-xs mt-1 mb-4">The mock server timed out.</p>
                    <Button size="sm" variant="outline" onClick={reset}>Try Again</Button>
                 </div>
            )}
        </div>
    </div>
  );
}

export default HeroScannerDemo;