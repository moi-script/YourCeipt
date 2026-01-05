import React, { useState, useEffect } from "react";
import { 
  Cpu, Zap, Activity, Server, ArrowLeft, Search, 
  CheckCircle2, AlertTriangle, Clock, Database, Lock, Globe, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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

  // Default to maintenance style if status is unknown
  const currentStyle = styles[status] || styles.maintenance;
  const currentIcon = icons[status] || icons.maintenance;

  return (
    <div className={`flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border ${currentStyle}`}>
      {currentIcon}
      {status || "Unknown"}
    </div>
  );
};

const LatencyBar = ({ ms }) => {
  // Normalize bar width (max 2000ms = 100%)
  const safeMs = ms || 0;
  const percentage = Math.min((safeMs / 2000) * 100, 100);
  
  let color = "bg-emerald-500";
  if (safeMs > 800) color = "bg-orange-500";
  if (safeMs > 1500) color = "bg-red-500";

  return (
    <div className="flex items-center gap-3 w-full max-w-[120px]">
      <div className="flex-1 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="text-xs font-mono text-stone-500 w-12 text-right">{safeMs}ms</span>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function AiEnginePage() {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState("All"); 
  const [search, setSearch] = useState("");

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual backend URL if running separately (e.g., http://localhost:3000/getModels)
        const response = await fetch('http://localhost:3000/extract/getModels'); 

        console.log("Response ::", response);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        // The backend returns { models: [...] }
        if (data && data.models) {
            setModels(data.models);
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
        setError("Unable to connect to AI Grid.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  // --- FILTERING LOGIC ---
  const filteredModels = models.filter(m => {
    // 1. Filter by Provider Type (Logic inferred from name since backend doesn't send 'type')
    // We assume 'gpt'/'claude' are Cloud, others might be Local/Open Source
    let modelType = "Local"; 
    const lowerName = m.name.toLowerCase();
    if (lowerName.includes("gpt") || lowerName.includes("claude") || lowerName.includes("gemini")) {
        modelType = "Cloud";
    }

    const matchesType = filter === "All" || modelType === filter;
    
    // 2. Search
    const matchesSearch = 
        m.name.toLowerCase().includes(search.toLowerCase()) || 
        m.provider.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Calculate Average Stats for the Header
  const avgLatency = models.length > 0 
    ? Math.round(models.reduce((acc, curr) => acc + (curr.latency || 0), 0) / models.length) 
    : 0;
  
  const totalRequests = models.reduce((acc, curr) => acc + (curr.requests || 0), 0);

  return (
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-500">
      
      {/* Navbar */}
      <nav className="border-b border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/main" className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-stone-500" />
            </Link>
            <div className="flex items-center gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-lg">
                    <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="font-serif font-bold text-lg tracking-wide text-stone-800 dark:text-stone-100">AI Engine Status</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <span className={`flex h-2 w-2 rounded-full ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></span>
             <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-widest">
                {isLoading ? "Syncing..." : "Systems Online"}
             </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* 1. Global Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-blue-500"><Activity className="w-5 h-5" /></div>
                </div>
                <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">Total Requests</p>
                <p className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mt-1">
                    {totalRequests > 1000 ? (totalRequests/1000).toFixed(1) + 'k' : totalRequests}
                </p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-orange-500"><Zap className="w-5 h-5" /></div>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">Live</Badge>
                </div>
                <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">Avg Latency</p>
                <p className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mt-1">{avgLatency}ms</p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-emerald-500"><Server className="w-5 h-5" /></div>
                </div>
                <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">Active Models</p>
                <p className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mt-1">{models.length}</p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-500"><Database className="w-5 h-5" /></div>
                </div>
                <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">Last Sync</p>
                <p className="text-xl font-serif font-bold text-stone-800 dark:text-stone-100 mt-2">Just now</p>
            </div>
        </section>

        {/* 2. Filters & Search */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="bg-stone-100 dark:bg-stone-900 p-1 rounded-xl flex gap-1">
                {["All", "Cloud", "Local"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            filter === tab 
                            ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm" 
                            : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input 
                    placeholder="Search models..." 
                    className="pl-10 rounded-xl bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </section>

        {/* 3. Models List */}
        <div className="space-y-4">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                <div className="col-span-4">Model Name</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Latency (Avg)</div>
                <div className="col-span-2">Requests (Load)</div>
                <div className="col-span-2 text-right">Provider</div>
            </div>

            {/* LOADING STATE */}
            {isLoading && (
                <div className="py-20 text-center text-stone-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-500" />
                    <p>Connecting to AI Grid...</p>
                </div>
            )}

            {/* ERROR STATE */}
            {!isLoading && error && (
                <div className="py-10 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
                </div>
            )}

            {/* DATA LIST */}
            {!isLoading && !error && filteredModels.map((model) => (
                <div key={model.id} className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 md:px-6 md:py-4 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        
                        {/* Name & Icon */}
                        <div className="col-span-4 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-stone-100 dark:bg-stone-800`}>
                                <Cpu className="w-5 h-5 text-stone-500" />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg md:text-base leading-tight">
                                    {model.name.split('/').pop()} {/* Show just name part */}
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

                        {/* Requests (Random mock in backend, visualization here) */}
                        <div className="col-span-2">
                            <div className="text-sm font-mono font-medium text-stone-700 dark:text-stone-300">{model.requests} reqs</div>
                            <div className="w-24 h-1 bg-stone-100 dark:bg-stone-800 rounded-full mt-2 overflow-hidden">
                                {/* Visual bar relative to 1000 requests max */}
                                <div className="h-full bg-blue-500" style={{width: `${Math.min((model.requests / 1000) * 100, 100)}%`}}></div>
                            </div>
                        </div>

                        {/* Provider */}
                        <div className="col-span-2 text-right">
                            <div className="text-sm font-bold text-stone-900 dark:text-stone-100">{model.provider}</div>
                            <div className="text-xs text-stone-500 mt-0.5">Free Tier</div>
                        </div>

                    </div>
                </div>
            ))}
        </div>

      </main>
    </div>
  );
}