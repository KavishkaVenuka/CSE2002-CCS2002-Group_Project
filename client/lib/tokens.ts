// ─── Design Tokens — Neo Brutalism ───────────────────────────────────────────
// These are used by components that still use inline styles.
// Colors align with the Neo Brutalism palette defined in globals.css @theme.
export const T = {
  // Surfaces
  surface: "#F5F0E8",   // warm off-white page background
  card:    "#FFFFFF",   // card / panel background

  // Primary accent (used by customer portal CTA)
  primary:      "#000000",
  primaryHover: "#333333",
  primaryBg:    "#FACC15", // yellow accent bg

  // Semantic status colors — vibrant, flat, no pastels
  green:    "#4ADE80",
  greenBg:  "#4ADE80",
  blue:     "#22D3EE",
  blueBg:   "#22D3EE",
  red:      "#EF4444",
  redBg:    "#EF4444",
  amber:    "#FACC15",
  amberBg:  "#FACC15",

  // Borders — everything is hard black in Neo Brutalism
  border:      "#000000",
  borderLight: "#000000",

  // Typography — all black
  t1: "#000000",
  t2: "#000000",
  t3: "#444444",

  // Legacy compat aliases
  amberBorder: "#000000",
  primaryBorder: "#000000",
  ink:      "#000000",
  inkHover: "#333333",
}

export const font = '"DM Sans", system-ui, sans-serif'
export const mono = '"Space Mono", "Courier New", monospace'

export const STATUS_MAP = {
  delivered:    { color: "#000000", bg: "#4ADE80", label: "Delivered" },
  "in-transit": { color: "#000000", bg: "#22D3EE", label: "In Transit" },
  dispatched:   { color: "#000000", bg: "#FACC15", label: "Dispatched" },
}

export const ACT_DOT = {
  green:   "#4ADE80",
  blue:    "#22D3EE",
  amber:   "#FACC15",
  red:     "#EF4444",
  primary: "#000000",
}
