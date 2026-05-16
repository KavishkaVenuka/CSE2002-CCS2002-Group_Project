"use client"

interface SignupFieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  multiline?: boolean
  rows?: number
}

export function SignupField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  multiline = false,
  rows = 3,
}: SignupFieldProps) {
  const inputClass =
    "w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors"

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block font-display font-black text-[10px] uppercase tracking-widest text-black"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      {error && (
        <p className="font-mono text-xs text-nb-red border-l-[3px] border-nb-red pl-2 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
