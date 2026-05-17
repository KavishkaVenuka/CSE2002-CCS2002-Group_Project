"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      // Connect to your actual login endpoint here
      const response = await fetch("http://localhost:5900/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Invalid credentials")
      }

      const data = await response.json()

      // Handle successful login: store token and user details
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirect based on role
      if (data.user?.role === "Supplier") {
        router.push("/supplier-dashboard")
      } else {
        router.push("/dashboard")
      }
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-nb-bg font-body flex flex-col lg:flex-row">
      {/* ── Visual Aside ──────────────────────────────────────────────────────── */}
      <aside className="lg:w-[45%] bg-nb-cyan border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-8 right-8 w-24 h-24 border-[4px] border-black opacity-30 hidden lg:block" />
        <div className="absolute bottom-24 right-16 w-20 h-20 bg-nb-yellow border-[4px] border-black hidden lg:block shadow-nb-lg" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-nb-red border-[4px] border-black hidden lg:block shadow-nb-xl rotate-12" />

        <div className="relative z-10">
          <span className="inline-block px-4 py-2 border-[3px] border-black bg-white font-mono text-[10px] font-bold text-black uppercase tracking-widest mb-6 shadow-nb-sm">
            Welcome Back
          </span>
          <h1 className="font-display font-black text-6xl lg:text-7xl text-black leading-[1.1] uppercase tracking-tighter">
            System
            <br />
            Access
          </h1>
          <p className="font-body text-lg text-black mt-6 max-w-sm font-medium border-l-[4px] border-black pl-4 py-1">
            Sign in to your StockFlow portal to manage procurement, track orders, and connect with supply partners.
          </p>
        </div>

        <div className="mt-16 lg:mt-0 relative z-10">
          <div className="inline-flex items-center gap-3 bg-white text-black px-4 py-3 border-[3px] border-black shadow-nb">
            <span className="w-3 h-3 bg-nb-green border-[2px] border-black animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest">Portal Online</span>
          </div>
        </div>
      </aside>

      {/* ── Login Form ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-white border-[4px] border-black shadow-nb-xl p-8 lg:p-10 space-y-8">
            <header>
              <h2 className="font-display font-black text-4xl uppercase tracking-tight text-black flex items-center gap-3">
                <LogIn size={36} strokeWidth={3} className="text-nb-yellow" style={{ filter: 'drop-shadow(2px 2px 0px #000)' }} />
                Sign In
              </h2>
              <p className="font-body text-sm text-[#444] mt-2 font-medium">
                Enter your credentials to access your dashboard.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {error && (
                <div
                  className="bg-nb-red border-[3px] border-black px-4 py-3 font-mono text-xs font-bold text-white shadow-nb"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block font-display font-black text-[11px] uppercase tracking-widest text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full p-4 bg-nb-bg border-[3px] border-black font-mono text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:bg-white focus:shadow-nb transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="block font-display font-black text-[11px] uppercase tracking-widest text-black">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="font-mono text-[10px] font-bold text-[#666] hover:text-black uppercase tracking-wide hover:bg-nb-yellow px-1 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 bg-nb-bg border-[3px] border-black font-mono text-sm font-bold text-black placeholder:text-black/40 focus:outline-none focus:bg-white focus:shadow-nb transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-nb-yellow border-[3px] border-black font-display font-black text-base uppercase tracking-widest shadow-nb nb-interactive flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Authenticating..." : "Access Portal"}
                {!isLoading && <ArrowRight size={20} strokeWidth={3} />}
              </button>
            </form>

            <div className="border-t-[3px] border-black pt-6 text-center">
              <p className="font-body text-sm font-bold text-[#444]">
                New to StockFlow?{" "}
                <Link
                  href="/signup"
                  className="font-display font-black text-black uppercase text-xs tracking-widest hover:underline hover:bg-nb-cyan px-2 py-1 ml-1 transition-colors border-[2px] border-transparent hover:border-black"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}