import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Skeleton = ({ className = "", variant = "default" }) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded";
  const variants = {
    default: "h-4",
    text: "h-4 w-3/4",
    title: "h-6 w-1/2",
    circle: "rounded-full",
    card: "h-48",
    button: "h-10 w-24"
  };
  
  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{
        animation: 'shimmer 2s infinite'
      }}
    />
  );
};

 const TransactionDashboardSkeleton = () => {
  return (
    <main className="flex-1 overflow-auto p-6 bg-gray-50">
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
      
      {/* Header Section */}
      <div className="mb-6">
        <Skeleton variant="title" className="w-48 mb-6" />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton variant="circle" className="w-10 h-10" />
                  <Skeleton className="w-12 h-4" />
                </div>
                <Skeleton variant="title" className="w-32 h-8 mb-2" />
                <Skeleton className="w-24 h-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="mb-6 border-none">
          <TabsTrigger value="transactions" disabled>
            <Skeleton className="w-24 h-4 bg-gray-300" />
          </TabsTrigger>
          <TabsTrigger value="overview" disabled>
            <Skeleton className="w-20 h-4 bg-gray-300" />
          </TabsTrigger>
          <TabsTrigger value="budgets" disabled>
            <Skeleton className="w-20 h-4 bg-gray-300" />
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card className="border-none shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton variant="title" className="w-40" />
                <Skeleton variant="button" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden border-none shadow-none">
                    {/* Image placeholder */}
                    <Skeleton className="w-full h-40 rounded-none" />
                    
                    <CardContent className="p-4">
                      {/* Title */}
                      <Skeleton variant="title" className="w-3/4 mb-3" />
                      
                      {/* Date */}
                      <Skeleton className="w-32 h-3 mb-3" />
                      
                      {/* Badges */}
                      <div className="flex gap-2 mb-3">
                        <Skeleton className="w-20 h-6 rounded-full" />
                        <Skeleton className="w-20 h-6 rounded-full" />
                      </div>
                      
                      {/* Notes */}
                      <Skeleton className="w-full h-3 mb-2" />
                      <Skeleton className="w-5/6 h-3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card className="border-none shadow-none">
              <CardHeader>
                <Skeleton variant="title" className="w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton variant="circle" className="w-10 h-10" />
                      <div className="flex-1">
                        <Skeleton className="w-32 h-4 mb-2" />
                        <Skeleton className="w-24 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-20 h-5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card className="border-none shadow-none">
              <CardHeader>
                <Skeleton variant="title" className="w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="w-32 h-3" />
                    </div>
                    <Skeleton className="w-full h-2 rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budgets Tab */}
        <TabsContent value="budgets">
          <Card className="border-none shadow-none">
            <CardHeader>
              <Skeleton variant="title" className="w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg">
                  <Skeleton variant="circle" className="w-12 h-12" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="w-32 h-5" />
                      <Skeleton className="w-16 h-6 rounded-full" />
                    </div>
                    <Skeleton className="w-48 h-3" />
                    <Skeleton className="w-full h-2 rounded-full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default TransactionDashboardSkeleton;
