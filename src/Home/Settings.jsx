import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Palette,
  Bell,
  Navigation,
  Tag,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Moon,
  Layout,
  Sparkles
} from "lucide-react";

// --- CUSTOM ORGANIC COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md border border-white/50 dark:border-white/5 bg-white/60 dark:bg-stone-900/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-8 pb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-serif text-stone-800 dark:text-stone-100 ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-stone-500 dark:text-stone-400 mt-1 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-8 pt-0 ${className}`}>{children}</div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-5 py-3 bg-white/50 dark:bg-stone-800/50 border border-transparent rounded-full text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:bg-white dark:focus:bg-stone-800 transition-all shadow-sm ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", htmlFor }) => (
  <label htmlFor={htmlFor} className={`block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 ml-4 ${className}`}>
    {children}
  </label>
);

const Separator = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-200 dark:via-stone-700 to-transparent my-6" />
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const styles = variant === "secondary" 
    ? "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300" 
    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "default", disabled, onClick, className = "" }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full h-11 px-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10",
    outline: "border-2 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-emerald-200 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 bg-transparent",
    ghost: "hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 text-stone-400 dark:text-stone-500 bg-transparent",
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// Custom Tabs Components
const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  // Pass activeTab state to children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });

  return <div className="space-y-6">{childrenWithProps}</div>;
};

const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="bg-white/40 dark:bg-stone-900/40 border border-white/50 dark:border-white/5 backdrop-blur-md p-1.5 rounded-full inline-flex flex-wrap gap-1">
    {React.Children.map(children, child => 
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ children, value, activeTab, setActiveTab, className = "" }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
      activeTab === value 
        ? "bg-emerald-700 dark:bg-emerald-600 text-white shadow-md" 
        : "text-stone-500 dark:text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-white/50 dark:hover:bg-stone-800/50"
    } ${className}`}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, activeTab }) => {
  if (activeTab !== value) return null;
  return <div className="animate-in fade-in zoom-in-95 duration-300">{children}</div>;
};

// Custom Select Component
const Select = ({ value, onValueChange, options, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full px-5 py-3 appearance-none bg-white/50 dark:bg-stone-800/50 border border-transparent rounded-full text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:bg-white dark:focus:bg-stone-800 transition-all shadow-sm cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  </div>
);

import React from 'react';

export default function SettingsDashboard() {
  // ============================================================================
  // INITIAL CONFIGURATION
  // ============================================================================
  const initialConfig = {
    app: {
      name: "BudgetMaster",
      tagline: "Financial Freedom",
      theme: {
        sidebarCollapsed: false,
        allowDarkMode: true,
      },
    },
    navigation: {
      items: [
        { title: "Dashboard", icon: "Home", href: "/dashboard" },
        { title: "Transactions", icon: "CreditCard", href: "/transactions" },
        { title: "Budgets", icon: "PieChart", href: "/budgets" },
        { title: "Analytics", icon: "TrendingUp", href: "/analytics" },
        { title: "Settings", icon: "Settings", href: "/settings" },
      ],
    },
    // ... stats removed for brevity as they aren't displayed in settings UI ...
    categories: {
      transactionCategories: [
        "Food", "Transportation", "Entertainment", "Shopping", "Utilities", "Income", "Healthcare", "Other",
      ],
      budgetCategories: [
        { name: "Food & Dining", spent: 450, budget: 600, color: "emerald" },
        { name: "Transportation", spent: 180, budget: 300, color: "blue" },
        { name: "Entertainment", spent: 95, budget: 150, color: "purple" },
        { name: "Shopping", spent: 320, budget: 400, color: "orange" },
      ],
    },
    notifications: {
      list: [
        { title: "Salary Credited", message: "₱4,200 has been added to your balance.", type: "success" },
        { title: "Budget Warning", message: "You are close to exceeding your Food budget.", type: "warning" },
        { title: "Subscription Charged", message: "Netflix charged ₱15.99", type: "info" },
      ],
      behavior: { staggerDelayMs: 300, showDotIndicator: true },
    },
    transactions: {
      ui: { showImagePreview: true, hoverActions: ["edit", "delete"], searchEnabled: true },
    },
    addTransactionModal: {
      inputModes: [
        { id: "manual", label: "Manual Entry" },
        { id: "receipt", label: "Scan Receipt" },
        { id: "quick", label: "Quick Text" },
      ],
      ocrPreviewEnabled: true,
      quickTextParsing: { detectAmount: true, detectType: true, extractName: true },
    },
  };

  const [config, setConfig] = useState(initialConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newBudgetCategory, setNewBudgetCategory] = useState({ name: "", budget: "", color: "emerald" });

  // Helper to deep update state
  const updateConfig = (path, value) => {
    setConfig((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = () => { console.log("Saving:", config); setHasChanges(false); };
  const handleReset = () => { setConfig(initialConfig); setHasChanges(false); };

  const addTransactionCategory = () => {
    if (newCategory.trim()) {
      updateConfig("categories.transactionCategories", [...config.categories.transactionCategories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeTransactionCategory = (index) => {
    const updated = config.categories.transactionCategories.filter((_, i) => i !== index);
    updateConfig("categories.transactionCategories", updated);
  };

  const addBudgetCategory = () => {
    if (newBudgetCategory.name && newBudgetCategory.budget) {
      updateConfig("categories.budgetCategories", [...config.categories.budgetCategories, {
        name: newBudgetCategory.name, spent: 0, budget: parseFloat(newBudgetCategory.budget), color: newBudgetCategory.color
      }]);
      setNewBudgetCategory({ name: "", budget: "", color: "emerald" });
    }
  };

  const removeBudgetCategory = (index) => {
    const updated = config.categories.budgetCategories.filter((_, i) => i !== index);
    updateConfig("categories.budgetCategories", updated);
  };

  const updateNavigationItem = (index, field, value) => {
    const updated = [...config.navigation.items];
    updated[index] = { ...updated[index], [field]: value };
    updateConfig("navigation.items", updated);
  };

  return (
    // 1. MAIN BG: Warm bone white (Light) / Deep Stone (Dark)
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden font-sans text-stone-800 dark:text-stone-100 transition-colors duration-300">
      
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-30 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-30 pointer-events-none"></div>

      {/* Header */}
      <div className="bg-white/40 dark:bg-stone-900/40 backdrop-blur-md border-b border-white/50 dark:border-white/5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 backdrop-blur-sm shadow-sm mb-2">
                 <Settings className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
                 <span className="text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">Configuration</span>
              </div>
              <h1 className="text-3xl font-serif italic text-stone-900 dark:text-stone-100">
                Settings
              </h1>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general"><Layout className="w-4 h-4" /> General</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="w-4 h-4" /> Appearance</TabsTrigger>
            <TabsTrigger value="navigation"><Navigation className="w-4 h-4" /> Navigation</TabsTrigger>
            <TabsTrigger value="categories"><Tag className="w-4 h-4" /> Categories</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
            <TabsTrigger value="advanced"><Sparkles className="w-4 h-4" /> Advanced</TabsTrigger>
          </TabsList>

          {/* ================= GENERAL TAB ================= */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Application Information</CardTitle>
                <CardDescription>Basic details about your budget application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input
                    id="app-name"
                    value={config.app.name}
                    onChange={(e) => updateConfig("app.name", e.target.value)}
                    placeholder="Enter app name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={config.app.tagline}
                    onChange={(e) => updateConfig("app.tagline", e.target.value)}
                    placeholder="Enter tagline"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-stone-50/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                  <div className="space-y-1">
                    <div className="font-bold text-stone-800 dark:text-stone-200">Currency Display</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">Set your preferred currency symbol</div>
                  </div>
                  <div className="w-40">
                    <Select 
                        value="usd" 
                        onValueChange={() => {}} 
                        options={[
                            {value: "usd", label: "$ USD"},
                            {value: "php", label: "₱ PHP"},
                            {value: "eur", label: "€ EUR"}
                        ]}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= APPEARANCE TAB ================= */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>Customize the visual appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-stone-50/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                  <div className="space-y-1">
                    <div className="font-bold flex items-center gap-2 text-stone-800 dark:text-stone-200">
                      <Moon className="w-4 h-4" /> Dark Mode
                    </div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">Enable dark theme option</div>
                  </div>
                  <Switch
                    checked={config.app.theme.allowDarkMode}
                    onCheckedChange={(checked) => updateConfig("app.theme.allowDarkMode", checked)}
                    className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-stone-50/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                  <div className="space-y-1">
                    <div className="font-bold flex items-center gap-2 text-stone-800 dark:text-stone-200">
                      <Layout className="w-4 h-4" /> Sidebar Collapsed
                    </div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">Start minimized by default</div>
                  </div>
                  <Switch
                    checked={config.app.theme.sidebarCollapsed}
                    onCheckedChange={(checked) => updateConfig("app.theme.sidebarCollapsed", checked)}
                    className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Accent Color</Label>
                  <div className="grid grid-cols-6 gap-3">
                    {["emerald", "blue", "purple", "orange", "pink", "indigo"].map((color) => {
                       const colors = {
                           emerald: "bg-emerald-500", blue: "bg-blue-500", purple: "bg-purple-500",
                           orange: "bg-orange-500", pink: "bg-pink-500", indigo: "bg-indigo-500"
                       };
                       return (
                        <button
                            key={color}
                            className={`h-12 rounded-2xl border-4 border-white dark:border-stone-800 shadow-md transition-all hover:scale-105 ${colors[color]}`}
                        />
                       );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= NAVIGATION TAB ================= */}
          <TabsContent value="navigation">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Menu</CardTitle>
                <CardDescription>Configure sidebar navigation items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.navigation.items.map((item, index) => (
                  <div key={index} className="p-4 border border-stone-200 dark:border-stone-700 rounded-[1.5rem] bg-white/50 dark:bg-stone-800/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-stone-900 dark:text-stone-100">Menu Item {index + 1}</div>
                      <Badge variant="secondary">{item.icon}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => updateNavigationItem(index, "title", e.target.value)}
                          placeholder="Menu title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Path</Label>
                        <Input
                          value={item.href}
                          onChange={(e) => updateNavigationItem(index, "href", e.target.value)}
                          placeholder="/path"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= CATEGORIES TAB ================= */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Categories</CardTitle>
                <CardDescription>Manage categories for classifying transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new category..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTransactionCategory()}
                  />
                  <Button onClick={addTransactionCategory}>
                    <Plus className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.categories.transactionCategories.map((cat, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-2">
                      {cat}
                      <button onClick={() => removeTransactionCategory(index)} className="hover:text-orange-600 transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
                <Card>
                <CardHeader>
                    <CardTitle>Budget Categories</CardTitle>
                    <CardDescription>Set budget limits for different spending categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Add New Budget Category */}
                    <div className="p-6 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-[1.5rem] bg-stone-50/50 dark:bg-stone-800/30 space-y-3">
                        <div className="font-medium text-sm text-stone-600 dark:text-stone-400">Add New Budget Category</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Input
                                placeholder="Category name"
                                value={newBudgetCategory.name}
                                onChange={(e) => setNewBudgetCategory({ ...newBudgetCategory, name: e.target.value })}
                            />
                            <Input
                                type="number"
                                placeholder="Budget amount"
                                value={newBudgetCategory.budget}
                                onChange={(e) => setNewBudgetCategory({ ...newBudgetCategory, budget: e.target.value })}
                            />
                            <Select 
                                value={newBudgetCategory.color}
                                onValueChange={(val) => setNewBudgetCategory({ ...newBudgetCategory, color: val })}
                                options={[
                                    {value: 'emerald', label: 'Emerald'},
                                    {value: 'blue', label: 'Blue'},
                                    {value: 'purple', label: 'Purple'},
                                    {value: 'orange', label: 'Orange'},
                                ]}
                            />
                        </div>
                        <Button onClick={addBudgetCategory} className="w-full mt-2">
                            <Plus className="w-4 h-4 mr-2" /> Add Budget Category
                        </Button>
                    </div>

                    {/* Existing Budget Categories */}
                    <div className="grid md:grid-cols-2 gap-4">
                    {config.categories.budgetCategories.map((cat, index) => (
                        <div key={index} className="p-4 border border-stone-200 dark:border-stone-700 rounded-[1.5rem] bg-white/50 dark:bg-stone-800/30 space-y-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="font-semibold text-stone-900 dark:text-stone-100">{cat.name}</div>
                                <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                                    Budget: <span className="font-medium text-stone-700 dark:text-stone-300">${cat.budget}</span> | 
                                    Spent: <span className="font-medium text-stone-700 dark:text-stone-300">${cat.spent}</span>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => removeBudgetCategory(index)} className="h-8 w-8 hover:bg-orange-50 hover:text-orange-600">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={
                                cat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                                cat.color === 'blue' ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300' :
                                cat.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            }>
                                {cat.color}
                            </Badge>
                            <Badge variant="secondary">
                                {Math.round((cat.spent / cat.budget) * 100)}% used
                            </Badge>
                        </div>
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>
            </div>
          </TabsContent>

          {/* ================= NOTIFICATIONS TAB ================= */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure notification behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stagger-delay">Stagger Delay (ms)</Label>
                  <Input
                    id="stagger-delay"
                    type="number"
                    value={config.notifications.behavior.staggerDelayMs}
                    onChange={(e) => updateConfig("notifications.behavior.staggerDelayMs", Number(e.target.value))}
                  />
                  <p className="text-xs text-stone-500 dark:text-stone-400">Delay between multiple notifications</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-stone-50/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                  <div className="space-y-1">
                    <div className="font-bold text-stone-800 dark:text-stone-200">Dot Indicator</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">Show red dot on bell icon</div>
                  </div>
                  <Switch
                    checked={config.notifications.behavior.showDotIndicator}
                    onCheckedChange={(checked) => updateConfig("notifications.behavior.showDotIndicator", checked)}
                    className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Preview Notifications</Label>
                  <div className="space-y-2">
                    {config.notifications.list.map((notif, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-2xl border-l-4 bg-white/60 dark:bg-stone-900/60 shadow-sm ${
                          notif.type === "success" ? "bg-emerald-50/30 border-emerald-500 dark:border-emerald-600" :
                          notif.type === "warning" ? "bg-orange-50/30 border-orange-500 dark:border-orange-600" :
                          "bg-sky-50/30 border-sky-500 dark:border-sky-600"
                        }`}
                      >
                        <div className="font-bold text-sm text-stone-800 dark:text-stone-200">{notif.title}</div>
                        <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">{notif.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= ADVANCED TAB ================= */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced UI Settings</CardTitle>
                <CardDescription>Fine-tune transaction display</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-stone-50/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                  <div className="space-y-1">
                    <div className="font-bold text-stone-800 dark:text-stone-200">Show Image Preview</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">Display receipts in list</div>
                  </div>
                  <Switch
                    checked={config.transactions.ui.showImagePreview}
                    onCheckedChange={(checked) => updateConfig("transactions.ui.showImagePreview", checked)}
                    className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-stone-50/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                  <div className="space-y-1">
                    <div className="font-bold text-stone-800 dark:text-stone-200">Enable Search</div>
                    <div className="text-sm text-stone-500 dark:text-stone-400">Allow filtering transactions</div>
                  </div>
                  <Switch
                    checked={config.transactions.ui.searchEnabled}
                    onCheckedChange={(checked) => updateConfig("transactions.ui.searchEnabled", checked)}
                    className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 rounded-[1.5rem] bg-stone-50/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
                      <div className="space-y-1">
                         <div className="font-bold text-stone-800 dark:text-stone-200">OCR Preview</div>
                         <div className="text-sm text-stone-500 dark:text-stone-400">Show text extraction</div>
                      </div>
                      <Switch
                        checked={config.addTransactionModal.ocrPreviewEnabled}
                        onCheckedChange={(checked) => updateConfig("addTransactionModal.ocrPreviewEnabled", checked)}
                        className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
                      />
                   </div>

                   <div className="space-y-2">
                      <Label>Quick Text Parsing</Label>
                      <div className="p-4 bg-stone-50/50 dark:bg-stone-800/50 rounded-[1.5rem] space-y-3 border border-stone-200 dark:border-stone-700">
                         {Object.entries(config.addTransactionModal.quickTextParsing).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                               <div className="capitalize text-sm font-medium text-stone-700 dark:text-stone-300">{key.replace(/([A-Z])/g, " $1")}</div>
                               <Switch
                                  checked={value}
                                  onCheckedChange={(checked) => updateConfig(`addTransactionModal.quickTextParsing.${key}`, checked)}
                                  className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500"
                               />
                            </div>
                         ))}
                      </div>
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