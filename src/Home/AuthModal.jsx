import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  UploadCloud,
  Cpu,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Leaf,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// Import your existing RegisterForm if it's a separate component
// import { RegisterForm } from "./Register"; 

export function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [mode, setMode] = useState(defaultTab); // 'login' or 'register'
  const [currentStep, setCurrentStep] = useState(0);
  
  // Update mode if the prop changes
  useEffect(() => {
    setMode(defaultTab);
  }, [defaultTab]);

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
  // LOGIN FORM LOGIC
  // =========================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
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
        onClose(); // Close modal on success
        navigate("/user"); // Navigate to dashboard
      }
    } catch (err) {
      console.error('Error login', err);
      setError("Invalid credentials");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-none shadow-2xl">
        <div className="flex w-full h-[600px] bg-[#fcfcfc] dark:bg-stone-900 rounded-3xl overflow-hidden relative">
            
            {/* Close Button Override */}
            <button 
                onClick={() => onClose(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 transition-colors"
            >
                <X className="w-4 h-4 text-stone-500" />
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
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 mb-8 shadow-xl min-h-[260px] flex flex-col justify-center items-center">
                        <div className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/20">
                            {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-emerald-600" })}
                        </div>
                        <h2 className="text-2xl font-serif text-white mb-2">{steps[currentStep].title}</h2>
                        <p className="text-emerald-100 text-sm">{steps[currentStep].description}</p>
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
                RIGHT COLUMN: FORM AREA
               ==================================================== */}
            <div className="w-full lg:w-7/12 p-8 sm:p-12 relative flex flex-col justify-center">
                
                {/* Header Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                        <Leaf className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <span className="font-serif italic font-bold text-2xl text-stone-800 dark:text-stone-100">Recepta</span>
                </div>

                {/* Form Container */}
                <div className="max-w-md w-full mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-stone-500 dark:text-stone-400 text-sm">
                            {mode === 'login' 
                                ? 'Sign in to access your financial flow.' 
                                : 'Start your journey to financial clarity.'}
                        </p>
                    </div>

                    {/* ==========================
                        LOGIN FORM
                        ========================== */}
                    {mode === 'login' && (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-stone-400 ml-3">Email</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200"
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
                                        className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-stone-900 outline-none transition-all dark:text-stone-200"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-600">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs ml-3">{error}</p>}

                            <div className="flex justify-end">
                                <Link to="/forgot" className="text-xs font-medium text-emerald-600 hover:underline">Forgot Password?</Link>
                            </div>

                            <button type="button" onClick={handleLoginSubmit} className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold shadow-lg shadow-emerald-900/10 transition-transform active:scale-95">
                                Sign In
                            </button>
                        </form>
                    )}

                    {/* ==========================
                        REGISTER FORM PLACEHOLDER
                        ========================== */}
                    {mode === 'register' && (
                        <div className="space-y-4">
                           {/* NOTE: If you have a separate <RegisterForm /> component, render it here */}
                           {/* <RegisterForm /> */}
                           
                           {/* Simplified Register inputs for demo if component not available */}
                           <div className="grid grid-cols-2 gap-3">
                                <input placeholder="First Name" className="px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full text-sm outline-none" />
                                <input placeholder="Last Name" className="px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full text-sm outline-none" />
                           </div>
                           <input type="email" placeholder="Email" className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full text-sm outline-none" />
                           <input type="password" placeholder="Password" className="w-full px-6 py-3 bg-stone-50 dark:bg-stone-800 rounded-full text-sm outline-none" />
                           
                           <button className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold shadow-lg">
                                Create Account
                            </button>
                        </div>
                    )}

                    {/* Toggle Mode */}
                    <div className="mt-8 text-center text-sm text-stone-500">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"} 
                        <button 
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="ml-2 font-bold text-emerald-700 hover:text-emerald-800 underline decoration-2 underline-offset-4"
                        >
                            {mode === 'login' ? "Sign Up" : "Log In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}