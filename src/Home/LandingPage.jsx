import React, { useState, useEffect } from "react";
import { 
  Leaf, 
  ArrowRight, 
  ScanLine, 
  PieChart, 
  Brain, 
  CheckCircle2, 
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { AuthModal } from "./AuthModal"; 
import dashboardPreview from "../assets/dashboard.png";
import { DemoModal } from "@/components/DemoModal";
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  const [isDark, setIsDark] = useState(true);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // ==================================================================
  // AUTH MODAL STATE
  // ==================================================================
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");

  const openAuth = (tab) => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };


  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // MAIN CONTAINER: Handles the base background color switch
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-emerald-500/30 transition-colors duration-500">
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={setIsAuthOpen} 
        defaultTab={authTab} 
      />

      {/* ==================================================================
          BACKGROUND EFFECTS (Adaptive opacity for Light/Dark)
          ================================================================== */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-400/30 dark:bg-emerald-900/20 rounded-full filter blur-[120px] opacity-60 dark:opacity-40 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-normal transition-all duration-500"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-300/30 dark:bg-orange-900/20 rounded-full filter blur-[120px] opacity-50 dark:opacity-30 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-normal transition-all duration-500"></div>

      {/* ==================================================================
          NAVBAR
          ================================================================== */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled 
            ? "bg-white/60 dark:bg-stone-950/80 backdrop-blur-md border-stone-200 dark:border-white/10 py-4 shadow-sm" 
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full transition-colors">
              <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="font-serif italic text-2xl tracking-wide text-stone-800 dark:text-stone-100">Recepta</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-400">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#ai" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI Engine</a>
            <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            {/* THEME TOGGLE BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <button 
                onClick={() => openAuth('login')}
                className="text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors px-2"
            >
              Log In
            </button>
            <Button 
                onClick={() => openAuth('register')}
                className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full px-6 transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* ==================================================================
          HERO SECTION
          ================================================================== */}
      <header className="relative z-10 pt-48 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium mb-6 animate-fade-in transition-colors">
            <Sparkles className="w-3 h-3" />
            <span>Now running on kwaipilot/kat-coder-pro:free</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-6 text-stone-900 dark:text-white transition-colors">
            Financial clarity, <br />
            <span className="italic text-emerald-600 dark:text-emerald-500">powered by intelligence.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-colors">
            Stop manually logging expenses. Recepta uses advanced AI vision to parse receipts, categorize spending, and forecast your financial health in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
                onClick={() => openAuth('register')}
                className="h-12 px-8 text-base bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full w-full sm:w-auto shadow-lg shadow-emerald-900/10 transition-all"
            >
              Start Tracking Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" 
            onClick={() => setIsDemoOpen(true)}
            className="h-12 px-8 text-base bg-white/50 dark:bg-transparent border-stone-300 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full w-full sm:w-auto transition-all">
              View Live Demo
            </Button>
          </div>
        </div>

        <DemoModal isOpen={isDemoOpen} onClose={setIsDemoOpen} />

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 relative max-w-6xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-orange-500/20 rounded-xl blur-lg opacity-50"></div>
          <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-2xl transition-colors duration-500">
            {/* Mockup Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 transition-colors">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
              </div>
            </div>
            
            {/* Placeholder / Image Area */}
            <div className="aspect-[16/9] bg-stone-100 dark:bg-stone-950 flex items-center justify-center text-stone-400 dark:text-stone-600 group cursor-pointer relative transition-colors">
               <img 
                 src={dashboardPreview} 
                 alt="Dashboard Preview" 
                 className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" 
                 onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'block';
                 }}
               />
               <div className="text-center space-y-2 hidden">
                 <p className="font-serif italic text-2xl text-stone-400 dark:text-stone-600">Your Dashboard View</p>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* ==================================================================
          FEATURES GRID
          ================================================================== */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-stone-900 dark:text-white">Everything you need to grow.</h2>
            <p className="text-stone-600 dark:text-stone-400">Advanced tools simplified for your personal economy.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white/40 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-stone-900/60 transition-colors group">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ScanLine className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-serif text-stone-900 dark:text-stone-100">Smart Receipt Scan</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                Upload a photo and let our AI extract merchants, dates, and line items instantly. No more manual data entry.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white/40 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-stone-900/60 transition-colors group">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <PieChart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-serif text-stone-900 dark:text-stone-100">Deep Analytics</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                Visualise your spending flow. Track categories, monthly trends, and get alerts when you're nearing your budget limits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white/40 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-stone-900/60 transition-colors group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-serif text-stone-900 dark:text-stone-100">Model Selection</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                Power user? Choose the specific LLM model (Xiaomi, Nvidia) used to parse your data for speed or precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          HOW IT WORKS
          ================================================================== */}
      <section className="py-24 border-t border-stone-200 dark:border-stone-900 relative z-10 bg-white/30 dark:bg-stone-950/50 backdrop-blur-sm transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-stone-900 dark:text-stone-100">
              From pocket to dashboard <br />
              <span className="italic text-stone-500">in seconds.</span>
            </h2>
            <div className="space-y-8">
              {[
                { title: "Snap or Upload", desc: "Take a picture of your receipt or upload a file directly." },
                { title: "AI Processing", desc: "Our neural nodes extract the total, date, and merchant details." },
                { title: "Review & Save", desc: "Verify the data and add it to your monthly ledger." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 font-bold text-sm border border-stone-300 dark:border-stone-700 transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-lg text-stone-800 dark:text-stone-200">{step.title}</h4>
                    <p className="text-stone-500 text-sm mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Abstract Representation */}
          <div className="relative h-[400px] bg-stone-100 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 flex flex-col justify-center items-center transition-colors">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20"></div>
             {/* Abstract UI Element */}
             <div className="w-64 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg p-4 shadow-2xl relative z-10 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
                <div className="h-2 w-20 bg-stone-200 dark:bg-stone-800 rounded mb-4"></div>
                <div className="space-y-2">
                   <div className="h-8 bg-stone-50 dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800 flex items-center px-3">
                      <span className="text-xs text-stone-400 dark:text-stone-500">Grocery Store...</span>
                   </div>
                   <div className="h-8 bg-emerald-100/50 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-900/50 flex items-center px-3 justify-between">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">Total</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">₱456.96</span>
                   </div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -right-4 -top-4 bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                   <CheckCircle2 className="w-3 h-3" /> Auto-Detected
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* ==================================================================
          CTA / FOOTER
          ================================================================== */}
      <footer className="py-20 border-t border-stone-200 dark:border-stone-900 relative z-10 text-center bg-[#f2f0e9] dark:bg-stone-950 transition-colors">
        <div className="max-w-3xl mx-auto px-6">
          <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-500 mx-auto mb-6" />
          <h2 className="font-serif text-4xl mb-6 text-stone-900 dark:text-white">Ready to clarify your finances?</h2>
          <p className="text-stone-600 dark:text-stone-400 mb-8">Join the waitlist or start your local instance today.</p>
          <div className="flex justify-center gap-4">
             <Button 
                onClick={() => openAuth('register')}
                className="bg-stone-900 dark:bg-white text-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 rounded-full h-12 px-8 transition-colors"
             >
                Create Account
             </Button>
          </div>
          
          <div className="mt-20 text-stone-500 dark:text-stone-600 text-sm flex flex-col md:flex-row gap-6 justify-between items-center border-t border-stone-300 dark:border-stone-900/50 pt-8 transition-colors">
             <p>&copy; 2026 Recepta. Built by Moi.</p>
             <div className="flex gap-6">
                <a href="#" className="hover:text-stone-800 dark:hover:text-stone-400">Privacy</a>
                <a href="#" className="hover:text-stone-800 dark:hover:text-stone-400">Terms</a>
                <a href="#" className="hover:text-stone-800 dark:hover:text-stone-400">Github</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}