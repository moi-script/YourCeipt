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
import { Camera, Loader2, Sparkles, Receipt, PenTool } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

export function DialogForm({
  isAddDialogOpen,
  setIsAddDialogOpen,
}) {
  const [inputMode, setInputMode] = useState("manual");
  const [quickText, setQuickText] = useState("");
  const [isLoading, setIsLoader] = useState(false);
  const [receiptContent, setReceiptContent] = useState(null);
  const [color, setColor] = useState("from-emerald-600");

  const categories = [
    "Food",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Income",
    "Healthcare",
    "Other",
  ];

  const { user, uploadReceipts, setReceipts, setRefreshPage } = useAuth(); 

  const [manualReceipt, setManualReceipt] = useState({
    transaction_type: "expense",
    amount: "",
    description: "",
    category: "",
    date: "",
    notes: "",
    currency : "PHP" 
  });

  const [formData, setFormData] = useState({
    type: "expense",
    name: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  const handleManualReceiptChange = (e) => {
    if (e === "expense" || e === "income") {
      setManualReceipt((prev) => ({ ...prev, transaction_type: e }));
      return;
    }

    if ((e !== "expense" || e !== "income") && !e.target) {
      setManualReceipt((prev) => ({ ...prev, category: e }));
      return;
    }

    const { name, value } = e.target;
    setManualReceipt((prev) => ({ ...prev, [name]: value }));
  };

  const uploadManualReceipt = async () => {
    try {
      await fetch("http://localhost:3000/receipt/uploadManual", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          ...manualReceipt,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadReceipts = async () => {
    try {
      await uploadReceipts("http://localhost:3000/receipt/upload", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          ...receiptContent,
        }),
      });
      alert("Uploaded Successfully");
    } catch (err) {
      console.error("Unable to upload receipts", err);
    }
  };

  const handleFileChanges = async (e) => {
    const files = e.target.files;
    if (files) {
      setIsLoader(true);
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("myImages", files[i]);
      }
      try {
        await axios.post("http://localhost:3000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const extractText = await axios.get(
          "http://localhost:3000/extract/getText"
        );
        setIsLoader(false);
        setReceipts(extractText.data.contents);
        setReceiptContent(extractText.data.contents);

        alert(`${files.length} files uploaded!`);
      } catch (err) {
        console.error(err);
      }
    } else return;
  };

  const handleParseText = async () => {
    try {
      setIsLoader(true);
      const res = await fetch("http://localhost:3000/extract/quickText", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, quickText: quickText }),
      });
      const data = await res.json()
      
      setColor("bg-orange-500"); 
      setQuickText(data);
      // Assuming 'data' contains parsed fields, update formData for preview
      // setFormData({ ...formData, amount: data.amount, name: data.merchant, type: data.type });
      
      setIsLoader(false);
    } catch (err) {
      console.error(err);
    }
  };

  const hanldeUploadQuickText = async () => {
    try {
      setIsLoader(true);
      const res = await fetch("http://localhost:3000/extract/uploadQuick", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, quickText: quickText.output }),
      });
      setIsLoader(false);
      if (res.ok === 200) {
        setQuickText("");
      }
      setColor("from-emerald-600");
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearUploads = async () => {
    try {
      await fetch('/clearUploads');
    } catch(err){
      console.error('Unable to clean uploads ::', err);
    }
  }

  const uploadInput = () => {
    switch (inputMode) {
      case "manual":
        return uploadManualReceipt();
      case "receipt":
        return handleUploadReceipts();
      case "quick":
        return hanldeUploadQuickText();
      default:
        return;
    }
  };

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        {/* Organic Dialog Content Style */}
        <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] bg-[#fcfcfc] dark:bg-stone-950 border border-white/50 dark:border-stone-800 shadow-2xl p-8 transition-colors duration-300">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-serif italic text-stone-800 dark:text-stone-100">New Transaction</DialogTitle>
            <DialogDescription className="text-stone-500 dark:text-stone-400 font-medium">
              Choose your preferred method to log expenses.
            </DialogDescription>
          </DialogHeader>

          {/* Input Method Selector - Organic Tabs */}
          <div className="grid grid-cols-3 gap-3 mb-8 bg-stone-100/50 dark:bg-stone-900/50 p-2 rounded-[2rem]">
            <Button
              variant="ghost"
              className={`flex-col h-auto py-4 rounded-[1.5rem] transition-all duration-300 ${
                inputMode === "manual" 
                  ? "bg-white dark:bg-stone-800 shadow-md text-emerald-700 dark:text-emerald-400" 
                  : "text-stone-500 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50 hover:text-stone-700 dark:hover:text-stone-200"
              }`}
              onClick={() => setInputMode("manual")}
            >
              <PenTool className="w-6 h-6 mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Manual</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-col h-auto py-4 rounded-[1.5rem] transition-all duration-300 ${
                inputMode === "receipt" 
                  ? "bg-white dark:bg-stone-800 shadow-md text-emerald-700 dark:text-emerald-400" 
                  : "text-stone-500 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50 hover:text-stone-700 dark:hover:text-stone-200"
              }`}
              onClick={() => setInputMode("receipt")}
            >
              <Camera className="w-6 h-6 mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Scan</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-col h-auto py-4 rounded-[1.5rem] transition-all duration-300 ${
                inputMode === "quick" 
                  ? "bg-white dark:bg-stone-800 shadow-md text-emerald-700 dark:text-emerald-400" 
                  : "text-stone-500 dark:text-stone-400 hover:bg-white/50 dark:hover:bg-stone-800/50 hover:text-stone-700 dark:hover:text-stone-200"
              }`}
              onClick={() => setInputMode("quick")}
            >
              <Sparkles className="w-6 h-6 mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Quick</span>
            </Button>
          </div>

          {/* Manual Entry Form */}
          {inputMode === "manual" && (
            <div className="space-y-1 animate-in fade-in zoom-in-95 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Type</Label>
                  <Select
                    value={manualReceipt.transaction_type}
                    name="transaction_type"
                    onValueChange={handleManualReceiptChange}
                  >
                    <SelectTrigger className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-12 px-4 focus:ring-emerald-200 dark:focus:ring-emerald-900 text-stone-800 dark:text-stone-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-[1.5rem] border-none shadow-xl bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-stone-400 dark:text-stone-500">₱</span>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        name="amount"
                        value={manualReceipt.amount}
                        onChange={handleManualReceiptChange}
                        className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-12 pl-8 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-900 text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Description</Label>
                <Input
                  placeholder="e.g., Grocery shopping, Salary..."
                  value={manualReceipt.name}
                  name="description"
                  onChange={handleManualReceiptChange}
                  className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-12 px-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-900 text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Category</Label>
                  <Select
                    value={manualReceipt.category}
                    name="category"
                    onValueChange={handleManualReceiptChange}
                  >
                    <SelectTrigger className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-12 px-4 focus:ring-emerald-200 dark:focus:ring-emerald-900 text-stone-800 dark:text-stone-200">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[1.5rem] border-none shadow-xl h-48 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Date</Label>
                  <Input
                    type="date"
                    name="date"
                    value={manualReceipt.date}
                    onChange={handleManualReceiptChange}
                    className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-12 px-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-900 text-stone-800 dark:text-stone-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Notes</Label>
                <Textarea
                  placeholder="Add any additional details..."
                  value={manualReceipt.notes}
                  name="notes"
                  onChange={handleManualReceiptChange}
                  rows={3}
                  className="rounded-[1.5rem] bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 px-4 py-3 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-900 resize-none text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>
            </div>
          )}

          {/* Receipt Upload */}
          {inputMode === "receipt" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="border-2 border-dashed border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] p-10 text-center hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group">
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Receipt className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-lg font-serif italic text-emerald-900 dark:text-emerald-100 mb-1">
                  Upload Receipt
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 max-w-xs mx-auto">
                  We'll use AI to extract the merchant, date, and total amount automatically.
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="image-upload"
                  onChange={handleFileChanges}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex justify-center items-center"
                >
                  {isLoading ? (
                    <Button disabled className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-8">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                    </Button>
                  ) : (
                    <div className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 transition-all">
                        Select Image
                    </div>
                  )}
                </label>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-[1.5rem] border border-orange-100 dark:border-orange-800/30 flex gap-3 items-start">
                <Sparkles className="w-5 h-5 text-orange-500 dark:text-orange-400 mt-0.5" />
                <p className="text-sm text-orange-800/80 dark:text-orange-200/80">
                  <span className="font-bold">Tip:</span> Ensure the receipt is well-lit and the total amount is clearly visible for best results.
                </p>
              </div>
            </div>
          )}

          {/* QUICK TEXT INPUT */}
          {inputMode === "quick" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">Quick Entry</Label>
                <Textarea
                  placeholder='e.g., "Paid $45 for groceries at Walmart yesterday"'
                  value={quickText}
                  onChange={(e) => setQuickText(e.target.value)}
                  rows={4}
                  className="rounded-[1.5rem] bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 px-5 py-4 focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-900 text-lg resize-none text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600"
                />
              </div>

              <Button 
                variant="secondary" 
                onClick={handleParseText}
                className="w-full rounded-full h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Parse with AI
              </Button>

              {formData.amount && (
                <Card className="border-none bg-stone-50 dark:bg-stone-900 rounded-[1.5rem]">
                  <CardContent className="p-6 space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-2">
                        <span className="text-stone-500 dark:text-stone-400">Merchant</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-2">
                        <span className="text-stone-500 dark:text-stone-400">Amount</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">${formData.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-stone-500 dark:text-stone-400">Type</span>
                        <Badge className="bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300">{formData.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* DIALOG ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-stone-100 dark:border-stone-800">
            <Button 
                variant="ghost" 
                onClick={() => {
                    handleClearUploads();
                    setIsAddDialogOpen(false);
                }}
                className="rounded-full px-6 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400"
            >
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              className={`rounded-full px-8 bg-gradient-to-r ${color} to-teal-600 hover:shadow-lg transition-all duration-300 text-white border-none`}
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
    </>
  );
}