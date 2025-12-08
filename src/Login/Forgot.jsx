import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, DollarSign, TrendingUp, UploadCloud, Cpu, Mail, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

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
      <Icon className="w-16 h-16 text-[#2FAF8A] opacity-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Left Column - Onboarding */}
          <div 
            className="relative hidden lg:flex flex-col justify-center items-center p-12 overflow-hidden"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/8092510/pexels-photo-8092510.jpeg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2FAF8A]/95 to-[#6BBF92]/95" />
            
            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
              {/* Icon Carousel */}
              <div className="mb-12">
                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-6 transition-all duration-500 transform">
                  <div className="bg-white rounded-2xl w-20 h-20 flex items-center justify-center mb-6 mx-auto shadow-lg">
                    {React.createElement(steps[currentStep].icon, {
                      className: "w-10 h-10 text-[#2FAF8A]"
                    })}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 text-center">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-white/90 text-center leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentStep 
                          ? 'w-8 bg-white' 
                          : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Forgot Password Form */}
          <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            {/* Floating Icons */}
            <FloatingIcon Icon={DollarSign} className="top-8 left-8 animate-pulse" />
            <FloatingIcon Icon={Wallet} className="bottom-8 right-8 animate-pulse" />
            <FloatingIcon Icon={TrendingUp} className="top-8 right-8 animate-pulse" />

            <div className="relative z-10 w-full max-w-md mx-auto">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gradient-to-br from-[#2FAF8A] to-[#6BBF92] p-3 rounded-2xl">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h1 className="ml-3 text-3xl font-bold text-[#1F2937]">Recepta</h1>
              </div>

              {/* Icon Header */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-[#2FAF8A]/20 to-[#6BBF92]/20 p-4 rounded-2xl">
                  <Mail className="w-12 h-12 text-[#2FAF8A]" />
                </div>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#1F2937] mb-2">Forgot Password</h2>
                <p className="text-[#6B7280]">Enter your email to reset your password</p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2FAF8A] focus:border-transparent transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-[#2FAF8A] to-[#6BBF92] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  Reset Password
                </button>

                {/* Back to Login Link */}
                <div className="text-center pt-4">
                  <button 
                    onClick={() => console.log('Back to login')}
                    className="inline-flex items-center gap-2 text-[#2FAF8A] hover:text-[#6BBF92] font-semibold transition-colors"
                    aschild
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <Link to="/">Back to Login</Link>
                  </button>
                </div>

                {/* Info */}
                <p className="text-xs text-[#9CA3AF] text-center pt-2">
                  You will receive an email with instructions to reset your password.
                </p>
              </div>

              {/* Mobile Onboarding Indicator */}
              <div className="lg:hidden mt-8 pt-8 border-t border-[#E5E7EB]">
                <div className="flex justify-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep 
                          ? 'w-6 bg-[#2FAF8A]' 
                          : 'w-1.5 bg-[#E5E7EB]'
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