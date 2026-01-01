
// 




const obj = {
budgetList: [
        {
            "_id": "69524e5eec45ffe9c65ab624",
            "userId": "6951c9f5e466e2821a5eb732",
            "category": "transportation",
            "budgetName": "Transportation",
            "budgetAmount": 8000,
            "spent": null,
            "color": "#d97706",
            "__v": 0
        },
        {
            "_id": "69524e5eec45ffe9c65ab626",
            "userId": "6951c9f5e466e2821a5eb732",
            "category": "dining",
            "budgetName": "Dining Out",
            "budgetAmount": 6000,
            "spent": null,
            "color": "#10b981",
            "__v": 0
        },
        {
            "_id": "69524e5eec45ffe9c65ab628",
            "userId": "6951c9f5e466e2821a5eb732",
            "category": "entertainment",
            "budgetName": "Entertainment",
            "budgetAmount": 5000,
            "spent": null,
            "color": "#34d399",
            "__v": 0
        },
        {
            "_id": "69524e5eec45ffe9c65ab62a",
            "userId": "6951c9f5e466e2821a5eb732",
            "category": "utilities",
            "budgetName": "Utilities",
            "budgetAmount": 4000,
            "spent": null,
            "color": "#f97316",
            "__v": 0
        },
        {
            "_id": "69527c207c0a3a1d8c50af87",
            "userId": "6951c9f5e466e2821a5eb732",
            "category": "other",
            "budgetName": "Mobile Legends",
            "budgetAmount": 2000,
            "spent": null,
            "color": "#f97316",
            "__v": 0
        }
    ]
}


const getTotalBalance = (budgetList) => {
    return budgetList.reduce((total, value) => {
        return total + value.budgetAmount
    }, 0)
}


//  Last month -> scopes {1-30 days } || Current Month  {1-30 days}


const getMonth = (date) => new Date(date).getMonth();

const currentMonth = 10; // November (0-based)
const lastMonth = 9;     // October



const getMonthlyIncome = (month, transactions) =>
  transactions
    .filter(t => t.type === "income" && getMonth(t.date) === month)
    .reduce((sum, t) => sum + t.amount, 0);


const getMonthlyExpenses = (month, transactions) =>
  transactions
    .filter(t => t.type === "expense" && getMonth(t.date) === month)
    .reduce((sum, t) => sum + t.amount, 0);
    

const percentageChange = (current, previous) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
};




const savingsGoal = 10000;
const totalBalance = 24580;

const savingsProgress = (totalBalance / savingsGoal) * 100;


const incomeCurrent = getMonthlyIncome(currentMonth);
const incomeLast = getMonthlyIncome(lastMonth);

const expenseCurrent = getMonthlyExpenses(currentMonth);
const expenseLast = getMonthlyExpenses(lastMonth);

const incomeChange = percentageChange(incomeCurrent, incomeLast);
const expenseChange = percentageChange(expenseCurrent, expenseLast);


// const stats = [
//   {
//     title: "Total Balance",
//     value: "$24,580.00",
//     change: "+12.5%",    
//     isPositive: true,
//     icon: Wallet,
//     color: "emerald",
//   },
//   {
//     title: "Monthly Income",
//     value: "$8,420.00",
//     change: "+8.2%",
//     isPositive: true,
//     icon: TrendingUp,
//     color: "emerald",
//   },
//   {
//     title: "Monthly Expenses",
//     value: "$5,230.00",
//     change: "-3.1%",
//     isPositive: true,
//     icon: TrendingDown,
//     color: "orange",
//   },
//   {
//     title: "Savings Goal",
//     value: "68%",
//     change: "Target: $10k",
//     isPositive: true,
//     icon: PieChart,
//     color: "blue",
//   },
// ];



console.log(getTotalBalance(obj.budgetList));