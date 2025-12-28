import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Leaf
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// import receptaLogo from '../assets/receptaLogo.png'; // Uncomment if needed

const Login = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  
  const { login, user, setUser} = useAuth();

  const steps = [
    {
      title: "Scan or Upload Receipts",
      description:
        "Easily capture your receipts by scanning or uploading images.",
      icon: UploadCloud,
    },
    {
      title: "AI Categorizes Your Spending",
      description: "Our AI automatically sorts your expenses into categories.",
      icon: Cpu,
    },
    {
      title: "View Insights & Trends",
      description:
        "Instantly see insights, trends, and summaries of your spending.",
      icon: TrendingUp,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login('http://localhost:3000/user/login', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({email, password})
      })

      if(res.status === 200) {
        setUser(res);
        navigate(from, { replace: true });
      } else {
         // Handle non-200 if needed
      }
    } catch(err) {
      console.error('Error login', err);
      setError("Invalid email or password");
      setTimeout(() => {
        setError(null);
        setPassword("");
      }, 3000);
    }
  };

  const from = location.state?.from?.pathname || "/user";

  const FloatingIcon = ({ Icon, className }) => (
    <div className={`absolute ${className}`}>
      <Icon className="w-16 h-16 text-emerald-500 opacity-10" />
    </div>
  );

  return (
    // 1. BACKGROUND: Warm bone (Light) / Deep Stone (Dark)
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* CSS Fix to hide browser default password reveal button */}
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
      `}</style>

      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[90px] opacity-60 dark:opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-6xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 dark:border-stone-800 relative z-10 transition-all duration-300">
        <div className="grid lg:grid-cols-2 min-h-[650px]">
          
          {/* Left Column - Onboarding (Emerald Theme) */}
          <div className="relative hidden lg:flex flex-col justify-center items-center p-12 overflow-hidden bg-emerald-900 dark:bg-emerald-950">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{
                    backgroundImage: "url(https://images.pexels.com/photos/8092510/pexels-photo-8092510.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-600 dark:from-emerald-950 dark:to-emerald-800 opacity-90" />
            
            {/* Decorative circles inside left panel */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl"></div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
              <div className="mb-12">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-8 mb-8 transition-all duration-500 transform shadow-xl">
                  <div className="bg-white rounded-2xl w-20 h-20 flex items-center justify-center mb-6 mx-auto shadow-lg shadow-emerald-900/20">
                    {React.createElement(steps[currentStep].icon, {
                      className: "w-10 h-10 text-emerald-600",
                    })}
                  </div>
                  <h2 className="text-3xl font-serif text-white mb-4 text-center">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-emerald-50 text-center leading-relaxed text-lg">
                    {steps[currentStep].description}
                  </p>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === currentStep
                          ? "w-8 bg-white"
                          : "w-2 bg-emerald-300/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-between items-center px-4">
                <button
                  onClick={() =>
                    setCurrentStep(
                      (prev) => (prev - 1 + steps.length) % steps.length
                    )
                  }
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all text-white border border-white/10 hover:border-white/30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setCurrentStep((prev) => (prev + 1) % steps.length)
                  }
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all text-white border border-white/10 hover:border-white/30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-[#fcfcfc] dark:bg-stone-900 transition-colors duration-300">
            {/* Floating Icons */}
            <FloatingIcon
              Icon={DollarSign}
              className="top-12 left-12 animate-pulse delay-100"
            />
            <FloatingIcon
              Icon={Wallet}
              className="bottom-12 right-12 animate-pulse delay-300"
            />
            <FloatingIcon
              Icon={TrendingUp}
              className="top-12 right-12 animate-pulse delay-500"
            />

            <div className="relative z-10 w-full max-w-md mx-auto">
              {/* Logo */}
              <div className="flex items-center justify-center mb-10 gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full shadow-sm">
                    <Leaf className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
                </div>
                <h1 className="text-4xl font-serif italic font-bold text-stone-800 dark:text-stone-100">
                  Recepta
                </h1>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-stone-800 dark:text-stone-100 mb-3">
                  Welcome Back
                </h2>
                <p className="text-stone-500 dark:text-stone-400">Sign in to manage your financial flow</p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 ml-4">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-6 py-4 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-full text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:bg-white dark:focus:bg-stone-900 transition-all shadow-sm"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2 ml-4">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-6 py-4 bg-stone-50 dark:bg-stone-800 border border-transparent rounded-full text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 focus:bg-white dark:focus:bg-stone-900 transition-all pr-14 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {error && <p className="text-orange-600 dark:text-orange-400 text-sm mt-2 ml-4 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 inline-block"></span>
                    {error}
                  </p>}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end pr-2">
                  <Link 
                    to="/forgot" 
                    className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors hover:underline decoration-2 underline-offset-4"
                  > 
                    Forgot password? 
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold py-4 rounded-full shadow-lg shadow-emerald-900/10 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide text-sm"
                >
                  Sign In
                </button>

                {/* Sign Up Link */}
                <div className="text-center pt-2">
                  <p className="text-stone-500 dark:text-stone-400">
                    Don't have an account?{" "}
                    <Link 
                        to="/register"
                        className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors ml-1"
                    >
                        Sign Up
                    </Link>
                  </p>
                </div>
              </form>

              {/* Mobile Onboarding Indicator (Visible only on small screens) */}
              <div className="lg:hidden mt-8 pt-8 border-t border-stone-100 dark:border-stone-800">
                <div className="flex justify-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep
                          ? "w-6 bg-emerald-500"
                          : "w-1.5 bg-stone-200 dark:bg-stone-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;