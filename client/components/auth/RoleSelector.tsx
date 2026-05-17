"use client"

import { Check, Package, Truck } from "lucide-react"

export type UserType = "customer" | "supplier"

interface RoleSelectorProps {
  value: UserType
  onChange: (type: UserType) => void
}

const ROLES: {
  id: UserType
  label: string
  description: string
  accent: string
  icon: typeof Package
}[] = [
  {
    id: "customer",
    label: "Customer",
    description: "Procure materials & track orders",
    accent: "bg-nb-yellow",
    icon: Package,
  },
  {
    id: "supplier",
    label: "Supplier",
    description: "Fulfill requirements & manage quotations",
    accent: "bg-nb-cyan",
    icon: Truck,
  },
]

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ROLES.map((role) => {
        const selected = value === role.id
        const Icon = role.icon
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            className={`
              relative text-left p-5 border-black nb-interactive
              ${role.accent}
              ${selected ? "border-[4px] shadow-[6px_6px_0px_0px_#000]" : "border-[2px] shadow-nb opacity-90 hover:opacity-100"}
            `}
          >
            {selected && (
              <span className="nb-badge absolute top-3 right-3 bg-white text-black gap-1">
                <Check size={12} strokeWidth={3} />
                Selected
              </span>
            )}
            <div className="w-12 h-12 bg-white border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] mb-4">
              <Icon size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <h3 className="font-display font-black text-lg uppercase tracking-tight text-black">
              {role.label}
            </h3>
            <p className="font-body text-sm text-black/80 mt-1 pr-16">{role.description}</p>
          </button>
        )
      })}
    </div>
  )
}
