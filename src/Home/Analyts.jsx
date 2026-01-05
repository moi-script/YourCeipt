import React, { useEffect, useState } from "react";
import {
  TrendingDown,
  Store,
  Target,
  Activity,
  Home,
  Coffee,
  Wallet,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Utensils,      // Food
  Car,           // Transportation
  Ticket,        // Entertainment
  ShoppingBag,   // Shopping
  Zap,           // Utilities
  TrendingUp,    // Income
  HeartPulse,    // Healthcare
  CircleEllipsis, // Other
  Leaf

} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { calculateKeyInsights, getCategorySummaries, getMerchantPatterns, processBudgetInsights,
   transformBudgetsToInsights,
    transformToDailyHeatmap,
    transformToMerchantInsights
   } from "@/api/analyticsAction";


const CATEGORY_MAP = {
  Food: { icon: Utensils, color: "emerald", iconColor: "text-emerald-600" },
  Transportation: { icon: Car, color: "blue", iconColor: "text-blue-600" },
  Entertainment: { icon: Ticket, color: "purple", iconColor: "text-purple-600" },
  Shopping: { icon: ShoppingBag, color: "orange", iconColor: "text-orange-600" },
  Utilities: { icon: Zap, color: "yellow", iconColor: "text-yellow-600" },
  Income: { icon: TrendingUp, color: "green", iconColor: "text-green-600" },
  Healthcare: { icon: HeartPulse, color: "red", iconColor: "text-red-600" },
  Other: { icon: CircleEllipsis, color: "stone", iconColor: "text-stone-600" },
};

const CATEGORY_CONFIG = {
  "dining": { icon: Coffee, color: "emerald" },
  "transportation": { icon: Car, color: "blue" },
  "entertainment": { icon: Ticket, color: "sky" },
  "shopping": { icon: ShoppingBag, color: "orange" },
  "utilities": { icon: Zap, color: "yellow" },
  "healthcare": { icon: HeartPulse, color: "red" },
  "other": { icon: CircleEllipsis, color: "stone" }
};


// --- REUSABLE ORGANIC COMPONENTS (Dark Mode Adapted) ---

const Card = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md border border-white/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-2 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-serif text-stone-800 dark:text-stone-100 ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-stone-500 dark:text-stone-400 mt-1 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Badge = ({ children, className = "", variant = "default" }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 rounded-full shadow-sm hover:shadow-md active:scale-95";
    const variants = {
      default: "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white",
      outline: "border-2 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 bg-transparent shadow-none",
      ghost: "hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 text-stone-400 dark:text-stone-500 bg-transparent shadow-none",
    };
    const sizes = {
      default: "px-4 py-2 text-xs uppercase tracking-wider",
      sm: "px-3 py-1.5 text-[10px]",
    };
    
    return (
      <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
        {children}
      </button>
    );
};

const Tabs = ({ children, defaultValue, className = "" }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    
    const childrenWithProps = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { activeTab, setActiveTab });
      }
      return child;
    });
  
    return <div className={className}>{childrenWithProps}</div>;
};
  
const TabsList = ({ children, activeTab, setActiveTab, className = "" }) => (
  <div 
    className={`
      flex gap-2 p-1.5 rounded-full 
      overflow-x-auto w-full flex-nowrap justify-start no-scrollbar 
      ${className}
    `}
  >
    {React.Children.map(children, child => 
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ children, value, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(value)}
        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === value 
            ? "bg-white dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 shadow-sm" 
            : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-white/50 dark:hover:bg-stone-800/50"
        }`}
    >
        {children}
    </button>
);
  
const TabsContent = ({ children, value, activeTab, className = "" }) => {
    if (activeTab !== value) return null;
    return <div className={`animate-in fade-in zoom-in-95 duration-300 ${className}`}>{children}</div>;
};

const Progress = ({ value = 0, className = "" }) => (
  <div className={`w-full bg-stone-100 dark:bg-stone-800 rounded-full h-3 overflow-hidden ${className}`}>
    <div 
      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

// --- DUMMY DATA ---

const dummyMonthlyData = {
  totalIncome: 50000,
  totalExpenses: 30000,
  netSavings: 20000,
  savingsRate: 40,
  incomeStability: 95,
};

// const dummySpendingTrend = [
//   { month: "Jan", income: 40000, expense: 30000 },
//   { month: "Feb", income: 45000, expense: 28000 },
//   { month: "Mar", income: 50000, expense: 32000 },
//   { month: "Apr", income: 48000, expense: 31000 },
// ];

const dummyCategoryInsights = [
  {
    name: "Food & Dining",
    spent: 8420,
    budget: 10000,
    color: "emerald",
    icon: Coffee,
    status: "healthy",
    trend: "up",
    change: 5.2,
    lastMonth: 8000,
  },
  {
    name: "Entertainment",
    spent: 1850,
    budget: 3000,
    color: "blue",
    icon: Home,
    status: "alert",
    trend: "down",
    change: -12,
    lastMonth: 2100,
  },
  {
    name: "Shopping",
    spent: 4800,
    budget: 5000,
    color: "orange",
    icon: Store,
    status: "alert",
    trend: "up",
    change: 36,
    lastMonth: 3500,
  },
];

const dummyMerchantInsights = [
  {
    name: "SM Supermarket",
    visits: 12,
    totalSpent: 4200,
    avgSpent: 350,
    category: "Groceries",
  },
  {
    name: "7-Eleven",
    visits: 18,
    totalSpent: 1800,
    avgSpent: 100,
    category: "Convenience",
  },
  {
    name: "Jollibee",
    visits: 5,
    totalSpent: 1200,
    avgSpent: 240,
    category: "Food",
  },
];

const dummyDailySpending = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  amount: Math.floor(Math.random() * 12000), // random amount between 0-12k
}));

// Function to map colors to Organic/Emerald palette (Updated for Dark Mode)
function dummyGetColorClass(color) {
  const mapping = {
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-100 dark:border-emerald-800/30",
    },
    blue: {
      bg: "bg-sky-50 dark:bg-sky-900/20",
      text: "text-sky-700 dark:text-sky-300",
      border: "border-sky-100 dark:border-sky-800/30",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-700 dark:text-orange-300",
      border: "border-orange-100 dark:border-orange-800/30",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-100 dark:border-purple-800/30",
    },
    teal: {
      bg: "bg-teal-50 dark:bg-teal-900/20",
      text: "text-teal-700 dark:text-teal-300",
      border: "border-teal-100 dark:border-teal-800/30",
    },
  };
  return (
    mapping[color] || {
      bg: "bg-stone-50 dark:bg-stone-800/50",
      text: "text-stone-600 dark:text-stone-300",
      border: "border-stone-200 dark:border-stone-700",
    }
  );
}

export function AnalyticsDashBoards() {
  return (
    <>
      <Analytics
        monthlyData={dummyMonthlyData}
        // spendingTrend={dummySpendingTrend}
        // categoryInsights={dummyCategoryInsights}
        // merchantInsights={dummyMerchantInsights}
        // dailySpending={dummyDailySpending}
        getColorClass={dummyGetColorClass}
      />
    </>
  );
}

export default function Analytics({
  monthlyData,
  // spendingTrend,
  // categoryInsights,
  // merchantInsights,
  // dailySpending,
  getColorClass,
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [metricValue, setMetricValue] = useState(null);  
  const { metricsAnalytic, getMetrics, totalIncome, totalSpent, spendingTrend, categorySpent, userReceipts } = useAuth(); // metricsAnalytic.info -> transaction, metricsAnalytic.setMetric -> (transaction, date); 
  const [transformInsights, setTransformInsights] = useState(null);
  const [categoryInsights, setCategoryInsights] = useState(null);
  const [merchantInsights, setMerchantInsights] = useState(null);
  const [merchantPattern, setMerchantPattern] = useState(null);
  const [dailySpending, setDailySpending] = useState(null);
  const [keyInsights, setKeyInsights] = useState(null);
  const [categorySummaries, setCagorySummaries] = useState({});
  useEffect(() => {
    if(metricsAnalytic.info){
    setMetricValue(getMetrics(metricsAnalytic.info, selectedPeriod));

    }
    // console.log("Info ->", metricsAnalytic.info)

  }, [metricsAnalytic, selectedPeriod]);

  useEffect(() => {
    if(categorySpent) {
      setTransformInsights(transformBudgetsToInsights(categorySpent, CATEGORY_MAP));
      setCategoryInsights(processBudgetInsights(categorySpent, CATEGORY_CONFIG));
      setCagorySummaries(getCategorySummaries(categorySpent));
    }

  }, [categorySpent])

  useEffect(() => {
    
    if(userReceipts) {
      setMerchantInsights(transformToMerchantInsights(userReceipts));
      setDailySpending(transformToDailyHeatmap(userReceipts));
      setKeyInsights(calculateKeyInsights(userReceipts));

    }
  }, [userReceipts])

  useEffect(() => {
    if(merchantInsights){
      setMerchantPattern(getMerchantPatterns(merchantInsights));
    }
  }, [merchantInsights])
  
// const spendingTrend = calculateMonthlyTrendClientSide(receipts, 2024);


  useEffect(() => {
    console.log('Metric value :: ', metricValue);
  }, [metricValue])



  return (
    // 1. BACKGROUND: 
    // Light: Warm bone white (#f2f0e9) 
    // Dark: Deep Stone (#0c0a09)
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden font-sans text-stone-800 dark:text-stone-100 p-4 sm:p-6 pb-20 transition-colors duration-300">
      
      {/* Decorative Blobs - Adjusted opacity for Dark Mode */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100 dark:bg-emerald-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none animate-pulse"></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-orange-100 dark:bg-orange-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 dark:bg-stone-800/40 border border-white/60 dark:border-white/10 backdrop-blur-md mb-3 shadow-sm">
               <Sparkles className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
               <span className="text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">Deep Dive</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif italic text-[#2c2c2c] dark:text-stone-100">Analytics Flow</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">
              Insights into your financial ecosystem.
            </p>
          </div>
          
          {/* Period Selector */}
          <div className="bg-white/40 dark:bg-stone-900/40 p-1.5 rounded-full border border-white/50 dark:border-white/5 backdrop-blur-sm flex gap-1">
            {["week", "month", "quarter", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedPeriod === period 
                    ? "bg-emerald-700 dark:bg-emerald-600 text-white shadow-md" 
                    : "text-stone-500 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-white/50 dark:hover:bg-stone-700/50"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Big Picture Stats - "Floating Pebbles" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          
          {/* Total Income (Emerald) */}
          <Card className="bg-white/60 dark:bg-stone-900/40 border-white/60 dark:border-white/5">
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30">
                  +12%
                </Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                Total Income
              </p>
              <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
                ₱{totalIncome}
              </h3>
            </CardContent>
          </Card>

          {/* Total Expenses (Orange) */}
          <Card className="bg-white/60 dark:bg-stone-900/40 border-white/60 dark:border-white/5">
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600 dark:text-orange-400">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <Badge className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-800/30">
                  +8%
                </Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                Total Expenses
              </p>
              <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
                ₱{totalSpent?.toFixed(2) || 0}
              </h3>
            </CardContent>
          </Card>

          {/* Net Savings (Blue/Teal) */}
          <Card className="bg-white/60 dark:bg-stone-900/40 border-white/60 dark:border-white/5">
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="bg-sky-100 dark:bg-sky-900/30 p-2.5 rounded-xl text-sky-600 dark:text-sky-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <Badge className="bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800/30">
                  Healthy
                </Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                Net Savings
              </p>
              <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
                ₱{metricValue?.netSavings.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          {/* Savings Rate (Emerald) */}
          <Card className="bg-white/60 dark:bg-stone-900/40 border-white/60 dark:border-white/5">
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Target className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30">
                  On Track
                </Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                Savings Rate
              </p>
              <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
                {metricValue?.savingsRate}%
              </h3>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-stone-900/40 border-white/60 dark:border-white/5">
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl text-purple-600 dark:text-purple-400">
                  <Activity className="w-5 h-5" />
                </div>
                <Badge className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/30">
                  Excellent
                </Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
                Income Stability
              </p>
              <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
                {metricValue?.stabilityScore}%
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/40 dark:bg-stone-900/40 border border-white/50 dark:border-white/5 backdrop-blur-md p-1.5">
            <TabsTrigger value="overview">Spending Overview</TabsTrigger>
            <TabsTrigger value="categories">Category Insights</TabsTrigger>
            <TabsTrigger value="merchants">Merchant Insights</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow Timeline</TabsTrigger>
          </TabsList>

          {/* 1. Spending Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Spending Trend */}
              <Card className="bg-white/70 dark:bg-stone-900/60 border-white dark:border-white/5">
                <CardHeader>
                  <CardTitle>Monthly Trend</CardTitle>
                  <CardDescription>
                    Income vs Expenses over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {spendingTrend?.map((data, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide">
                            {data.month}
                          </span>
                          <div className="flex gap-4 text-xs font-medium">
                            <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                              ↑ ₱{data.income.toLocaleString()}
                            </span>
                            <span className="text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                              ↓ ₱{data.expense.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="relative h-6 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          {/* Income Bar (Background, lighter) */}
                          <div
                            className="absolute left-0 top-0 h-full bg-emerald-200 dark:bg-emerald-800/50"
                            style={{ width: `${(data.income / 55000) * 100}%` }}
                          />
                          {/* Expense Bar (Foreground, stronger) */}
                          <div
                            className="absolute left-0 top-0 h-full bg-orange-400/80 dark:bg-orange-600/80 rounded-r-full"
                            style={{
                              width: `${(data.expense / 55000) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="bg-white/70 dark:bg-stone-900/60 border-white dark:border-white/5">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Where your money goes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {transformInsights?.slice(0, 6).map((category, idx) => {
                      const percentage =
                        (category.spent / monthlyData.totalExpenses) * 100;
                      const colors = getColorClass(category.color);
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${colors.bg}`}>
                                <category.icon
                                  className={`w-4 h-4 ${colors.text}`}
                                />
                              </div>
                              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                                {category.name}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                              ₱{category.spent.toLocaleString()}
                            </span>
                          </div>
                          <div className="relative h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 top-0 h-full rounded-full ${colors.bg.replace(
                                "50",
                                "500"
                              )}`}
                              style={{ width: `${percentage}%`, backgroundColor: category.color === 'emerald' ? '#10b981' : category.color === 'blue' ? '#0ea5e9' : '#f97316' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spending Insights */}
          <Card className="border-orange-200/50 dark:border-orange-900/20 bg-orange-50/30 dark:bg-orange-900/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-200">
        <div className="bg-orange-100 dark:bg-orange-900/40 p-1.5 rounded-full">
          <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        Key Insights
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Spending Spike Insight */}
        <div className="bg-white/80 dark:bg-stone-900/80 rounded-[1.5rem] p-5 border border-white dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h4 className="font-bold text-stone-800 dark:text-stone-100">Spending Spike</h4>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {keyInsights?.spike?.name || "N/A"} increased by{" "}
            <span className="font-bold text-orange-600">
              {Math.abs(Math.round(keyInsights?.spike?.change || 0))}%
            </span>{" "}
            this month
          </p>
        </div>

        {/* Doing Well Insight */}
        <div className="bg-white/80 dark:bg-stone-900/80 rounded-[1.5rem] p-5 border border-white dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-stone-800 dark:text-stone-100">Doing Well</h4>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {keyInsights?.doingWell?.name || "N/A"} spending down by{" "}
            <span className="font-bold text-emerald-600">
              {Math.abs(Math.round(keyInsights?.doingWell?.change || 0))}%
            </span>
          </p>
        </div>

        {/* Income Insight (Placeholder logic) */}
        <div className="bg-white/80 dark:bg-stone-900/80 rounded-[1.5rem] p-5 border border-white dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h4 className="font-bold text-stone-800 dark:text-stone-100">Status</h4>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Monthly average:{" "}
            <span className="font-bold text-sky-600">
              ₱{(userReceipts?.reduce((acc, r) => acc + parseFloat(r.total), 0) / 2).toLocaleString()}
            </span>
          </p>
        </div>

      </div>
    </CardContent>
  </Card>


          </TabsContent>

         {/* 2. Category Insights */}
          <TabsContent value="categories" className="space-y-6">
            
            {/* --- TOP SUMMARY CARDS (The code you provided, refined) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Top Category (Emerald) */}
              <Card className="border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl">
                      <Coffee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70">Top Category</p>
                      <h4 className="font-serif text-lg text-emerald-900 dark:text-emerald-100">
                        {categoryInsights?.topCategory?.name || "N/A"}
                      </h4>
                    </div>
                  </div>
                  <p className="text-3xl font-serif text-emerald-700 dark:text-emerald-300">
                    ₱{(categoryInsights?.topCategory?.spent || 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              {/* Least Spending (Blue) */}
              <Card className="border-sky-100 dark:border-sky-900/30 bg-sky-50/50 dark:bg-sky-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-sky-100 dark:bg-sky-900/30 p-2.5 rounded-xl">
                      <Home className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600/70 dark:text-sky-400/70">Least Spending</p>
                      <h4 className="font-serif text-lg text-sky-900 dark:text-sky-100">
                        {categoryInsights?.leastSpending?.name || "N/A"}
                      </h4>
                    </div>
                  </div>
                  <p className="text-3xl font-serif text-sky-700 dark:text-sky-300">
                     ₱{(categoryInsights?.leastSpending?.spent || 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              {/* Overspending (Orange) */}
              <Card className="border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600/70 dark:text-orange-400/70">Highest Usage</p>
                      <h4 className="font-serif text-lg text-orange-900 dark:text-orange-100">
                        {categoryInsights?.overspending?.name || "None"}
                      </h4>
                    </div>
                  </div>
                  <p className="text-3xl font-serif text-orange-700 dark:text-orange-300">
                     {(categoryInsights?.overspending?.status === 'alert') ? 'High Alert' : 'Normal'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* --- NEW SECTION: DETAILED BREAKDOWN --- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h3 className="font-serif text-xl text-stone-800 dark:text-stone-100">Detailed Breakdown</h3>
                 <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                   {categoryInsights?.insights?.length || 0} Categories
                 </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(categoryInsights?.insights || []).map((category, idx) => {
                  // Helper variables for clean JSX
                  const colors = getColorClass(category.color);
                  const budgetAmount = category.budget || 1; // Prevent div by zero
                  const budgetUsage = (category.spent / budgetAmount) * 100;
                  const changeAbs = Math.abs(category.change || 0);
                  const isOverBudget = budgetUsage > 100;

                  return (
                    <Card
                      key={idx}
                      className={`
                        border border-white/60 dark:border-white/5 
                        bg-white/40 dark:bg-stone-900/40 
                        hover:bg-white/80 dark:hover:bg-stone-900/60 
                        hover:shadow-lg transition-all duration-300 cursor-pointer group
                      `}
                    >
                      <CardContent className="p-5">
                        {/* Header: Icon, Name, Money, Badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            {/* Icon Box */}
                            <div className={`
                              p-3 rounded-2xl shadow-sm transition-colors duration-300
                              ${colors.bg} group-hover:bg-white dark:group-hover:bg-stone-800
                            `}>
                              {category.icon && <category.icon className={`w-6 h-6 ${colors.text}`} />}
                            </div>
                            
                            {/* Text Info */}
                            <div>
                              <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100 leading-tight">
                                {category.name}
                              </h3>
                              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                                <span className="text-stone-900 dark:text-stone-200 font-bold">₱{(category.spent || 0).toLocaleString()}</span> 
                                <span className="opacity-60"> / ₱{(category.budget || 0).toLocaleString()}</span>
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <Badge
                            className={
                              category.status === "alert"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/30"
                                : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30"
                            }
                          >
                            {category.status}
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                            <span>Usage</span>
                            <span className={isOverBudget ? "text-red-500" : "text-stone-500"}>
                              {budgetUsage.toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={budgetUsage} 
                            className={`h-2.5 ${isOverBudget ? "[&>div]:bg-red-500" : ""}`} 
                          />
                        </div>

                        {/* Footer: Trends */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/50">
                          <div className="flex items-center gap-2">
                            {category.trend === "up" && (
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3 text-orange-500 dark:text-orange-400" />
                              </div>
                            )}
                            {category.trend === "down" && (
                              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-1 rounded-full">
                                <ArrowDownRight className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                              </div>
                            )}
                            <span
                              className={`text-xs font-bold ${
                                category.trend === "up"
                                  ? "text-orange-600 dark:text-orange-400"
                                  : category.trend === "down"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-stone-500"
                              }`}
                            >
                              {category.trend === "stable"
                                ? "Stable"
                                : `${changeAbs.toFixed(1)}% vs last month`}
                            </span>
                          </div>
                          
                          <span className="text-[10px] text-stone-400 dark:text-stone-600 font-medium">
                            Prev: ₱{(category.lastMonth || 0).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>




          {/* 3. Merchant Insights */}
          <TabsContent value="merchants" className="space-y-6">
            <Card className="bg-white/70 dark:bg-stone-900/60 border-white dark:border-white/5">
              <CardHeader>
                <CardTitle>Top Merchants</CardTitle>
                <CardDescription>
                  Where you shop most frequently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {merchantInsights?.map((merchant, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white/50 dark:bg-stone-800/40 rounded-[1.5rem] border border-stone-100 dark:border-white/5 hover:bg-white dark:hover:bg-stone-800/60 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-2xl shadow-emerald-200 dark:shadow-emerald-900/20 shadow-lg">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-serif text-lg text-stone-800 dark:text-stone-100">
                            {merchant.name}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                            <span className="font-bold bg-stone-100 dark:bg-stone-700/50 px-2 py-0.5 rounded-full">{merchant.visits} visits</span>
                            <span>•</span>
                            <span className="uppercase tracking-wider">
                              {merchant.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-stone-800 dark:text-stone-100">
                          ₱{merchant.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-xs text-stone-400 dark:text-stone-500">
                          ~₱{merchant.avgSpent} / visit
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100 dark:border-orange-900/20 bg-orange-50/30 dark:bg-orange-900/10">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-200">
        <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        Patterns
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Most Frequent Pattern */}
        <div className="bg-white/80 dark:bg-stone-900/80 rounded-[1.5rem] p-5 border border-orange-100 dark:border-orange-900/20 shadow-sm">
          <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-2">
            Most Frequent
          </h4>
          <p className="text-2xl font-serif text-orange-600 dark:text-orange-400 mb-1">
            {merchantPattern?.mostFrequent ? merchantPattern?.mostFrequent.name : "N/A"}
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {merchantPattern?.mostFrequent ? `${merchantPattern?.mostFrequent.visits} visits this month` : "No visits recorded"}
          </p>
        </div>

        {/* Biggest Spender Pattern */}
        <div className="bg-white/80 dark:bg-stone-900/80 rounded-[1.5rem] p-5 border border-emerald-100 dark:border-emerald-900/20 shadow-sm">
          <h4 className="font-bold text-stone-800 dark:text-stone-100 mb-2">
            Biggest Spender
          </h4>
          <p className="text-2xl font-serif text-emerald-600 dark:text-emerald-400 mb-1">
            {merchantPattern?.biggestSpender ? merchantPattern?.biggestSpender.name : "N/A"}
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {merchantPattern?.biggestSpender ? `₱${merchantPattern?.biggestSpender.totalSpent.toLocaleString()} total spent` : "No spending recorded"}
          </p>
        </div>

      </div>
    </CardContent>
  </Card>
          </TabsContent>

          {/* 4. Cash Flow Timeline */}
        <TabsContent value="cashflow" className="space-y-6">
        <Card className="bg-white/70 dark:bg-stone-900/60 border-white dark:border-white/5">
      <CardHeader>
        <CardTitle>Daily Heatmap</CardTitle>
        <CardDescription>
          Spending intensity for {new Date().toLocaleString('default', { month: 'long' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
          {dailySpending?.map((day) => {
            // Your existing intensity logic
            const intensity =
              day.amount > 10000 ? "special" :
              day.amount > 2000 ? "high" :
              day.amount > 1000 ? "medium" :
              day.amount > 500 ? "low" : "minimal";

            // Your existing color class logic
            const colorClass = 
              day.amount > 10000 ? "bg-emerald-600 dark:bg-emerald-500 shadow-lg shadow-emerald-200" :
              intensity === "high" ? "bg-orange-500 dark:bg-orange-600" :
              intensity === "medium" ? "bg-orange-300 dark:bg-orange-800/70" :
              intensity === "low" ? "bg-emerald-200 dark:bg-emerald-900/50" :
              "bg-stone-200 dark:bg-stone-800";

            return (
              <div
                key={day.day}
                className={`aspect-square rounded-xl ${colorClass} flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 relative group`}
              >
                <span className={`text-[10px] font-bold ${day.amount > 10000 ? "text-white" : "text-stone-600/50 dark:text-stone-400/50"}`}>
                  {day.day}
                </span>
                
                {/* Tooltip with Real Data */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-stone-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  Day {day.day}: ₱{day.amount.toLocaleString()}
                  {day.amount > 10000 && " 💰"}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend remains the same */}
      </CardContent>
    </Card>
  </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}