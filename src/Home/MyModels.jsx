import React, { useEffect, useState } from "react";
import { DashboardSkeleton } from "@/components/loaders/AiSkeleton";
import {
  RefreshCw,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Settings,
  Shield,
  ChevronRight,
  LogOut,
  Sparkles,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

// --- CUSTOM ORGANIC COMPONENTS (Updated for Dark Mode) ---

const OrganicCard = ({ children, className = "" }) => (
  // Light: White glass | Dark: Smoked glass (stone-900 with low opacity)
  <div className={`backdrop-blur-md border border-white/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const OrganicCardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-2 ${className}`}>{children}</div>
);

const OrganicCardTitle = ({ children, className = "" }) => (
  <h3 className={`text-sm font-bold uppercase tracking-wider ${className}`}>{children}</h3>
);

const OrganicCardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export default function AIModelDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setIsModelLoading, isModelLoading, models, setModels } = useAuth();

  useEffect(() => {
    console.log('Model list :: ', models);
  }, [models]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    console.log('Fetching ai --> ');
    try {
      // setIsModelLoading(true); 
      const res = await fetch("http://localhost:3000/extract/getModels");
      const data = await res.json();
      setModels(data.models);
      // setIsModelLoading(false);
    } catch (err) {
      console.error("Unable to fetch ai models");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status) => {
    return status === "active" ? (
      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      </div>
    ) : (
      <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-full">
        <XCircle className="w-5 h-5 text-stone-400 dark:text-stone-500 shrink-0" />
      </div>
    );
  };

  const getLatencyColor = (latency) => {
    if (latency === 0) return "text-stone-400 dark:text-stone-500";
    // Added dark mode text variants for better contrast
    if (latency < 200) return "text-emerald-600 dark:text-emerald-400"; // Excellent
    if (latency < 300) return "text-orange-500 dark:text-orange-400"; // Caution
    return "text-orange-700 dark:text-orange-500"; // Poor
  };

  if (isModelLoading) {
    return <DashboardSkeleton />;
  }

  // Calculate generic stats
  const activeCount = Array.isArray(models) ? models.length : 0;
  const avgLatency = Array.isArray(models) && models.length > 0 
    ? Math.round(models.reduce((acc, curr) => acc + (curr.latency || 0), 0) / models.length) 
    : 0;

  return (
    // MAIN BG: 
    // Light: Warm bone (#f2f0e9) | Dark: Deep Stone (#0c0a09)
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden font-sans text-stone-800 dark:text-stone-100 p-4 md:p-8 transition-colors duration-300">
      
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-30 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-30 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 dark:bg-stone-800/40 border border-white/60 dark:border-white/10 backdrop-blur-md mb-3 shadow-sm">
               <Cpu className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
               <span className="text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">System Status</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif italic text-[#2c2c2c] dark:text-stone-100 mb-2">
              AI Models
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base font-medium">
              Monitor performance and latency across your neural engines.
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 rounded-full px-6 h-12 transition-all duration-300 w-full sm:w-auto"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh Nodes
          </Button>
        </div>

        {/* Stats Cards - "Floating Pebbles" */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          
          {/* Card 1: Active Models (Blue/Sky) */}
          <OrganicCard className="bg-sky-50/50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-800/30">
            <OrganicCardHeader>
              <OrganicCardTitle className="text-sky-700 dark:text-sky-300 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-sky-500 dark:text-sky-400" />
                Active Models
              </OrganicCardTitle>
            </OrganicCardHeader>
            <OrganicCardContent className="pt-0">
              <div className="text-4xl font-serif text-sky-800 dark:text-sky-100">
                {activeCount}
              </div>
              <p className="text-xs text-sky-600/80 dark:text-sky-300/80 mt-2 font-bold uppercase tracking-wide">
                Online & Ready
              </p>
            </OrganicCardContent>
          </OrganicCard>

          {/* Card 2: Avg Latency (Orange) */}
          <OrganicCard className="bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/30">
            <OrganicCardHeader>
              <OrganicCardTitle className="text-orange-700 dark:text-orange-300 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-orange-500 dark:text-orange-400" />
                Avg Latency
              </OrganicCardTitle>
            </OrganicCardHeader>
            <OrganicCardContent className="pt-0">
              <div className="text-4xl font-serif text-orange-800 dark:text-orange-100">
                {avgLatency > 0 ? `${avgLatency}ms` : "N/A"}
              </div>
              <p className="text-xs text-orange-600/80 dark:text-orange-300/80 mt-2 font-bold uppercase tracking-wide">
                System Average
              </p>
            </OrganicCardContent>
          </OrganicCard>

          {/* Card 3: Total Requests (Emerald) */}
          <OrganicCard className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30">
            <OrganicCardHeader>
              <OrganicCardTitle className="text-emerald-700 dark:text-emerald-300 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                Total Requests
              </OrganicCardTitle>
            </OrganicCardHeader>
            <OrganicCardContent className="pt-0">
              <div className="text-4xl font-serif text-emerald-800 dark:text-emerald-100">2,673</div>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-300/80 mt-2 font-bold uppercase tracking-wide">
                Last 24 Hours
              </p>
            </OrganicCardContent>
          </OrganicCard>
        </div>

        {/* Model List */}
        <div className="space-y-4">
          {(Array.isArray(models) && models.length > 0) ? models.map((model) => (
            <OrganicCard
              key={model.id}
              className="bg-white/60 dark:bg-stone-900/40 hover:bg-white/80 dark:hover:bg-stone-900/60 border-white dark:border-white/5 hover:shadow-lg transition-all duration-300"
            >
              <OrganicCardContent className="p-4 md:p-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
                  
                  {/* LEFT SECTION: Icon + Names */}
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    {getStatusIcon(model.status)}
                    <div>
                      <h3 className="text-lg font-serif font-bold text-stone-800 dark:text-stone-100">
                        {model.name}
                      </h3>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                        {model.provider}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SECTION: Stats + Actions */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 w-full md:w-auto">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:gap-12 w-full md:w-auto">
                      {/* Latency */}
                      <div className="text-left md:text-center md:w-24">
                        <div className={`text-xl font-bold ${getLatencyColor(model.latency)}`}>
                          {model.latency > 0 ? `${model.latency}ms` : "-"}
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-bold">Latency</p>
                      </div>

                      {/* Requests */}
                      <div className="text-left md:text-center md:w-24">
                        <div className="text-xl font-bold text-sky-600 dark:text-sky-400">
                          {model.requests || 0}
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-bold">Requests</p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t border-stone-100 dark:border-stone-800 pt-4 md:pt-0 mt-2 md:mt-0">
                        
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-bold ${
                          model.status === "active"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                            : "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400"
                        }`}
                      >
                        {model.status}
                      </Badge>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full border-2 border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-emerald-200 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-stone-800 bg-transparent h-9 px-4 text-xs uppercase tracking-wider font-bold"
                        >
                          Config
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white shadow-md shadow-orange-200 dark:shadow-none h-9 px-6 text-xs uppercase tracking-wider font-bold"
                        >
                          Test
                        </Button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Last Updated Footer */}
                {model.lastUpdated && (
                    <div className="mt-4 pt-3 border-t border-stone-100/50 dark:border-stone-800/50 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-600"></div>
                        <p className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500">
                        Last updated: {model.lastUpdated}
                        </p>
                    </div>
                )}
              </OrganicCardContent>
            </OrganicCard>
          )) : (
             <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-full bg-stone-100 dark:bg-stone-900 mb-4 text-stone-400 dark:text-stone-600">
                    <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif text-stone-600 dark:text-stone-300">No Models Connected</h3>
                <p className="text-stone-400 dark:text-stone-500 text-sm">Refresh or check your connection.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}