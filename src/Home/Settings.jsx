import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
  ChevronRight,
  Moon,
  Sun,
  Layout,
  DollarSign,
} from "lucide-react";

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
    stats: [
      {
        key: "totalBalance",
        title: "Total Balance",
        value: 24580,
        change: "+12.5%",
        positive: true,
        icon: "Wallet",
        color: "emerald",
      },
      {
        key: "monthlyIncome",
        title: "Monthly Income",
        value: 8420,
        change: "+8.2%",
        positive: true,
        icon: "TrendingUp",
        color: "blue",
      },
      {
        key: "monthlyExpenses",
        title: "Monthly Expenses",
        value: 5230,
        change: "-3.1%",
        positive: false,
        icon: "TrendingDown",
        color: "orange",
      },
      {
        key: "savingsGoal",
        title: "Savings Goal",
        value: 0.68,
        change: "Target: $10k",
        positive: true,
        icon: "PieChart",
        color: "purple",
      },
    ],
    categories: {
      transactionCategories: [
        "Food",
        "Transportation",
        "Entertainment",
        "Shopping",
        "Utilities",
        "Income",
        "Healthcare",
        "Other",
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
        {
          title: "Salary Credited",
          message: "₱4,200 has been added to your balance.",
          type: "success",
        },
        {
          title: "Budget Warning",
          message: "You are close to exceeding your Food budget.",
          type: "warning",
        },
        {
          title: "Subscription Charged",
          message: "Netflix charged ₱15.99",
          type: "info",
        },
      ],
      behavior: {
        staggerDelayMs: 300,
        showDotIndicator: true,
      },
    },
    transactions: {
      schema: {
        id: "number",
        name: "string",
        amount: "number",
        category: "string",
        date: "string",
        type: "expense | income",
        notes: "string",
        image: "string | null",
      },
      ui: {
        showImagePreview: true,
        hoverActions: ["edit", "delete"],
        searchEnabled: true,
      },
    },
    addTransactionModal: {
      inputModes: [
        { id: "manual", label: "Manual Entry", icon: "FileText" },
        { id: "receipt", label: "Scan Receipt", icon: "Camera" },
        { id: "quick", label: "Quick Text", icon: "Upload" },
      ],
      manualFields: ["type", "name", "amount", "category", "date", "notes"],
      ocrPreviewEnabled: true,
      quickTextParsing: {
        detectAmount: true,
        detectType: true,
        extractName: true,
      },
    },
    tabs: [
      { id: "overview", title: "Overview" },
      { id: "transactions", title: "Transactions" },
      { id: "budgets", title: "Budgets" },
    ],
  };

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [config, setConfig] = useState(initialConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newBudgetCategory, setNewBudgetCategory] = useState({
    name: "",
    budget: "",
    color: "emerald",
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================
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

  const handleSave = () => {
    console.log("Saving configuration:", config);
    setHasChanges(false);
    // Here you would typically save to localStorage or send to API
  };

  const handleReset = () => {
    setConfig(initialConfig);
    setHasChanges(false);
  };

  const addTransactionCategory = () => {
    if (newCategory.trim()) {
      updateConfig("categories.transactionCategories", [
        ...config.categories.transactionCategories,
        newCategory.trim(),
      ]);
      setNewCategory("");
    }
  };

  const removeTransactionCategory = (index) => {
    const updated = config.categories.transactionCategories.filter(
      (_, i) => i !== index
    );
    updateConfig("categories.transactionCategories", updated);
  };

  const addBudgetCategory = () => {
    if (newBudgetCategory.name && newBudgetCategory.budget) {
      updateConfig("categories.budgetCategories", [
        ...config.categories.budgetCategories,
        {
          name: newBudgetCategory.name,
          spent: 0,
          budget: parseFloat(newBudgetCategory.budget),
          color: newBudgetCategory.color,
        },
      ]);
      setNewBudgetCategory({ name: "", budget: "", color: "emerald" });
    }
  };

  const removeBudgetCategory = (index) => {
    const updated = config.categories.budgetCategories.filter(
      (_, i) => i !== index
    );
    updateConfig("categories.budgetCategories", updated);
  };

  const updateNavigationItem = (index, field, value) => {
    const updated = [...config.navigation.items];
    updated[index] = { ...updated[index], [field]: value };
    updateConfig("navigation.items", updated);
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Settings className="w-8 h-8 text-emerald-600" />
                Settings
              </h1>
              <p className="text-slate-500 mt-1">
                Manage app preferences, categories, and behavior
              </p>
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
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger value="general" className="gap-2">
              <Layout className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="navigation" className="gap-2">
              <Navigation className="w-4 h-4" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Tag className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Settings className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          {/* ====================================================================
              GENERAL TAB
          ==================================================================== */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Information</CardTitle>
                <CardDescription>
                  Basic details about your budget application
                </CardDescription>
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
                    onChange={(e) =>
                      updateConfig("app.tagline", e.target.value)
                    }
                    placeholder="Enter tagline"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-1">
                    <div className="font-medium">Currency Display</div>
                    <div className="text-sm text-slate-500">
                      Set your preferred currency symbol
                    </div>
                  </div>
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">$ USD</SelectItem>
                      <SelectItem value="php">₱ PHP</SelectItem>
                      <SelectItem value="eur">€ EUR</SelectItem>
                      <SelectItem value="gbp">£ GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================================================================
              APPEARANCE TAB
          ==================================================================== */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize the visual appearance of your app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </div>
                    <div className="text-sm text-slate-500">
                      Enable dark theme option for users
                    </div>
                  </div>
                  <Switch
                    checked={config.app.theme.allowDarkMode}
                    onCheckedChange={(checked) =>
                      updateConfig("app.theme.allowDarkMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      <Layout className="w-4 h-4" />
                      Collapsed Sidebar by Default
                    </div>
                    <div className="text-sm text-slate-500">
                      Start with sidebar minimized
                    </div>
                  </div>
                  <Switch
                    checked={config.app.theme.sidebarCollapsed}
                    onCheckedChange={(checked) =>
                      updateConfig("app.theme.sidebarCollapsed", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Primary Color</Label>
                  <div className="grid grid-cols-6 gap-3">
                    {[
                      "emerald",
                      "blue",
                      "purple",
                      "orange",
                      "pink",
                      "indigo",
                    ].map((color) => (
                      <button
                        key={color}
                        className={`h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                          color === "emerald"
                            ? "bg-emerald-500 border-emerald-600"
                            : color === "blue"
                            ? "bg-blue-500 border-blue-600"
                            : color === "purple"
                            ? "bg-purple-500 border-purple-600"
                            : color === "orange"
                            ? "bg-orange-500 border-orange-600"
                            : color === "pink"
                            ? "bg-pink-500 border-pink-600"
                            : "bg-indigo-500 border-indigo-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================================================================
              NAVIGATION TAB
          ==================================================================== */}
          <TabsContent value="navigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Menu</CardTitle>
                <CardDescription>
                  Configure sidebar navigation items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {config.navigation.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-slate-200 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-900">
                        Menu Item {index + 1}
                      </div>
                      <Badge variant="secondary">{item.icon}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            updateNavigationItem(index, "title", e.target.value)
                          }
                          placeholder="Menu title"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Path</Label>
                        <Input
                          value={item.href}
                          onChange={(e) =>
                            updateNavigationItem(index, "href", e.target.value)
                          }
                          placeholder="/path"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================================================================
              CATEGORIES TAB
          ==================================================================== */}
          <TabsContent value="categories" className="space-y-6">
            {/* Transaction Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Categories</CardTitle>
                <CardDescription>
                  Manage categories for classifying transactions
                </CardDescription>
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
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {config.categories.transactionCategories.map((cat, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm flex items-center gap-2"
                    >
                      {cat}
                      <button
                        onClick={() => removeTransactionCategory(index)}
                        className="hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Categories</CardTitle>
                <CardDescription>
                  Set budget limits for different spending categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Budget Category */}
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg space-y-3">
                  <div className="font-medium text-sm text-slate-600">
                    Add New Budget Category
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="Category name"
                      value={newBudgetCategory.name}
                      onChange={(e) =>
                        setNewBudgetCategory({
                          ...newBudgetCategory,
                          name: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Budget amount"
                      value={newBudgetCategory.budget}
                      onChange={(e) =>
                        setNewBudgetCategory({
                          ...newBudgetCategory,
                          budget: e.target.value,
                        })
                      }
                    />
                    <Select
                      value={newBudgetCategory.color}
                      onValueChange={(value) =>
                        setNewBudgetCategory({
                          ...newBudgetCategory,
                          color: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emerald">Emerald</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addBudgetCategory} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Budget Category
                  </Button>
                </div>

                {/* Existing Budget Categories */}
                <div className="grid md:grid-cols-2 gap-4">
                  {config.categories.budgetCategories.map((cat, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-200 rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {cat.name}
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            Budget: <span className="font-medium">${cat.budget}</span> |
                            Spent: <span className="font-medium">${cat.spent}</span>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeBudgetCategory(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${
                            cat.color === "emerald"
                              ? "bg-emerald-100 text-emerald-700"
                              : cat.color === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : cat.color === "purple"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {cat.color}
                        </Badge>
                        <Badge variant="outline">
                          {Math.round((cat.spent / cat.budget) * 100)}% used
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================================================================
              NOTIFICATIONS TAB
          ==================================================================== */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure notification behavior and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stagger-delay">
                    Stagger Delay (milliseconds)
                  </Label>
                  <Input
                    id="stagger-delay"
                    type="number"
                    value={config.notifications.behavior.staggerDelayMs}
                    onChange={(e) =>
                      updateConfig(
                        "notifications.behavior.staggerDelayMs",
                        Number(e.target.value)
                      )
                    }
                  />
                  <p className="text-xs text-slate-500">
                    Time delay between displaying multiple notifications
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-1">
                    <div className="font-medium">Notification Dot Indicator</div>
                    <div className="text-sm text-slate-500">
                      Show red dot on bell icon when notifications are present
                    </div>
                  </div>
                  <Switch
                    checked={config.notifications.behavior.showDotIndicator}
                    onCheckedChange={(checked) =>
                      updateConfig(
                        "notifications.behavior.showDotIndicator",
                        checked
                      )
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Preview Notifications</Label>
                  <div className="space-y-2">
                    {config.notifications.list.map((notif, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          notif.type === "success"
                            ? "bg-emerald-50 border-emerald-500"
                            : notif.type === "warning"
                            ? "bg-orange-50 border-orange-500"
                            : "bg-blue-50 border-blue-500"
                        }`}
                      >
                        <div className="font-medium text-sm">{notif.title}</div>
                        <div className="text-xs text-slate-600 mt-1">
                          {notif.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ====================================================================
              ADVANCED TAB
          ==================================================================== */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction UI Settings</CardTitle>
                <CardDescription>
                  Advanced configuration for transaction display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-1">
                    <div className="font-medium">Show Image Preview</div>
                    <div className="text-sm text-slate-500">
                      Display receipt images in transaction cards
                    </div>
                  </div>
                  <Switch
                    checked={config.transactions.ui.showImagePreview}
                    onCheckedChange={(checked) =>
                      updateConfig("transactions.ui.showImagePreview", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-1">
                    <div className="font-medium">Enable Search</div>
                    <div className="text-sm text-slate-500">
                      Allow users to search and filter transactions
                    </div>
                  </div>
                  <Switch
                    checked={config.transactions.ui.searchEnabled}
                    onCheckedChange={(checked) =>
                      updateConfig("transactions.ui.searchEnabled", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Hover Actions</Label>
                  <div className="flex gap-2">
                    {config.transactions.ui.hoverActions.map((action, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1.5">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Transaction Modal</CardTitle>
                <CardDescription>
                  Configure input modes and parsing behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Input Modes</Label>
                  <div className="flex flex-wrap gap-3">
                    {config.addTransactionModal.inputModes.map((mode, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5 flex items-center gap-2">
                        {mode.label}
                        <Edit className="w-3 h-3" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                    <div className="space-y-1">
                      <div className="font-medium">Enable OCR Preview</div>
                      <div className="text-sm text-slate-500">Show extracted text when scanning receipts</div>
                    </div>
                    <Switch
                      checked={config.addTransactionModal.ocrPreviewEnabled}
                      onCheckedChange={(checked) =>
                        updateConfig("addTransactionModal.ocrPreviewEnabled", checked)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quick Text Parsing</Label>
                    <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                      {Object.entries(config.addTransactionModal.quickTextParsing).map(
                        ([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <div className="capitalize text-sm text-slate-700">{key.replace(/([A-Z])/g, " $1")}</div>
                            <Switch
                              checked={value}
                              onCheckedChange={(checked) =>
                                updateConfig(`addTransactionModal.quickTextParsing.${key}`, checked)
                              }
                            />
                          </div>
                        )
                      )}
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
