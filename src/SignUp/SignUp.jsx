import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { RegisterForm } from "./Register.jsx";
import receptaLogo from "../assets/receptaLogo.png";


//  image_profile : {
//     type : String,
//     required : true
//   },
//   currency : {
//     type : String,
//     required : true
//   },
//   theme : {
//     type : String,
//     required : true
//   },
//   overspending : {
//     type : Boolean,
//     required : true
//   },
//   nearLimit : {
//     type : Boolean,
//     required : true
//   },
  


const BudgetSignup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    fullname: "",
    email: "",
    password: "",
    image_profile : "",
    currency : "PHP",
    theme : "default",
    overSpending : false,
    nearLimit : false
  });

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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const FloatingIcon = ({ Icon, className }) => (
    <div className={`absolute ${className}`}>
      <Icon className="w-16 h-16 text-emerald-500 opacity-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f0e9] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-[90px] opacity-60 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[90px] opacity-60 pointer-events-none"></div>

      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/50 relative z-10">
        <div className="grid lg:grid-cols-2 min-h-[650px]">
          
          {/* Left Column - Onboarding (Emerald Theme) */}
          <div className="relative hidden lg:flex flex-col justify-center items-center p-12 overflow-hidden bg-emerald-900">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{
                    backgroundImage: "url(https://images.pexels.com/photos/8092510/pexels-photo-8092510.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-600 opacity-90" />
            
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

          {/* Right Column - Signup Form */}
          <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-[#fcfcfc]">
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
                <div className="bg-emerald-100 p-3 rounded-full shadow-sm">
                    <Leaf className="w-8 h-8 text-emerald-700" />
                </div>
                {/* <div
                  className="p-3 rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${receptaLogo})`,
                    backgroundBlendMode: "multiply",
                    minWidth: "50px",
                    minHeight: "50px",
                  }}
                />
                */}
                <h1 className="text-4xl font-serif italic font-bold text-stone-800">
                  Recepta
                </h1>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-stone-800 mb-3">
                  Start Budgeting Smart
                </h2>
                <p className="text-stone-500">
                  Take control of your finances today
                </p>
              </div>

              <RegisterForm
                formData={formData}
                handleChange={handleChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              {/* Mobile Onboarding Indicator */}
              <div className="lg:hidden mt-8 pt-8 border-t border-stone-100">
                <div className="flex justify-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep
                          ? "w-6 bg-emerald-500"
                          : "w-1.5 bg-stone-200"
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

export default BudgetSignup;