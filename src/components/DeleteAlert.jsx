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

export function DeleteAlert({ onClick, onDelete, itemName = "this item" }) {
  return (
    <AlertDialog>
      {/* The Button that opens the popup */}
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-slate-500 hover:text-red-600"
          onClick={onClick}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </AlertDialogTrigger>

      {/* The Pop-up Content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            <span className="font-bold text-red-500"> {itemName} </span>
            from your database.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* The "Cancel" Button - closes modal automatically */}
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          {/* The "Okay" Button - fires your delete function */}
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Okay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
