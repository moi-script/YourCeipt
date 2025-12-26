import React, { useEffect, useState } from "react";
import { DashboardSkeleton } from "@/components/loaders/AiSkeleton";
import {
  RefreshCw,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AIModelDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState(null);

  useEffect(() => {
    console.error('Fetching ai models ');
    const fetchAi = async () => {
    console.log('Fetching ai --> ');
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/extract/getModels");
        const data = await res.json();
        setModels(data.models);
        setIsLoading(false);
      } catch (err) {
        console.error("Unable to fetch ai models");
      }
    };
    fetchAi();

  }, []);

  useEffect(() => {
    console.log('Model list :: ', models);
  }, [models]);


  const handleRefresh = () => {
    setIsRefreshing(true);

    const fetchAi = async () => {
        console.log('Fetching ai --> ');
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/extract/getModels");
        const data = await res.json();
        setModels(data.models);
        setIsLoading(false);
      } catch (err) {
        console.error("Unable to fetch ai models");
      }
    };
    fetchAi();
    setIsRefreshing(false);

    // Simulate API call
    // fetchAi(setModels);
  };

  const getStatusIcon = (status) => {
    return status === "active" ? (
      // Changed to Mint Green/Emerald-400 match
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    ) : (
      <XCircle className="w-5 h-5 text-slate-400" />
    );
  };

  if(isLoading) {
    console.log('The page is loading :: ', isLoading);
    return <DashboardSkeleton/>
  }

  const getLatencyColor = (latency) => {
    if (latency === 0) return "text-slate-400";
    // Adjusted for light mode contrast
    if (latency < 200) return "text-emerald-600";
    if (latency < 300) return "text-orange-500";
    return "text-rose-500";
  };

  return (
    // MAIN BG: Changed from dark gradient to light slate/white theme
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {/* Typography: Changed text-white to text-slate-900 */}
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              AI Model Dashboard
            </h1>
            <p className="text-slate-500">
              Monitor and manage your AI model 
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            // BUTTON: Emerald Green #10b981 (bg-emerald-500)
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh Models
          </Button>
        </div>

        {/* Stats Cards - Using the Pastel Theme from the Image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Active Models -> The "Income" Style (Cyan/Sky) */}
          <Card className="bg-sky-50 border-sky-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sky-900 text-sm font-medium flex items-center">
                <Activity className="w-4 h-4 mr-2 text-blue-500" />
                Active Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sky-700">3</div>
              <p className="text-xs text-sky-600/80 mt-1 font-medium">
                Out of 4 total
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Avg Latency -> The "Net Savings" Style (Amber/Orange) */}
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

          {/* Card 3: Total Requests -> The "Savings Rate" Style (Emerald/Mint) */}
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

        {/* Model List
        
        */}
        <div className="space-y-4">
          { (Array.isArray(models) && models.length > 0 ) &&  models.map((model) => (
            // LIST CARDS: Clean White bg with light slate border
            <Card
              key={model.id}
              className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(model.status)}
                      <div>
                        {/* Text Colors: Dark Slate for headings */}
                        <h3 className="text-lg font-bold text-slate-800">
                          {model.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {model.provider}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    {/* Latency */}
                    <div className="text-center w-24">
                      <div
                        className={`text-xl font-bold ${getLatencyColor(
                          model.latency
                        )}`}
                      >
                        {model.latency > 0 ? `${model.latency}ms` : "-"}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        Latency
                      </p>
                    </div>

                    {/* Requests */}
                    <div className="text-center w-24">
                      {/* Changed to Blue-500 to match "Entertainment" icon */}
                      <div className="text-xl font-bold text-blue-500">
                        {model.requests}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        Requests
                      </p>
                    </div>

                    {/* Status Badge - Using "Pill" style backgrounds */}
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

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        // Outline Button: Slate border, dark text
                        className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Configure
                      </Button>
                      <Button
                        size="sm"
                        // Test Button: Burnt Orange #f97316 (bg-orange-500)
                        className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Last Updated - Lighter grey divider */}
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
