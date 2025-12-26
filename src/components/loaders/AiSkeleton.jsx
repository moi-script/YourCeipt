import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Adjust import path as needed

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto animate-pulse">
        
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-10 w-64 bg-slate-200 rounded mb-3"></div>
            <div className="h-4 w-48 bg-slate-200 rounded"></div>
          </div>
          {/* Refresh Button Placeholder */}
          <div className="h-10 w-40 bg-slate-200 rounded-lg"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border-slate-100">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-slate-200 mr-2"></div>
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-9 w-16 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-slate-100 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Model List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border-slate-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Left Side: Icon + Titles */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-3 w-full">
                      {/* Status Icon */}
                      <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0"></div>
                      <div className="space-y-2">
                        <div className="h-6 w-48 bg-slate-200 rounded"></div>
                        <div className="h-4 w-24 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Metrics & Actions */}
                  <div className="flex items-center space-x-8">
                    {/* Latency */}
                    <div className="text-center w-24 flex flex-col items-center space-y-2">
                      <div className="h-6 w-12 bg-slate-200 rounded"></div>
                      <div className="h-3 w-10 bg-slate-100 rounded"></div>
                    </div>

                    {/* Requests */}
                    <div className="text-center w-24 flex flex-col items-center space-y-2">
                      <div className="h-6 w-12 bg-slate-200 rounded"></div>
                      <div className="h-3 w-12 bg-slate-100 rounded"></div>
                    </div>

                    {/* Badge */}
                    <div className="h-6 w-20 bg-slate-200 rounded-full"></div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <div className="h-8 w-20 bg-slate-200 rounded"></div>
                      <div className="h-8 w-16 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Footer Divider */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="h-3 w-32 bg-slate-100 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Model Button Skeleton */}
        <div className="mt-8 flex justify-center">
          <div className="h-14 w-48 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}