import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { 
  Leaf, ArrowRight, ScanLine, PieChart, Brain, CheckCircle2, Sparkles, Sun, Moon, Check, X, Zap,
  Loader2, ChevronUp, MapPin, ShoppingBag, 
  Wallet, ArrowUpRight, ArrowDownRight, Shield, Globe, FileJson, Utensils, Car, Lightbulb
} from "lucide-react";

import { Button } from "@/components/ui/button"; 
import { AuthModal } from "./AuthModal"; 
import { DemoModal } from "@/components/DemoModal";
import { Link } from "react-router-dom";

const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    
    const currentElement = domRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return [domRef, isVisible];
};

// --- ANIMATED WRAPPER COMPONENT ---
const ScrollReveal = ({ children, className = "" }) => {
  const [ref, isVisible] = useScrollAnimation();
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// --- MOCK DATA ENGINE ---
const MOCK_RECEIPTS = [
    {
        store: "Starbucks Coffee",
        address: { city: "Makati", street: "Ayala Ave" },
        items: [
            { description: "Caramel Macchiato", price: 180, quantity: 1, category: "Food" },
            { description: "Bagel w/ Cream Cheese", price: 120, quantity: 1, category: "Food" }
        ],
        subtotal: 300,
        total: 300,
        metadata: { type: "expense", currency: "PHP" }
    },
    {
        store: "7-Eleven",
        address: { city: "Taguig", street: "BGC High Street" },
        items: [
            { description: "Gulp Soft Drink", price: 45, quantity: 1, category: "Food" },
            { description: "Umbrella", price: 150, quantity: 1, category: "Shopping" }
        ],
        subtotal: 195,
        total: 195,
        metadata: { type: "expense", currency: "PHP" }
    },
    {
        store: "Mercury Drug",
        address: { city: "Quezon City", street: "Tomas Morato" },
        items: [
            { description: "Biogesic 500mg (10pcs)", price: 80, quantity: 1, category: "Healthcare" },
            { description: "Alcohol 70%", price: 55, quantity: 1, category: "Healthcare" }
        ],
        subtotal: 135,
        total: 135,
        metadata: { type: "expense", currency: "PHP" }
    }
];

// --- ANIMATED CHART COMPONENT ---
const SmoothLineChart = ({ data, labels }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  
  // --- CONFIGURATION ---
  const width = 600; 
  const height = 250; 
  const margin = { top: 20, right: 10, bottom: 30, left: 40 };
  
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const maxVal = Math.max(...data) * 1.2; 

  const points = data.map((val, i) => {
    const x = margin.left + (i / (data.length - 1)) * chartWidth;
    const y = margin.top + chartHeight - (val / maxVal) * chartHeight;
    return [x, y];
  });

  const getPath = (points, isClosed = false) => {
    if (points.length === 0) return "";
    const line = (pointA, pointB) => {
      const lengthX = pointB[0] - pointA[0];
      const lengthY = pointB[1] - pointA[1];
      return { length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)), angle: Math.atan2(lengthY, lengthX) };
    };
    const controlPoint = (current, previous, next, reverse) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.15;
      const o = line(p, n);
      const angle = o.angle + (reverse ? Math.PI : 0);
      const length = o.length * smoothing;
      const x = current[0] + Math.cos(angle) * length;
      const y = current[1] + Math.sin(angle) * length;
      return [x, y];
    };
    const d = points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point[0]},${point[1]}`;
      const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
      const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
      return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
    }, "");
    if (isClosed) return `${d} L ${width},${height - margin.bottom} L ${margin.left},${height - margin.bottom} Z`;
    return d;
  };

  const linePath = getPath(points);
  const areaPath = getPath(points, true);
  const yTicks = [0, maxVal / 2, maxVal].map(val => ({ val: Math.round(val), y: margin.top + chartHeight - (val / maxVal) * chartHeight }));

  return (
    <div className="relative w-full h-full select-none group" onMouseLeave={() => setHoveredIndex(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <clipPath id="chart-clip">
             <rect x="0" y="0" width={isLoaded ? width : 0} height={height} className="transition-all duration-[1500ms] ease-out" />
          </clipPath>
        </defs>

        {/* Grid Lines */}
        {yTicks.map((tick, i) => (
          <g key={i} className="opacity-50">
            <line x1={margin.left} y1={tick.y} x2={width - margin.right} y2={tick.y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" className="text-stone-400 dark:text-stone-600" />
            <text x={margin.left - 10} y={tick.y + 4} textAnchor="end" className="text-[10px] fill-stone-400 font-mono">{tick.val}</text>
          </g>
        ))}

        {/* Chart Content with Animation */}
        <g clipPath="url(#chart-clip)">
            <path d={areaPath} fill="url(#chartGradient)" />
            <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
        </g>

        {/* Interactive Points */}
        {points.map((point, i) => {
          const showLabel = i % 3 === 0;
          return (
            <g key={i}>
              {showLabel && (
                <text x={point[0]} y={height} textAnchor="middle" className="text-[10px] fill-stone-400 font-medium uppercase tracking-wider">{labels[i].split(' ')[1]}</text>
              )}
              <rect x={point[0] - (chartWidth / points.length / 2)} y={margin.top} width={chartWidth / points.length} height={chartHeight} fill="transparent" onMouseEnter={() => setHoveredIndex(i)} className="cursor-crosshair" />
              
              {/* Active Point */}
              <circle cx={point[0]} cy={point[1]} r={hoveredIndex === i ? 5 : 0} className="fill-emerald-600 dark:fill-emerald-400 stroke-white dark:stroke-stone-900 stroke-2 transition-all duration-200" />
              <line x1={point[0]} y1={margin.top} x2={point[0]} y2={height - margin.bottom} stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" className={`transition-opacity duration-200 ${hoveredIndex === i ? 'opacity-30' : 'opacity-0'}`} />
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div 
          className="absolute top-0 -translate-x-1/2 bg-stone-900/95 dark:bg-stone-100/95 backdrop-blur text-white dark:text-stone-900 text-[10px] px-3 py-1.5 rounded-lg shadow-xl pointer-events-none transition-all duration-150 z-20 flex flex-col items-center min-w-[80px] animate-in fade-in zoom-in-95"
          style={{ left: `${((margin.left + (hoveredIndex / (data.length - 1)) * chartWidth) / width) * 100}%`, top: `${((margin.top + chartHeight - (data[hoveredIndex] / maxVal) * chartHeight) / height) * 100}%`, transform: 'translate(-50%, -120%)' }}
        >
          <span className="font-bold text-xs">₱{Math.round(data[hoveredIndex] * 15).toLocaleString()}</span>
          <span className="opacity-70 text-[9px] uppercase tracking-wide">{labels[hoveredIndex]}</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900/95 dark:bg-stone-100/95 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// --- INTERACTIVE COMPONENTS ---

const BentoGrid = () => (
  <section className="py-24 bg-white dark:bg-stone-900 transition-colors">
    <div className="max-w-7xl mx-auto px-6">
      <ScrollReveal className="mb-16 max-w-2xl">
        <h2 className="font-serif text-3xl md:text-4xl mb-4 text-stone-900 dark:text-white">
          Built for the modern economy.
        </h2>
        <p className="text-stone-600 dark:text-stone-400">
          Recepta isn't just a scanner. It's a financial operating system designed for speed, privacy, and control.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[500px]">
        
        {/* Large Item */}
        <ScrollReveal className="md:col-span-2 md:row-span-2 bg-stone-50 dark:bg-stone-950/50 rounded-3xl p-8 border border-stone-100 dark:border-stone-800 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 shadow-sm hover:shadow-xl h-full">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <Shield className="w-64 h-64 text-emerald-500" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Privacy First Architecture</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                We believe financial data is personal. Use our local docker containers to run Recepta entirely offline, or use our cloud with zero-retention policies.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Medium Item */}
        <ScrollReveal className="md:col-span-2 bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 shadow-md hover:shadow-xl hover:shadow-emerald-500/20 h-full">
           <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-110">
             <Globe className="w-32 h-32" />
           </div>
           <div className="relative z-10">
             <h3 className="text-lg font-bold mb-1">Global Currency Support</h3>
             <p className="text-emerald-100 text-sm">Auto-detects PHP, USD, EUR, and JPY. Perfect for travelers and digital nomads.</p>
           </div>
        </ScrollReveal>

        {/* Small Item */}
        <ScrollReveal className="bg-stone-50 dark:bg-stone-950/50 rounded-3xl p-6 border border-stone-100 dark:border-stone-800 flex flex-col justify-between group hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300 shadow-sm hover:shadow-lg h-full">
           <FileJson className="w-8 h-8 text-stone-400 group-hover:text-emerald-500 transition-colors mb-4" />
           <div>
             <h3 className="font-bold text-stone-900 dark:text-white text-sm">Export Data</h3>
             <p className="text-stone-500 text-xs mt-1">JSON, CSV, & PDF.</p>
           </div>
        </ScrollReveal>

        {/* Small Item */}
        <ScrollReveal className="bg-stone-50 dark:bg-stone-950/50 rounded-3xl p-6 border border-stone-100 dark:border-stone-800 flex flex-col justify-between group hover:-translate-y-1 hover:border-orange-500/30 transition-all duration-300 shadow-sm hover:shadow-lg h-full">
           <Zap className="w-8 h-8 text-stone-400 group-hover:text-orange-500 transition-colors mb-4" />
           <div>
             <h3 className="font-bold text-stone-900 dark:text-white text-sm">Flash Models</h3>
             <p className="text-stone-500 text-xs mt-1">~1.2s extraction.</p>
           </div>
        </ScrollReveal>

      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-24 bg-[#f2f0e9] dark:bg-stone-950 transition-colors border-t border-stone-200 dark:border-stone-900">
    <div className="max-w-7xl mx-auto px-6">
      <ScrollReveal className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 dark:text-white">
          Don't just take our word for it.
        </h2>
      </ScrollReveal>
      
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { text: "I used to spend Sunday nights manually typing receipts into Excel. Recepta literally gave me my weekends back.", author: "Sarah Jenkins", role: "Freelance Designer" },
          { text: "The local LLM option is a game changer. I can track my expenses without sending data to the cloud.", author: "David Chen", role: "Software Engineer" },
          { text: "Accurately read a crumpled coffee receipt from my pocket. The vision model is actually insane.", author: "Miguel Santos", role: "Small Business Owner" }
        ].map((t, i) => (
          <ScrollReveal key={i} className="h-full">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(star => <div key={star} className="w-4 h-4 bg-orange-400 rounded-full" />)}
              </div>
              <p className="text-stone-600 dark:text-stone-300 mb-6 leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 font-bold">
                  {t.author[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900 dark:text-white">{t.author}</p>
                  <p className="text-xs text-stone-500">{t.role}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const items = [
    { q: "Is my financial data secure?", a: "Yes. We use banking-standard encryption. If you choose the Local plan, your data never leaves your device." },
    { q: "How accurate is the AI?", a: "We use advanced Vision-Language Models (VLMs) like GPT-4o and Nemotron-3. It achieves 98%+ accuracy on standard receipts." },
    { q: "Can I export my data?", a: "Absolutely. You can export your entire transaction history to CSV, JSON, or PDF at any time." },
    { q: "Is there a free trial?", a: "The 'Sprout' plan is free forever. You get 5 AI scans per month and unlimited manual entry." }
  ];

  return (
    <section className="py-24 bg-white dark:bg-stone-900 transition-colors">
      <div className="max-w-3xl mx-auto px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl mb-12 text-stone-900 dark:text-white text-center">Frequently Asked Questions</h2>
        </ScrollReveal>
        <div className="space-y-4">
          {items.map((item, i) => (
            <ScrollReveal key={i}>
              <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-200 dark:hover:border-emerald-800">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                >
                  <span className="font-medium text-stone-900 dark:text-stone-100">{item.q}</span>
                  <ChevronUp className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="p-6 pt-0 text-stone-600 dark:text-stone-400 text-sm leading-relaxed border-t border-dashed border-stone-100 dark:border-stone-800 mt-2">
                    {item.a}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const getRandomMock = () => MOCK_RECEIPTS[Math.floor(Math.random() * MOCK_RECEIPTS.length)];

// --- NEW COMPONENT: INTERACTIVE SCANNER DEMO ---
const HeroScannerDemo = () => {
  const [scanState, setScanState] = useState('idle');
  const [demoData, setDemoData] = useState(null);
  
  const runSimulation = () => {
    setScanState('scanning');
    setTimeout(() => {
        setScanState('processing');
        setTimeout(() => {
            setDemoData(getRandomMock());
            setScanState('complete');
        }, 1500);
    }, 1500);
  };

  const reset = () => {
    setScanState('idle');
    setDemoData(null);
  }

  return (
    <div className="relative group w-full max-w-sm mx-auto mt-8 sm:mt-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:border-emerald-500/30 transform hover:-translate-y-1 duration-500">
        
        {/* Mac-style Header */}
        <div className="bg-stone-50 dark:bg-stone-950/50 border-b border-stone-100 dark:border-stone-800 p-3 flex items-center justify-between">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider animate-pulse">
                {scanState === 'idle' ? 'AI Ready' : scanState === 'scanning' ? 'Scanning...' : 'Processing...'}
            </span>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[320px] flex flex-col items-center justify-center text-center relative">
            
            {/* STATE: IDLE */}
            {scanState === 'idle' && (
                <div className="animate-in fade-in zoom-in duration-500">
                    <div 
                        className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-all cursor-pointer shadow-sm" 
                        onClick={runSimulation}
                    >
                        <ScanLine className="w-10 h-10 text-stone-400 dark:text-stone-500 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Try the Demo</p>
                    <p className="text-xs text-stone-500 mb-6">Click below to simulate a live receipt capture.</p>
                    <Button 
                        size="sm" 
                        onClick={runSimulation} 
                        className="rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 hover:scale-105 transition-all shadow-md"
                    >
                        Simulate Scan
                    </Button>
                </div>
            )}

            {/* STATE: SCANNING / PROCESSING */}
            {(scanState === 'scanning' || scanState === 'processing') && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 dark:bg-stone-900/95 z-10 backdrop-blur-sm">
                    {/* Scanning Beam Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-[scan_2s_linear_infinite]" />
                    
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
                        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin relative z-10" />
                    </div>
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200 animate-pulse">
                        {scanState === 'scanning' ? 'Analyzing Image...' : 'Extracting Entities...'}
                    </p>
                    
                    <div className="w-48 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full mt-6 overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-[loading_1.5s_ease-in-out_infinite] rounded-full"></div>
                    </div>

                    <div className="mt-6 text-[10px] text-stone-400 space-y-2 text-left w-48">
                        <div className={`flex items-center gap-2 transition-all duration-300 ${scanState === 'processing' ? 'text-emerald-500 translate-x-1' : ''}`}>
                            <CheckCircle2 className="w-3 h-3" /> Optical Character Recognition
                        </div>
                        <div className={`flex items-center gap-2 transition-all duration-300 delay-100 ${scanState === 'processing' ? 'text-emerald-500 translate-x-1' : 'opacity-50'}`}>
                            <Brain className="w-3 h-3" /> Identifying Merchants
                        </div>
                        <div className={`flex items-center gap-2 transition-all duration-300 delay-200 ${scanState === 'processing' ? 'text-emerald-500 translate-x-1' : 'opacity-50'}`}>
                            <FileJson className="w-3 h-3" /> Structuring JSON
                        </div>
                    </div>
                </div>
            )}

            {/* STATE: COMPLETE */}
            {scanState === 'complete' && demoData && (
                <div className="w-full text-left animate-in slide-in-from-bottom-8 duration-700 ease-out">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100 dark:border-emerald-800/50">
                            <CheckCircle2 className="w-3 h-3" /> Parsed in 1.2s
                        </span>
                        <button onClick={reset} className="text-[10px] text-stone-400 hover:text-emerald-500 transition-colors flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" /> Reset
                        </button>
                    </div>

                    {/* Receipt Paper Card */}
                    <div className="bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/50 rounded-xl p-5 relative overflow-hidden shadow-lg transform transition-all hover:scale-[1.02]">
                          
                          {/* Dashed line effect */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

                          <div className="flex justify-between items-start border-b border-dashed border-stone-300 dark:border-stone-700 pb-4 mb-4">
                            <div>
                                <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold mb-1">Merchant</p>
                                <p className="font-serif font-bold text-xl text-stone-800 dark:text-stone-100 leading-none">
                                    {demoData.store}
                                </p>
                                <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-2">
                                    <MapPin className="w-3 h-3" />
                                    {demoData.address?.street}, {demoData.address?.city}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-stone-900 p-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
                                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                            </div>
                          </div>

                          <div className="space-y-3 mb-5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                             {demoData.items?.map((item, i) => (
                                 <div key={i} className="flex justify-between text-xs group">
                                     <div className="flex gap-2 items-center">
                                         <span className="font-bold text-stone-400 w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[9px]">{item.quantity}</span>
                                         <span className="text-stone-600 dark:text-stone-300 font-medium truncate max-w-[120px]">{item.description}</span>
                                     </div>
                                     <span className="font-mono text-stone-500">₱{item.price}</span>
                                 </div>
                             ))}
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-dashed border-stone-300 dark:border-stone-700 bg-stone-100/50 dark:bg-stone-800/50 -mx-5 -mb-5 p-5">
                             <div className="flex flex-col">
                                <span className="text-[10px] text-stone-500 uppercase font-bold">Total Amount</span>
                                <span className="text-xs text-stone-400">{demoData.metadata?.currency}</span>
                             </div>
                             <span className="font-serif font-bold text-2xl text-emerald-600">₱{demoData.total.toFixed(2)}</span>
                          </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}

// --- HELPER DATA FOR DASHBOARD PREVIEW ---
const { data: CHART_VALUES, labels: CHART_LABELS } = (() => {
  const data = [], labels = [], days = ["S", "M", "T", "W", "T", "F", "S"];
  for (let i = 20; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    data.push(Math.max(10, Math.floor(Math.random()*50)+30+(Math.sin(i)*20)));
    labels.push(`${days[d.getDay()]} ${d.getDate()}`);
  }
  return { data, labels };
})();

// --- INTERACTIVE DASHBOARD PREVIEW ---
const InteractiveDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [animateKey, setAnimateKey] = useState(0);

    // Trigger re-animation on tab change
    useEffect(() => {
        setAnimateKey(prev => prev + 1);
    }, [activeTab]);
    
    const RECENT_TXNS = [
        { name: "Starbucks Coffee", cat: "Food", date: "Today, 9:41 AM", amount: -5.40, icon: Utensils, color: "bg-orange-100 text-orange-600" },
        { name: "Uber Ride", cat: "Transport", date: "Yesterday, 6:20 PM", amount: -14.20, icon: Car, color: "bg-blue-100 text-blue-600" },
        { name: "Freelance Payment", cat: "Income", date: "Mon, 10:00 AM", amount: +1250.00, icon: Wallet, color: "bg-emerald-100 text-emerald-600" },
        { name: "Electric Bill", cat: "Utilities", date: "Sun, 2:00 PM", amount: -85.00, icon: Lightbulb, color: "bg-yellow-100 text-yellow-600" },
    ];
    const BUDGETS = [
        { name: "Groceries", limit: 500, spent: 320, color: "bg-emerald-500" },
        { name: "Entertainment", limit: 200, spent: 180, color: "bg-orange-500" },
        { name: "Shopping", limit: 300, spent: 45, color: "bg-blue-500" },
    ];

    return (
        <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-3xl transform hover:-translate-y-1">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 transition-colors">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                </div>
                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {['overview', 'activity', 'budgets'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={()=>setActiveTab(tab)} 
                            className={`hover:text-emerald-500 transition-all relative ${activeTab===tab ? 'text-emerald-600 dark:text-emerald-400 scale-105' : ''}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute -bottom-3 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Body */}
            <div className="p-6 bg-stone-50/30 dark:bg-stone-950/30 aspect-[16/9] flex flex-col gap-6 relative">
                
                {/* --- TAB: OVERVIEW --- */}
                {activeTab === 'overview' && (
                    <div key={animateKey} className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { title: 'Balance', val: '₱12,450', icon: Wallet, color: 'text-stone-800 dark:text-white', iconColor: 'text-stone-300' },
                                { title: 'Income', val: '+₱4,200', icon: ArrowUpRight, color: 'text-emerald-600', iconColor: 'text-emerald-500' },
                                { title: 'Spent', val: '-₱1,850', icon: ArrowDownRight, color: 'text-orange-600', iconColor: 'text-orange-500' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-100 dark:border-stone-700 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">{stat.title}</p>
                                        <stat.icon className={`w-3 h-3 ${stat.iconColor}`} />
                                    </div>
                                    <p className={`text-lg font-serif font-bold ${stat.color}`}>{stat.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Chart Section */}
                        <div className="flex-1 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">Spending Trend</h4>
                                    <p className="text-[10px] text-stone-400">Last 21 Days</p>
                                </div>
                                <div className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3" /> +12%
                                </div>
                            </div>
                            <div className="flex-1 w-full h-full min-h-[120px]">
                                <SmoothLineChart data={CHART_VALUES} labels={CHART_LABELS} />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: ACTIVITY --- */}
                {activeTab === 'activity' && (
                    <div key={animateKey} className="h-full overflow-hidden flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
                        <div className="flex justify-between items-center mb-3 px-1">
                            <h4 className="text-xs font-bold text-stone-500 uppercase">Recent Transactions</h4>
                            <button className="text-[10px] text-emerald-600 hover:underline">View All</button>
                        </div>
                        <div className="space-y-2 overflow-y-auto pr-1">
                            {RECENT_TXNS.map((txn, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-colors group cursor-default animate-in slide-in-from-bottom-2 duration-300" style={{animationDelay: `${i*100}ms`}}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.color.split(' ')[0]}`}>
                                            <txn.icon className={`w-4 h-4 ${txn.color.split(' ')[1]}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-stone-800 dark:text-stone-200">{txn.name}</p>
                                            <p className="text-[10px] text-stone-400">{txn.date}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-mono font-medium ${txn.amount > 0 ? 'text-emerald-600' : 'text-stone-600 dark:text-stone-300'}`}>
                                        {txn.amount > 0 ? '+' : ''}₱{Math.abs(txn.amount).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB: BUDGETS --- */}
                {activeTab === 'budgets' && (
                    <div key={animateKey} className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h4 className="text-xs font-bold text-stone-500 uppercase">Monthly Budgets</h4>
                            <button className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-full w-5 h-5 flex items-center justify-center hover:scale-110 transition-transform text-xs">+</button>
                        </div>
                        <div className="space-y-4">
                            {BUDGETS.map((b, i) => {
                                const pct = (b.spent / b.limit) * 100;
                                return (
                                    <div key={i} className="bg-white dark:bg-stone-800 p-4 rounded-xl border border-stone-100 dark:border-stone-700 animate-in slide-in-from-bottom-3 duration-500" style={{animationDelay: `${i*150}ms`}}>
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">{b.name}</p>
                                                <p className="text-[10px] text-stone-400">₱{b.spent} of ₱{b.limit}</p>
                                            </div>
                                            <span className={`text-xs font-bold ${pct > 90 ? 'text-red-500' : 'text-stone-500'}`}>{Math.round(pct)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-stone-100 dark:bg-stone-900 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${b.color}`} 
                                                style={{ width: `${pct}%`, animation: `growWidth 1s ease-out forwards` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") return document.documentElement.classList.contains("dark");
    return false;
  });

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // AUTH & OTHER STATE
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [isAnnual, setIsAnnual] = useState(false);

  const openAuth = (tab) => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-emerald-500/30 transition-colors duration-500">
      
      <AuthModal isOpen={isAuthOpen} onClose={setIsAuthOpen} defaultTab={authTab} />
      <DemoModal isOpen={isDemoOpen} onClose={setIsDemoOpen} />

      {/* BACKGROUND EFFECTS */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-400/30 dark:bg-emerald-900/20 rounded-full filter blur-[120px] opacity-60 dark:opacity-40 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-normal transition-all duration-1000 animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-300/30 dark:bg-orange-900/20 rounded-full filter blur-[120px] opacity-50 dark:opacity-30 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-normal transition-all duration-1000 animate-pulse-slow" style={{animationDelay: '2s'}}></div>


{/* NAVBAR */}
<nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
    scrolled 
    ? "bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl border-stone-200 dark:border-white/10 py-3 sm:py-4 shadow-sm" 
    : "bg-transparent border-transparent py-4 sm:py-6"
}`}>
    {/* Changed px-6 to px-4 for mobile to save horizontal space */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* --- LEFT: Logo --- */}
        <div className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer shrink-0">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 sm:p-2 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            {/* Reduced text size to text-lg on mobile, 2xl on desktop */}
            <span className="font-serif italic text-lg sm:text-2xl tracking-wide text-stone-800 dark:text-stone-100 group-hover:text-emerald-700 transition-colors">
                Recepta
            </span>
        </div>

        {/* --- CENTER: Desktop Links (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-400">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:-translate-y-0.5 transform duration-200">Features</a>
            <Link to="/aiEngine" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:-translate-y-0.5 transform duration-200">AI Engine</Link>
            <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors hover:-translate-y-0.5 transform duration-200">Pricing</a>
        </div>

        {/* --- RIGHT: Actions --- */}
        {/* Added shrink-0 to prevent this section from being crushed */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Theme Toggle */}
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-all hover:scale-110"
            >
                {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>

            {/* Log In Link - Slightly smaller text on mobile */}
            <button 
                onClick={() => openAuth('login')} 
                className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors px-1 sm:px-2 hover:underline decoration-emerald-500 decoration-2 underline-offset-4 whitespace-nowrap"
            >
                Log In
            </button>

            {/* Get Started Button - Tighter padding (px-3) and smaller text on mobile */}
            <Button 
                onClick={() => openAuth('register')} 
                className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full px-3 sm:px-6 h-8 sm:h-10 text-xs sm:text-sm transition-all hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 whitespace-nowrap"
            >
                Get Started
            </Button>
        </div>
    </div>
</nav>
      {/* HERO SECTION */}
      <header className="relative z-10 pt-48 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Now running on kwaipilot/kat-coder-pro:free</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-6 text-stone-900 dark:text-white transition-colors animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Financial clarity, <br />
              <span className="italic text-emerald-600 dark:text-emerald-500">powered by AI.</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-colors animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Stop manually logging expenses. Recepta uses advanced vision to parse receipts and forecast your financial health.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Button onClick={() => openAuth('register')} className="h-12 px-8 text-base bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full w-full sm:w-auto shadow-lg shadow-emerald-900/10 transition-all hover:-translate-y-1 hover:shadow-xl">
                Start Tracking Free <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" onClick={() => setIsDemoOpen(true)} className="h-12 px-8 text-base bg-white/50 dark:bg-transparent border-stone-300 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full w-full sm:w-auto transition-all hover:-translate-y-1">
                View Live Demo
              </Button>
            </div>
          </ScrollReveal>
          <div className="flex justify-center lg:justify-end animate-in fade-in zoom-in duration-1000 delay-300">
            <HeroScannerDemo />
          </div>
        </div>

        <ScrollReveal className="mt-20 relative max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-orange-500/20 rounded-xl blur-lg opacity-50 animate-pulse-slow"></div>
          <InteractiveDashboard />
        </ScrollReveal>
      </header>

      {/* FEATURES */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 view-trigger">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-stone-900 dark:text-white">Everything you need to grow.</h2>
            <p className="text-stone-600 dark:text-stone-400">Advanced tools simplified for your personal economy.</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            <ScrollReveal className="p-8 rounded-2xl bg-white/40 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-stone-900/60 transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ScanLine className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-serif text-stone-900 dark:text-stone-100">Smart Receipt Scan</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                Upload a photo and let our AI extract merchants, dates, and line items instantly. No more manual data entry.
              </p>
            </ScrollReveal>
            <ScrollReveal className="p-8 rounded-2xl bg-white/40 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-stone-900/60 transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl delay-100">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <PieChart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-serif text-stone-900 dark:text-stone-100">Deep Analytics</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                Visualise your spending flow. Track categories, monthly trends, and get alerts when you're nearing your budget limits.
              </p>
            </ScrollReveal>
            <ScrollReveal className="p-8 rounded-2xl bg-white/40 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-stone-900/60 transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl delay-200">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-serif text-stone-900 dark:text-stone-100">Model Selection</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                Power user? Choose the specific LLM model (Xiaomi, Nvidia) used to parse your data for speed or precision.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <BentoGrid /> 
      <Testimonials />

      {/* PRICING */}
      <section id="pricing" className="py-24 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-stone-900 dark:text-white">Transparent pricing for your growth.</h2>
            <p className="text-stone-600 dark:text-stone-400 mb-8">Start for free, upgrade for power. No hidden fees.</p>
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold ${!isAnnual ? 'text-stone-900 dark:text-white' : 'text-stone-500'}`}>Monthly</span>
              <button onClick={() => setIsAnnual(!isAnnual)} className="relative w-14 h-8 rounded-full bg-stone-200 dark:bg-stone-800 transition-colors p-1 cursor-pointer">
                <div className={`w-6 h-6 rounded-full bg-emerald-600 shadow-sm transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-bold ${isAnnual ? 'text-stone-900 dark:text-white' : 'text-stone-500'}`}>Yearly <span className="text-emerald-600 text-xs ml-1 font-normal">(Save 20%)</span></span>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <ScrollReveal className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl p-8 flex flex-col hover:border-stone-300 dark:hover:border-stone-700 transition-all hover:-translate-y-1 hover:shadow-xl">
               <div className="mb-4">
                 <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">Sprout</h3>
                 <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mt-1">Free Forever</p>
               </div>
               <div className="mb-6"><span className="text-4xl font-serif text-stone-900 dark:text-white">₱0</span><span className="text-stone-500">/mo</span></div>
               <Button onClick={() => openAuth('register')} variant="outline" className="w-full mb-8 rounded-full border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all hover:scale-105">Start Free</Button>
               <ul className="space-y-4 flex-1">
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-emerald-600 flex-shrink-0" /><span>Manual Transaction Entry</span></li>
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-emerald-600 flex-shrink-0" /><span>5 AI Receipt Scans / mo</span></li>
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-emerald-600 flex-shrink-0" /><span>Basic Spending Analytics</span></li>
                 <li className="flex items-start gap-3 text-sm text-stone-400 dark:text-stone-600"><X className="w-5 h-5 flex-shrink-0" /><span>Custom AI Models</span></li>
               </ul>
            </ScrollReveal>
            {/* Pro Plan */}
            <ScrollReveal className="relative bg-white dark:bg-stone-900 backdrop-blur-md border border-emerald-500/30 dark:border-emerald-500/50 rounded-2xl p-8 flex flex-col shadow-2xl shadow-emerald-900/10 transform md:-translate-y-4 hover:-translate-y-6 transition-all duration-300">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">Most Popular</div>
               <div className="mb-4">
                 <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">Bloom <Sparkles className="w-4 h-4 text-emerald-500" /></h3>
                 <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold mt-1">For Power Users</p>
               </div>
               <div className="mb-6"><span className="text-4xl font-serif text-stone-900 dark:text-white">{isAnnual ? '₱159' : '₱199'}</span><span className="text-stone-500">/mo</span></div>
               <Button onClick={() => openAuth('register')} className="w-full mb-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105 shadow-lg shadow-emerald-500/30">Get Bloom</Button>
               <ul className="space-y-4 flex-1">
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span><strong>Unlimited</strong> AI Receipt Scans</span></li>
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span>Advanced Models (Nemotron-3)</span></li>
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span>Export to CSV/Excel</span></li>
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-emerald-500 flex-shrink-0" /><span>Priority Support</span></li>
               </ul>
            </ScrollReveal>
            {/* Local Plan */}
            <ScrollReveal className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl p-8 flex flex-col hover:border-stone-300 dark:hover:border-stone-700 transition-all hover:-translate-y-1 hover:shadow-xl">
               <div className="mb-4">
                 <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">Local</h3>
                 <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mt-1">Self-Hosted / Dev</p>
               </div>
               <div className="mb-6"><span className="text-4xl font-serif text-stone-900 dark:text-white">Free</span><p className="text-xs text-stone-500 mt-1">Requires your own API Keys</p></div>
               <Button variant="outline" className="w-full mb-8 rounded-full border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all hover:scale-105">View GitHub</Button>
               <ul className="space-y-4 flex-1">
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-stone-400 flex-shrink-0" /><span>Self-hosted Docker Container</span></li>
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-stone-400 flex-shrink-0" /><span>Bring Your Own LLM Key</span></li>
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Check className="w-5 h-5 text-stone-400 flex-shrink-0" /><span>Full Data Sovereignty</span></li>
                 <li className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300"><Zap className="w-5 h-5 text-stone-400 flex-shrink-0" /><span>Community Support</span></li>
               </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <FAQ />

      <footer className="py-20 border-t border-stone-200 dark:border-stone-900 relative z-10 text-center bg-[#f2f0e9] dark:bg-stone-950 transition-colors">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-500 mx-auto mb-6 animate-pulse-slow" />
            <h2 className="font-serif text-4xl mb-6 text-stone-900 dark:text-white">Ready to clarify your finances?</h2>
            <p className="text-stone-600 dark:text-stone-400 mb-8">Join the waitlist or start your local instance today.</p>
            <div className="flex justify-center gap-4">
                <Button onClick={() => openAuth('register')} className="bg-stone-900 dark:bg-white text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full h-12 px-8 transition-all hover:scale-105 shadow-lg">Create Account</Button>
            </div>
            <div className="mt-20 text-stone-500 dark:text-stone-600 text-sm flex flex-col md:flex-row gap-6 justify-between items-center border-t border-stone-300 dark:border-stone-900/50 pt-8 transition-colors">
                <p>&copy; 2026 Recepta. Built by Moises Nugal.</p>
                <div className="flex gap-6">
                  <Link to="/legal" className="hover:text-stone-800 dark:hover:text-stone-400 transition-colors hover:underline">Privacy</Link>
                  <Link to="/legal" className="hover:text-stone-800 dark:hover:text-stone-400 transition-colors hover:underline">Terms</Link>
                  <a href="#" className="hover:text-stone-800 dark:hover:text-stone-400 transition-colors hover:underline">Github</a>
                </div>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </div>
  );
}