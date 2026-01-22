"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogForm } from "@/Input/DialogForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Search,
  Receipt,
  Leaf,
  Sparkles,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BASE_API_URL } from "@/api/getKeys.js";
// const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"

export default function TransactionsPage({
  sidebarOpen,
  setSidebarOpen,
  handleBellClick,
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { transactionFlow, setRefreshPage } = useAuth();

  useEffect(() => {
    setTransactions(transactionFlow);
  }, [transactionFlow]);

  const handleDeleteReceipts = async (id) => {
    if (confirm("Do you want to delete this transaction?")) {
      try {
        await fetch(BASE_API_URL + `/receipt/delete?id=${id}`, {
          method: "DELETE",
        });
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        setRefreshPage(true);
      } catch (err) {
        console.error("Unable to delete", err);
      }
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions?.filter((t) => {
      const matchesSearch =
        t.store.toLowerCase().includes(search.toLowerCase()) ||
        t.metadata.notes?.toLowerCase().includes(search.toLowerCase());

      const matchesType = filterType === "all" ? true : t.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, filterType]);

  return (
    <>
      <div className="h-screen w-full bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden flex flex-col font-sans text-stone-800 dark:text-stone-100 transition-colors duration-300">
        
        {/* Decorative Background Blobs - Added max-w-full to prevent horizontal scroll on mobile */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] max-w-full h-[500px] bg-emerald-100 dark:bg-emerald-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[80px] opacity-60 dark:opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] max-w-full h-[400px] bg-orange-100 dark:bg-orange-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[80px] opacity-60 dark:opacity-20 pointer-events-none"></div>

        <DialogForm
          transactions={transactions}
          setTransactions={setTransactions}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
        />

        {/* HEADER SECTION */}
        <div className="p-4 sm:p-6 pb-2 z-10 space-y-4 sm:space-y-6">
          {/* Title & Add Button - Stack on mobile, Row on Desktop */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 backdrop-blur-sm shadow-sm mb-2">
                <Sparkles className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
                <span className="text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                  Ledger
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif italic text-[#2c2c2c] dark:text-stone-100">
                Transaction Flow
              </h1>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="w-full sm:w-auto rounded-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/10 px-6"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New
            </Button>
          </div>

          {/* SEARCH & FILTER BAR - Stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-stone-400 dark:text-stone-500" />
              <Input
                placeholder="Search stores or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-full bg-white/60 dark:bg-stone-900/60 border-transparent shadow-sm h-11 focus-visible:ring-emerald-300/50 text-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500 backdrop-blur-md w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-full bg-white/60 dark:bg-stone-900/60 border-transparent shadow-sm h-11 focus:ring-emerald-300/50 text-stone-800 dark:text-stone-100 backdrop-blur-md">
                <SelectValue placeholder="Filter Type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-800 dark:text-stone-100">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* LIST */}
        <ScrollArea className="flex-1 px-4 sm:px-6 pb-6 z-10 w-full">
          <div className="space-y-4">
            {filteredTransactions?.length === 0 ? (
              <Card className="border-none bg-white/40 dark:bg-stone-900/40 shadow-none rounded-[2rem]">
                <CardContent className="p-12 text-center text-stone-500 dark:text-stone-400">
                  <Receipt className="w-12 h-12 mx-auto mb-4 opacity-30 text-stone-400 dark:text-stone-600" />
                  <p className="font-serif italic text-lg">
                    No transactions found
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredTransactions?.map((t) => {
                const isOpen = expandedId === t.id;

                return (
                  <Card
                    key={t.id}
                    className={`border-white/50 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-[2rem] overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "ring-2 ring-emerald-100 dark:ring-emerald-900/50 shadow-md"
                        : "hover:bg-white/90 dark:hover:bg-stone-800/80"
                    }`}
                  >
                    {/* COLLAPSED HEADER - Responsive Flex */}
                    <CardHeader
                      className="cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4"
                      onClick={() => setExpandedId(isOpen ? null : t.id)}
                    >
                      {/* Left Side: Icon & Details */}
                      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto overflow-hidden">
                        <div
                          className={`shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center ${
                            t.type === "income"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                          }`}
                        >
                          <Leaf className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-serif text-base sm:text-lg text-stone-800 dark:text-stone-100 truncate">
                            {t.store}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                            <span className="truncate">{t.metadata.datetime}</span>
                            <span className="hidden sm:inline h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-600"></span>
                            <span className="capitalize hidden sm:inline">
                              {t.payment_method}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Amount & Chevron - Adjusted for Mobile */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        {/* Mobile Only Payment Method Label */}
                        <span className="sm:hidden text-xs text-stone-400 capitalize">{t.payment_method}</span>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <p
                            className={`text-lg font-bold whitespace-nowrap ${
                                t.type === "income"
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-stone-800 dark:text-stone-200"
                            }`}
                            >
                            {t.type === "expense" && "-"} {t.metadata.currency}{" "}
                            {t.total.toFixed(2)}
                            </p>
                            <div
                            className={`p-2 rounded-full transition-colors ${
                                isOpen
                                ? "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                                : "text-stone-400 dark:text-stone-500"
                            }`}
                            >
                            {isOpen ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                            </div>
                        </div>
                      </div>
                    </CardHeader>

                    {/* EXPANDED CONTENT */}
                    {isOpen && (
                      <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
                        <div className="h-px w-full bg-stone-100 dark:bg-stone-800"></div>

                        {/* STORE INFO & ADDRESS GRID - Stack on mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50/50 dark:bg-stone-800/40 p-4 sm:p-6 rounded-[1.5rem]">
                          <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                              Location
                            </p>
                            <p className="text-sm text-stone-700 dark:text-stone-300 font-medium break-words">
                              {t.address.street}, {t.address.city}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              {t.address.state} {t.address.zip}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                              Details
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-stone-600 dark:text-stone-300">
                              <div>
                                <span className="text-stone-400 dark:text-stone-500">
                                  Store #:
                                </span>{" "}
                                {t.transaction.store_number}
                              </div>
                              <div>
                                <span className="text-stone-400 dark:text-stone-500">
                                  Term:
                                </span>{" "}
                                {t.transaction.terminal_number}
                              </div>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400">
                              Mgr: {t.manager || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* ITEMS */}
                        <div className="space-y-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-2">
                            Receipt Items
                          </p>
                          <div className="space-y-2">
                            {t.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-start sm:items-center bg-white/60 dark:bg-stone-900/60 p-3 rounded-2xl text-sm border border-stone-100 dark:border-stone-800"
                              >
                                <div className="flex gap-3 items-start">
                                  <span className="bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-lg text-xs font-mono mt-0.5 sm:mt-0">
                                    x{item.quantity}
                                  </span>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-stone-700 dark:text-stone-200 line-clamp-2">
                                      {item.description}
                                    </span>
                                    <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-wide">
                                      {item.type}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-mono text-stone-600 dark:text-stone-400 whitespace-nowrap ml-2">
                                  {t.metadata.currency} {item.price.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* TOTALS */}
                        <div className="flex justify-end">
                          <div className="bg-stone-800 dark:bg-black text-stone-100 p-6 rounded-[1.5rem] w-full sm:w-auto sm:min-w-[200px] space-y-2">
                            <div className="flex justify-between text-xs text-stone-400">
                              <span>Subtotal</span>
                              <span>{t.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-stone-400 border-b border-stone-700 pb-2">
                              <span>Tax</span>
                              <span>{t.tax_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-1">
                              <span>Total</span>
                              <span>{t.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* NOTES */}
                        {t.metadata.notes && (
                          <div className="text-sm bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-2xl text-stone-600 dark:text-stone-300 italic border border-yellow-100 dark:border-yellow-900/20">
                            "{t.metadata.notes}"
                          </div>
                        )}

                        {/* ACTIONS */}
                        <div className="flex justify-end pt-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleDeleteReceipts(t.id)}
                            className="w-full sm:w-auto hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 rounded-full px-4 text-stone-500 dark:text-stone-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Record
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}