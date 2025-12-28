import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteAlert({ onClick, onDelete, itemName = "this item", trigger }) {
  return (
    <AlertDialog>
      {/* The Button that opens the popup */}
      <AlertDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-stone-400 dark:text-stone-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            onClick={onClick}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </AlertDialogTrigger>

      {/* The Pop-up Content */}
      <AlertDialogContent className="max-w-md rounded-[2.5rem] bg-[#fcfcfc] dark:bg-stone-950 border border-white dark:border-stone-800 shadow-2xl p-8">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 shadow-sm">
            <Trash2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <AlertDialogTitle className="text-center text-xl font-serif text-stone-800 dark:text-stone-100">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-stone-500 dark:text-stone-400">
            This action cannot be undone. This will permanently delete
            <span className="font-bold text-orange-600 dark:text-orange-400 block mt-1">
              "{itemName}"
            </span>
            from your database.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="grid grid-cols-2 gap-3 sm:gap-3 sm:space-x-0 mt-6">
          {/* The "Cancel" Button */}
          <AlertDialogCancel className="w-full mt-0 font-bold rounded-full border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-200 h-12 bg-transparent">
            Cancel
          </AlertDialogCancel>

          {/* The "Okay" Button */}
          <AlertDialogAction
            onClick={onDelete}
            className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 focus:ring-orange-600 font-bold rounded-full h-12 shadow-lg shadow-orange-200 dark:shadow-none text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}