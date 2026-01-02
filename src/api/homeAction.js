// // Rythm
// // Total Balance
// // Monthly Expenses
// // Monthly Income
// // Saving Goals 
// // Recent Transaction gap by 3 weeks




//  const totalSpent = transactions
//       .reduce((sum, item) => {
//         return sum  + item.total
//       }, 0);



// const normalized = transactions.map(tx => ({
//     ...tx,
//     total: Number(tx.total ?? 0),
//     date: new Date(tx.metadata.datetime)
// }));

// // Total Balance = Total Income − Total Expenses
// const totalIncome = normalized
//     .filter(tx => tx.total > 0 && tx.metadata.type === "Income")
//     .reduce((sum, tx) => sum + tx.total, 0);

// const totalExpenses = normalized
//     .filter(tx => tx.total > 0 && tx.metadata.type !== "Income")
//     .reduce((sum, tx) => sum + tx.total, 0);

// // const totalBalance = totalIncome - totalExpenses;

// // budget - totalExpenses 


// // Monthly expenses
// const now = new Date();
// const currentMonth = now.getMonth();
// const currentYear = now.getFullYear();

// const monthlyExpenses = normalized
//     .filter(tx =>
//         tx.date.getMonth() === currentMonth &&
//         tx.date.getFullYear() === currentYear &&
//         tx.metadata.type !== "Income"
//     )
//     .reduce((sum, tx) => sum + tx.total, 0);

// // Monthly Income 
// const monthlyIncome = normalized
//     .filter(tx =>
//         tx.date.getMonth() === currentMonth &&
//         tx.date.getFullYear() === currentYear &&
//         tx.metadata.type === "Income"
//     )
//     .reduce((sum, tx) => sum + tx.total, 0);





// // Savings
// // Savings = Monthly Income − Monthly Expenses

// const savings = monthlyIncome - monthlyExpenses;
// const savingGoalPercent = 0.2; // 20%
// const savingGoalAmount = monthlyIncome * savingGoalPercent;

// // recent transaction 
// const THREE_WEEKS_MS = 21 * 24 * 60 * 60 * 1000;
// const cutoff = Date.now() - THREE_WEEKS_MS;

// const recentTransactions = normalized
//     .filter(tx => tx.date.getTime() >= cutoff)
//     .sort((a, b) => b.date - a.date);





// // const getDateFormat = () => {

// const monthList = ["January", "February", "March", "April", "May", "June", "July",
//     "August", "September", "October", "November", "December"];

// const isoDate = new Date().toISOString();

// const split = isoDate.split('T')[0];

// const monthIndex = new Date(split).getMonth();
// const day = new Date(split).getDate();
// const year = new Date(split).getFullYear();
// return [year, day, monthList[monthIndex]].join('-');
// // }
// // console.log(new Date().getFullYear());

// // overview
// // Recent transaction
// // Budget Overview 

// const dashboard = {
//     totalBalance,
//     monthlyExpenses,
//     monthlyIncome,
//     savings,
//     recentTransactions
// };




const d = new Date('2023-12-10');
console.log(d.getMonth());






