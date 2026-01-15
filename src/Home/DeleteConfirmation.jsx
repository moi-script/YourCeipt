import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Assuming you have this
import { useNavigate } from "react-router-dom";


const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"


export function DeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const { user } = useAuth(); // To get userId if needed

  const handleDelete = async () => {
    if (!password) {
      setError("Password is required to delete account.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      // Replace with your actual delete endpoint
      const deleteAcc = await fetch(BASE_API_URL + "/user/delete-account", {
        method: "DELETE",
        credentials : "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userId: user?._id, 
            password: password 
        }),
      });
      console.log('User public image url :: ', user.image_public_url);
      const deleteProfile = await fetch(BASE_API_URL + '/image', {
        method : "DELETE",
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({public_id : user.image_public_url})
      })

      if(!deleteProfile.ok) {
        const data = await deleteAcc.json();
        throw new Error(data.message || "Faild to delete profile picture");
      }
      if (!deleteAcc.ok) {
        const data = await deleteAcc.json();
        throw new Error(data.message || "Failed to delete account");
      }


      alert("Account deleted successfully.");
      setIsOpen(false);
      // Redirect to login or home
    //   window.location.href = "/login"; 
      navigate('/', {replace : true});

    } catch (err) {
      console.error(err);
      setError("Incorrect password or server error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3">

         <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Purge Data Button (Unchanged) */}
      <Button 
        variant="outline" 
        className="flex-1 rounded-full border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:text-orange-800 bg-transparent h-12"
      >
        Purge Data
      </Button>

      {/* Delete Account Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1 rounded-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white shadow-lg shadow-orange-200 dark:shadow-none h-12">
            Delete
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] bg-[#fcfcfc] dark:bg-stone-950 border border-white/50 dark:border-stone-800 shadow-2xl p-8 transition-colors duration-300">
          <DialogHeader className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
               <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <DialogTitle className="text-2xl font-serif italic text-stone-800 dark:text-stone-100">
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-stone-500 dark:text-stone-400 mt-2">
              This action is permanent and cannot be undone. Please enter your password to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 ml-3">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                      setPassword(e.target.value);
                      setError(""); // Clear error on type
                  }}
                  className="rounded-full bg-stone-50 dark:bg-stone-900 border-transparent dark:border-stone-800 h-12 px-6 pr-12 focus-visible:ring-orange-200 dark:focus-visible:ring-orange-900 text-stone-800 dark:text-stone-200"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Error Message */}
              {error && (
                <p className="text-sm text-red-500 font-medium ml-4 animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 mt-8">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="w-full rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isLoading || !password}
              className="w-full rounded-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white shadow-lg shadow-orange-200 dark:shadow-none"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}