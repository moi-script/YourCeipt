import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings2, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// 1. Define the exact Item Schema for consistent adding
const EMPTY_ITEM_SCHEMA = {
  description: "", // maps to description
  upc: "",         // maps to upc
  type: "",        // maps to type (e.g., Produce, Dairy)
  category: "General", // maps to category
  price: 0,        // maps to price
  quantity: 1      // maps to quantity
};

// 2. Define the Initial Complex State
const INITIAL_COMPLEX_STATE = {
  store: "",
  slogan: "",
  contact: "",
  manager: "",
  address: { street: "", city: "", state: "", zip: "" },
  transaction: { store_number: "", operator_number: "", terminal_number: "", transaction_number: "" },
  items: [ { ...EMPTY_ITEM_SCHEMA, description: "Manual Item" } ], // Start with one item
  subtotal: 0,
  tax_rate: 0,
  tax_amount: 0,
  total: 0,
  payment_method: "Cash",
  amount_paid: 0,
  metadata: {
    currency: "PHP",
    datetime: new Date().toISOString().split('T')[0],
    notes: "",
    source_type: "Manual",
    type: "expense"
  }
};

const categories = ["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Health", "General"];

export function ManualEntryForm() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [formData, setFormData] = useState(INITIAL_COMPLEX_STATE);

  // --- HANDLERS ---

  // Simple Mode "Bridge" Handler
  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newState = { ...prev };
      
      if (name === "amount") {
        const val = parseFloat(value) || 0;
        newState.total = val;
        newState.subtotal = val;
        newState.amount_paid = val;
        // Update first item price if it exists
        if (newState.items.length > 0) newState.items[0].price = val;
      } 
      else if (name === "description") {
        newState.store = value;
        // Update first item description if it exists
        if (newState.items.length > 0) newState.items[0].description = value;
      }
      else if (name === "date") {
        newState.metadata = { ...newState.metadata, datetime: value };
      }
      else if (name === "notes") {
        newState.metadata = { ...newState.metadata, notes: value };
      }
      
      return newState;
    });
  };

  const handleSimpleSelectChange = (field, value) => {
    setFormData(prev => {
      const newState = { ...prev };
      if (field === "transaction_type") {
        newState.metadata = { ...newState.metadata, type: value };
      } else if (field === "category") {
        if (newState.items.length > 0) newState.items[0].category = value;
      }
      return newState;
    });
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  // Item Handler (Calculations included)
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calculate totals
    const newSubtotal = newItems.reduce((acc, item) => acc + (parseFloat(item.price || 0) * parseFloat(item.quantity || 1)), 0);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal: newSubtotal,
      total: newSubtotal + (parseFloat(prev.tax_amount) || 0)
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...EMPTY_ITEM_SCHEMA }] // Adds exact schema
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    // Recalculate
    const newSubtotal = newItems.reduce((acc, item) => acc + (parseFloat(item.price || 0) * parseFloat(item.quantity || 1)), 0);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal: newSubtotal,
      total: newSubtotal + (parseFloat(prev.tax_amount) || 0)
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      
      {/* Header / Toggle */}
      <div className="flex justify-between items-center px-2">
         <h3 className="font-serif text-lg text-stone-700 dark:text-stone-300 italic">
            {isAdvanced ? "Detailed Entry" : "Quick Entry"}
         </h3>
         <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="text-stone-500 hover:text-emerald-600 gap-2"
         >
            <Settings2 className="w-4 h-4" />
            {isAdvanced ? "Switch to Simple" : "Advanced Mode"}
         </Button>
      </div>

      {/* ================= SIMPLE MODE ================= */}
      {!isAdvanced && (
        <div className="space-y-3 sm:space-y-1 animate-in fade-in zoom-in-95 duration-300">
           {/* ... (Same as previous simple mode code) ... */}
           {/* Copy/Paste the simple mode JSX from previous response here if needed, keeping it brief for this snippet */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Type</Label>
                <Select value={formData.metadata.type} onValueChange={(val) => handleSimpleSelectChange("transaction_type", val)}>
                  <SelectTrigger className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-11 sm:h-12 px-4 text-sm sm:text-base focus:ring-emerald-200 dark:focus:ring-emerald-900 text-stone-800 dark:text-stone-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-[1.5rem] border-none shadow-xl bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Amount</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-sm sm:text-base">₱</span>
                  <Input type="number" step="0.01" placeholder="0.00" name="amount" value={formData.total || ""} onChange={handleSimpleChange} className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-11 sm:h-12 pl-8 text-sm sm:text-base focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-900 text-stone-800 dark:text-stone-200" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
              <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Description</Label>
              <Input placeholder="e.g., Grocery shopping..." name="description" value={formData.store} onChange={handleSimpleChange} className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-11 sm:h-12 px-4 text-sm sm:text-base focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-900 text-stone-800 dark:text-stone-200" />
            </div>
        </div>
      )}


      {/* ================= ADVANCED MODE ================= */}
      {isAdvanced && (
        <ScrollArea className="h-[500px] pr-4 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-6">
            
            {/* 1. Store Details */}
            <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-[1.5rem] space-y-4">
               <h4 className="font-bold text-stone-600 dark:text-stone-400 text-sm uppercase tracking-wider">Store Information</h4>
               <Input placeholder="Store Name" value={formData.store} onChange={(e) => setFormData({...formData, store: e.target.value})} className="rounded-full border-stone-200 dark:border-stone-800" />
               <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Street Address" value={formData.address.street} onChange={(e) => handleNestedChange('address', 'street', e.target.value)} className="col-span-2 rounded-full border-stone-200 dark:border-stone-800" />
                  <Input placeholder="City" value={formData.address.city} onChange={(e) => handleNestedChange('address', 'city', e.target.value)} className="rounded-full border-stone-200 dark:border-stone-800" />
                  <Input placeholder="Zip" value={formData.address.zip} onChange={(e) => handleNestedChange('address', 'zip', e.target.value)} className="rounded-full border-stone-200 dark:border-stone-800" />
               </div>
            </div>

            {/* 2. Items List (UPDATED TO MATCH SCHEMA) */}
            <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-[1.5rem] space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-stone-600 dark:text-stone-400 text-sm uppercase tracking-wider">Line Items</h4>
                </div>
                
                {formData.items.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-sm space-y-3 relative group">
                        
                        {/* Remove Button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem(idx)}
                          className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>

                        {/* Top Row: Description & Quantity */}
                        <div className="flex gap-2">
                           <Input 
                              placeholder="Item description" 
                              value={item.description} 
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                              className="flex-1 border-stone-100 dark:border-stone-800 bg-transparent font-medium" 
                           />
                           <Input 
                              type="number" 
                              placeholder="Qty" 
                              className="w-16 border-stone-100 dark:border-stone-800"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                           />
                        </div>

                        {/* Middle Row: Price, Category, Type */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="relative col-span-1">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 text-xs">₱</span>
                                <Input 
                                    type="number" 
                                    placeholder="Price" 
                                    className="pl-6 text-xs border-stone-100 dark:border-stone-800"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                                />
                            </div>
                            
                            <Select value={item.category} onValueChange={(val) => handleItemChange(idx, 'category', val)}>
                                <SelectTrigger className="h-10 text-xs border-stone-100 dark:border-stone-800">
                                    <SelectValue placeholder="Cat" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Input 
                                placeholder="Type (e.g. Produce)" 
                                className="text-xs border-stone-100 dark:border-stone-800"
                                value={item.type}
                                onChange={(e) => handleItemChange(idx, 'type', e.target.value)}
                            />
                        </div>

                        {/* Bottom Row: UPC (Optional) */}
                        <Input 
                            placeholder="UPC / Barcode (Optional)" 
                            className="text-[10px] h-8 border-none bg-stone-50 dark:bg-stone-800 text-stone-400"
                            value={item.upc}
                            onChange={(e) => handleItemChange(idx, 'upc', e.target.value)}
                        />
                    </div>
                ))}

                <Button 
                    variant="outline" 
                    className="w-full rounded-full border-dashed border-stone-300 text-stone-500 hover:text-emerald-600"
                    onClick={addItem}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
            </div>

            {/* 3. Financials */}
            <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-[1.5rem] space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="font-mono">{formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <span className="text-stone-500 text-sm">Tax Amount</span>
                    <Input 
                        type="number" 
                        className="w-24 h-8 text-right rounded-md bg-white dark:bg-stone-800 border-none"
                        value={formData.tax_amount}
                        onChange={(e) => {
                             const tax = parseFloat(e.target.value) || 0;
                             setFormData(prev => ({...prev, tax_amount: tax, total: prev.subtotal + tax}));
                        }}
                    />
                </div>
                <Separator className="bg-stone-200" />
                <div className="flex justify-between items-center pt-2">
                    <span className="font-serif font-bold text-stone-800 dark:text-stone-100">Total</span>
                    <span className="font-serif font-bold text-xl text-emerald-600">
                        {formData.total.toFixed(2)}
                    </span>
                </div>
            </div>

          </div>
        </ScrollArea>
      )}

      {/* Submit */}
      <Button className="w-full rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-12 shadow-lg shadow-emerald-900/10 mt-4">
        Save Receipt
      </Button>
    </div>
  );
}