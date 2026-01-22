import React, { useState, useEffect } from "react";
import { 
  Cpu, Zap, Activity, Server, ArrowLeft, Search, 
  CheckCircle2, AlertTriangle, Clock, Database, Lock, Globe, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BASE_API_URL } from "@/api/getKeys.js";
// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    degraded: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    maintenance: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700"
  };

  const icons = {
    active: <CheckCircle2 className="w-3 h-3 mr-1" />,
    degraded: <AlertTriangle className="w-3 h-3 mr-1" />,
    maintenance: <Clock className="w-3 h-3 mr-1" />
  };

  const currentStyle = styles[status] || styles.maintenance;
  const currentIcon = icons[status] || icons.maintenance;

  return (
    <div className={`flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${currentStyle} transition-all duration-300`}>
      {/* Add a ping animation if active */}
      {status === 'active' && (
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {status !== 'active' && currentIcon}
      {status || "Unknown"}
    </div>
  );
};

const LatencyBar = ({ ms }) => {
  const [width, setWidth] = useState(0);
  
  // Animate on mount
  useEffect(() => {
    const safeMs = ms || 0;
    const percentage = Math.min((safeMs / 2000) * 100, 100);
    // Slight delay to allow layout to settle
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [ms]);

  let color = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]";
  if (ms > 800) color = "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]";
  if (ms > 1500) color = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]";

  return (
    <div className="flex items-center gap-3 w-full max-w-[120px]">
      <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
        <div 
            className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} 
            style={{ width: `${width}%` }}
        ></div>
      </div>
      <span className="text-xs font-mono text-stone-500 w-12 text-right tabular-nums">{ms}ms</span>
    </div>
  );
};


// const BASE_API_URL  = im port.meta.env.VITE_URL_BACKEND || "http://localhost:5173"


export default function AiEnginePage() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState("All"); 
  const [search, setSearch] = useState("");

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(BASE_API_URL + '/extract/getModels'); 
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        
        if (data && data.models) {
            // Artificial delay for smooth animation demonstration (Remove in production if needed)
            setTimeout(() => setModels(data.models), 300);
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
        setError("Unable to connect to AI Grid.");
      } finally {
        // Artificial delay matching the data set
        setTimeout(() => setIsLoading(false), 300);
      }
    };
    fetchModels();
  }, []);

  // --- FILTERING LOGIC ---
  const filteredModels = models.filter(m => {
    let modelType = "Local"; 
    const lowerName = m.name.toLowerCase();
    if (lowerName.includes("gpt") || lowerName.includes("claude") || lowerName.includes("gemini")) {
        modelType = "Cloud";
    }
    const matchesType = filter === "All" || modelType === filter;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalRequests = models.reduce((acc, curr) => acc + (curr.requests || 0), 0);
  const avgLatency = models.length > 0 ? Math.round(models.reduce((acc, curr) => acc + (curr.latency || 0), 0) / models.length) : 0;

  // 

 
  // Helps visualize how the request routes through the proxy to specific models.

  return (
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-500">
      
      {/* Navbar */}
      <nav className="border-b border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-950/50 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors group">
              <ArrowLeft className="w-5 h-5 text-stone-500 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-lg">
                    <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="font-serif font-bold text-lg tracking-wide text-stone-800 dark:text-stone-100">AI Engine Status</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800">
              <span className={`flex h-2 w-2 rounded-full ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></span>
              <span className="text-xs font-mono text-stone-600 dark:text-stone-400 uppercase font-bold tracking-widest">
                {isLoading ? "Syncing..." : "Systems Online"}
              </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* 1. Global Stats Grid - Staggered Fade In */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {[
                { title: "Total Requests", val: totalRequests > 1000 ? (totalRequests/1000).toFixed(1) + 'k' : totalRequests, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
                { title: "Avg Latency", val: `${avgLatency}ms`, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10", badge: "Live" },
                { title: "Active Models", val: models.length, icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { title: "Last Sync", val: "Just now", icon: Database, color: "text-stone-500", bg: "bg-stone-500/10" }
            ].map((stat, idx) => (
                <div 
                    key={idx} 
                    className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'backwards' }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        {stat.badge && <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">{stat.badge}</Badge>}
                    </div>
                    <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">{stat.title}</p>
                    <p className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mt-1">{stat.val}</p>
                </div>
            ))}
        </section>

        {/* 2. Filters & Search */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300" style={{ animationFillMode: 'backwards' }}>
            <div className="bg-stone-100 dark:bg-stone-900 p-1 rounded-xl flex gap-1">
                {["All", "Cloud", "Local"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out ${
                            filter === tab 
                            ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm scale-105" 
                            : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
                <Input 
                    placeholder="Search models..." 
                    className="pl-10 rounded-xl bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 focus:ring-emerald-500/20 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </section>

        {/* 3. Models List */}
        <div className="space-y-4 min-h-[400px]">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold uppercase tracking-wider text-stone-400 animate-in fade-in duration-500">
                <div className="col-span-4">Model Name</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Latency (Avg)</div>
                <div className="col-span-2">Requests (Load)</div>
                <div className="col-span-2 text-right">Provider</div>
            </div>

            {/* LOADING STATE */}
            {isLoading && (
                <div className="py-20 text-center text-stone-500 flex flex-col items-center animate-in fade-in duration-300">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
                    <p className="animate-pulse">Connecting to AI Grid...</p>
                </div>
            )}

            {/* ERROR STATE */}
            {!isLoading && error && (
                <div className="py-10 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 animate-in zoom-in-95 duration-300">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <Button variant="outline" size="sm" className="mt-4 hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => window.location.reload()}>Retry Connection</Button>
                </div>
            )}

            {/* DATA LIST - WATERFALL ANIMATION */}
            {!isLoading && !error && filteredModels.map((model, index) => (
                <div 
                    key={model.id} 
                    className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 md:px-6 md:py-4 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default animate-in slide-in-from-bottom-3 fade-in fill-mode-backwards"
                    style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        
                        {/* Name & Icon */}
                        <div className="col-span-4 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-stone-100 dark:bg-stone-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-600 transition-colors duration-300`}>
                                <Cpu className="w-5 h-5 text-stone-500 group-hover:text-emerald-600 dark:text-stone-400 dark:group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg md:text-base leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                    {model.name.split('/').pop()}
                                </h3>
                                <p className="text-xs text-stone-400 truncate w-full max-w-[200px] mt-0.5">{model.name}</p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex md:block">
                            <StatusBadge status={model.status} />
                        </div>

                        {/* Latency */}
                        <div className="col-span-2">
                            <LatencyBar ms={model.latency} />
                        </div>

                        {/* Requests */}
                        <div className="col-span-2">
                            <div className="text-sm font-mono font-medium text-stone-700 dark:text-stone-300">{model.requests} reqs</div>
                            <div className="w-24 h-1 bg-stone-100 dark:bg-stone-800 rounded-full mt-2 overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                                    style={{ 
                                        width: `${Math.min((model.requests / 1000) * 100, 100)}%`,
                                        transitionDelay: `${index * 100 + 300}ms`
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Provider */}
                        <div className="col-span-2 text-right">
                            <div className="text-sm font-bold text-stone-900 dark:text-stone-100">{model.provider}</div>
                            <div className="text-xs text-stone-500 mt-0.5 group-hover:text-emerald-600 transition-colors">Free Tier</div>
                        </div>

                    </div>
                </div>
            ))}
            
            {/* Empty State */}
            {!isLoading && !error && filteredModels.length === 0 && (
                <div className="py-20 text-center animate-in fade-in duration-500">
                    <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-stone-400" />
                    </div>
                    <h3 className="text-stone-900 dark:text-white font-bold mb-1">No models found</h3>
                    <p className="text-stone-500 text-sm">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
}