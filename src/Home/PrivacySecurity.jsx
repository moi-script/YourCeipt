import React from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Trash2, 
  Leaf,
  Wind
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function OrganicPrivacyPageColors() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    // 1. BACKGROUND: 
    // Light: Warm, paper-like tone (#f2f0e9) 
    // Dark: Deep Stone (#0c0a09)
    <div className="min-h-screen bg-[#f2f0e9] dark:bg-stone-950 relative overflow-hidden font-sans text-stone-800 dark:text-stone-100 selection:bg-emerald-100 dark:selection:bg-emerald-900 selection:text-emerald-900 dark:selection:text-emerald-100 pb-24 transition-colors duration-300">
      
      {/* Decorative Background Blobs - Modified blending for Dark Mode */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[80px] opacity-70 dark:opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[80px] opacity-70 dark:opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-[#eadfd8] dark:bg-stone-900/40 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-[100px] opacity-60 dark:opacity-20 pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-6 pt-24 space-y-16">
        
        {/* 2. TYPOGRAPHY */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/30 backdrop-blur-sm shadow-sm mb-4">
            <Leaf className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-medium tracking-widest uppercase text-emerald-700 dark:text-emerald-400">Recepta Secure</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif italic text-[#2c2c2c] dark:text-stone-100">
            Privacy & Flow
          </h1>
          <p className="text-lg text-[#666666] dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
            Cultivate a secure environment for your financial growth. 
            Your data, handled with care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-8">
            
            {/* CARD 1: AUTHENTICATION (Emerald Theme) */}
            <div className="bg-white/80 dark:bg-stone-900/60 backdrop-blur-md border border-white dark:border-stone-800 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-serif text-emerald-950 dark:text-emerald-50">Identity</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-stone-600 dark:text-stone-400 ml-2">Current Password</Label>
                  <Input 
                    type="password" 
                    className="rounded-full bg-[#fcfcfc] dark:bg-stone-800/50 border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] h-12 px-6 focus-visible:ring-1 focus-visible:ring-emerald-300 dark:focus-visible:ring-emerald-600 text-stone-800 dark:text-stone-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-stone-600 dark:text-stone-400 ml-2">New Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      className="rounded-full bg-[#fcfcfc] dark:bg-stone-800/50 border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] h-12 px-6 pr-12 focus-visible:ring-1 focus-visible:ring-emerald-300 dark:focus-visible:ring-emerald-600 text-stone-800 dark:text-stone-200"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="font-medium text-stone-700 dark:text-stone-200">Two-Factor Auth</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">Secure via Email</p>
                   </div>
                   <Switch className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500" />
                </div>

                <Button className="w-full rounded-full h-12 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-emerald-50 hover:text-white transition-colors text-md font-normal shadow-lg shadow-emerald-900/10">
                  Update Credentials
                </Button>
              </div>
            </div>

            {/* CARD 2: DANGER ZONE (Orange Theme) */}
            <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-[2.5rem] p-8">
              <div className="flex items-center gap-4 mb-4">
                 <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-700 dark:text-orange-400">
                    <Trash2 className="h-5 w-5" />
                 </div>
                 <h2 className="text-xl font-serif text-orange-900 dark:text-orange-200">Release Data</h2>
              </div>
              <p className="text-sm text-orange-800/70 dark:text-orange-300/70 mb-6 leading-relaxed">
                Letting go is permanent. Deleting your account will return all your data to the void.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-full border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:text-orange-800 bg-transparent">
                  Purge Data
                </Button>
                <Button className="flex-1 rounded-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white shadow-lg shadow-orange-200 dark:shadow-none">
                  Delete
                </Button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8 mt-0 md:mt-12">
            
             {/* CARD 3: DATA & AI (Emerald Theme) */}
             <div className="bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                {/* Subtle watermark icon */}
                <Wind className="absolute top-[-20px] right-[-20px] h-32 w-32 text-emerald-100 dark:text-emerald-900/40 opacity-60 rotate-12" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-stone-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-sm">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-serif text-emerald-950 dark:text-emerald-100">Data Harmony</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/60 dark:bg-stone-900/60 p-5 rounded-3xl flex items-center justify-between border border-white dark:border-white/5">
                       <div className="pr-4">
                          <p className="font-medium text-emerald-900 dark:text-emerald-100">Original Receipts</p>
                          <p className="text-sm text-emerald-700/70 dark:text-emerald-300/60 mt-1">Keep the raw imagery of your spending.</p>
                       </div>
                       <Switch defaultChecked className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500" />
                    </div>

                    <div className="bg-white/60 dark:bg-stone-900/60 p-5 rounded-3xl flex items-center justify-between border border-white dark:border-white/5">
                       <div className="pr-4">
                          <p className="font-medium text-emerald-900 dark:text-emerald-100">AI Symbiosis</p>
                          <p className="text-sm text-emerald-700/70 dark:text-emerald-300/60 mt-1">Share anonymized patterns to grow the model.</p>
                       </div>
                       <Switch className="data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-500" />
                    </div>
                  </div>
                </div>
             </div>

             {/* CARD 4: SESSIONS */}
             <div className="space-y-4">
                <h3 className="text-lg font-serif italic text-stone-500 dark:text-stone-400 ml-4">Current Presence</h3>
                
                <div className="group flex items-center justify-between bg-white dark:bg-stone-900 rounded-full p-3 pr-6 shadow-sm hover:shadow-md transition-all cursor-default border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/50">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-[#f2f0e9] dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                         <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="font-medium text-stone-800 dark:text-stone-100">Windows PC</p>
                         <p className="text-xs text-stone-500 dark:text-stone-400">General Trias • Active Now</p>
                      </div>
                   </div>
                   {/* Emerald pulse for active session */}
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>

                <div className="group flex items-center justify-between bg-white/60 dark:bg-stone-900/60 rounded-full p-3 pr-6 hover:bg-white dark:hover:bg-stone-900 transition-all border border-transparent hover:border-orange-100 dark:hover:border-orange-900/50">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-[#f7f5f0] dark:bg-stone-800/50 flex items-center justify-center text-stone-400">
                         <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                         <p className="font-medium text-stone-600 dark:text-stone-300">iPhone 14</p>
                         <p className="text-xs text-stone-400 dark:text-stone-500">Manila • 2 days ago</p>
                      </div>
                   </div>
                   {/* Orange text for revoke action */}
                   <button className="text-xs font-medium text-orange-700 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-200 px-3 py-1 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                      Revoke
                   </button>
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}