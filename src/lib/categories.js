import {
  Utensils, Car, Ticket, ShoppingBag, Zap, TrendingUp, HeartPulse, CircleEllipsis, Coffee,
} from "lucide-react";

export const CATEGORY_MAP = {
  Food: { icon: Utensils, color: "emerald", iconColor: "text-emerald-600" },
  Transportation: { icon: Car, color: "blue", iconColor: "text-blue-600" },
  Entertainment: { icon: Ticket, color: "purple", iconColor: "text-purple-600" },
  Shopping: { icon: ShoppingBag, color: "orange", iconColor: "text-orange-600" },
  Utilities: { icon: Zap, color: "yellow", iconColor: "text-yellow-600" },
  Income: { icon: TrendingUp, color: "green", iconColor: "text-green-600" },
  Healthcare: { icon: HeartPulse, color: "red", iconColor: "text-red-600" },
  Other: { icon: CircleEllipsis, color: "stone", iconColor: "text-stone-600" },
};

export const CATEGORY_CONFIG = {
  "dining": { icon: Coffee, color: "emerald" },
  "transportation": { icon: Car, color: "blue" },
  "entertainment": { icon: Ticket, color: "sky" },
  "shopping": { icon: ShoppingBag, color: "orange" },
  "utilities": { icon: Zap, color: "yellow" },
  "healthcare": { icon: HeartPulse, color: "red" },
  "other": { icon: CircleEllipsis, color: "stone" }
};
