"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { SignupField } from "@/components/auth/SignupField"
import { RoleSelector, type UserType } from "@/components/auth/RoleSelector"

type FormData = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  contactNumber: string
  companyName: string
  address: string
  vatNumber: string
}

type FormErrors = Partial<Record<keyof FormData | "form", string>>

const INITIAL_FORM: FormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  contactNumber: "",
  companyName: "",
  address: "",
  vatNumber: "",
}

const HERO_PROPS = [
  { accent: "bg-nb-yellow", text: "Send requirements & receive quotations fast" },
  { accent: "bg-nb-cyan", text: "Track orders, invoices, and deliveries in one place" },
  { accent: "bg-nb-green", text: "Built for procurement teams & supply partners" },
]

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function SignupPage() {
  const [userType, setUserType] = useState<UserType>("customer")
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isCustomer = userType === "customer"
  const accentShadow = isCustomer ? "#FACC15" : "#A5E6DC"
  const ctaBg = isCustomer ? "bg-nb-yellow" : "bg-nb-cyan"

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!form.fullName.trim()) next.fullName = "Full name is required"
    if (!form.email.trim()) next.email = "Email is required"
    else if (!validateEmail(form.email)) next.email = "Enter a valid email address"
    if (!form.password) next.password = "Password is required"
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters"
    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password"
    else if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match"
    if (!form.contactNumber.trim()) next.contactNumber = "Contact number is required"
    if (!form.companyName.trim()) next.companyName = "Company name is required"
    if (!form.address.trim()) next.address = "Address is required"
    if (isCustomer && !form.vatNumber.trim()) next.vatNumber = "VAT number is required"
    return next
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors({ ...nextErrors, form: "Please fix the errors below." })
      return
    }
    setErrors({})
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5900/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: isCustomer ? "Customer" : "Supplier",
          contactNumber: form.contactNumber,
          address: form.address,
          companyName: form.companyName,
          vatNumber: form.vatNumber,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Registration failed")
      }

      setSubmitted(true)
    } catch (error: any) {
      setErrors({ form: error.message || "An unexpected error occurred." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-nb-bg font-body flex flex-col lg:flex-row">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <aside
        className="lg:w-[35%] bg-nb-cyan border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden"
        style={{ boxShadow: `8px 8px 0px 0px ${accentShadow}` }}
      >
        <div className="absolute top-8 right-8 w-24 h-24 border-[4px] border-black opacity-30 hidden lg:block" />
        <div
          className="absolute bottom-24 right-16 w-20 h-20 hidden lg:block shadow-nb-lg"
          style={{ backgroundColor: accentShadow, border: "4px solid #000" }}
        />

        <div className="relative z-10">
          <span className="inline-block px-4 py-2 border-[3px] border-black bg-white font-mono text-[10px] font-bold text-black uppercase tracking-widest mb-6 shadow-nb-sm">
            Procurement Platform
          </span>
          <h1 className="font-display font-black text-5xl lg:text-6xl text-black leading-[1.1] uppercase tracking-tighter">
            Stock<span style={{ color: accentShadow, textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' }}>Flow</span>
          </h1>
          <p className="font-body text-lg text-black mt-6 max-w-sm font-medium border-l-[4px] border-black pl-4 py-1">
            Join as a customer to procure materials or as a supplier to fulfill requirements across the supply chain.
          </p>
        </div>

        <ul className="space-y-4 mt-10 lg:mt-0 relative z-10">
          {HERO_PROPS.map((item) => (
            <li key={item.text} className="flex items-start gap-3">
              <span className={`w-4 h-4 mt-1 shrink-0 border-[3px] border-black shadow-nb-sm ${item.accent}`} />
              <span className="font-body text-sm font-bold text-black">{item.text}</span>
            </li>
          ))}
        </ul>

        <p className="font-mono text-[10px] font-bold text-black/60 uppercase tracking-widest mt-8 hidden lg:block relative z-10">
          Neo Brutalism UI · StockFlow v1
        </p>
      </aside>

      {/* ── Form panel ───────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-3xl">
          {submitted ? (
            <div className="bg-nb-green border-[4px] border-black shadow-nb-xl p-10 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-white border-[3px] border-black flex items-center justify-center shadow-nb">
                <CheckCircle2 size={32} strokeWidth={2.5} className="text-black" />
              </div>
              <h2 className="font-display font-black text-3xl uppercase text-black">Account Ready</h2>
              <p className="font-body text-sm text-black/80">
                Your {isCustomer ? "customer" : "supplier"} profile is set up. Sign in when the login page is available to access your portal.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setForm(INITIAL_FORM)
                }}
                className="px-6 py-3 bg-white border-[3px] border-black font-display font-black text-xs uppercase tracking-widest shadow-nb nb-interactive"
              >
                Register another account
              </button>
            </div>
          ) : (
            <div className="bg-white border-[4px] border-black shadow-nb-xl p-8 lg:p-10 space-y-8">
              <header>
                <h2 className="font-display font-black text-3xl uppercase tracking-tight text-black">
                  Create Account
                </h2>
                <p className="font-body text-sm text-[#444] mt-2">
                  Choose your role and fill in your details to get started.
                </p>
              </header>

              <section className="space-y-3">
                <p className="font-display font-black text-[10px] uppercase tracking-widest text-black">
                  I am signing up as
                </p>
                <RoleSelector value={userType} onChange={setUserType} />
              </section>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {errors.form && (
                  <div
                    className="bg-nb-red border-[3px] border-black px-4 py-3 font-mono text-xs text-white"
                    role="alert"
                  >
                    {errors.form}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SignupField
                    label="Full name *"
                    name="fullName"
                    value={form.fullName}
                    onChange={(v) => update("fullName", v)}
                    error={errors.fullName}
                    placeholder="Jane Doe"
                  />
                  <SignupField
                    label="Email *"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    error={errors.email}
                    placeholder="you@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SignupField
                    label="Password *"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={(v) => update("password", v)}
                    error={errors.password}
                    placeholder="Min. 6 characters"
                  />
                  <SignupField
                    label="Confirm password *"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={(v) => update("confirmPassword", v)}
                    error={errors.confirmPassword}
                    placeholder="Repeat password"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <SignupField
                    label="Contact number *"
                    name="contactNumber"
                    type="tel"
                    value={form.contactNumber}
                    onChange={(v) => update("contactNumber", v)}
                    error={errors.contactNumber}
                    placeholder="+94 77 123 4567"
                  />
                  <div>
                    <SignupField
                      label="Company name *"
                      name="companyName"
                      value={form.companyName}
                      onChange={(v) => update("companyName", v)}
                      error={errors.companyName}
                      placeholder="Acme Industries Ltd."
                    />
                    {!isCustomer && (
                      <p className="font-mono text-[10px] text-[#444] mt-1 uppercase tracking-wide">
                        Registered business name
                      </p>
                    )}
                  </div>
                </div>

                {isCustomer && (
                  <SignupField
                    label="VAT number *"
                    name="vatNumber"
                    value={form.vatNumber}
                    onChange={(v) => update("vatNumber", v)}
                    error={errors.vatNumber}
                    placeholder="VAT-123456789"
                  />
                )}

                <SignupField
                  label="Address *"
                  name="address"
                  value={form.address}
                  onChange={(v) => update("address", v)}
                  error={errors.address}
                  placeholder="Street, city, postal code"
                  multiline
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 ${ctaBg} border-[3px] border-black font-display font-black text-sm uppercase tracking-widest shadow-nb nb-interactive flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {isLoading ? "Processing..." : `Create ${isCustomer ? "Customer" : "Supplier"} Account`}
                  {!isLoading && <ArrowRight size={18} strokeWidth={3} />}
                </button>
              </form>

              <p className="font-body text-sm text-center text-[#444] border-t-[2px] border-black pt-6">
                Already have an account?{" "}
                <Link
                  href="#"
                  className="font-display font-black text-black uppercase text-xs tracking-widest hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
