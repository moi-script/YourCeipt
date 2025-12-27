import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  //   DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Upload, X, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function DialogForm({
  transactions,
  setTransactions,
  isAddDialogOpen,
  setIsAddDialogOpen,
}) {
  const [inputMode, setInputMode] = useState("manual");
  const [quickText, setQuickText] = useState("");
  const [isLoading, setIsLoader] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [receiptContent, setReceiptContent] = useState(null);
  const [color, setColor] = useState("from-emerald-600");

  // const [text, setExtractedText] = useState(null);
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

  const handleQuickParse = () => {
    const amountMatch = quickText.match(/\$?(\d+(\.\d+)?)/);
    const amount = amountMatch ? amountMatch[1] : "";

    setFormData({
      ...formData,
      name: quickText.split(/\d/)[0].trim() || "Transaction",
      amount: amount,
      type:
        quickText.toLowerCase().includes("received") ||
        quickText.toLowerCase().includes("income")
          ? "income"
          : "expense",
      notes: quickText,
    });
  };

  const { user, uploadReceipts, setReceipts, refreshPage, setRefreshPage } = useAuth(); // _id

  const [manualReceipt, setManualReceipt] = useState({
    transaction_type: "expense",
    amount: "",
    description: "",
    category: "",
    date: "",
    notes: "",
    currency : "PHP" // set for default 
  });

  const handleManualReceiptChange = (e) => {
    console.log("e --> ", e.target);

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
    console.log("Manual :: ", manualReceipt);
  };

  const uploadManualReceipt = async () => {
    console.log('Manual receipt', manualReceipt);
    try {
      const res = await fetch("http://localhost:3000/receipt/uploadManual", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          ...manualReceipt,
        }),
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadReceipts = async () => {
    console.log("User object handleUpload ::", user);
    console.log("Reciept object handleUpload ::", receiptContent);

    try {
      const res = await uploadReceipts("http://localhost:3000/receipt/upload", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          ...receiptContent,
        }),
      });

      // const data = await res.json();
      console.log("Data :: ", res);
      alert("Uploaded Successfully");
    } catch (err) {
      console.error("Unable to upload receipts", err);
    }
  };

  const handleFileChanges = async (e) => {
    const files = e.target.files;
    // setSelectedFiles(e.target.files);
    if (files) {
      setIsLoader(true);
      console.log("Uploading files");
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("myImages", files[i]);
      }
      try {
        const res = await axios.post("http://localhost:3000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Uploaded:", res.data);

        const extractText = await axios.get(
          "http://localhost:3000/extract/getText"
        );
        setIsLoader(false);
        //  const dataContents = await extractText.json();
        console.log("Extracted text :: ", extractText.data.contents);
        setReceipts(extractText.data.contents);
        setReceiptContent(extractText.data.contents);

        alert(`${files.length} files uploaded!`);
      } catch (err) {
        console.error(err);
      }
    } else return;
  };

  // uploadQuick

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
      console.log('Res output ::', data);
      setQuickText(data);
      setIsLoader(false);
    } catch (err) {
      console.error(err);
    }
  };

  const hanldeUploadQuickText = async () => {
    try {
      setIsLoader(true);
      console.log('Uploading quickText ',  quickText.output);
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
      const res = await fetch('/clearUploads');
    } catch(err){
      console.error('Unable to clean uploads ::', err);
    }
  }

  const uploadInput = () => {
    console.log("Input mode ::", inputMode);
    // setColor("from-emerald-600");

    switch (inputMode) {
      case "manual":
        return uploadManualReceipt();
      case "receipt":
        return handleUploadReceipts();
      case "quick":
        return hanldeUploadQuickText();
    }
  };

  const [formData, setFormData] = useState({
    type: "expense",
    name: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Choose how you'd like to add your transaction
            </DialogDescription>
          </DialogHeader>

          {/* Input Method Selector */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Button
              variant={inputMode === "manual" ? "default" : "outline"}
              className="flex-col h-auto py-4"
              onClick={() => setInputMode("manual")}
            >
              <FileText className="w-6 h-6 mb-2" />
              <span className="text-xs">Manual Entry</span>
            </Button>
            <Button
              variant={inputMode === "receipt" ? "default" : "outline"}
              className="flex-col h-auto py-4"
              onClick={() => setInputMode("receipt")}
            >
              <Camera className="w-6 h-6 mb-2" />
              <span className="text-xs">Scan Receipt</span>
            </Button>
            <Button
              variant={inputMode === "quick" ? "default" : "outline"}
              className="flex-col h-auto py-4"
              onClick={() => setInputMode("quick")}
            >
              <Upload className="w-6 h-6 mb-2" />
              <span className="text-xs">Quick Text</span>
            </Button>
          </div>

          {/* Manual Entry Form */}
          {inputMode === "manual" && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <Select
                    value={manualReceipt.transaction_type}
                    name="transaction_type"
                    onValueChange={handleManualReceiptChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    name="amount"
                    value={manualReceipt.amount}
                    onChange={handleManualReceiptChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="e.g., Grocery shopping, Salary..."
                  value={manualReceipt.name}
                  name="description"
                  onChange={handleManualReceiptChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Select
                    value={manualReceipt.category}
                    name="category"
                    onValueChange={handleManualReceiptChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    name="date"
                    value={manualReceipt.date}
                    onChange={handleManualReceiptChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any additional details..."
                  value={manualReceipt.notes}
                  name="notes"
                  onChange={handleManualReceiptChange}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Receipt Upload */}
          {inputMode === "receipt" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors">
                <Camera className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Upload Receipt Image
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  We'll extract transaction details automatically
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
                  {/* Add pointer-events-none so the click ignores the button and hits the label */}
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="pointer-events-none"
                    >
                      Upload Image
                    </Button>
                  )}
                </label>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  After upload, extracted values will auto-fill the form.
                </p>
              </div>
            </div>
          )}

          {/* QUICK TEXT INPUT */}
          {inputMode === "quick" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Quick Entry</Label>
                <Textarea
                  placeholder='Example: "Paid $45 for groceries at Walmart"'
                  value={quickText}
                  onChange={(e) => setQuickText(e.target.value)}
                  rows={4}
                />
              </div>

              <Button variant="secondary" onClick={handleParseText}>
                Parse Text
              </Button>

              {formData.amount && (
                <Card className="border-slate-200">
                  <CardContent className="p-4 space-y-2 text-sm">
                    <p>
                      <strong>Detected Name:</strong> {formData.name}
                    </p>
                    <p>
                      <strong>Detected Amount:</strong> ${formData.amount}
                    </p>
                    <p>
                      <strong>Detected Type:</strong> {formData.type}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* DIALOG ACTIONS */}
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={() => {
              handleClearUploads();
              setIsAddDialogOpen(false);
            }}>
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              className={`bg-gradient-to-r ${color} to-teal-600`}
              onClick={() => {
                setRefreshPage(true);
                uploadInput();
                setIsAddDialogOpen(false);
                // setRefreshPage(false);
              }}
            >
              {isLoading && <Loader2 className="animate-spin" />}
              Save Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
