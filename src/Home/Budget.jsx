import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, AlertTriangle, Calendar, Edit2, Trash2, DollarSign, ShoppingCart, Home, Car, Utensils, Heart, Film, Zap } from 'lucide-react';

// Shadcn UI Components (simulated)
const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-[#2E282A] rounded-lg border border-slate-200 dark:border-[#3d3437] shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50";
  const variants = {
    default: "bg-[#E4572E] text-white hover:bg-[#E4572E]/90",
    outline: "border border-[#2E282A] dark:border-white/20 bg-transparent hover:bg-slate-100 dark:hover:bg-white/10",
    ghost: "hover:bg-slate-100 dark:hover:bg-white/10",
    destructive: "bg-[#E4572E] text-white hover:bg-[#E4572E]/90"
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
    icon: "w-10 h-10"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = "", ...props }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`} {...props}>
    {children}
  </span>
);

const Progress = ({ value = 0, className = "" }) => (
  <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden ${className}`}>
    <div 
      className="h-full bg-[#17BEBB] transition-all duration-300"
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 bg-white dark:bg-[#2E282A] border border-slate-300 dark:border-[#3d3437] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17BEBB] ${className}`}
    {...props}
  />
);

const Select = ({ children, value, onChange, className = "" }) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 bg-white dark:bg-[#2E282A] border border-slate-300 dark:border-[#3d3437] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17BEBB] ${className}`}
  >
    {children}
  </select>
);

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white dark:bg-[#2E282A] rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const Alert = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
    destructive: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
  };
  return (
    <div className={`p-4 rounded-lg border ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Category icons mapping
const categoryIcons = {
  groceries: ShoppingCart,
  housing: Home,
  transportation: Car,
  dining: Utensils,
  healthcare: Heart,
  entertainment: Film,
  utilities: Zap,
  other: DollarSign
};

// Sample data
const initialBudgets = [
  { id: 1, category: 'groceries', name: 'Groceries', budget: 15000, spent: 12500, color: '#17BEBB' },
  { id: 2, category: 'housing', name: 'Housing', budget: 25000, spent: 25000, color: '#E4572E' },
  { id: 3, category: 'transportation', name: 'Transportation', budget: 8000, spent: 9200, color: '#FFC914' },
  { id: 4, category: 'dining', name: 'Dining Out', budget: 6000, spent: 4800, color: '#76B041' },
  { id: 5, category: 'entertainment', name: 'Entertainment', budget: 5000, spent: 3200, color: '#17BEBB' },
  { id: 6, category: 'utilities', name: 'Utilities', budget: 4000, spent: 3800, color: '#E4572E' }
];

const BudgetPage = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({ category: 'groceries', name: '', budget: '', color: '#17BEBB' });

  // Calculate totals
  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget) * 100;

  // Detect overspending and recurring
  const overspendingCategories = budgets.filter(b => b.spent > b.budget);
  const nearLimitCategories = budgets.filter(b => (b.spent / b.budget) >= 0.9 && b.spent <= b.budget);

  const handleAddEdit = () => {
    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === editingBudget.id 
        ? { ...b, ...formData, budget: parseFloat(formData.budget) }
        : b
      ));
    } else {
      setBudgets([...budgets, { 
        id: Date.now(), 
        ...formData, 
        budget: parseFloat(formData.budget),
        spent: 0 
      }]);
    }
    setIsDialogOpen(false);
    setEditingBudget(null);
    setFormData({ category: 'groceries', name: '', budget: '', color: '#17BEBB' });
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({ category: budget.category, name: budget.name, budget: budget.budget.toString(), color: budget.color });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#242424] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2E282A] dark:text-white">Budget</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
              Track and manage your monthly spending
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </div>

        {/* Alerts */}
        {overspendingCategories.length > 0 && (
          <Alert variant="destructive">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#E4572E] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#E4572E] mb-1">Overspending Alert!</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  You've exceeded your budget in {overspendingCategories.map(b => b.name).join(', ')}
                </p>
              </div>
            </div>
          </Alert>
        )}

        {nearLimitCategories.length > 0 && (
          <Alert>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FFC914] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#2E282A] dark:text-white mb-1">Near Budget Limit</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {nearLimitCategories.map(b => b.name).join(', ')} at 90% or more of budget
                </p>
              </div>
            </div>
          </Alert>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-[#17BEBB]/20 bg-gradient-to-br from-[#17BEBB]/10 to-white dark:to-[#2E282A]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-[#17BEBB]/20 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#17BEBB]" />
                </div>
                <Badge className="bg-[#17BEBB]/20 text-[#17BEBB] border-[#17BEBB]/30 text-xs">
                  Total
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Total Budget</p>
              <h3 className="text-xl sm:text-2xl font-bold text-[#2E282A] dark:text-white">
                ₱{totalBudget.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          <Card className="border-[#E4572E]/20 bg-gradient-to-br from-[#E4572E]/10 to-white dark:to-[#2E282A]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-[#E4572E]/20 p-2 rounded-lg">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4572E]" />
                </div>
                <Badge className="bg-[#E4572E]/20 text-[#E4572E] border-[#E4572E]/30 text-xs">
                  {spentPercentage.toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Total Spent</p>
              <h3 className="text-xl sm:text-2xl font-bold text-[#2E282A] dark:text-white">
                ₱{totalSpent.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          <Card className={`border-${totalRemaining >= 0 ? '[#76B041]' : '[#E4572E]'}/20 bg-gradient-to-br from-${totalRemaining >= 0 ? '[#76B041]' : '[#E4572E]'}/10 to-white dark:to-[#2E282A]`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`bg-${totalRemaining >= 0 ? '[#76B041]' : '[#E4572E]'}/20 p-2 rounded-lg`}>
                  {totalRemaining >= 0 ? (
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#76B041' }} />
                  ) : (
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4572E]" />
                  )}
                </div>
                <Badge 
                  className="text-xs"
                  style={{
                    backgroundColor: totalRemaining >= 0 ? 'rgba(118, 176, 65, 0.2)' : 'rgba(228, 87, 46, 0.2)',
                    color: totalRemaining >= 0 ? '#76B041' : '#E4572E',
                    borderColor: totalRemaining >= 0 ? 'rgba(118, 176, 65, 0.3)' : 'rgba(228, 87, 46, 0.3)'
                  }}
                >
                  {totalRemaining >= 0 ? 'Safe' : 'Over'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Remaining</p>
              <h3 className="text-xl sm:text-2xl font-bold text-[#2E282A] dark:text-white">
                ₱{Math.abs(totalRemaining).toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          <Card className="border-[#FFC914]/20 bg-gradient-to-br from-[#FFC914]/10 to-white dark:to-[#2E282A]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-[#FFC914]/20 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFC914]" />
                </div>
                <Badge className="bg-[#FFC914]/20 text-[#FFC914] border-[#FFC914]/30 text-xs">
                  {budgets.length}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">Categories</p>
              <h3 className="text-xl sm:text-2xl font-bold text-[#2E282A] dark:text-white">
                {budgets.length} Active
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary Chart */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-[#2E282A] dark:text-white mb-4">Monthly Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Overall Progress</span>
                  <span className="font-semibold text-[#2E282A] dark:text-white">
                    {spentPercentage.toFixed(1)}% spent
                  </span>
                </div>
                <Progress value={spentPercentage} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.budget) * 100;
            const isOverBudget = budget.spent > budget.budget;
            const Icon = categoryIcons[budget.category] || DollarSign;

            return (
              <Card key={budget.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${budget.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: budget.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2E282A] dark:text-white">{budget.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{budget.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)}>
                        <Trash2 className="w-4 h-4 text-[#E4572E]" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        ₱{budget.spent.toLocaleString()} / ₱{budget.budget.toLocaleString()}
                      </span>
                      <span className={`font-semibold ${isOverBudget ? 'text-[#E4572E]' : 'text-[#76B041]'}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isOverBudget ? '#E4572E' : budget.color
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Remaining: ₱{Math.max(0, budget.budget - budget.spent).toLocaleString()}
                      </span>
                      {isOverBudget && (
                        <Badge className="bg-[#E4572E]/20 text-[#E4572E] border-[#E4572E]/30">
                          Over Budget
                        </Badge>
                      )}
                      {percentage >= 90 && !isOverBudget && (
                        <Badge className="bg-[#FFC914]/20 text-[#FFC914] border-[#FFC914]/30">
                          Near Limit
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#2E282A] dark:text-white mb-4">
              {editingBudget ? 'Edit Budget' : 'Add New Budget'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <Select 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="groceries">Groceries</option>
                  <option value="housing">Housing</option>
                  <option value="transportation">Transportation</option>
                  <option value="dining">Dining Out</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Budget Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Monthly Groceries"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Budget Amount (₱)
                </label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {['#17BEBB', '#E4572E', '#FFC914', '#76B041', '#2E282A'].map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color ? 'border-slate-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleAddEdit}
                  disabled={!formData.name || !formData.budget}
                  className="flex-1"
                >
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingBudget(null);
                    setFormData({ category: 'groceries', name: '', budget: '', color: '#17BEBB' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default BudgetPage;