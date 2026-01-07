"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, CheckSquare, Apple } from "lucide-react";

export default function VertexLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] text-white flex items-center justify-center p-4 lg:p-8 font-sans">
      {/* Main Container Board */}
      <div className="w-full max-w-[1400px] h-[85vh] bg-[#0f1218] rounded-3xl overflow-hidden flex shadow-2xl border border-gray-800 relative">

        {/* LEFT SIDE: Visuals/Branding */}
        <div className="hidden lg:flex flex-col justify-end w-1/2 relative p-12">
          {/* Background Image Placeholder */}
          <div className="absolute inset-0 z-0">
            {/* Note: In a real app, use a local image or optimized next/image here */}
            <img
              src="https://images.unsplash.com/photo-1639322537228-ad7117a3943b?q=80&w=2664&auto=format&fit=crop"
              alt="Digital Globe Abstract"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            {/* Gradient Overlay for the blue glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f1218] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 space-y-4 mb-10">
            <h2 className="text-gray-400 tracking-widest text-sm font-semibold uppercase">Vertex Financial</h2>
            <h1 className="text-5xl font-medium leading-tight text-gray-100">
              Smarter trades. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Infinite potential.
              </span>
            </h1>
          </div>

          {/* Decorative mesh/dots at bottom left */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative">

          {/* Subtle background glow behind the form card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Glassmorphism Card */}
          <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">

            {/* Header */}
            <div className="text-center mb-8 space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4 text-gray-300">
                <div className="bg-blue-500/20 p-1.5 rounded-lg border border-blue-400/30">
                  <CheckSquare className="w-5 h-5 text-blue-400" />
                </div>
                <span className="font-semibold tracking-wide uppercase text-sm">Vertex</span>
              </div>
              <h2 className="text-3xl font-medium text-white">Welcome back.</h2>
              <p className="text-gray-400 text-sm">Sign in to manage your portfolio.</p>
            </div>

            {/* Form */}
            <form className="space-y-5">

              {/* Email Input */}
              <div className="group space-y-1.5">
                <label className="text-xs text-gray-400 ml-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full bg-[#1c1f26] border border-gray-700 text-gray-200 text-sm rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  />
                  {/* Glowing border effect on focus could be enhanced here */}
                </div>
              </div>

              {/* Password Input */}
              <div className="group space-y-1.5">
                <label className="text-xs text-gray-400 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-[#1c1f26] border border-gray-700 text-gray-200 text-sm rounded-xl py-3 pl-10 pr-10 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all transform active:scale-[0.98]">
                Sign In
              </button>

            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#161920] px-2 text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-[#1c1f26] hover:bg-[#252932] border border-gray-700 hover:border-gray-600 text-gray-300 py-2.5 rounded-xl transition-all text-sm font-medium">
                {/* Simple Google SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.2 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#1c1f26] hover:bg-[#252932] border border-gray-700 hover:border-gray-600 text-gray-300 py-2.5 rounded-xl transition-all text-sm font-medium">
                <Apple className="w-4 h-4" />
                Apple
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                Don&apos;t have an account? <a href="#" className="text-blue-400 hover:underline">Contact Administrator.</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
