import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Camera, Loader2, Sparkles, Receipt, PenTool, Settings2, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "../components/Toaster.jsx";
import { Badge } from "@/components/ui/badge";
import { uploadNotification } from "@/api/uploadNotification.js";
// --- 1. DEFINITIONS & SCHEMA ---
const EMPTY_ITEM_SCHEMA = {
  description: "", 
  upc: "",         
  type: "",       
  category: "General", 
  price: 0,        
  quantity: 1      
};
import { BASE_API_URL } from "@/api/getKeys.js";
// const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000"


const INITIAL_COMPLEX_STATE = {
  store: "",
  slogan: "",
  contact: "",
  manager: "",
  address: { street: "", city: "", state: "", zip: "" },
  transaction: { store_number: "", operator_number: "", terminal_number: "", transaction_number: "" },
  items: [ { ...EMPTY_ITEM_SCHEMA, description: "Manual Item" } ], 
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

const categories = [
  "Food", "Transportation", "Entertainment", "Shopping", 
  "Utilities", "Income", "Healthcare", "Other", "General"
];

export function AdvanceForm({
  isAddDialogOpen,
  setIsAddDialogOpen,
}) {
  const { user, uploadReceipts, setReceipts, setRefreshPage, activeModelName } = useAuth();
  const  toast   = useToast();
  const [inputMode, setInputMode] = useState("manual");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [quickText, setQuickText] = useState("");
  const [isLoading, setIsLoader] = useState(false);
  const [receiptContent, setReceiptContent] = useState(null);
  const [color, setColor] = useState("from-emerald-600");


  const [formData, setFormData] = useState(INITIAL_COMPLEX_STATE);

  useEffect(() => {

    // console.warn('The value of toast context ::', toast.success);
  }, [])
  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev };
      
      if (name === "amount") {
        const val = parseFloat(value) || 0;
        newState.total = val;
        newState.subtotal = val;
        newState.amount_paid = val;
        // Sync with first item
        if (newState.items.length > 0) newState.items[0].price = val;
      } 
      else if (name === "description") {
        newState.store = value;
        // Sync with first item
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

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setColor("bg-orange-500"); 
    const newSubtotal = newItems.reduce((acc, item) => acc + (parseFloat(item.price || 0) * parseFloat(item.quantity || 1)), 0);
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal: newSubtotal,
      total: newSubtotal + (parseFloat(prev.tax_amount) || 0)
    }));
  };

  const addItem = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM_SCHEMA }] }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const newSubtotal = newItems.reduce((acc, item) => acc + (parseFloat(item.price || 0) * parseFloat(item.quantity || 1)), 0);
    setFormData(prev => ({
      ...prev,
      items: newItems,
      subtotal: newSubtotal,
      total: newSubtotal + (parseFloat(prev.tax_amount) || 0)
    }));
  };


  const uploadManualReceipt = async () => {
    try {
      await fetch(BASE_API_URL + "/receipt/uploadManual",  { // http://localhost:3000/receipt/uploadManual",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          ...formData, 
        }),
      });
      setFormData(INITIAL_COMPLEX_STATE);

      const { store } = formData;

       const notifPayload = {
        userId : user._id,
        title : store,
        message : "Your receipt was successfully parsed and logged.",
        type : "success"
      }
      
      toast.success("Transaction Saved", "Your receipt was successfully parsed and logged.");

      await uploadNotification(notifPayload);

    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadReceipts = async () => {
    try {
      await uploadReceipts(BASE_API_URL + "/receipt/upload", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          ...receiptContent,
        }),
      });

      const { store } = receiptContent;

      const notifPayload = {
        userId : user._id,
        title : store,
        message : "Your receipt was successfully parsed and logged.",
        type : "success"
      }
      
      toast.success("Transaction Saved", "Your receipt was successfully parsed and logged.");


      await uploadNotification(notifPayload);

      setReceiptContent(null);
    } catch (err) {
      console.error("Unable to upload receipts", err);
    }
  };

  const handleFileChanges = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoader(true);

      // limit to just only 1 files first
      const formDataUpload = new FormData();
      
      // for (let i = 0; i < files.length; i++) {
      //   formDataUpload.append("myImages", files[i]);
      // }

      formDataUpload.append('image', file)
      try {
           // BASE_API_URL 'http://localhost:3000'
        const res = await fetch(BASE_API_URL + "/receipt-image-cloud", {
          method : "POST",
          body : formDataUpload
          // headers: { "Content-Type": "multipart/form-data" },
        });

        const { imageUrl } = await res.json();

        console.log("Url to fetch image for buffer --> ", imageUrl);
        const image_response = await fetch(imageUrl);

        const postImageForm = new FormData();
          const arrayBuffer = await image_response.arrayBuffer();
          const blob = new Blob([arrayBuffer], { type: "image/*" });
          console.log('This is the buffer -->', blob);
          postImageForm.append("image_buffer", blob);
          postImageForm.append("activeModelName", activeModelName);
          // const buffer = Buffer.from(arrayBuffer);

          const extractText = await axios.post(BASE_API_URL + "/extract/azure", postImageForm); //  BASE_API_URL

        if(extractText.status !== 200){
           setIsLoader(false);
           return;
        }
        setIsLoader(false);
        setReceipts(extractText.data.contents);
        setReceiptContent(extractText.data.contents);
      } catch (err) {
        alert('Unable to parse image ::', err);
        console.error('Unable to parse image ::' + err);
        console.log('Unable to parse image ::' + err);

        setIsLoader(false);
      }
    }
  };

  const handleParseText = async () => {
    // needs to be study
    try {
      setIsLoader(true);
      const res = await fetch(BASE_API_URL + "/extract/quickText",  { // BASE_API_URL http://localhost:3000/extract/quickText",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ userId: user._id, quickText: quickText, activeModelName : activeModelName }),
      });
      const data = await res.json();
      setColor("bg-orange-500");  
      setQuickText(data); 
      setIsLoader(false);
    } catch (err) {
      console.error(err);
      setIsLoader(false);
    }
  };

  const hanldeUploadQuickText = async () => {
    try {
      setIsLoader(true);
      const res = await fetch(BASE_API_URL + "/extract/uploadQuick", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ userId: user._id, quickText: quickText.output }),
      });
      setIsLoader(false);
      if (res.ok) setQuickText("");
      setColor("from-emerald-600");
    } catch (err) {
      console.error(err);
      setIsLoader(false);
    }
  };

  const handleClearUploads = async () => {
    try {
      await fetch('/clearUploads');
      setFormData(INITIAL_COMPLEX_STATE); 
    } catch(err){
      console.error('Unable to clean uploads ::', err);
    }
  }

  const uploadInput = () => {
    switch (inputMode) {
      case "manual": return uploadManualReceipt();
      case "receipt": return handleUploadReceipts();
      case "quick": return hanldeUploadQuickText();
      default: return;
    }
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent 
        className="w-[95vw] sm:w-full sm:max-w-[600px] 
          max-h-[85vh] overflow-y-auto 
          rounded-[1.5rem] sm:rounded-[2.5rem] 
          bg-[#fcfcfc] dark:bg-stone-950 
          border border-white/50 dark:border-stone-800 
          shadow-2xl p-4 sm:p-8 
          transition-colors duration-300
          [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-200 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        
        <DialogHeader className="mb-4 sm:mb-6">
          <DialogTitle className="text-xl sm:text-3xl font-serif italic text-stone-800 dark:text-stone-100">
            New Transaction
          </DialogTitle>
          <DialogDescription className="text-stone-500 dark:text-stone-400 font-medium text-xs sm:text-base">
            Choose your preferred method to log expenses.
          </DialogDescription>
        </DialogHeader>

        {/* Mode Selectors */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-8 bg-stone-100/50 dark:bg-stone-900/50 p-1.5 sm:p-2 rounded-[1.5rem] sm:rounded-[2rem]">
          {["manual", "receipt", "quick"].map((mode) => (
            <Button
              key={mode}
              variant="ghost"
              className={`flex-col h-auto py-2 sm:py-4 rounded-[1.2rem] sm:rounded-[1.5rem] transition-all duration-300 ${
                inputMode === mode 
                  ? "bg-white dark:bg-stone-800 shadow-md text-emerald-700 dark:text-emerald-400" 
                  : "text-stone-500 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50"
              }`}
              onClick={() => setInputMode(mode)}
            >
              {mode === "manual" && <PenTool className="w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2" />}
              {mode === "receipt" && <Camera className="w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2" />}
              {mode === "quick" && <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2" />}
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                {mode === "quick" ? "AI Quick" : mode.charAt(0).toUpperCase() + mode.slice(1)}
              </span>
            </Button>
          ))}
        </div>

        {/* ================= MANUAL MODE (UPDATED) ================= */}
        {inputMode === "manual" && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
             
             {/* TOGGLE SWITCH HEADER */}
             <div className="flex justify-between items-center px-2">
                <h3 className="font-serif text-sm sm:text-lg text-stone-700 dark:text-stone-300 italic">
                   {isAdvanced ? "Detailed Entry" : "Quick Entry"}
                </h3>
                <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setIsAdvanced(!isAdvanced)}
                   className="text-stone-500 hover:text-emerald-600 gap-2 h-8 text-[10px] sm:text-xs"
                >
                   <Settings2 className="w-3 h-3 sm:w-4 sm:h-4" />
                   {isAdvanced ? "Switch to Simple" : "Advanced"}
                </Button>
             </div>

             {/* --- SIMPLE VIEW --- */}
             {!isAdvanced && (
                <div className="space-y-3 sm:space-y-1">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 ml-3">Type</Label>
                        <Select value={formData.metadata.type} onValueChange={(val) => handleSimpleSelectChange("transaction_type", val)}>
                          <SelectTrigger className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-11 sm:h-12"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-[1.5rem]">
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 ml-3">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">₱</span>
                          <Input type="number" step="0.01" placeholder="0.00" name="amount" value={formData.total || ""} onChange={handleSimpleChange} className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-11 sm:h-12 pl-8" />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-1.5 sm:space-y-2 pt-1">
                      <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 ml-3">Description</Label>
                      <Input placeholder="e.g., Grocery shopping..." name="description" value={formData.store} onChange={handleSimpleChange} className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-11 sm:h-12 px-4" />
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 pt-1">
                      <div className="space-y-1.5 sm:space-y-2">
                         <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 ml-3">Category</Label>
                         <Select value={formData.items[0]?.category || "General"} onValueChange={(val) => handleSimpleSelectChange("category", val)}>
                            <SelectTrigger className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-11 sm:h-12"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent className="rounded-[1.5rem] h-48">
                              {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                         <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 ml-3">Date</Label>
                         <Input type="date" name="date" value={formData.metadata.datetime} onChange={handleSimpleChange} className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-11 sm:h-12 px-4" />
                      </div>
                   </div>

                   <div className="space-y-1.5 sm:space-y-2 pt-1">
                      <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 ml-3">Notes</Label>
                      <Textarea placeholder="Details..." name="notes" value={formData.metadata.notes} onChange={handleSimpleChange} rows={3} className="rounded-[1.5rem] bg-stone-50 dark:bg-stone-900 border-transparent px-4 py-3 resize-none" />
                   </div>
                </div>
             )}

             {/* --- ADVANCED VIEW --- */}
             {isAdvanced && (
                <ScrollArea className="h-[400px] pr-4 rounded-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="space-y-6 pt-1">
                      {/* Store */}
                      <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-[1.5rem] space-y-4">
                         <h4 className="font-bold text-stone-500 text-xs uppercase tracking-wider">Store Info</h4>
                         <Input placeholder="Store Name" value={formData.store} onChange={(e) => setFormData({...formData, store: e.target.value})} className="rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950" />
                         <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Street" value={formData.address.street} onChange={(e) => handleNestedChange('address', 'street', e.target.value)} className="col-span-2 rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950" />
                            <Input placeholder="City" value={formData.address.city} onChange={(e) => handleNestedChange('address', 'city', e.target.value)} className="rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950" />
                            <Input placeholder="Zip" value={formData.address.zip} onChange={(e) => handleNestedChange('address', 'zip', e.target.value)} className="rounded-full border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950" />
                         </div>
                      </div>

                      {/* Items */}
                      <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-[1.5rem] space-y-4">
                          <div className="flex justify-between items-center"><h4 className="font-bold text-stone-500 text-xs uppercase tracking-wider">Items</h4></div>
                          {formData.items.map((item, idx) => (
                              <div key={idx} className="bg-white dark:bg-stone-950 p-4 rounded-xl shadow-sm space-y-3 relative group border border-stone-100 dark:border-stone-800">
                                  <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></Button>
                                  <div className="flex gap-2">
                                     <Input placeholder="Item Name" value={item.description} onChange={(e) => handleItemChange(idx, 'description', e.target.value)} className="flex-1 border-none bg-transparent font-medium p-0 focus-visible:ring-0" />
                                     <Input type="number" placeholder="Qty" className="w-14 h-8 text-xs bg-stone-50 dark:bg-stone-900 border-none text-center" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} />
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                      <div className="relative col-span-1">
                                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 text-xs">₱</span>
                                          <Input type="number" className="pl-6 h-9 text-xs bg-stone-50 dark:bg-stone-900 border-none" value={item.price} onChange={(e) => handleItemChange(idx, 'price', e.target.value)} />
                                      </div>
                                      <Select value={item.category} onValueChange={(val) => handleItemChange(idx, 'category', val)}>
                                          <SelectTrigger className="h-9 text-xs bg-stone-50 dark:bg-stone-900 border-none"><SelectValue placeholder="Cat" /></SelectTrigger>
                                          <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                      </Select>
                                      <Input placeholder="Type" className="h-9 text-xs bg-stone-50 dark:bg-stone-900 border-none" value={item.type} onChange={(e) => handleItemChange(idx, 'type', e.target.value)} />
                                  </div>
                              </div>
                          ))}
                          <Button variant="outline" className="w-full rounded-full border-dashed border-stone-300 text-stone-500 hover:text-emerald-600" onClick={addItem}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
                      </div>

                      {/* Totals */}
                      <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-[1.5rem] space-y-2">
                          <div className="flex justify-between text-sm text-stone-500"><span>Subtotal</span><span className="font-mono">{formData.subtotal.toFixed(2)}</span></div>
                          <div className="flex justify-between items-center gap-4"><span className="text-stone-500 text-sm">Tax</span><Input type="number" className="w-20 h-8 text-right rounded-md bg-white dark:bg-stone-950 border-none text-xs" value={formData.tax_amount} onChange={(e) => { const tax = parseFloat(e.target.value) || 0; setFormData(prev => ({...prev, tax_amount: tax, total: prev.subtotal + tax})); }} /></div>
                          <Separator className="bg-stone-200 dark:bg-stone-800" />
                          <div className="flex justify-between items-center pt-2"><span className="font-serif font-bold text-stone-800 dark:text-stone-100">Total</span><span className="font-serif font-bold text-xl text-emerald-600">₱{formData.total.toFixed(2)}</span></div>
                      </div>
                   </div>
                </ScrollArea>
             )}
          </div>
        )}

        {/* ================= RECEIPT & QUICK MODES (UNCHANGED) ================= */}
        {inputMode === "receipt" && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-300">
             <div className="border-2 border-dashed border-emerald-100 dark:border-emerald-900/30 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-10 text-center hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 sm:p-4 rounded-full w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-base sm:text-lg font-serif italic text-emerald-900 dark:text-emerald-100 mb-1">Upload Receipt</p>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-4 sm:mb-6 max-w-xs mx-auto">
                AI extraction supported.
              </p>
              <Input type="file" accept="image/*" multiple className="hidden" id="image-upload" onChange={handleFileChanges} />
              <label htmlFor="image-upload" className="cursor-pointer flex justify-center items-center">
                {isLoading ? (
                  <Button disabled className="w-full sm:w-auto rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 h-10 sm:h-12 px-6 sm:px-8 text-sm"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</Button>
                ) : (
                  <div className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white h-10 sm:h-12 px-6 sm:px-8 flex items-center justify-center rounded-full font-medium text-sm sm:text-base shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 transition-all">Select Image</div>
                )}
              </label>
            </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 sm:p-4 rounded-[1.2rem] sm:rounded-[1.5rem] border border-orange-100 dark:border-orange-800/30 flex gap-3 items-start">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400 mt-0.5" />
              <p className="text-xs sm:text-sm text-orange-800/80 dark:text-orange-200/80">
                <span className="font-bold">Tip:</span> Ensure the receipt is well-lit. Parsing speed depends on your Ai model {activeModelName}
              </p>
            </div>


          </div>
        )}

        {inputMode === "quick" && (
           <div className="space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="space-y-1.5 sm:space-y-2">
                 <Label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Quick Entry</Label>
                 <Textarea placeholder='e.g., "Paid $45 for groceries..."' value={quickText} onChange={(e) => setQuickText(e.target.value)} rows={4} className="rounded-[1.5rem] bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 px-4 sm:px-5 py-3 sm:py-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-900 text-base sm:text-lg resize-none" />
              </div>
              <Button variant="secondary" onClick={handleParseText} className="w-full rounded-full h-11 sm:h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"><Sparkles className="w-4 h-4 mr-2" /> Parse with AI</Button>
           </div>
        )}

        {/* DIALOG ACTIONS */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 mt-4 border-t border-stone-100 dark:border-stone-800">
          <Button 
              variant="ghost" 
              onClick={() => {
                  handleClearUploads();
                  setIsAddDialogOpen(false);
              }}
              className="w-full sm:w-auto h-11 sm:h-auto rounded-full px-6 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 text-sm sm:text-base"
          >
            Cancel
          </Button>

          <Button
            disabled={isLoading}
            className={`w-full sm:w-auto h-11 sm:h-auto rounded-full px-8 bg-gradient-to-r ${color} to-teal-600 hover:shadow-lg transition-all duration-300 text-white border-none text-sm sm:text-base`}
            onClick={() => {
              setRefreshPage(true);
              uploadInput();
              setIsAddDialogOpen(false);
            }}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}