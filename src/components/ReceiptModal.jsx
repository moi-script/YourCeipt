import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  MapPin, 
  Calendar, 
  Hash, 
  Receipt, 
  CreditCard, 
  Clock,
  User,
  Phone,
  Tag // Added Tag icon
} from "lucide-react";

// ... (Keep your dummyReceiptData exactly as it was) ...

const ReceiptDetailModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  // Helper for safe currency display
  const currencySymbol = data.metadata?.currency === "PHP" ? "₱" : "$";
  
  const formatMoney = (amount) => {
    if (amount === null || amount === undefined) return "0.00";
    return typeof amount === 'number' ? amount.toFixed(2) : amount;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="[&>button]:z-50 max-w-md w-[95%] rounded-[2.5rem] bg-[#f2f0e9] dark:bg-stone-950 border-white/50 dark:border-stone-800 shadow-2xl p-0 overflow-hidden gap-0">
        
        {/* Decorative Header Blob (Subtle) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-[50px] pointer-events-none opacity-50" />

        <DialogHeader className="p-6 pb-2 relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-50">
            <Receipt className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Transaction Details</span>
          </div>
          <DialogTitle className="font-serif text-2xl text-stone-800 dark:text-stone-100 italic">
            {data.store || "Unknown Store"}
          </DialogTitle>
          {data.slogan && (
            <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">"{data.slogan}"</p>
          )}

          <DialogDescription className="text-sm text-stone-500 dark:text-stone-400 font-medium">
              {data.slogan ? `"${data.slogan}"` : "Receipt Details"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] w-full px-6 pb-6 relative z-10">
          
          {/* THE "PAPER" RECEIPT CARD */}
          <div className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-md rounded-[1.5rem] border border-white/60 dark:border-white/5 p-5 space-y-5 shadow-sm">
            
            {/* 1. Address & Contact */}
            <div className="space-y-2 text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                <span>
                  {[
                    data.address?.street,
                    data.address?.city,
                    data.address?.state,
                    data.address?.zip
                  ].filter(Boolean).join(", ") || "No address provided"}
                </span>
              </div>
              {(data.manager || data.contact) && (
                <div className="flex gap-4">
                  {data.manager && (
                    <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        <span>Mgr: {data.manager}</span>
                    </div>
                  )}
                  {data.contact && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        <span>{data.contact}</span>
                      </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-full text-emerald-700 dark:text-emerald-400">
                  <Calendar className="w-3 h-3" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase text-stone-400 font-bold">Date</span>
                   <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                     {formatDate(data.metadata?.datetime)}
                   </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-full text-orange-700 dark:text-orange-400">
                  <Clock className="w-3 h-3" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase text-stone-400 font-bold">Time</span>
                   <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                     {formatTime(data.metadata?.datetime)}
                   </span>
                </div>
              </div>
              {data.transaction?.transaction_number && (
                  <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-dashed border-stone-200 dark:border-stone-700 mt-1">
                     <Hash className="w-3 h-3 text-stone-400" />
                     <span className="text-[10px] text-stone-400 font-mono">
                       Ref: #{data.transaction.transaction_number} 
                       {data.transaction.terminal_number ? ` / Term: ${data.transaction.terminal_number}` : ''}
                     </span>
                  </div>
              )}
            </div>

            {/* 3. Items List */}
            <div>
              <div className="flex justify-between items-center mb-3">
                 <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 font-serif">Items Purchased</h4>
                 <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full text-stone-500">
                    {data.items?.length || 0} items
                 </span>
              </div>
              
              <div className="space-y-3">
                {data.items && data.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm group">
                    <div className="flex gap-3">
                      {/* Quantity Box */}
                      <div className="w-5 h-5 flex items-center justify-center bg-stone-100 dark:bg-stone-800 rounded-md text-[10px] font-bold text-stone-500 shrink-0 mt-0.5">
                        {item.quantity || 1}
                      </div>
                      
                      <div className="flex flex-col">
                        <p className="text-stone-700 dark:text-stone-300 font-medium leading-snug">
                          {item.description || "Unknown Item"}
                        </p>
                        
                        {/* --- NEW: CATEGORY & UPC ROW --- */}
                        <div className="flex items-center gap-2 mt-1">
                            {(item.category || item.type) && (
                                <span className="inline-flex items-center text-[9px] uppercase tracking-wider font-bold text-stone-500 bg-stone-100 dark:bg-stone-800/80 px-1.5 py-0.5 rounded">
                                    {item.category || item.type}
                                </span>
                            )}
                            {item.upc && (
                                <span className="text-[9px] text-stone-400 font-mono">
                                    #{item.upc}
                                </span>
                            )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="font-semibold text-stone-800 dark:text-stone-200 whitespace-nowrap pl-2">
                      {currencySymbol}{formatMoney(item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-stone-200 dark:bg-stone-700 border-t border-dashed h-[1px]" />

            {/* 4. Financial Summary */}
            <div className="space-y-1">
              {/* Subtotal */}
              <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>Subtotal</span>
                <span>{currencySymbol}{formatMoney(data.subtotal)}</span>
              </div>
              
              {/* Tax */}
              <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>Tax {data.tax_rate ? `(${data.tax_rate}%)` : ''}</span>
                <span>{currencySymbol}{formatMoney(data.tax_amount)}</span>
              </div>

              {/* Total - Big Organic Emphasis */}
              <div className="flex justify-between items-center pt-3 mt-2">
                <span className="font-serif text-lg text-stone-800 dark:text-stone-100 italic">Total</span>
                <span className="font-serif text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    {currencySymbol}{formatMoney(data.total)}
                </span>
              </div>
            </div>

            {/* 5. Payment Footer */}
            <div className="bg-stone-100 dark:bg-stone-800/50 rounded-xl p-3 flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-stone-400" />
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                    {data.payment_method || "Cash"}
                  </span>
               </div>
               {data.amount_paid && (
                 <span className="text-xs text-stone-500">
                   Paid: {currencySymbol}{formatMoney(data.amount_paid)}
                 </span>
               )}
            </div>

          </div>

          {/* Bottom Note */}
          <div className="text-center mt-6 mb-2">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">
              Generated from {data.metadata?.source_type || "Scan"}
            </p>
          </div>

        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDetailModal;