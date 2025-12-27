import { ClipboardList } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-lg bg-gray-50/50">
      {/* Icon */}
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <ClipboardList className="h-8 w-8 text-gray-400" />
      </div>

      {/* Main Text */}
      <h3 className="text-lg font-semibold text-gray-900">
        No transactions yet
      </h3>
      
      {/* Subtext */}
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        You haven't made any uploads receipt . New transactions history will appear here once you process add transaction.
      </p>
    </div>
  );
}