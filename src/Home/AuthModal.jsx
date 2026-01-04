import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
  Leaf,
  X,
  Mail,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  // Modes: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState(defaultTab); 
  const [currentStep, setCurrentStep] = useState(0);
  
  // Sync mode with props when opening
  useEffect(() => {
    if (isOpen) {
      setMode(defaultTab);
    }
  }, [defaultTab, isOpen]);

  // =========================================================
  // LEFT PANEL LOGIC (CAROUSEL)
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
  // FORM STATES
  // =========================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [resetSent, setResetSent] = useState(false); // State for forgot password success
  
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.status === 200) {
        setUser(res);
        onClose(false); 
        navigate("/user"); 
      }
    } catch (err) {
      console.error('Error login', err);
      setError("Invalid credentials");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleForgotSubmit = (e) => {
      e.preventDefault();
      // Simulate API call
      console.log("Resetting password for", email);
      setResetSent(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-none shadow-2xl focus:outline-none">
        <div className="flex w-full h-[650px] bg-[#fcfcfc] dark:bg-stone-900 rounded-3xl overflow-hidden relative transition-colors duration-300">
            
            {/* Close Button Override */}
            <button 
                onClick={() => onClose(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
                <X className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            </button>

            {/* ====================================================
                LEFT COLUMN: CAROUSEL (Hidden on mobile)
               ==================================================== */}
            <div className="hidden lg:flex w-5/12 relative flex-col justify-center items-center p-8 bg-emerald-900 dark:bg-emerald-950 overflow-hidden">
                {/* Background Image Overlay */}
                <div 
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                        backgroundImage: "url(https://images.pexels.com/photos/8092510/pexels-photo-8092510.jpeg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-600 dark:from-emerald-950 dark:to-emerald-800 opacity-90" />
                
                {/* Carousel Content */}
                <div className="relative z-10 w-full max-w-xs text-center">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-8 shadow-xl min-h-[260px] flex flex-col justify-center items-center transition-all duration-500">
                        <div className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/20">
                            {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-emerald-600" })}
                        </div>
                        <h2 className="text-2xl font-serif text-white mb-2 animate-fade-in">{steps[currentStep].title}</h2>
                        <p className="text-emerald-100 text-sm animate-fade-in">{steps[currentStep].description}</p>
                    </div>
                    
                    {/* Dots */}
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

                    {/* Arrows */}
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ====================================================
                RIGHT COLUMN: CONTENT AREA
               ==================================================== */}
            <div className="w-full lg:w-7/12 p-8 sm:p-12 relative flex flex-col justify-center overflow-y-auto">
                
                {/* Header Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full">
                        <Leaf className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <span className="font-serif italic font-bold text-2xl text-stone-800 dark:text-stone-100">Recepta</span>
                </div>

                <div className="max-w-md w-full mx-auto">

                    {/* ==========================
                        VIEW 1: LOGIN FORM
                        ========================== */}
                    {mode === 'login' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="mb-8">
                                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Welcome Back</h2>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">Sign in to access your financial flow.</p>
                            </div>
                            
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-stone-400 ml-3">Email</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200 placeholder-stone-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-stone-400 ml-3">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200 placeholder-stone-400"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-xs ml-3 font-medium">{error}</p>}

                                <div className="flex justify-end">
                                    <button 
                                        type="button" 
                                        onClick={() => setMode('forgot')}
                                        className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button type="submit" className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full font-bold shadow-lg shadow-emerald-900/10 transition-transform active:scale-95">
                                    Sign In
                                </button>
                            </form>

                            <div className="mt-8 text-center text-sm text-stone-500 dark:text-stone-400">
                                Don't have an account? 
                                <button 
                                    onClick={() => setMode('register')}
                                    className="ml-2 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==========================
                        VIEW 2: FORGOT PASSWORD
                        ========================== */}
                    {mode === 'forgot' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                             {/* Icon Header */}
                            <div className="flex justify-center mb-6">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-full shadow-inner border border-emerald-100 dark:border-emerald-800/30">
                                    <Mail className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Forgot Password</h2>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">Enter your email to reset your password.</p>
                            </div>

                            {!resetSent ? (
                                <form onSubmit={handleForgotSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 ml-4">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-full text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:bg-white dark:focus:bg-stone-900 transition-all shadow-sm"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold py-3 rounded-full shadow-lg transition-all transform active:scale-95 uppercase tracking-wide text-xs"
                                    >
                                        Reset Password
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-center animate-in zoom-in-95">
                                    <p className="text-emerald-800 dark:text-emerald-300 font-medium">
                                        Check your inbox!
                                    </p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                        We sent a password reset link to <span className="font-bold">{email}</span>.
                                    </p>
                                </div>
                            )}
                            
                            {/* Warning Box (Only show if not sent yet) */}
                            {!resetSent && (
                                <div className="mt-6 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100/50 dark:border-orange-900/30">
                                    <p className="text-xs text-orange-800/70 dark:text-orange-300/70 text-center font-medium">
                                        You will receive an email with instructions shortly after submitting.
                                    </p>
                                </div>
                            )}

                            {/* Back to Login */}
                            <div className="text-center pt-8">
                                <button 
                                    onClick={() => { setMode('login'); setResetSent(false); }}
                                    className="inline-flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold transition-colors group text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ==========================
                        VIEW 3: REGISTER (Placeholder)
                        ========================== */}
                    {mode === 'register' && (
                         <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="mb-8">
                                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">Create Account</h2>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">Start your journey to financial clarity.</p>
                            </div>

                             {/* Use your RegisterForm component here if available */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <input placeholder="First Name" className="px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full text-sm outline-none dark:text-stone-200" />
                                    <input placeholder="Last Name" className="px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full text-sm outline-none dark:text-stone-200" />
                                </div>
                                <input type="email" placeholder="Email" className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full text-sm outline-none dark:text-stone-200" />
                                <input type="password" placeholder="Password" className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full text-sm outline-none dark:text-stone-200" />
                                
                                <button className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 text-white rounded-full font-bold shadow-lg">
                                    Create Account
                                </button>
                            </div>

                            <div className="mt-8 text-center text-sm text-stone-500 dark:text-stone-400">
                                Already have an account? 
                                <button 
                                    onClick={() => setMode('login')}
                                    className="ml-2 font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline"
                                >
                                    Log In
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