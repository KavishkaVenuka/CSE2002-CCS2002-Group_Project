// ─── Design Tokens ───────────────────────────────────────────────────────────
export const T = {
    // 30% – Sidebar, Primary Headers, Secondary UI
    ink: "#1A3A5C",      // Deep Navy
    inkHover: "#2A5580", // Primary Light
    
    // 60% – Backgrounds & Large Surfaces
    surface: "#F2F6FB",  // Pale Blue-White
    card: "#FFFFFF",     // Base White
    
    // 10% – Primary Accent / Call-to-Action
    primary: "#1D9E75",       // Emerald Green
    primaryHover: "#0F6E56",  // Accent Dark
    primaryBg: "#E1F5EE",     // Accent Light
    primaryBorder: "#1D9E75", // Emerald Green
    
    // Semantic Status Colors
    green: "#22C55E",   // Success / In Stock
    greenBg: "#E1F5EE",
    blue: "#1A3A5C",    // Info / Processing
    blueBg: "#EBF3FF",
    red: "#EF4444",     // Danger / Out of Stock
    redBg: "#FEE2E2",
    amber: "#F59E0B",   // Warning / Low Stock
    amberBg: "#FEF3C7",
    amberBorder: "#F59E0B",

    // Borders
    border: "#CCD9E8",      // Base Border
    borderLight: "#E0EAF5", // Light Border

    // Typography (WCAG AA Compliant)
    t1: "#1A3A5C", // Primary text
    t2: "#4A6582", // Secondary text
    t3: "#6B7280", // Muted text
}

export const font = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
export const mono = "'DM Mono', 'JetBrains Mono', 'Courier New', monospace"

export const STATUS_MAP = {
    delivered: { color: T.green, bg: T.greenBg, label: "Delivered" },
    "in-transit": { color: T.blue, bg: T.blueBg, label: "In Transit" },
    dispatched: { color: T.amber, bg: T.amberBg, label: "Dispatched" },
}

export const ACT_DOT = { 
    green: T.green, 
    blue: T.blue, 
    amber: T.amber, 
    red: T.red,
    primary: T.primary 
}
