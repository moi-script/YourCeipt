import React, { useState } from 'react';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar, 
  Edit2, 
  Trash2, 
  DollarSign, 
  ShoppingCart, 
  Home, 
  Car, 
  Utensils, 
  Heart, 
  Film, 
  Zap,
  Sparkles,
  Leaf
} from 'lucide-react';

// --- SIMULATED SHADCN UI COMPONENTS (Customized for Organic Look & Dark Mode) ---

const Card = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md border border-white/50 dark:border-white/10 bg-white/60 dark:bg-stone-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 rounded-full shadow-lg hover:shadow-xl active:scale-95";
  const variants = {
    default: "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-emerald-900/10",
    outline: "border-2 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 bg-transparent shadow-none",
    ghost: "hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 text-stone-400 dark:text-stone-500 bg-transparent shadow-none",
    destructive: "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-900/10"
  };
  const sizes = {
    default: "px-6 py-2.5 text-sm",
    sm: "px-4 py-1.5 text-xs",
    lg: "px-8 py-3.5 text-base",
    icon: "w-10 h-10 px-0 flex items-center justify-center rounded-full"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = "", ...props }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${className}`} {...props}>
    {children}
  </span>
);

const Progress = ({ value = 0, className = "", indicatorColor = "bg-emerald-500" }) => (
  <div className={`w-full bg-stone-200 dark:bg-stone-800 rounded-full h-3 overflow-hidden ${className}`}>
    <div 
      className={`h-full transition-all duration-500 ease-out rounded-full ${indicatorColor}`}
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-5 py-3 bg-white/60 dark:bg-stone-800/60 border border-transparent rounded-full text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:bg-white dark:focus:bg-stone-800 transition-all shadow-sm ${className}`}
    {...props}
  />
);

const Select = ({ children, value, onChange, className = "" }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-5 py-3 appearance-none bg-white/60 dark:bg-stone-800/60 border border-transparent rounded-full text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:bg-white dark:focus:bg-stone-800 transition-all shadow-sm cursor-pointer ${className}`}
    >
      {children}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  </div>
);

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#2c2c2c]/20 dark:bg-black/60 backdrop-blur-sm transition-all" onClick={() => onOpenChange(false)} />
      <div className="relative bg-[#fcfcfc] dark:bg-stone-900 rounded-[2.5rem] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
};

const Alert = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300",
    destructive: "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800 text-orange-900 dark:text-orange-300"
  };
  return (
    <div className={`p-5 rounded-[1.5rem] border ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// --- DATA & LOGIC ---

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

// Using the Emerald/Orange palette
const initialBudgets = [
  { id: 1, category: 'groceries', name: 'Groceries', budget: 15000, spent: 12500, color: '#059669' }, // Emerald-600
  { id: 2, category: 'housing', name: 'Housing', budget: 25000, spent: 25000, color: '#ea580c' }, // Orange-600
  { id: 3, category: 'transportation', name: 'Transportation', budget: 8000, spent: 9200, color: '#d97706' }, // Amber-600 (Warning)
  { id: 4, category: 'dining', name: 'Dining Out', budget: 6000, spent: 4800, color: '#10b981' }, // Emerald-500
  { id: 5, category: 'entertainment', name: 'Entertainment', budget: 5000, spent: 3200, color: '#34d399' }, // Emerald-400
  { id: 6, category: 'utilities', name: 'Utilities', budget: 4000, spent: 3800, color: '#f97316' } // Orange-500
];

const BudgetPage = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({ category: 'groceries', name: '', budget: '', color: '#10b981' });

  // Calculate totals
  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

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
    setFormData({ category: 'groceries', name: '', budget: '', color: '#10b981' });
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
    // 1. BACKGROUND: 
    // Light: Warm bone white (#f2f0e9) 
    // Dark: Deep Stone (#0c0a09)
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden font-sans text-stone-800 dark:text-stone-100 p-4 sm:p-6 pb-20 transition-colors duration-300">
      
      {/* Decorative Blobs - Reduced opacity for Dark Mode */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100 dark:bg-emerald-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 dark:bg-stone-800/40 border border-white/60 dark:border-white/10 backdrop-blur-md mb-3 shadow-sm">
               <Leaf className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
               <span className="text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">Financial Health</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif italic text-[#2c2c2c] dark:text-stone-100">Budget Flow</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-2 font-medium">
              Track and manage your monthly spending rhythm.
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" />
            New Budget
          </Button>
        </div>

        {/* Alerts */}
        {overspendingCategories.length > 0 && (
          <Alert variant="destructive">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-full text-orange-600 dark:text-orange-400 mt-1">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-orange-800 dark:text-orange-300 mb-1">Overspending Alert!</h3>
                <p className="text-sm text-orange-800/80 dark:text-orange-300/80 leading-relaxed">
                  You've exceeded your budget in <span className="font-semibold">{overspendingCategories.map(b => b.name).join(', ')}</span>.
                </p>
              </div>
            </div>
          </Alert>
        )}

        {nearLimitCategories.length > 0 && (
          <Alert>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-full text-emerald-600 dark:text-emerald-400 mt-1">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-emerald-900 dark:text-emerald-300 mb-1">Near Budget Limit</h3>
                <p className="text-sm text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                  <span className="font-semibold">{nearLimitCategories.map(b => b.name).join(', ')}</span> are at 90% or more of capacity.
                </p>
              </div>
            </div>
          </Alert>
        )}

        {/* Overview Cards - "Floating Pebbles" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Budget */}
          <Card className="bg-white/60 dark:bg-stone-900/60">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">Total</Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">Total Budget</p>
              <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
                ₱{totalBudget.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card className="bg-white/60 dark:bg-stone-900/60">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600 dark:text-orange-400">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <Badge className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400">{spentPercentage.toFixed(0)}%</Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">Total Spent</p>
              <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
                ₱{totalSpent.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          {/* Remaining */}
          <Card className={`bg-white/60 dark:bg-stone-900/60`}>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${totalRemaining >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                  {totalRemaining >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <Badge className={totalRemaining >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'}>
                  {totalRemaining >= 0 ? 'Safe' : 'Over'}
                </Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">Remaining</p>
              <h3 className={`text-2xl font-serif ${totalRemaining >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                ₱{Math.abs(totalRemaining).toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          {/* Active Categories */}
          <Card className="bg-white/60 dark:bg-stone-900/60">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-stone-100 dark:bg-stone-800 p-2.5 rounded-xl text-stone-600 dark:text-stone-300">
                  <Calendar className="w-5 h-5" />
                </div>
                <Badge className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">{budgets.length}</Badge>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">Categories</p>
              <h3 className="text-2xl font-serif text-stone-800 dark:text-stone-100">
                {budgets.length} Active
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary Chart */}
        <Card className="bg-white/70 dark:bg-stone-900/70 border-white/80 dark:border-white/10">
          <CardContent>
            <h2 className="text-xl font-serif text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              Monthly Overview
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-stone-500 dark:text-stone-400 font-medium">Overall Progress</span>
                  <span className="font-bold text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-800 px-3 py-1 rounded-full shadow-sm">
                    {spentPercentage.toFixed(1)}% spent
                  </span>
                </div>
                {/* Custom Progress Bar with Emerald/Orange logic */}
                <Progress 
                  value={spentPercentage} 
                  className="h-4" 
                  indicatorColor={spentPercentage > 100 ? "bg-orange-500" : "bg-emerald-500"}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.budget) * 100;
            const isOverBudget = budget.spent > budget.budget;
            const Icon = categoryIcons[budget.category] || DollarSign;
            
            // Dynamic color logic based on state
            const stateColor = isOverBudget ? '#ea580c' : budget.color; // orange-600 for error

            return (
              <Card key={budget.id} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-stone-900/80 border-white dark:border-stone-800">
                <CardContent>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="p-3 rounded-2xl shadow-sm bg-white dark:bg-stone-800"
                      >
                        <Icon className="w-6 h-6" style={{ color: stateColor }} />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-stone-800 dark:text-stone-100">{budget.name}</h3>
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">{budget.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)}>
                        <Trash2 className="w-4 h-4 text-orange-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm items-end">
                      <span className="text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full text-xs font-medium">
                        ₱{budget.spent.toLocaleString()} <span className="text-stone-300 dark:text-stone-600">/</span> ₱{budget.budget.toLocaleString()}
                      </span>
                      <span 
                        className="font-bold text-lg"
                        style={{ color: stateColor }}
                      >
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 rounded-full"
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: stateColor
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-medium text-stone-400 dark:text-stone-500">
                        REMAINING: <span className="text-stone-600 dark:text-stone-300">₱{Math.max(0, budget.budget - budget.spent).toLocaleString()}</span>
                      </span>
                      {isOverBudget && (
                        <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">Over Budget</Badge>
                      )}
                      {percentage >= 90 && !isOverBudget && (
                        <Badge className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">Near Limit</Badge>
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
          <div className="p-8">
            <h2 className="text-3xl font-serif italic text-stone-800 dark:text-stone-100 mb-6">
              {editingBudget ? 'Refine Budget' : 'New Budget'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 ml-4">
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
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 ml-4">
                  Budget Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Monthly Groceries"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 ml-4">
                  Budget Amount (₱)
                </label>
                <div className="relative">
                    <span className="absolute left-5 top-3.5 text-stone-400 dark:text-stone-500">₱</span>
                    <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="0.00"
                    className="pl-10"
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 ml-4">
                  Color Tag
                </label>
                <div className="flex gap-3 justify-center bg-stone-100 dark:bg-stone-800/50 p-4 rounded-[1.5rem]">
                  {['#10b981', '#f97316', '#0ea5e9', '#8b5cf6', '#ec4899'].map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-full transition-all shadow-sm ${
                        formData.color === color ? 'ring-4 ring-white dark:ring-stone-600 ring-offset-2 ring-offset-stone-100 dark:ring-offset-stone-800 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleAddEdit}
                  disabled={!formData.name || !formData.budget}
                  className="flex-1"
                >
                  {editingBudget ? 'Update Flow' : 'Create Flow'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingBudget(null);
                    setFormData({ category: 'groceries', name: '', budget: '', color: '#10b981' });
                  }}
                  className="flex-1 rounded-full border-stone-300 dark:border-stone-600"
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