import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  Store,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Heart,
  Zap,
  ChevronRight,
  Flame,
  Coffee,
  Wallet,
  AlertCircle,
} from "lucide-react";

const dummyMonthlyData = {
  totalIncome: 50000,
  totalExpenses: 30000,
  netSavings: 20000,
  savingsRate: 40,
  incomeStability: 95,
};

const dummySpendingTrend = [
  { month: "Jan", income: 40000, expense: 30000 },
  { month: "Feb", income: 45000, expense: 28000 },
  { month: "Mar", income: 50000, expense: 32000 },
  { month: "Apr", income: 48000, expense: 31000 },
];

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

// Dummy getColorClass function
function dummyGetColorClass(color) {
  const mapping = {
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      border: "border-orange-200",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    teal: {
      bg: "bg-teal-100",
      text: "text-teal-600",
      border: "border-teal-200",
    },
  };
  return (
    mapping[color] || {
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
    }
  );
}

export function AnalyticsDashBoards() {
  return (
    <>
      <Analytics
        monthlyData={dummyMonthlyData}
        spendingTrend={dummySpendingTrend}
        categoryInsights={dummyCategoryInsights}
        merchantInsights={dummyMerchantInsights}
        dailySpending={dummyDailySpending}
        getColorClass={dummyGetColorClass}
      />
    </>
  );
}

export default function Analytics({
  monthlyData,
  spendingTrend,
  categoryInsights,
  merchantInsights,
  dailySpending,
  getColorClass,
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Analytics
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Deep insights into your spending patterns
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["week", "month", "quarter", "year"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Big Picture Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Total Income */}
          <Card className="border-secondary/20 bg-gradient-to-br from-secondary/10 to-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-secondary/20 p-2 rounded-lg">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                  +12%
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Total Income
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                ₱{monthlyData.totalIncome.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          {/* Total Expenses */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                  +8%
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Total Expenses
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                ₱{monthlyData.totalExpenses.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          {/* Net Savings */}
          <Card className="border-accent/20 bg-gradient-to-br from-accent/10 to-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-accent/20 p-2 rounded-lg">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                  Healthy
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Net Savings
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                ₱{monthlyData.netSavings.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          {/* Savings Rate */}
          <Card className="border-chart-5/20 bg-gradient-to-br from-chart-5/10 to-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-chart-5/20 p-2 rounded-lg">
                  <Target
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    style={{ color: "hsl(var(--chart-5))" }}
                  />
                </div>
                <Badge
                  className="text-xs"
                  style={{
                    backgroundColor: "hsl(var(--chart-5) / 0.2)",
                    color: "hsl(var(--chart-5))",
                    borderColor: "hsl(var(--chart-5) / 0.3)",
                  }}
                >
                  On Track
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Savings Rate
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                {monthlyData.savingsRate}%
              </h3>
            </CardContent>
          </Card>

          {/* Income Stability */}
          <Card className="border-secondary/30 bg-gradient-to-br from-secondary/15 to-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-secondary/20 p-2 rounded-lg">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                  Excellent
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Income Stability
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                {monthlyData.incomeStability}%
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="overview">Spending Overview</TabsTrigger>
            <TabsTrigger value="categories">Category Insights</TabsTrigger>
            <TabsTrigger value="merchants">Merchant Insights</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow Timeline</TabsTrigger>
          </TabsList>

          {/* 1. Spending Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Spending Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending Trend</CardTitle>
                  <CardDescription>
                    Income vs Expenses over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spendingTrend.map((data, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            {data.month}
                          </span>
                          <div className="flex gap-4 text-xs">
                            <span className="text-emerald-600">
                              ↑ ₱{data.income.toLocaleString()}
                            </span>
                            <span className="text-orange-600">
                              ↓ ₱{data.expense.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full bg-emerald-500 opacity-30"
                            style={{ width: `${(data.income / 50000) * 100}%` }}
                          />
                          <div
                            className="absolute left-0 top-0 h-full bg-orange-500"
                            style={{
                              width: `${(data.expense / 50000) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Where your money goes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryInsights.slice(0, 6).map((category, idx) => {
                      const percentage =
                        (category.spent / monthlyData.totalExpenses) * 100;
                      const colors = getColorClass(category.color);
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                                <category.icon
                                  className={`w-4 h-4 ${colors.text}`}
                                />
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                {category.name}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                              ₱{category.spent.toLocaleString()}
                            </span>
                          </div>
                          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 top-0 h-full ${colors.bg.replace(
                                "100",
                                "500"
                              )}`}
                              style={{ width: `${percentage}%` }}
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
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-slate-900">
                        Spending Spike
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      Shopping increased by{" "}
                      <span className="font-bold text-orange-600">62%</span>{" "}
                      this month
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-semibold text-slate-900">
                        Doing Well
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      Entertainment spending down by{" "}
                      <span className="font-bold text-emerald-600">12%</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-slate-900">
                        Income Stable
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      Consistent income at{" "}
                      <span className="font-bold text-blue-600">
                        ₱45,000/mo
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. Category Insights */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Coffee className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Top Category</p>
                      <h4 className="font-bold text-slate-900">
                        Food & Dining
                      </h4>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">₱8,420</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Home className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Least Spending</p>
                      <h4 className="font-bold text-slate-900">
                        Entertainment
                      </h4>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">₱1,850</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Overspending</p>
                      <h4 className="font-bold text-slate-900">Shopping</h4>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">+36%</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categoryInsights.map((category, idx) => {
                const colors = getColorClass(category.color);
                const budgetUsage = (category.spent / category.budget) * 100;
                const changeAbs = Math.abs(category.change);

                return (
                  <Card
                    key={idx}
                    className={`border-2 ${colors.border} hover:shadow-lg transition-shadow cursor-pointer`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${colors.bg}`}>
                            <category.icon
                              className={`w-6 h-6 ${colors.text}`}
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">
                              {category.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              ₱{category.spent.toLocaleString()} of ₱
                              {category.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            category.status === "alert"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {category.status}
                        </Badge>
                      </div>

                      <Progress value={budgetUsage} className="h-3 mb-4" />

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {category.trend === "up" && (
                            <ArrowUpRight className="w-4 h-4 text-orange-500" />
                          )}
                          {category.trend === "down" && (
                            <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                          )}
                          <span
                            className={
                              category.trend === "up"
                                ? "text-orange-600"
                                : category.trend === "down"
                                ? "text-emerald-600"
                                : "text-slate-600"
                            }
                          >
                            {category.trend === "stable"
                              ? "Stable"
                              : `${changeAbs.toFixed(1)}% vs last month`}
                          </span>
                        </div>
                        <span className="text-slate-500">
                          Last: ₱{category.lastMonth.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* 3. Merchant Insights */}
          <TabsContent value="merchants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Merchants This Month</CardTitle>
                <CardDescription>
                  Where you shop most frequently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {merchantInsights.map((merchant, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-xl">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {merchant.name}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span>{merchant.visits} visits</span>
                            <span>•</span>
                            <Badge variant="secondary" className="text-xs">
                              {merchant.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-slate-900">
                          ₱{merchant.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500">
                          ~₱{merchant.avgSpent} per visit
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  Spending Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Most Frequent
                    </h4>
                    <p className="text-2xl font-bold text-amber-600 mb-1">
                      7-Eleven
                    </p>
                    <p className="text-sm text-slate-600">
                      18 visits this month
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200">
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Biggest Spender
                    </h4>
                    <p className="text-2xl font-bold text-emerald-600 mb-1">
                      SM Supermarket
                    </p>
                    <p className="text-sm text-slate-600">₱4,200 total spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Cash Flow Timeline */}
          <TabsContent value="cashflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Spending Heatmap</CardTitle>
                <CardDescription>
                  Visualize your spending patterns throughout the month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-2">
                  {dailySpending.map((day) => {
                    const intensity =
                      day.amount > 10000
                        ? "special"
                        : day.amount > 2000
                        ? "high"
                        : day.amount > 1000
                        ? "medium"
                        : day.amount > 500
                        ? "low"
                        : "minimal";

                    const colorClass =
                      day.amount > 10000
                        ? "bg-emerald-500"
                        : intensity === "high"
                        ? "bg-red-500"
                        : intensity === "medium"
                        ? "bg-orange-400"
                        : intensity === "low"
                        ? "bg-yellow-300"
                        : "bg-slate-200";

                    return (
                      <div
                        key={day.day}
                        className={`aspect-square rounded ${colorClass} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform relative group`}
                      >
                        <span className="text-xs font-medium text-white drop-shadow">
                          {day.day}
                        </span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Day {day.day}: ₱{day.amount.toLocaleString()}
                          {day.amount > 10000 && " 💰"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-200 rounded"></div>
                    <span className="text-slate-600">Minimal (&lt;₱500)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                    <span className="text-slate-600">Low (₱500-1k)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-400 rounded"></div>
                    <span className="text-slate-600">Medium (₱1k-2k)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-slate-600">High (&gt;₱2k)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    <span className="text-slate-600">Special (&gt;₱10k)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
