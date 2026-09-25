import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BASE_API_URL } from "@/api/getKeys";

// Shared by the sidebar menu and the app's profile sheet.
export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setUser } = useAuth() || {};
  const navigate = useNavigate();

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch(BASE_API_URL + "/user/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Logout failed");
    } catch {
      console.error("Unable to logout");
    } finally {
      setIsLoggingOut(false);
      localStorage.setItem("user", false);
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  return { logout, isLoggingOut };
}
