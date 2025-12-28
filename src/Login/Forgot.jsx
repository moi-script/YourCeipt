import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, DollarSign, TrendingUp, UploadCloud, Cpu, Mail, ArrowLeft, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');

  const steps = [
    {
      title: "Scan or Upload Receipts",
      description: "Easily capture your receipts by scanning or uploading images.",
      icon: UploadCloud
    },
    {
      title: "AI Categorizes Your Spending",
      description: "Our AI automatically sorts your expenses into categories.",
      icon: Cpu
    },
    {
      title: "View Insights & Trends",
      description: "Instantly see insights, trends, and summaries of your spending.",
      icon: TrendingUp
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset request for:', email);
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
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          
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
                      className: "w-10 h-10 text-emerald-600"
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
                          ? 'w-8 bg-white' 
                          : 'w-2 bg-emerald-300/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-between items-center px-4">
                <button
                  onClick={() => setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all text-white border border-white/10 hover:border-white/30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 rounded-full transition-all text-white border border-white/10 hover:border-white/30"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Forgot Password Form */}
          <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-[#fcfcfc]">
            {/* Floating Icons */}
            <FloatingIcon Icon={DollarSign} className="top-12 left-12 animate-pulse delay-100" />
            <FloatingIcon Icon={Wallet} className="bottom-12 right-12 animate-pulse delay-300" />
            <FloatingIcon Icon={TrendingUp} className="top-12 right-12 animate-pulse delay-500" />

            <div className="relative z-10 w-full max-w-md mx-auto">
              
              {/* Icon Header */}
              <div className="flex justify-center mb-8">
                <div className="bg-emerald-50 p-6 rounded-full shadow-inner border border-emerald-100">
                  <Mail className="w-12 h-12 text-emerald-600" />
                </div>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-stone-800 mb-3">Forgot Password</h2>
                <p className="text-stone-500">Enter your email to reset your password</p>
              </div>

              {/* Form */}
              <div className="space-y-8">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 ml-4">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-6 py-4 bg-stone-50 border border-transparent rounded-full text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-full shadow-lg shadow-emerald-900/10 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide text-sm"
                >
                  Reset Password
                </button>

                {/* Back to Login Link */}
                <div className="text-center pt-4">
                  <button 
                    onClick={() => console.log('Back to login')}
                    className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-bold transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <Link to="/">Back to Login</Link>
                  </button>
                </div>

                {/* Info */}
                <div className="bg-orange-50 p-4 rounded-[1.5rem] border border-orange-100/50">
                    <p className="text-xs text-orange-800/70 text-center font-medium">
                    You will receive an email with instructions to reset your password shortly after submitting.
                    </p>
                </div>
              </div>

              {/* Mobile Onboarding Indicator */}
              <div className="lg:hidden mt-8 pt-8 border-t border-stone-100">
                <div className="flex justify-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep 
                          ? 'w-6 bg-emerald-500' 
                          : 'w-1.5 bg-stone-200'
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

export default ForgotPassword;