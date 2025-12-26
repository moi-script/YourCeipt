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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export default function AIModelDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const {setIsModelLoading, isModelLoading,  models, setModels} = useAuth();
  // const [models, setModels] = useState(null);
// setIsModelLoading,
      // isModelLoading,
      // models,
      // setModels,
  // // ... (Your existing useEffects remain the same) ...
  // useEffect(() => {
  //   console.error('Fetching ai models ');
  //   const fetchAi = async () => {
  //   console.log('Fetching ai --> ');
  //     try {
  //       setIsLoading(true);
  //       const res = await fetch("http://localhost:3000/extract/getModels");
  //       const data = await res.json();
  //       setModels(data.models);
  //       setIsLoading(false);
  //     } catch (err) {
  //       console.error("Unable to fetch ai models");
  //     }
  //   };
  //   fetchAi();

  // }, []);

  useEffect(() => {
    console.log('Model list :: ', models);
  }, [models]);


  const handleRefresh = () => {
    setIsRefreshing(true);
    // ... your fetch logic ...

     const fetchAi = async () => {
    console.log('Fetching ai --> ');
      try {
        setIsModelLoading(true);
        const res = await fetch("http://localhost:3000/extract/getModels");
        const data = await res.json();
        setModels(data.models);
        setIsModelLoading(false);
      } catch (err) {
        console.error("Unable to fetch ai models");
      }
    };
    fetchAi();
    setIsRefreshing(false);

  };

  const getStatusIcon = (status) => {
    return status === "active" ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
    ) : (
      <XCircle className="w-5 h-5 text-slate-400 shrink-0" />
    );
  };

  if (isModelLoading) {
    return <DashboardSkeleton />;
  }

  const getLatencyColor = (latency) => {
    if (latency === 0) return "text-slate-400";
    if (latency < 200) return "text-emerald-600";
    if (latency < 300) return "text-orange-500";
    return "text-rose-500";
  };

  return (
    // MAIN BG: Adjusted padding for mobile (p-4) vs desktop (md:p-8)
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header: Stacked on mobile, Row on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              AI Model Dashboard
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              Monitor and manage your AI model usage
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm w-full sm:w-auto"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh Models
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Card 1 */}
          <Card className="bg-sky-50 border-sky-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sky-900 text-sm font-medium flex items-center">
                <Activity className="w-4 h-4 mr-2 text-blue-500" />
                Active Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-700">
                {(Array.isArray(models) && models.length > 0) ? models.length : 0}
              </div>
              <p className="text-xs text-sky-600/80 mt-1 font-medium">
                Free models
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="bg-amber-50 border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-900 text-sm font-medium flex items-center">
                <Zap className="w-4 h-4 mr-2 text-orange-500" />
                Avg Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">249ms</div>
              <p className="text-xs text-amber-600/80 mt-1 font-medium">
                Across active models
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="bg-emerald-50 border-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-900 text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700">2,673</div>
              <p className="text-xs text-emerald-600/80 mt-1 font-medium">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Model List */}
        <div className="space-y-4">
          {(Array.isArray(models) && models.length > 0) && models.map((model) => (
            <Card
              key={model.id}
              className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
            >
              <CardContent className="p-4 md:p-6">
                
                {/* MOBILE LAYOUT STRATEGY: 
                  - Use Flex-col on mobile to stack everything vertically.
                  - Use Flex-row on desktop (md:) to put them in a line.
                */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
                  
                  {/* LEFT SECTION: Icon + Names */}
                  <div className="flex items-center space-x-3 w-full md:w-auto">
                    {getStatusIcon(model.status)}
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {model.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {model.provider}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SECTION: Stats + Actions */}
                  {/* Mobile: Grid for stats, Flex for buttons. Desktop: Flex row for all. */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto">
                    
                    {/* Stats Grid (Latency/Requests) */}
                    <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:gap-8 w-full md:w-auto">
                        
                      {/* Latency */}
                      <div className="text-left md:text-center md:w-24">
                        <div className={`text-xl font-bold ${getLatencyColor(model.latency)}`}>
                          {model.latency > 0 ? `${model.latency}ms` : "-"}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Latency</p>
                      </div>

                      {/* Requests */}
                      <div className="text-left md:text-center md:w-24">
                        <div className="text-xl font-bold text-blue-500">
                          {model.requests}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Requests</p>
                      </div>
                    </div>

                    {/* Status & Actions - Full width on mobile, auto on desktop */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                        
                      {/* Status Badge */}
                      <Badge
                        variant="outline"
                        className={`${
                          model.status === "active"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-slate-100 border-slate-200 text-slate-500"
                        }`}
                      >
                        {model.status}
                      </Badge>

                      {/* Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                          Configure
                        </Button>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                        >
                          Test
                        </Button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Last Updated */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Last updated: {model.lastUpdated}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}