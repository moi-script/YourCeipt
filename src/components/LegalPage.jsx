import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  FileText, 
  Lock, 
  ArrowLeft, 
  Server, 
  Eye, 
  Cpu, 
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState("privacy");
  const [scrolled, setScrolled] = useState(false);

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-500 selection:bg-emerald-500/30">
      
      {/* ==================================================================
          NAVBAR (Simplified)
          ================================================================== */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled 
            ? "bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-stone-200 dark:border-stone-800 py-4" 
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link to="/main" className="flex items-center gap-2 group text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Back to Home</span>
          </Link>
          <span className="font-serif italic font-bold text-xl">Recepta Legal</span>
        </div>
      </nav>

      {/* ==================================================================
          HEADER SECTION
          ================================================================== */}
      <div className="pt-32 pb-12 px-6 bg-stone-100 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
                <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4 text-stone-900 dark:text-white">
                Transparency & Trust
            </h1>
            <p className="text-stone-600 dark:text-stone-400 text-lg max-w-2xl mx-auto">
                We handle your financial data with the same care we would handle our own. 
                Read below to understand how Recepta protects your privacy.
            </p>
        </div>
      </div>

      {/* ==================================================================
          TABS & CONTENT
          ================================================================== */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
            <div className="bg-stone-200 dark:bg-stone-900 p-1 rounded-full inline-flex">
                <button
                    onClick={() => setActiveTab("privacy")}
                    className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                        activeTab === "privacy"
                            ? "bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 shadow-sm"
                            : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                    }`}
                >
                    Privacy Policy
                </button>
                <button
                    onClick={() => setActiveTab("terms")}
                    className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                        activeTab === "terms"
                            ? "bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 shadow-sm"
                            : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                    }`}
                >
                    Terms of Service
                </button>
            </div>
        </div>

        {/* Content Container */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-12 shadow-xl border border-stone-200 dark:border-stone-800">
            
            {/* ====================================================
                PRIVACY POLICY CONTENT
               ==================================================== */}
            {activeTab === "privacy" && (
                <div className="prose prose-stone dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-stone-100 dark:border-stone-800">
                        <Lock className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-3xl font-serif m-0">Privacy Policy</h2>
                    </div>

                    <p className="lead text-lg text-stone-600 dark:text-stone-300">
                        Last Updated: January 2026
                    </p>

                    <h3>1. Data Collection</h3>
                    <p>
                        We collect information you provide directly to us when you create an account, upload receipts, or input transaction data.
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0 my-6">
                        <li className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-100 dark:border-stone-800">
                            <strong className="block text-emerald-600 mb-1">Identity Data</strong>
                            Name, email address, and profile image.
                        </li>
                        <li className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-100 dark:border-stone-800">
                            <strong className="block text-emerald-600 mb-1">Financial Data</strong>
                            Receipt images, merchant names, transaction amounts, and budgets.
                        </li>
                    </ul>

                    <h3>2. How We Use AI</h3>
                    <div className="flex gap-4 items-start bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 my-6">
                        <Cpu className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="text-emerald-800 dark:text-emerald-400 font-bold m-0 mb-2">Receipt Processing</h4>
                            <p className="m-0 text-sm text-emerald-900/80 dark:text-stone-300">
                                When you upload a receipt, the image is processed by our AI models (e.g., Xiaomi Mimo, Nemotron) solely to extract data (Date, Total, Merchant). 
                                <strong> We do not use your personal financial data to train public AI models.</strong>
                            </p>
                        </div>
                    </div>

                    <h3>3. Data Storage & Security</h3>
                    <p>
                        Your data is encrypted at rest and in transit. We use industry-standard encryption protocols (AES-256) to store your financial records. 
                        You retain full ownership of your data at all times.
                    </p>

                    <h3>4. User Rights</h3>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access the personal data we hold about you.</li>
                        <li>Request correction of inaccurate data.</li>
                        <li>Request deletion of your account and all associated financial data ("Right to be Forgotten").</li>
                        <li>Export your transaction history in CSV/JSON format.</li>
                    </ul>

                    <h3>5. Contact Us</h3>
                    <p>
                        If you have questions about this policy, please contact us at <a href="mailto:privacy@recepta.app" className="text-emerald-600 hover:underline">privacy@recepta.app</a>.
                    </p>
                </div>
            )}


            {/* ====================================================
                TERMS OF SERVICE CONTENT
               ==================================================== */}
            {activeTab === "terms" && (
                <div className="prose prose-stone dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-stone-100 dark:border-stone-800">
                        <Scale className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-3xl font-serif m-0">Terms of Service</h2>
                    </div>

                    <p className="lead text-lg text-stone-600 dark:text-stone-300">
                        Last Updated: January 2026
                    </p>

                    <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30 my-6">
                        <h4 className="text-orange-800 dark:text-orange-400 font-bold m-0 mb-2">Important Disclaimer</h4>
                        <p className="m-0 text-sm text-orange-900/80 dark:text-stone-300">
                            <strong>Recepta is a budgeting tool, not a financial advisor.</strong> The insights provided by our AI are for informational purposes only. We are not responsible for financial decisions made based on this data.
                        </p>
                    </div>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using Recepta, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
                    </p>

                    <h3>2. User Responsibilities</h3>
                    <p>You are responsible for:</p>
                    <ul>
                        <li>Maintaining the confidentiality of your account credentials.</li>
                        <li>Ensuring uploaded receipts do not contain illegal or prohibited content.</li>
                        <li>Verifying the accuracy of AI-extracted data before relying on it for tax or accounting purposes.</li>
                    </ul>

                    <h3>3. AI Usage Limitations</h3>
                    <p>
                        Our AI features utilize Large Language Models (LLMs). You acknowledge that AI can occasionally produce "hallucinations" or incorrect data. Always review scanned receipt totals against the original physical document.
                    </p>

                    <h3>4. Intellectual Property</h3>
                    <p>
                        The Recepta source code, design, and "Leaf" branding are owned by us. Your specific financial data remains your intellectual property.
                    </p>

                    <h3>5. Termination</h3>
                    <p>
                        We reserve the right to suspend or terminate your account immediately, without prior notice, for any breach of these Terms, specifically regarding fraudulent usage or security violations.
                    </p>
                </div>
            )}
        </div>
      </main>

      {/* ==================================================================
          FOOTER
          ================================================================== */}
      <footer className="py-12 text-center text-stone-500 text-sm">
        <p>&copy; 2026 Recepta. Built by Moi.</p>
        <div className="mt-4 flex justify-center gap-4">
            <Link to="/main" className="hover:text-stone-800 dark:hover:text-stone-300">Home</Link>
            <a href="#" className="hover:text-stone-800 dark:hover:text-stone-300">Contact Support</a>
        </div>
      </footer>

    </div>
  );
}