import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Suspense, use, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";

export function RegisterForm({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
}) {
  const { login, register, registerLoading, setRegisterLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('This is the localtion :: ', location);
  }, []);

  const handleSubmit = async (e, setRegisterLoading) => {
    e.preventDefault();

    console.log("Uploading user data");

    try {
      const response = await register("http://localhost:3000/user" + location.pathname, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setRegisterLoading(false);

      console.log('Response register ::', response);

      if (response.status === 200) {
        login(formData);
        console.log('From location :: ', from);
        navigate(from, { replace: true });
      } else {  
        console.error("Server Error:");
      }
    } catch (err) {
      console.error("Network Error:", err);
    }

  };

  const from = location.state?.from?.pathname || "/user";

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          Nickname
        </label>
        <input
          type="text"
          value={formData.nickname}
          onChange={(e) => handleChange("nickname", e.target.value)}
          name="nickname"
          placeholder="How should we call you?"
          className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2FAF8A] focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={formData.fullname}
          onChange={(e) => handleChange("fullname", e.target.value)}
          name="fullname"
          placeholder="Your full legal name"
          className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2FAF8A] focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          name="email"
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2FAF8A] focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            name="password"
            placeholder="Create a strong password"
            className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2FAF8A] focus:border-transparent transition-all pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#2FAF8A] transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      <button
        onClick={(e) => handleSubmit(e, setRegisterLoading)}
        type="submit"
        className="w-full bg-gradient-to-r from-[#2FAF8A] to-[#6BBF92] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 mt-6"
      >
        {!registerLoading ? <Spinner /> : "Create Account"}
      </button>

      {/* Sign In Link */}
      <div className="text-center pt-4">
        <p className="text-[#6B7280]">
          Already have an account?{" "}
          <button
            onClick={() => console.log("Sign in")}
            className="font-semibold text-[#2FAF8A] hover:text-[#6BBF92] transition-colors"
          >
            <Link to="/"> Sign In</Link>
          </button>
        </p>
      </div>

      {/* Terms */}
      <p className="text-xs text-[#9CA3AF] text-center pt-2">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}
