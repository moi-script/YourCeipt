"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Menu,
  Bell,
  Plus,
} from "lucide-react";

/* ============================
   FULL RECEIPT-STYLE DATA
   ============================ */
const initialTransactions = [
  {
    id: 1,
    store: "Walmart Supermarket",
    slogan: "Save Money. Live Better.",
    contact: "0917-555-1234",
    manager: "John Cruz",
    address: {
      street: "Main Street",
      city: "Quezon City",
      state: "Metro Manila",
      zip: "1100",
    },
    transaction: {
      store_number: "WM-102",
      operator_number: "OP-88",
      terminal_number: "T-09",
      transaction_number: "TXN-77881",
    },
    items: [
      {
        description: "Bread",
        upc: "123456",
        type: "Food",
        price: 45.5,
        quantity: 1,
      },
      {
        description: "Milk",
        upc: "987654",
        type: "Food",
        price: 79,
        quantity: 1,
      },
    ],
    subtotal: 124.5,
    tax_rate: 0.12,
    tax_amount: 14.94,
    total: 139.44,
    payment_method: "Credit Card",
    amount_paid: 139.44,
    type: "expense",
    metadata: {
      currency: "PHP",
      datetime: "2024-12-01 14:25",
      notes: "Weekly groceries",
      source_type: "receipt_upload",
    },
  },

  {
    id: 2,
    store: "Shell Gas Station",
    slogan: null,
    contact: null,
    manager: null,
    address: {
      street: "EDSA",
      city: "Makati",
      state: "Metro Manila",
      zip: "1200",
    },
    transaction: {
      store_number: "SH-01",
      operator_number: "OP-22",
      terminal_number: "T-02",
      transaction_number: "TXN-99314",
    },
    items: [
      {
        description: "Diesel Fuel",
        upc: null,
        type: "Fuel",
        price: 62.15,
        quantity: 1,
      },
    ],
    subtotal: 62.15,
    tax_rate: 0.12,
    tax_amount: 7.46,
    total: 69.61,
    payment_method: "Cash",
    amount_paid: 69.61,
    type: "expense",
    metadata: {
      currency: "PHP",
      datetime: "2024-12-02 09:18",
      notes: "Fuel refill",
      source_type: "manual",
    },
  },
];

/* ============================
   PAGE
   ============================ */
export default function TransactionsPage({
  sidebarOpen,
  setSidebarOpen,
  handleBellClick,
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [transactions, setTransactions] = useState(initialTransactions);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.store.toLowerCase().includes(search.toLowerCase()) ||
        t.metadata.notes?.toLowerCase().includes(search.toLowerCase());

      const matchesType = filterType === "all" ? true : t.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, filterType]);

  const deleteTransaction = (id) => {
    if (confirm("Delete this transaction?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    

    <>
    <div className="h-screen w-full bg-slate-50 flex flex-col">
      {/*Needs to set the sideBarOpen*/}
     
      
      <DialogForm
      transactions={transactions}
      setTransactions={setTransactions}
      isAddDialogOpen={isAddDialogOpen}
      setIsAddDialogOpen={setIsAddDialogOpen} /> 

      {/* LIST */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-slate-500">
                <Receipt className="w-10 h-10 mx-auto mb-4 opacity-50" />
                No transactions found
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((t) => {
              const isOpen = expandedId === t.id;

              return (
                <Card key={t.id} className="transition">
                  {/* COLLAPSED HEADER */}
                  <CardHeader
                    className="cursor-pointer flex-row flex justify-between items-center"
                    onClick={() => setExpandedId(isOpen ? null : t.id)}
                  >
                    <div>
                      <p className="font-semibold">{t.store}</p>
                      <p className="text-sm text-slate-500">
                        {t.metadata.datetime}
                      </p>
                      <Badge className="mt-1">{t.payment_method}</Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold">
                        {t.metadata.currency} {t.total.toFixed(2)}
                      </p>
                      {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </CardHeader>

                  {/* EXPANDED CONTENT */}
                  {isOpen && (
                    <CardContent className="space-y-4">
                      {/* STORE INFO */}
                      <div className="grid grid-cols-2 md:grid-cols-4 text-sm gap-4">
                        <div>
                          <strong>Manager:</strong> {t.manager || "N/A"}
                        </div>
                        <div>
                          <strong>Contact:</strong> {t.contact || "N/A"}
                        </div>
                        <div>
                          <strong>Store #:</strong> {t.transaction.store_number}
                        </div>
                        <div>
                          <strong>Terminal:</strong>{" "}
                          {t.transaction.terminal_number}
                        </div>
                      </div>

                      {/* ADDRESS */}
                      <div className="text-sm text-slate-600">
                        {t.address.street}, {t.address.city}, {t.address.state}{" "}
                        {t.address.zip}
                      </div>

                      {/* ITEMS */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-slate-100 p-2 text-sm font-semibold">
                          Items
                        </div>
                        {t.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-4 gap-2 text-sm p-2 border-t"
                          >
                            <span>{item.description}</span>
                            <span>{item.type}</span>
                            <span>×{item.quantity}</span>
                            <span className="text-right">
                              {t.metadata.currency} {item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* TOTALS */}
                      <div className="grid grid-cols-2 md:grid-cols-4 text-sm gap-4">
                        <div>Subtotal: {t.subtotal.toFixed(2)}</div>
                        <div>Tax: {t.tax_amount.toFixed(2)}</div>
                        <div>Total: {t.total.toFixed(2)}</div>
                        <div>Paid: {t.amount_paid.toFixed(2)}</div>
                      </div>

                      {/* NOTES */}
                      <div className="text-sm text-slate-600">
                        <strong>Notes:</strong> {t.metadata.notes}
                      </div>

                      {/* ACTIONS */}
                      <div className="flex justify-end">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => deleteTransaction(t.id)}
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
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

// {/* HEADER */}
// <div className="bg-white border-b px-6 py-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
//   <h1 className="text-2xl font-bold">Receipt Transactions</h1>

//   <div className="flex gap-3 w-full md:w-auto">
//     <div className="relative w-full md:w-72">
//       <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//       <Input
//         placeholder="Search by store or notes..."
//         className="pl-9"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//     </div>

//     <Select value={filterType} onValueChange={setFilterType}>
//       <SelectTrigger className="w-40">
//         <SelectValue />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="all">All</SelectItem>
//         <SelectItem value="income">Income</SelectItem>
//         <SelectItem value="expense">Expense</SelectItem>
//       </SelectContent>
//     </Select>
//   </div>
// </div>
