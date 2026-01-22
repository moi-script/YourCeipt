import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  UploadCloud,
  Cpu,
  TrendingUp,
  Eye,
  EyeOff,
  Leaf,
  X,
  Mail,
  ArrowLeft,
  KeyRound,
  Lock,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BASE_API_URL } from "@/api/getKeys.js";
import { getAiDefaultModel } from "@/api/getKeys.js";
// const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"




const uploadAiDefaultModel = async (userId, modelName, BASE_API_URL) => {
     const res = await fetch(BASE_API_URL + "/extract/postmodel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userId,
              modelName: modelName,
            }),
          });

          try {
            const data = await res.json();
            return data;
          } catch(err) {
            console.error("Unable to post ai default model ::", err);
          }
}

const modelName = "xiaomi/mimo-v2-flash:free";

export function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [mode, setMode] = useState(defaultTab); 
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    if (isOpen) {
      setMode(defaultTab);
    }
  }, [defaultTab, isOpen]);

  // =========================================================
  // CAROUSEL LOGIC
  // =========================================================
  const steps = [
    {
      title: "Scan Receipts",
      description: "Capture receipts instantly via camera or upload.",
      icon: UploadCloud,
    },
    {
      title: "AI Categorization",
      description: "Our AI automatically sorts your spending habits.",
      icon: Cpu,
    },
    {
      title: "Smart Insights",
      description: "View trends and prevent overspending.",
      icon: TrendingUp,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // AUTH STATE & LOGIC
  // =========================================================
  const { login, register, setUser } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/user";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // --- LOGIN & REGISTER STATE ---
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    nickname: "",
    fullname: "",
    email: "",
    password: "",
    image_profile : "",
    image_public_url : "",
    currency : "PHP",
    theme : "default",
    overSpending : false,
    nearLimit : false
  });

  // --- FORGOT PASSWORD STATE (Integrated) ---
  const [fpStep, setFpStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");

  // Helper to clear FP state when switching back to login
  const resetFPState = () => {
    setFpStep(1);
    setFpEmail("");
    setFpOtp("");
    setFpNewPassword("");
    setError(null);
    setMode('login');
  };

  const handleLoginChange = (e) => {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // --- HANDLERS: LOGIN ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await login(BASE_API_URL + '/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      if (res.status === 200) {
        setUser(res);
        onClose(false); 
        localStorage.setItem('user', true);
        navigate("/user"); 
      }
    } catch (err) {
      console.error('Error login', err);
      setError("Invalid credentials. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  // --- HANDLERS: REGISTER ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // const postAi = await uploadAiDefaultModel(user._id, modelName = uploadAiDefaultModel(), BASE_API_URL);

    if(postAi.ok) throw Error('Ai default error');
    
    try {
      const response = await register(BASE_API_URL + "/user/register", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (response.status === 200) {
        setUser(registerData);
        onClose(false);
        localStorage.setItem('user', true);
        navigate(from, { replace: true });
      } else {  
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
        setIsLoading(false);
    }
  };



  
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(BASE_API_URL + "/user/send-otp", { email: fpEmail });
      setFpStep(2); // Move to next step
    } catch (err) {
      setError("User not found or error sending email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(BASE_API_URL + "/user/verify-otp", { email: fpEmail, otp: fpOtp });
      setFpStep(3); // Move to next step
    } catch (err) {
      console.error("OTP Error", err);
      setError("Invalid or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(BASE_API_URL + "/user/reset-password", { 
        email: fpEmail, 
        otp: fpOtp, 
        newPassword: fpNewPassword 
      });
      resetFPState(); 
      alert("Password reset successfully! Please login.");
    } catch (err) {
      setError("Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-none shadow-2xl focus:outline-none [&>button]:hidden">
        
        <style>{`
          /* Hide Browser Password Eye */
          input[type="password"]::-ms-reveal,
          input[type="password"]::-ms-clear {
            display: none;
          }
          /* Custom Scrollbar */
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d6d3d1; border-radius: 20px; }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #44403c; }
        `}</style>

        <div className="flex w-full h-[700px] bg-[#fcfcfc] dark:bg-stone-900 rounded-3xl overflow-hidden relative transition-colors duration-300">
            
            {/* Close Button */}
            <button 
                onClick={() => onClose(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors shadow-sm"
            >
                <X className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            </button>

            {/* ====================================================
                LEFT COLUMN: CAROUSEL
               ==================================================== */}
            <div className="hidden lg:flex w-5/12 relative flex-col justify-center items-center p-8 bg-emerald-900 dark:bg-emerald-950 overflow-hidden">
                <div 
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                        backgroundImage: "url(https://images.pexels.com/photos/8092510/pexels-photo-8092510.jpeg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-600 dark:from-emerald-950 dark:to-emerald-800 opacity-90" />
                
                <div className="relative z-10 w-full max-w-xs text-center">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-8 shadow-xl min-h-[260px] flex flex-col justify-center items-center">
                        <div className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/20">
                            {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-emerald-600" })}
                        </div>
                        <h2 className="text-2xl font-serif text-white mb-2 animate-fade-in">{steps[currentStep].title}</h2>
                        <p className="text-emerald-100 text-sm animate-fade-in">{steps[currentStep].description}</p>
                    </div>
                    
                    <div className="flex justify-center gap-2 mb-6">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    index === currentStep ? "w-6 bg-white" : "w-1.5 bg-emerald-400/30"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ====================================================
                RIGHT COLUMN: FORMS
               ==================================================== */}
            <div className="w-full lg:w-7/12 p-8 sm:p-12 relative flex flex-col justify-center overflow-y-auto custom-scrollbar">
                
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full">
                        <Leaf className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <span className="font-serif italic font-bold text-2xl text-stone-800 dark:text-stone-100">Recepta</span>
                </div>

                <div className="max-w-md w-full mx-auto">

                    {/* ==========================
                        VIEW: LOGIN
                        ========================== */}
                    {mode === 'login' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="mb-6">
                                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Welcome Back</h2>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">Sign in to access your financial flow.</p>
                            </div>
                            
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-stone-400 ml-3">Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        placeholder="name@example.com"
                                        className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200 placeholder-stone-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-stone-400 ml-3">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200 placeholder-stone-400"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-xs ml-3 font-medium">{error}</p>}

                                <div className="flex justify-end">
                                    <button type="button" onClick={() => { setError(null); setMode('forgot'); }} className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                                        Forgot Password?
                                    </button>
                                </div>

                                <button type="submit" className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/10 transition-transform active:scale-95 flex justify-center items-center">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                                </button>
                            </form>
                            <div className="mt-6 text-center text-sm text-stone-500">
                                Don't have an account? <button onClick={() => { setError(null); setMode('register'); }} className="ml-2 font-bold text-emerald-700 hover:underline">Sign Up</button>
                            </div>
                        </div>
                    )}

                    {/* ==========================
                        VIEW: REGISTER
                        ========================== */}
                    {mode === 'register' && (
                         <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="mb-6">
                                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Create Account</h2>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">Start your journey to financial clarity.</p>
                            </div>

                            <form onSubmit={handleRegisterSubmit} className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-stone-400 ml-3">Nickname</label>
                                    <input
                                        type="text"
                                        name="nickname"
                                        value={registerData.nickname}
                                        onChange={handleRegisterChange}
                                        placeholder="How should we call you?"
                                        className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-stone-400 ml-3">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={registerData.fullname}
                                        onChange={handleRegisterChange}
                                        placeholder="Your full legal name"
                                        className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-stone-400 ml-3">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        placeholder="your.email@example.com"
                                        className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-stone-400 ml-3">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                            placeholder="Create a strong password"
                                            className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-xs ml-3 font-medium">{error}</p>}
                                
                                <button
                                    type="submit"
                                    className="w-full mt-4 py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex justify-center items-center"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm text-stone-500">
                                Already have an account? 
                                <button 
                                    onClick={() => { setError(null); setMode('login'); }}
                                    className="ml-2 font-bold text-emerald-700 hover:underline"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==========================
                        VIEW: FORGOT PASSWORD (INTEGRATED)
                        ========================== */}
                    {mode === 'forgot' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                             
                             {/* STEP 1: EMAIL */}
                             {fpStep === 1 && (
                                <>
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-full shadow-inner">
                                            <Mail className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </div>
                                    <div className="text-center mb-6">
                                        <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Forgot Password</h2>
                                        <p className="text-stone-500 dark:text-stone-400 text-sm">Enter your email to receive a One-Time Password.</p>
                                    </div>
                                    <form onSubmit={handleSendOTP} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 ml-4">Email Address</label>
                                            <input 
                                                key="fp-email"
                                                type="email" 
                                                name="email"
                                                value={fpEmail}
                                                onChange={(e) => setFpEmail(e.target.value)}
                                                placeholder="your.email@example.com" 
                                                className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-xl text-stone-800 dark:text-stone-200 outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all" 
                                                required
                                            />
                                        </div>
                                        {error && <p className="text-red-500 text-xs ml-3 font-medium">{error}</p>}
                                        <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center">
                                             {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                                        </button>
                                    </form>
                                </>
                             )}

                             {/* STEP 2: OTP */}
                             {fpStep === 2 && (
                                <>
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-full shadow-inner">
                                            <KeyRound className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </div>
                                    <div className="text-center mb-6">
                                        <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Enter OTP</h2>
                                        <p className="text-stone-500 dark:text-stone-400 text-sm">We sent a 6-digit code to <br/><span className="font-bold text-stone-700 dark:text-stone-300">{fpEmail}</span></p>
                                    </div>
                                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 ml-4">One-Time Password</label>
                                            <input 
                                                key="fp-otp"
                                                type="text" 
                                                name="otp"
                                                value={fpOtp}
                                                autoComplete="off"
                                                onChange={(e) => setFpOtp(e.target.value)}
                                                placeholder="123456" 
                                                className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-xl text-stone-800 dark:text-stone-200 outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all text-center tracking-widest text-lg" 
                                                required
                                            />
                                        </div>
                                        {error && <p className="text-red-500 text-xs ml-3 font-medium">{error}</p>}
                                        <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center">
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                                        </button>
                                    </form>
                                </>
                             )}

                             {/* STEP 3: NEW PASSWORD */}
                             {fpStep === 3 && (
                                <>
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-full shadow-inner">
                                            <Lock className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </div>
                                    <div className="text-center mb-6">
                                        <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Reset Password</h2>
                                        <p className="text-stone-500 dark:text-stone-400 text-sm">Create a new strong password.</p>
                                    </div>
                                    <form onSubmit={handleResetPassword} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 ml-4">New Password</label>
                                            <div className="relative">
                                                <input 
                                                    key="fp-pass"
                                                    type={showPassword ? "text" : "password"}
                                                    name="newPassword"
                                                    value={fpNewPassword}
                                                    onChange={(e) => setFpNewPassword(e.target.value)}
                                                    placeholder="New secure password" 
                                                    className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-xl text-stone-800 dark:text-stone-200 outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all" 
                                                    required
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600">
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        {error && <p className="text-red-500 text-xs ml-3 font-medium">{error}</p>}
                                        <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center">
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                                        </button>
                                    </form>
                                </>
                             )}

                            {/* Back to Login Button (Always Visible in Forgot Mode) */}
                            <div className="text-center pt-8">
                                <button onClick={resetFPState} className="inline-flex items-center gap-2 text-stone-500 font-bold hover:text-emerald-700 text-sm group">
                                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}