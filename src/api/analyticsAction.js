
// Income and expense for the last four months, oldest first. (`year` is kept
// for callers but the window can cross into the previous year in January.)
export const calculateMonthlyTrendClientSide = (receipts, year = new Date().getFullYear()) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const now = new Date();
    const months = Array.from({ length: 4 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 3 + i, 1));
    const monthlyData = months.map((d) => ({ month: monthNames[d.getMonth()], income: 0, expense: 0 }));
    const slot = (d) => months.findIndex((m) => m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth());

    (receipts || []).forEach(receipt => {
        const date = new Date(receipt?.metadata?.datetime);
        if (Number.isNaN(date.getTime())) return;

        const i = slot(date);
        if (i === -1) return;

        // total is a string on AI receipts and a number on manual ones.
        const total = parseFloat(String(receipt.total ?? 0).replace(/[^0-9.-]+/g, ''));
        if (!total) return;

        if (receipt.metadata?.type?.toLowerCase() === 'income') monthlyData[i].income += total;
        else monthlyData[i].expense += total;
    });

    return monthlyData;
};



export const transformBudgetsToInsights = (budgets, CATEGORY_MAP) => {
  // console.log('Budget for transform ::', budgets);
    return budgets.map((b) => {
        const config = CATEGORY_MAP[b.category] || CATEGORY_MAP.Other;

        // Logic for Status (Alert if spending > 85% of budget)
        const usageRatio = b.spent / b.budgetAmount;
        const status = usageRatio >= 0.85 ? "alert" : "healthy";

        return {
            name: b.budgetName,
            spent: b.spent || 0,
            budget: b.budgetAmount,
            color: config.color,
            icon: config.icon, // Lucide Component
            status: status,
            // For trend/change, you would usually compare with a previous month's record
            trend: "neutral",
            change: 0,
            lastMonth: 0,
        };
    });
};

export const processBudgetInsights = (budgets, CATEGORY_CONFIG) => {
  // console.log('Budgets for procssing :: ', budgets);
  // if (!budgets || budgets.length === 0) {
  //   return { 
  //       insights: [], 
  //       topCategory: null, 
  //       leastSpending: null, 
  //       overspending: null 
  //   };
  // }

  // 1. Map Mongoose data to your UI format
  const insights = budgets.map(b => {
    const config = CATEGORY_CONFIG[b.category] || CATEGORY_CONFIG["other"];
    const usage = (b.spent / b.budgetAmount) * 100;

    return {
      name: b.budgetName,
      spent: b.spent || 0,
      budget: b.budgetAmount,
      color: config?.color,
      icon: config?.icon,
      status: usage >= 90 ? "alert" : "healthy",
      // These would ideally come from a historical comparison
      trend: usage > 80 ? "up" : "down", 
      change: usage - 50, // Mock calculation for change
      lastMonth: b.spent * 0.9 // Mock last month data
    };
  });

  // 2. Identify "Top Category" (Highest spent)
  const topCategory = [...insights].sort((a, b) => b.spent - a.spent)[0];

  // 3. Identify "Least Spending" (Lowest spent)
  const leastSpending = [...insights].sort((a, b) => a.spent - b.spent)[0];

  // 4. Identify "Overspending" (Highest % usage)
  const overspending = [...insights].sort((a, b) => 
    (b.spent / b.budget) - (a.spent / a.budget)
  )[0];

  return { insights, topCategory, leastSpending, overspending };
};



export const transformToMerchantInsights = (receipts) => {
  if (!receipts || receipts.length === 0) return [];



  const merchantMap = receipts.reduce((acc, receipt) => {
    const merchantName = receipt.store || "Unknown Merchant";
    
    // Convert string total to number (clean non-numeric chars if necessary)
    const totalAmount = parseFloat(receipt.total) || 0;

    // Get primary category from the first item, or default to "General"
    const primaryCategory = receipt.items?.[0]?.category || "General";

    if (!acc[merchantName]) {
      acc[merchantName] = {
        name: merchantName,
        visits: 0,
        totalSpent: 0,
        category: primaryCategory,
      };
    }

    acc[merchantName].visits += 1;
    acc[merchantName].totalSpent += totalAmount;

    return acc;
  }, {});

  // Convert the object map back into an array and calculate averages
  return Object.values(merchantMap).map(merchant => ({
    ...merchant,
    // Rounding to 2 decimal places
    totalSpent: Math.round(merchant.totalSpent * 100) / 100,
    avgSpent: Math.round((merchant.totalSpent / merchant.visits) * 100) / 100
  }))
  // Optional: Sort by totalSpent descending
  .sort((a, b) => b.totalSpent - a.totalSpent);
};


export const getMerchantPatterns = (merchantInsights) => {
  if (!merchantInsights || merchantInsights.length === 0) {
    return { mostFrequent: null, biggestSpender: null };
  }

  

  // 1. Find Most Frequent (Highest visits)
  const mostFrequent = [...merchantInsights].sort((a, b) => b.visits - a.visits)[0];

  // 2. Find Biggest Spender (Highest totalSpent)
  const biggestSpender = [...merchantInsights].sort((a, b) => b.totalSpent - a.totalSpent)[0];

  return { mostFrequent, biggestSpender };
};

const isIncome = (r) => String(r?.metadata?.type || "").toLowerCase() === "income";
const parseAmount = (v) => {
  const n = parseFloat(String(v ?? 0).replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(n) ? n : 0;
};

// The AI and the manual form don't agree on names ("Groceries", "food",
// "Transport"), so fold them onto the categories the app knows.
const CATEGORY_ALIASES = {
  food: "Food", groceries: "Food", grocery: "Food", dining: "Food", restaurant: "Food",
  transport: "Transportation", transportation: "Transportation",
  health: "Healthcare", healthcare: "Healthcare", medical: "Healthcare",
  shopping: "Shopping", utilities: "Utilities", bills: "Utilities",
  entertainment: "Entertainment",
};
const canonicalCategory = (c) => CATEGORY_ALIASES[String(c || "").toLowerCase().trim()] || "Other";

// This month's spending per category, from what was actually spent. The donut
// used to be built from budgets, so it was empty for anyone without one.
export const spendingByCategory = (receipts, CATEGORY_MAP) => {
  const now = new Date();
  const totals = {};
  for (const r of receipts || []) {
    if (isIncome(r)) continue;
    const d = new Date(r?.metadata?.datetime);
    if (Number.isNaN(d.getTime()) || d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()) continue;
    const items = (r.items || []).filter((i) => parseAmount(i.price) > 0);
    if (items.length) {
      for (const i of items) {
        const key = canonicalCategory(i.category);
        totals[key] = (totals[key] || 0) + parseAmount(i.price) * (parseFloat(i.quantity) || 1);
      }
    } else {
      const key = canonicalCategory(r.category);
      totals[key] = (totals[key] || 0) + parseAmount(r.total);
    }
  }
  return Object.entries(totals)
    .map(([name, spent]) => ({ name, spent: Math.round(spent * 100) / 100, color: (CATEGORY_MAP[name] || CATEGORY_MAP.Other).color }))
    .sort((a, b) => b.spent - a.spent);
};

export const transformToDailyHeatmap = (receipts) => {
  // 1. Determine the number of days in the current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // 2. Initialize the array with zero amounts for every day
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    amount: 0,
  }));

  // 3. Fill in this month's spending. This used to add every receipt from
  // every month, income included, onto its day number, so a salary on the
  // 1st of any month showed as a giant spike.
  receipts.forEach((receipt) => {
    if (!receipt.metadata?.datetime || isIncome(receipt)) return;

    const date = new Date(receipt.metadata.datetime);
    if (Number.isNaN(date.getTime()) || date.getFullYear() !== now.getFullYear() || date.getMonth() !== now.getMonth()) return;
    dailyData[date.getDate() - 1].amount += parseAmount(receipt.total);
  });

  return dailyData;
};


export const calculateKeyInsights = (receipts) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const categoryTotals = {};

  receipts.forEach(receipt => {
    const date = new Date(receipt.metadata.datetime);
    const month = date.getMonth();
    const year = date.getFullYear();
    const amount = parseFloat(receipt.total) || 0;
    const category = receipt.items?.[0]?.category || "Other";

    if (!categoryTotals[category]) {
      categoryTotals[category] = { current: 0, previous: 0 };
    }

    if (month === currentMonth && year === currentYear) {
      categoryTotals[category].current += amount;
    } else if (month === prevMonth && year === prevMonthYear) {
      categoryTotals[category].previous += amount;
    }
  });

  // Convert to array of insights
  const insights = Object.keys(categoryTotals).map(cat => {
    const { current, previous } = categoryTotals[cat];
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    return { name: cat, change, current, previous };
  });

  // Identify the "Spike" (highest positive change)
  const spike = insights.sort((a, b) => b.change - a.change)[0];
  
  // Identify "Doing Well" (lowest/most negative change)
  const doingWell = insights.sort((a, b) => a.change - b.change)[0];

  return { spike, doingWell };
};





export const getCategorySummaries = (budgets) => {
  if (!budgets || budgets.length === 0) return { top: null, least: null, over: null };

  // 1. Top Category (Highest absolute 'spent' value)
  const top = [...budgets].sort((a, b) => (b.spent || 0) - (a.spent || 0))[0];

  // 2. Least Spending (Lowest absolute 'spent' value)
  const least = [...budgets].sort((a, b) => (a.spent || 0) - (b.spent || 0))[0];

  // 3. Overspending (Highest % usage: spent / budgetAmount)
  const over = [...budgets].sort((a, b) => {
    const usageA = (a.spent || 0) / a.budgetAmount;
    const usageB = (b.spent || 0) / b.budgetAmount;
    return usageB - usageA;
  })[0];

  // console.log('Result for getting the category summaries :: ', {top, least, over});
  return { top, least, over };
};