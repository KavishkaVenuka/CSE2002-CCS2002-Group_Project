import Link from "next/link";
import { ArrowRight, Box, ShieldCheck, TrendingUp, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] font-body text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FACC15] border-2 border-black flex items-center justify-center transform -rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Box size={20} strokeWidth={3} className="text-black" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight">STOCKFLOW</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <button className="px-6 py-2 font-display font-bold uppercase tracking-wider bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all cursor-pointer">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-6 py-2 font-display font-bold uppercase tracking-wider bg-[#4ADE80] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all cursor-pointer">
              Sign Up
            </button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16 px-6 sm:px-12 md:px-24 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-40 left-10 w-32 h-32 bg-[#A5E6DC] border-4 border-black opacity-50 -z-10 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#FB923C] border-4 border-black opacity-50 -z-10 rotate-12"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#EF4444] border-4 border-black opacity-50 -z-10 -rotate-12"></div>
        
        {/* Hero Section */}
        <div className="max-w-4xl text-center space-y-8 relative z-10 mt-12 md:mt-24">
          <div className="inline-block bg-[#FACC15] border-2 border-black px-4 py-2 font-mono font-bold uppercase tracking-widest text-sm transform -rotate-2 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Supply Chain Management System
          </div>
          <h1 className="text-5xl sm:text-7xl font-display font-extrabold uppercase leading-[1.1] tracking-tighter">
            Manage Your <br/>
            <span className="inline-block bg-white border-4 border-black px-4 py-2 mt-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1">
              Supply Chain
            </span>
          </h1>
          <p className="text-xl sm:text-2xl font-medium max-w-2xl mx-auto leading-relaxed mt-8">
            The brutally simple, high-performance platform for managing orders, suppliers, and deliveries with uncompromising clarity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <Link href="/signup">
              <button className="flex items-center gap-2 px-8 py-4 font-display font-bold text-xl uppercase tracking-wider bg-[#FACC15] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none transition-all cursor-pointer">
                Get Started <ArrowRight strokeWidth={3} className="text-black" />
              </button>
            </Link>
          </div>
        </div>
        
        {/* Features Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full z-10">
          <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-[#A5E6DC] border-2 border-black mb-6 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp size={24} strokeWidth={3} className="text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl uppercase mb-3">Real-time Stats</h3>
            <p className="font-medium text-gray-800">Track orders, monitor inventory, and analyze supplier performance instantly.</p>
          </div>
          <div className="bg-[#4ADE80] p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-white border-2 border-black mb-6 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Zap size={24} strokeWidth={3} className="text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl uppercase mb-3">Fast Workflow</h3>
            <p className="font-medium text-gray-800">Streamlined purchase orders, instant quotations, and automated payments.</p>
          </div>
          <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 bg-[#FB923C] border-2 border-black mb-6 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck size={24} strokeWidth={3} className="text-black" />
            </div>
            <h3 className="font-display font-bold text-2xl uppercase mb-3">Secure System</h3>
            <p className="font-medium text-gray-800">Role-based access control, secure payments, and reliable delivery tracking.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#000000] text-white flex items-center justify-center font-display font-bold text-xs">
              S
            </div>
            <span className="font-display font-bold tracking-tight">STOCKFLOW</span>
          </div>
          <div className="text-sm font-medium font-mono text-center md:text-left">
            © {new Date().getFullYear()} StockFlow System. All rights reserved.
          </div>
          <div className="flex gap-6 font-display font-bold text-sm uppercase">
            <Link href="#" className="hover:underline decoration-2 underline-offset-4">Privacy</Link>
            <Link href="#" className="hover:underline decoration-2 underline-offset-4">Terms</Link>
            <Link href="#" className="hover:underline decoration-2 underline-offset-4">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}