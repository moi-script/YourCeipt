import { useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";


const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"



export default function ProfilePicPage() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.image_profile || "/path-to-your-avatar.jpg");

  const handleChangeProfile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file); // key must match 'uploadCloudImage' middleware expectation
      formData.append("public_url", user?.image_public_url);

      const uploadRes = await fetch("http://localhost:3000" +  "/image", { // http://localhost:3000 BASE_API_URL 
        method: "POST",
        body: formData,
      });

      console.log("Upload res -->", uploadRes);

      if (!uploadRes.ok) throw new Error("Image upload failed");

      const uploadData = await uploadRes.json();
      console.log("Upload data -->", uploadData);

      const updateRes = await fetch(BASE_API_URL + "/user/image_profile", { // http://localhost:3000
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userId: user._id, 
            image_source: uploadData.url,
            image_public_url : uploadData.public_url
        }),
      });

      if (!updateRes.ok) throw new Error("Profile update failed");

      // 5. Update Local User Context so it reflects everywhere immediately
      setUser({ ...user, image_profile: uploadData.url, image_public_url : uploadData.public_url});

    } catch (error) {
      console.error("Avatar change failed:", error);
      // setAvatarPreview(user?.image_profile); 
    } finally {
      setIsUploading(false);
    }

  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      
      {/* AVATAR CIRCLE */}
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-white dark:border-stone-800 shadow-sm rounded-[2rem]">
          <AvatarImage 
            src={avatarPreview} 
            alt="Profile" 
            className="object-cover"
          />
          <AvatarFallback className="text-3xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-medium">
            {user?.fullname ? user.fullname[0] : "JM"}
          </AvatarFallback>
        </Avatar>

        {/* LOADING INDICATOR (Overlay) */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/30 rounded-[2rem] flex items-center justify-center backdrop-blur-sm z-10">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}

        {/* Quick Edit Button (Bottom Right) */}
        <button 
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 bg-stone-800 dark:bg-stone-200 text-emerald-100 dark:text-emerald-900 p-2 rounded-full hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors shadow-lg z-20"
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </div>
      
      {/* TEXT & BUTTONS */}
      <div className="space-y-3 text-center sm:text-left">
        <h3 className="text-xl font-medium text-stone-800 dark:text-stone-100">
            {user?.fullname || "John Moises Nugal"}
        </h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">
            Managed by Admin
        </p>

        {/* Hidden Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleChangeProfile}
          className="hidden" 
          accept="image/*"
        />

        {/* Visible Button */}
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isUploading}
          onClick={() => fileInputRef.current.click()} 
          className="rounded-full border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-800 bg-transparent"
        >
          {isUploading ? "Uploading..." : "Upload New Image"}
        </Button>
      </div>
    </div>
  );
}