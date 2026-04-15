import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from "react";

// ═══════════════════════════════════════════════════════════════════
// EUROPE PAY CALCULATOR v1.0
// Net ↔ Gross ↔ Total Company Cost · 45+ Countries
// Command Center + Map Explorer · Charts · Comparison · SEO
// ═══════════════════════════════════════════════════════════════════

// ─── DESIGN SYSTEM (matching TVP glassmorphism) ─────────────────
const F = "'SF Pro Display',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif";
const FM = "'SF Mono','Fira Code',monospace";
const G = { blur: "blur(16px) saturate(1.4)", r: 24, rSm: 18, rXs: 14 };

const TH = {
  light: {
    bg: "#F2F1EE", sf: "#FAFAF8", tx: "#1A1A1A", t2: "#6B6B6B", t3: "#9B9B9B",
    ac: "#2563EB", ac2: "#7C3AED", gd: "linear-gradient(135deg,#2563EB,#7C3AED)",
    bd: "#E8E6E1", gbg: "rgba(255,255,255,0.72)", gbd: "rgba(232,230,225,0.6)",
    sh: "rgba(0,0,0,0.04)", sd: "0 2px 16px rgba(0,0,0,0.06)",
    sl: "0 8px 48px rgba(0,0,0,0.12)", sm: "0 1px 4px rgba(0,0,0,0.04)",
    al: "rgba(37,99,235,0.08)", wl: "#FFFBEB", wm: "#F59E0B",
    ht: "#DC2626", hc: "#FEE2E2",
    pos: "#10B981", neg: "#EF4444", warn: "#F59E0B",
    card: "rgba(255,255,255,0.85)",
  },
  dark: {
    bg: "#0F0F12", sf: "#1A1A20", tx: "#F0F0F0", t2: "#9B9BA0", t3: "#6B6B70",
    ac: "#818CF8", ac2: "#A78BFA", gd: "linear-gradient(135deg,#818CF8,#A78BFA)",
    bd: "#2A2A30", gbg: "rgba(26,26,32,0.82)", gbd: "rgba(42,42,48,0.6)",
    sh: "rgba(255,255,255,0.04)", sd: "0 2px 16px rgba(0,0,0,0.3)",
    sl: "0 8px 48px rgba(0,0,0,0.4)", sm: "0 1px 4px rgba(0,0,0,0.2)",
    al: "rgba(129,140,248,0.12)", wl: "#422006", wm: "#FBBF24",
    ht: "#F87171", hc: "#451A1A",
    pos: "#34D399", neg: "#F87171", warn: "#FBBF24",
    card: "rgba(26,26,32,0.9)",
  },
};

const CHART_COLORS = {
  net: "#10B981", tax: "#EF4444", empSocial: "#F59E0B", empTax: "#8B5CF6",
  employer: "#3B82F6", pension: "#6366F1", health: "#EC4899", unemployment: "#14B8A6",
  other: "#F97316", solidarity: "#A855F7",
};

// ─── COUNTRY DATA ───────────────────────────────────────────────
const COUNTRIES = [
  // EU-27
  { c: "AT", n: "Austria", f: "🇦🇹", cur: "EUR", grp: "EU", months: 14 },
  { c: "BE", n: "Belgium", f: "🇧🇪", cur: "EUR", grp: "EU" },
  { c: "BG", n: "Bulgaria", f: "🇧🇬", cur: "EUR", grp: "EU" },
  { c: "HR", n: "Croatia", f: "🇭🇷", cur: "EUR", grp: "EU" },
  { c: "CY", n: "Cyprus", f: "🇨🇾", cur: "EUR", grp: "EU" },
  { c: "CZ", n: "Czech Republic", f: "🇨🇿", cur: "CZK", grp: "EU", fx: 25.0 },
  { c: "DK", n: "Denmark", f: "🇩🇰", cur: "DKK", grp: "EU", fx: 7.46 },
  { c: "EE", n: "Estonia", f: "🇪🇪", cur: "EUR", grp: "EU" },
  { c: "FI", n: "Finland", f: "🇫🇮", cur: "EUR", grp: "EU" },
  { c: "FR", n: "France", f: "🇫🇷", cur: "EUR", grp: "EU" },
  { c: "DE", n: "Germany", f: "🇩🇪", cur: "EUR", grp: "EU" },
  { c: "GR", n: "Greece", f: "🇬🇷", cur: "EUR", grp: "EU" },
  { c: "HU", n: "Hungary", f: "🇭🇺", cur: "HUF", grp: "EU", fx: 395 },
  { c: "IE", n: "Ireland", f: "🇮🇪", cur: "EUR", grp: "EU" },
  { c: "IT", n: "Italy", f: "🇮🇹", cur: "EUR", grp: "EU" },
  { c: "LV", n: "Latvia", f: "🇱🇻", cur: "EUR", grp: "EU" },
  { c: "LT", n: "Lithuania", f: "🇱🇹", cur: "EUR", grp: "EU" },
  { c: "LU", n: "Luxembourg", f: "🇱🇺", cur: "EUR", grp: "EU" },
  { c: "MT", n: "Malta", f: "🇲🇹", cur: "EUR", grp: "EU" },
  { c: "NL", n: "Netherlands", f: "🇳🇱", cur: "EUR", grp: "EU" },
  { c: "PL", n: "Poland", f: "🇵🇱", cur: "PLN", grp: "EU", fx: 4.30 },
  { c: "PT", n: "Portugal", f: "🇵🇹", cur: "EUR", grp: "EU" },
  { c: "RO", n: "Romania", f: "🇷🇴", cur: "RON", grp: "EU", fx: 4.98 },
  { c: "SK", n: "Slovakia", f: "🇸🇰", cur: "EUR", grp: "EU" },
  { c: "SI", n: "Slovenia", f: "🇸🇮", cur: "EUR", grp: "EU" },
  { c: "ES", n: "Spain", f: "🇪🇸", cur: "EUR", grp: "EU" },
  { c: "SE", n: "Sweden", f: "🇸🇪", cur: "SEK", grp: "EU", fx: 11.0 },
  // EEA/EFTA
  { c: "IS", n: "Iceland", f: "🇮🇸", cur: "ISK", grp: "EEA", fx: 148 },
  { c: "LI", n: "Liechtenstein", f: "🇱🇮", cur: "CHF", grp: "EEA", fx: 0.94 },
  { c: "NO", n: "Norway", f: "🇳🇴", cur: "NOK", grp: "EEA", fx: 11.5 },
  { c: "CH", n: "Switzerland", f: "🇨🇭", cur: "CHF", grp: "EFTA", fx: 0.94 },
  // Other European
  { c: "GB", n: "United Kingdom", f: "🇬🇧", cur: "GBP", grp: "EUR", fx: 0.86 },
  { c: "UA", n: "Ukraine", f: "🇺🇦", cur: "UAH", grp: "EUR", fx: 41.0 },
  { c: "RS", n: "Serbia", f: "🇷🇸", cur: "RSD", grp: "EUR", fx: 117 },
  { c: "BA", n: "Bosnia & Herzegovina", f: "🇧🇦", cur: "BAM", grp: "EUR", fx: 1.96 },
  { c: "ME", n: "Montenegro", f: "🇲🇪", cur: "EUR", grp: "EUR" },
  { c: "MK", n: "North Macedonia", f: "🇲🇰", cur: "MKD", grp: "EUR", fx: 61.5 },
  { c: "AL", n: "Albania", f: "🇦🇱", cur: "ALL", grp: "EUR", fx: 100 },
  { c: "XK", n: "Kosovo", f: "🇽🇰", cur: "EUR", grp: "EUR" },
  { c: "MD", n: "Moldova", f: "🇲🇩", cur: "MDL", grp: "EUR", fx: 19.5 },
  { c: "TR", n: "Turkey", f: "🇹🇷", cur: "TRY", grp: "EUR", fx: 38.0 },
  { c: "BY", n: "Belarus", f: "🇧🇾", cur: "BYN", grp: "EUR", fx: 3.5 },
  // Gulf / Other
  { c: "SA", n: "Saudi Arabia", f: "🇸🇦", cur: "SAR", grp: "GULF", fx: 4.05 },
  { c: "AE", n: "United Arab Emirates", f: "🇦🇪", cur: "AED", grp: "GULF", fx: 3.97 },
  { c: "BH", n: "Bahrain", f: "🇧🇭", cur: "BHD", grp: "GULF", fx: 0.41 },
  { c: "KZ", n: "Kazakhstan", f: "🇰🇿", cur: "KZT", grp: "ASIA", fx: 480 },
];

// ─── TAX ENGINE ─────────────────────────────────────────────────
// Each country has: incomeTax(brackets), empSocial, employerSocial, deduction, solidarity
// All amounts in EUR (annual). Currencies converted at input.

const TAX_DATA = {
  // ═══ GERMANY ═══ (2025/2026)
  DE: {
    name: "Germany",
    brackets: [
      { up: 12096, rate: 0 },       // Grundfreibetrag 2025
      { up: 17443, rate: 0.14 },    // progressive zone 1
      { up: 68480, rate: 0.2397 },  // progressive zone 2
      { up: 277826, rate: 0.42 },
      { up: Infinity, rate: 0.45 },
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.093, cap: 101400 },    // 2025/26 cap
      health: { rate: 0.0875, cap: 69750 },     // 14.6%+2.9% avg / 2; cap 2025/26
      nursing: { rate: 0.0235, cap: 69750 },    // childless rate
      unemployment: { rate: 0.013, cap: 101400 },
    },
    employerSocial: {
      pension: { rate: 0.093, cap: 101400 },
      health: { rate: 0.0875, cap: 69750 },
      nursing: { rate: 0.018, cap: 69750 },
      unemployment: { rate: 0.013, cap: 101400 },
      accident: { rate: 0.0012, cap: Infinity },
    },
    solidarity: { rate: 0.055, threshold: 20350 },
  },

  // ═══ FRANCE ═══
  FR: {
    name: "France",
    brackets: [
      { up: 11294, rate: 0 },
      { up: 28797, rate: 0.11 },
      { up: 82341, rate: 0.30 },
      { up: 177106, rate: 0.41 },
      { up: Infinity, rate: 0.45 },
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.0690, cap: 46368 },    // base pension
      pensionComp: { rate: 0.0386, cap: 46368 }, // complementary T1
      pensionCompT2: { rate: 0.1083, capMin: 46368, cap: 370944 }, // T2
      health: { rate: 0.0, cap: 0 },  // Removed for employees
      unemployment: { rate: 0.024, cap: 46368 },
      csg: { rate: 0.092, cap: Infinity },  // CSG 9.2% on 98.25% of gross
      crds: { rate: 0.005, cap: Infinity },  // CRDS 0.5% on 98.25%
    },
    employerSocial: {
      health: { rate: 0.07, cap: Infinity },
      pension: { rate: 0.0855, cap: 46368 },
      pensionComp: { rate: 0.0601, cap: 46368 },
      pensionCompT2: { rate: 0.1268, capMin: 46368, cap: 370944 },
      unemployment: { rate: 0.0405, cap: 46368 },
      family: { rate: 0.0525, cap: Infinity },
      accident: { rate: 0.02, cap: Infinity },
      housing: { rate: 0.005, cap: Infinity },
      apprenticeship: { rate: 0.0068, cap: Infinity },
      transport: { rate: 0.03, cap: Infinity },
    },
  },

  // ═══ UNITED KINGDOM ═══ (2025/26)
  GB: {
    name: "United Kingdom",
    taxOnGross: true,  // UK taxes gross income, not gross minus NI
    brackets: [
      { up: 12570, rate: 0 },     // Personal Allowance
      { up: 50270, rate: 0.20 },   // Basic rate
      { up: 125140, rate: 0.40 },  // Higher rate
      { up: Infinity, rate: 0.45 }, // Additional rate
    ],
    deduction: 0,
    personalAllowanceTaper: { threshold: 100000, rate: 0.5 },
    empSocial: {
      ni: { rate: 0.08, floor: 12570, cap: 50270 },
      niUpper: { rate: 0.02, capMin: 50270, cap: Infinity },
    },
    employerSocial: {
      ni: { rate: 0.15, floor: 5000, cap: Infinity },  // 15% from Apr 2025
    },
  },

  // ═══ NETHERLANDS ═══ (2025/26)
  NL: {
    name: "Netherlands",
    taxOnGross: true, // NL box 1 combined rate applies to gross
    brackets: [
      { up: 38883, rate: 0.3575 },   // 2026 combined rate
      { up: 78426, rate: 0.3756 },
      { up: Infinity, rate: 0.495 },
    ],
    deduction: 3362,  // General tax credit (heffingskorting) - simplified
    empSocial: {
      health: { rate: 0.0549, cap: 78426 }, // Nominal ZVW
    },
    employerSocial: {
      health: { rate: 0.0651, cap: 78426 },
      unemployment: { rate: 0.0274, cap: 78426 },
      disability: { rate: 0.068, cap: 78426 },
      childcare: { rate: 0.005, cap: 78426 },
    },
  },

  // ═══ BELGIUM ═══ (2025/26)
  BE: {
    name: "Belgium",
    brackets: [
      { up: 15200, rate: 0.25 },
      { up: 26830, rate: 0.40 },
      { up: 46440, rate: 0.45 },
      { up: Infinity, rate: 0.50 },
    ],
    deduction: 10910,  // Tax-free sum 2025
    empSocial: {
      social: { rate: 0.1307, cap: Infinity },
    },
    employerSocial: {
      social: { rate: 0.2500, cap: Infinity },
    },
  },

  // ═══ AUSTRIA ═══
  AT: {
    name: "Austria",
    brackets: [
      { up: 13541, rate: 0 },
      { up: 21992, rate: 0.20 },
      { up: 36458, rate: 0.30 },
      { up: 70365, rate: 0.40 },
      { up: 104859, rate: 0.48 },
      { up: 1000000, rate: 0.50 },
      { up: Infinity, rate: 0.55 },
    ],
    deduction: 0,
    months: 14,
    empSocial: {
      pension: { rate: 0.1025, cap: 77400 },
      health: { rate: 0.0387, cap: 77400 },
      unemployment: { rate: 0.0295, cap: 77400 },
    },
    employerSocial: {
      pension: { rate: 0.1255, cap: 77400 },
      health: { rate: 0.0378, cap: 77400 },
      unemployment: { rate: 0.0295, cap: 77400 },
      accident: { rate: 0.011, cap: Infinity },
      severance: { rate: 0.0153, cap: Infinity },
      family: { rate: 0.037, cap: Infinity },
      municipal: { rate: 0.03, cap: Infinity },
      chamber: { rate: 0.004, cap: Infinity },
    },
  },

  // ═══ SPAIN ═══
  ES: {
    name: "Spain",
    brackets: [
      { up: 12450, rate: 0.19 },
      { up: 20200, rate: 0.24 },
      { up: 35200, rate: 0.30 },
      { up: 60000, rate: 0.37 },
      { up: 300000, rate: 0.45 },
      { up: Infinity, rate: 0.47 },
    ],
    deduction: 5550,  // Personal minimum
    empSocial: {
      social: { rate: 0.0635, cap: 56844 },  // 4.7% common + 1.55% unemployment + 0.1% training
    },
    employerSocial: {
      common: { rate: 0.2360, cap: 56844 },
      unemployment: { rate: 0.055, cap: 56844 },
      accident: { rate: 0.015, cap: 56844 },
      training: { rate: 0.006, cap: 56844 },
    },
  },

  // ═══ ITALY ═══
  IT: {
    name: "Italy",
    brackets: [
      { up: 28000, rate: 0.23 },
      { up: 50000, rate: 0.35 },
      { up: Infinity, rate: 0.43 },
    ],
    deduction: 1955,  // Employee deduction (simplified)
    empSocial: {
      pension: { rate: 0.0919, cap: 119650 },
      other: { rate: 0.01, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.2381, cap: 119650 },
      tfr: { rate: 0.007, cap: Infinity },  // Severance fund
      other: { rate: 0.05, cap: Infinity },  // Accident, illness, maternity
    },
  },

  // ═══ PORTUGAL ═══
  PT: {
    name: "Portugal",
    brackets: [
      { up: 7703, rate: 0.1325 },
      { up: 11623, rate: 0.18 },
      { up: 16472, rate: 0.23 },
      { up: 21321, rate: 0.26 },
      { up: 27146, rate: 0.3275 },
      { up: 39791, rate: 0.37 },
      { up: 51997, rate: 0.435 },
      { up: 81199, rate: 0.45 },
      { up: Infinity, rate: 0.48 },
    ],
    deduction: 4104,  // Standard deduction
    empSocial: {
      social: { rate: 0.11, cap: Infinity },
    },
    employerSocial: {
      social: { rate: 0.2375, cap: Infinity },
      accident: { rate: 0.0175, cap: Infinity },
    },
  },

  // ═══ POLAND ═══ (2025/26)
  PL: {
    name: "Poland",
    brackets: [
      { up: 120000, rate: 0.12 },
      { up: Infinity, rate: 0.32 },
    ],
    deduction: 30000,  // Tax-free amount (PIT-0)
    empSocial: {
      pension: { rate: 0.0976, cap: 282600 },   // 2026 cap
      disability: { rate: 0.015, cap: 282600 },
      sickness: { rate: 0.0245, cap: Infinity },
      health: { rate: 0.09, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.0976, cap: 282600 },
      disability: { rate: 0.065, cap: 282600 },
      accident: { rate: 0.0167, cap: Infinity },
      labor: { rate: 0.0245, cap: Infinity },
      fgsp: { rate: 0.001, cap: Infinity },
    },
  },

  // ═══ ROMANIA ═══
  RO: {
    name: "Romania",
    brackets: [
      { up: Infinity, rate: 0.10 },  // Flat 10% income tax
    ],
    deduction: 0,  // Personal deduction depends on dependents (simplified)
    empSocial: {
      pension: { rate: 0.25, cap: Infinity },  // CAS
      health: { rate: 0.10, cap: Infinity },    // CASS
    },
    employerSocial: {
      work: { rate: 0.0225, cap: Infinity },  // CAM (work insurance)
    },
  },

  // ═══ SWEDEN ═══
  SE: {
    name: "Sweden",
    brackets: [
      { up: 614942, rate: 0.32 },   // Municipal tax (avg ~32%)
      { up: Infinity, rate: 0.52 },  // Municipal + state (32% + 20%)
    ],
    deduction: 16800,  // Basic allowance (simplified)
    empSocial: {
      social: { rate: 0.07, cap: Infinity },  // General pension contribution 7%
    },
    employerSocial: {
      social: { rate: 0.3142, cap: Infinity }, // 31.42% payroll tax
    },
  },

  // ═══ DENMARK ═══
  DK: {
    name: "Denmark",
    brackets: [
      { up: 588900, rate: 0.3712 },  // Bottom tax (~12.09%) + municipal (~24.97%) + health (~0.06%)
      { up: Infinity, rate: 0.5209 }, // + top bracket 15% (capped at 52.07%)
    ],
    deduction: 49700,  // Personal allowance
    laborMarketRate: 0.08,  // AM-bidrag
    empSocial: {
      laborMarket: { rate: 0.08, cap: Infinity },  // Deducted before tax calculation
    },
    employerSocial: {
      atp: { rate: 0.015, cap: Infinity },  // ~DKK 8,000/year flat
      pension: { rate: 0.08, cap: Infinity }, // Typical employer pension
    },
  },

  // ═══ FINLAND ═══
  FI: {
    name: "Finland",
    brackets: [
      { up: 20500, rate: 0 },     // State tax threshold
      { up: 30500, rate: 0.06 },
      { up: 50400, rate: 0.1725 },
      { up: 88200, rate: 0.2125 },
      { up: 150000, rate: 0.3125 },
      { up: Infinity, rate: 0.4375 },
    ],
    municipalRate: 0.0784,  // Average municipal tax ~7.84% on top
    deduction: 0,
    empSocial: {
      pension: { rate: 0.0715, cap: Infinity },
      unemployment: { rate: 0.0079, cap: Infinity },
      health: { rate: 0.0187, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.2485, cap: Infinity },
      unemployment: { rate: 0.0092, cap: Infinity },
      health: { rate: 0.0187, cap: Infinity },
      accident: { rate: 0.007, cap: Infinity },
    },
  },

  // ═══ NORWAY ═══
  NO: {
    name: "Norway",
    brackets: [
      { up: 208050, rate: 0 },
      { up: 292850, rate: 0.017 },
      { up: 670000, rate: 0.04 },
      { up: 937900, rate: 0.136 },
      { up: 1350000, rate: 0.166 },
      { up: Infinity, rate: 0.176 },
    ],
    municipalRate: 0.22,  // Flat 22% on ordinary income
    deduction: 109950,  // Personal allowance (minstefradrag)
    empSocial: {
      social: { rate: 0.078, cap: Infinity },
    },
    employerSocial: {
      social: { rate: 0.141, cap: Infinity },
    },
  },

  // ═══ SWITZERLAND ═══
  CH: {
    name: "Switzerland",
    brackets: [
      { up: 18800, rate: 0 },
      { up: 31600, rate: 0.0077 },
      { up: 41400, rate: 0.0088 },
      { up: 55200, rate: 0.0264 },
      { up: 72700, rate: 0.0297 },
      { up: 78100, rate: 0.0561 },
      { up: 103600, rate: 0.0624 },
      { up: 134600, rate: 0.0668 },
      { up: 176000, rate: 0.0891 },
      { up: 755200, rate: 0.1000 },
      { up: Infinity, rate: 0.115 },
    ],
    cantonalRate: 0.12,  // Approximate cantonal + municipal (varies 10-15%)
    deduction: 0,
    empSocial: {
      ahv: { rate: 0.053, cap: Infinity },    // AHV/IV/EO
      alv: { rate: 0.011, cap: 148200 },      // Unemployment
      pension: { rate: 0.075, cap: Infinity }, // 2nd pillar (avg)
    },
    employerSocial: {
      ahv: { rate: 0.053, cap: Infinity },
      alv: { rate: 0.011, cap: 148200 },
      accident: { rate: 0.02, cap: Infinity },
      pension: { rate: 0.075, cap: Infinity },
    },
  },

  // ═══ IRELAND ═══ (2025/26)
  IE: {
    name: "Ireland",
    taxOnGross: true,  // IE taxes gross income, PRSI is separate
    brackets: [
      { up: 44000, rate: 0.20 },
      { up: Infinity, rate: 0.40 },
    ],
    deduction: 3750,  // Personal credit €1,875 + PAYE credit €1,875
    usc: [
      { up: 12012, rate: 0.005 },
      { up: 25760, rate: 0.02 },
      { up: 70044, rate: 0.04 },
      { up: Infinity, rate: 0.08 },
    ],
    empSocial: {
      prsi: { rate: 0.042, cap: Infinity },  // 4.2% from Oct 2025
    },
    employerSocial: {
      prsi: { rate: 0.1125, cap: Infinity },
    },
  },

  // ═══ LUXEMBOURG ═══
  LU: {
    name: "Luxembourg",
    brackets: [
      { up: 12438, rate: 0 },
      { up: 14508, rate: 0.08 },
      { up: 16578, rate: 0.10 },
      { up: 18648, rate: 0.12 },
      { up: 20718, rate: 0.14 },
      { up: 22788, rate: 0.16 },
      { up: 24939, rate: 0.18 },
      { up: 27090, rate: 0.20 },
      { up: 29241, rate: 0.22 },
      { up: 31392, rate: 0.24 },
      { up: 33543, rate: 0.26 },
      { up: 35694, rate: 0.28 },
      { up: 37845, rate: 0.30 },
      { up: 39996, rate: 0.32 },
      { up: 42147, rate: 0.34 },
      { up: 44298, rate: 0.36 },
      { up: 46449, rate: 0.38 },
      { up: 110403, rate: 0.39 },
      { up: 165159, rate: 0.40 },
      { up: 220788, rate: 0.41 },
      { up: Infinity, rate: 0.42 },
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.08, cap: 143243 },
      health: { rate: 0.028, cap: 143243 },
      nursing: { rate: 0.014, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.08, cap: 143243 },
      health: { rate: 0.028, cap: 143243 },
      accident: { rate: 0.007, cap: Infinity },
      mutual: { rate: 0.025, cap: Infinity },
    },
  },

  // ═══ CZECH REPUBLIC ═══
  CZ: {
    name: "Czech Republic",
    brackets: [
      { up: 1935552, rate: 0.15 },
      { up: Infinity, rate: 0.23 },
    ],
    deduction: 30840,  // Basic taxpayer allowance (CZK)
    empSocial: {
      pension: { rate: 0.065, cap: 2234736 },
      health: { rate: 0.045, cap: Infinity },
      sickness: { rate: 0.0, cap: 0 },  // Employee doesn't pay
    },
    employerSocial: {
      pension: { rate: 0.215, cap: 2234736 },
      health: { rate: 0.09, cap: Infinity },
      sickness: { rate: 0.021, cap: 2234736 },
    },
  },

  // ═══ HUNGARY ═══
  HU: {
    name: "Hungary",
    taxOnGross: true,  // PIT on gross, social is separate
    brackets: [
      { up: Infinity, rate: 0.15 },  // Flat 15%
    ],
    deduction: 0,
    empSocial: {
      social: { rate: 0.185, cap: Infinity },  // 18.5% unified
    },
    employerSocial: {
      social: { rate: 0.13, cap: Infinity },  // 13% social contribution tax
    },
  },

  // ═══ GREECE ═══
  GR: {
    name: "Greece",
    brackets: [
      { up: 10000, rate: 0.09 },
      { up: 20000, rate: 0.22 },
      { up: 30000, rate: 0.28 },
      { up: 40000, rate: 0.36 },
      { up: Infinity, rate: 0.44 },
    ],
    deduction: 777,  // Tax reduction for income up to €20k
    solidarityAbolished: true,  // Abolished since 2023
    empSocial: {
      social: { rate: 0.1337, cap: 90780 },
    },
    employerSocial: {
      social: { rate: 0.2179, cap: 90780 },
    },
  },

  // ═══ BULGARIA ═══
  BG: {
    name: "Bulgaria",
    brackets: [
      { up: Infinity, rate: 0.10 },  // Flat 10%
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.1058, cap: 49560 },  // EUR (~BGN 96,960)
      health: { rate: 0.032, cap: 49560 },
      unemployment: { rate: 0.004, cap: 49560 },
    },
    employerSocial: {
      pension: { rate: 0.1482, cap: 49560 },
      health: { rate: 0.048, cap: 49560 },
      unemployment: { rate: 0.006, cap: 49560 },
      accident: { rate: 0.005, cap: 49560 },
    },
  },

  // ═══ CROATIA ═══
  HR: {
    name: "Croatia",
    brackets: [
      { up: 50400, rate: 0.20 },
      { up: Infinity, rate: 0.30 },
    ],
    deduction: 5880,  // Personal allowance
    empSocial: {
      pension1: { rate: 0.15, cap: Infinity },
      pension2: { rate: 0.05, cap: Infinity },
    },
    employerSocial: {
      health: { rate: 0.165, cap: Infinity },
    },
  },

  // ═══ SLOVAKIA ═══
  SK: {
    name: "Slovakia",
    brackets: [
      { up: 47537, rate: 0.19 },
      { up: Infinity, rate: 0.25 },
    ],
    deduction: 5646,  // Nontaxable amount
    empSocial: {
      pension: { rate: 0.04, cap: 96600 },
      disability: { rate: 0.03, cap: 96600 },
      sickness: { rate: 0.014, cap: 96600 },
      unemployment: { rate: 0.01, cap: 96600 },
      health: { rate: 0.04, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.14, cap: 96600 },
      disability: { rate: 0.03, cap: 96600 },
      sickness: { rate: 0.014, cap: 96600 },
      unemployment: { rate: 0.01, cap: 96600 },
      guarantee: { rate: 0.0025, cap: 96600 },
      accident: { rate: 0.008, cap: 96600 },
      reserve: { rate: 0.0475, cap: 96600 },
      health: { rate: 0.11, cap: Infinity },
    },
  },

  // ═══ SLOVENIA ═══
  SI: {
    name: "Slovenia",
    brackets: [
      { up: 9063, rate: 0.16 },
      { up: 27188, rate: 0.26 },
      { up: 54375, rate: 0.33 },
      { up: 78750, rate: 0.39 },
      { up: Infinity, rate: 0.50 },
    ],
    deduction: 4420,  // General personal allowance
    empSocial: {
      pension: { rate: 0.154, cap: 82346 },
      health: { rate: 0.0636, cap: 82346 },
      unemployment: { rate: 0.0014, cap: 82346 },
      parental: { rate: 0.001, cap: 82346 },
    },
    employerSocial: {
      pension: { rate: 0.0856, cap: 82346 },
      health: { rate: 0.066, cap: 82346 },
      unemployment: { rate: 0.0006, cap: 82346 },
      accident: { rate: 0.0053, cap: 82346 },
      parental: { rate: 0.001, cap: 82346 },
    },
  },

  // ═══ CYPRUS ═══
  CY: {
    name: "Cyprus",
    brackets: [
      { up: 19500, rate: 0 },
      { up: 28000, rate: 0.20 },
      { up: 36300, rate: 0.25 },
      { up: 60000, rate: 0.30 },
      { up: Infinity, rate: 0.35 },
    ],
    deduction: 0,
    empSocial: {
      social: { rate: 0.088, cap: 62868 },
      gesy: { rate: 0.029, cap: 180000 },
    },
    employerSocial: {
      social: { rate: 0.088, cap: 62868 },
      gesy: { rate: 0.029, cap: 180000 },
      redundancy: { rate: 0.012, cap: 62868 },
      hrda: { rate: 0.005, cap: 62868 },
      cohesion: { rate: 0.02, cap: Infinity },
    },
  },

  // ═══ ESTONIA ═══
  EE: {
    name: "Estonia",
    brackets: [
      { up: Infinity, rate: 0.20 },  // Flat 20%
    ],
    deduction: 7848,  // Basic exemption (income-dependent, max €7,848)
    empSocial: {
      unemployment: { rate: 0.016, cap: Infinity },
      pension: { rate: 0.02, cap: Infinity },  // 2nd pillar
    },
    employerSocial: {
      social: { rate: 0.33, cap: Infinity },  // 33% social tax
      unemployment: { rate: 0.008, cap: Infinity },
    },
  },

  // ═══ LATVIA ═══
  LV: {
    name: "Latvia",
    brackets: [
      { up: 20004, rate: 0.20 },
      { up: 78100, rate: 0.23 },
      { up: Infinity, rate: 0.31 },
    ],
    deduction: 6000,  // Non-taxable minimum (depends on income)
    empSocial: {
      social: { rate: 0.105, cap: 105300 },
    },
    employerSocial: {
      social: { rate: 0.2359, cap: 105300 },
    },
  },

  // ═══ LITHUANIA ═══
  LT: {
    name: "Lithuania",
    brackets: [
      { up: 101094, rate: 0.20 },
      { up: Infinity, rate: 0.32 },
    ],
    deduction: 6060,  // Monthly non-taxable income (simplified annual)
    empSocial: {
      pension: { rate: 0.0303, cap: Infinity },
      health: { rate: 0.0698, cap: Infinity },
    },
    employerSocial: {
      social: { rate: 0.0177, cap: Infinity },  // Accident/guaranty
      pension: { rate: 0.015, cap: Infinity },
    },
  },

  // ═══ MALTA ═══
  MT: {
    name: "Malta",
    brackets: [
      { up: 9100, rate: 0 },
      { up: 14500, rate: 0.15 },
      { up: 19500, rate: 0.25 },
      { up: 60000, rate: 0.25 },
      { up: Infinity, rate: 0.35 },
    ],
    deduction: 0,
    empSocial: {
      social: { rate: 0.10, cap: 28068 },
    },
    employerSocial: {
      social: { rate: 0.10, cap: 28068 },
    },
  },

  // ═══ ICELAND ═══
  IS: {
    name: "Iceland",
    brackets: [
      { up: 4803255, rate: 0.3148 },  // ISK (municipal 14.48% + state 17%)
      { up: 13476636, rate: 0.3798 },
      { up: Infinity, rate: 0.4628 },
    ],
    deduction: 878124,  // Personal tax credit (ISK)
    empSocial: {
      pension: { rate: 0.04, cap: Infinity },
    },
    employerSocial: {
      social: { rate: 0.0635, cap: Infinity },
      pension: { rate: 0.115, cap: Infinity },
    },
  },

  // ═══ LIECHTENSTEIN ═══
  LI: {
    name: "Liechtenstein",
    brackets: [
      { up: 25000, rate: 0.02 },
      { up: 50000, rate: 0.06 },
      { up: 75000, rate: 0.065 },
      { up: Infinity, rate: 0.08 },
    ],
    deduction: 0,
    empSocial: {
      ahv: { rate: 0.045, cap: Infinity },
    },
    employerSocial: {
      ahv: { rate: 0.045, cap: Infinity },
      pension: { rate: 0.05, cap: Infinity },
    },
  },

  // ═══ UKRAINE ═══
  UA: {
    name: "Ukraine",
    taxOnGross: true,  // PIT on gross
    brackets: [
      { up: Infinity, rate: 0.18 },  // Flat 18% PIT
    ],
    militarySurcharge: 0.015,  // 1.5% military levy
    deduction: 0,
    empSocial: {
      social: { rate: 0.0, cap: 0 },
    },
    employerSocial: {
      usc: { rate: 0.22, cap: Infinity },  // Unified social contribution
    },
  },

  // ═══ SERBIA ═══
  RS: {
    name: "Serbia",
    brackets: [
      { up: Infinity, rate: 0.10 },  // Flat 10%
    ],
    deduction: 25000,  // Nontaxable amount (RSD)
    empSocial: {
      pension: { rate: 0.14, cap: Infinity },
      health: { rate: 0.0515, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.10, cap: Infinity },
      health: { rate: 0.0515, cap: Infinity },
      unemployment: { rate: 0.0075, cap: Infinity },
    },
  },

  // ═══ BOSNIA & HERZEGOVINA ═══
  BA: {
    name: "Bosnia & Herzegovina",
    brackets: [
      { up: Infinity, rate: 0.10 },
    ],
    deduction: 3600,
    empSocial: {
      pension: { rate: 0.17, cap: Infinity },
      health: { rate: 0.125, cap: Infinity },
      unemployment: { rate: 0.015, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.06, cap: Infinity },
      health: { rate: 0.04, cap: Infinity },
      unemployment: { rate: 0.005, cap: Infinity },
    },
  },

  // ═══ MONTENEGRO ═══
  ME: {
    name: "Montenegro",
    brackets: [
      { up: 8400, rate: 0.09 },
      { up: Infinity, rate: 0.15 },
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.15, cap: Infinity },
      health: { rate: 0.085, cap: Infinity },
      unemployment: { rate: 0.005, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.055, cap: Infinity },
      health: { rate: 0.0, cap: 0 },
      unemployment: { rate: 0.005, cap: Infinity },
    },
  },

  // ═══ NORTH MACEDONIA ═══
  MK: {
    name: "North Macedonia",
    brackets: [
      { up: Infinity, rate: 0.10 },
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.188, cap: Infinity },
      health: { rate: 0.075, cap: Infinity },
      unemployment: { rate: 0.012, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.0, cap: 0 },  // Paid fully by employee from gross
      health: { rate: 0.075, cap: Infinity },
      unemployment: { rate: 0.012, cap: Infinity },
    },
  },

  // ═══ ALBANIA ═══
  AL: {
    name: "Albania",
    brackets: [
      { up: 50000, rate: 0 },
      { up: 60000, rate: 0.13 },
      { up: Infinity, rate: 0.23 },
    ],
    deduction: 0,
    empSocial: {
      social: { rate: 0.095, cap: Infinity },
      health: { rate: 0.017, cap: Infinity },
    },
    employerSocial: {
      social: { rate: 0.15, cap: Infinity },
      health: { rate: 0.017, cap: Infinity },
    },
  },

  // ═══ KOSOVO ═══
  XK: {
    name: "Kosovo",
    brackets: [
      { up: 960, rate: 0 },
      { up: 3000, rate: 0.04 },
      { up: 5400, rate: 0.08 },
      { up: Infinity, rate: 0.10 },
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.05, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.05, cap: Infinity },
    },
  },

  // ═══ MOLDOVA ═══
  MD: {
    name: "Moldova",
    brackets: [
      { up: 40200, rate: 0.12 },
      { up: Infinity, rate: 0.12 },
    ],
    deduction: 31140,  // Personal exemption (MDL)
    empSocial: {
      social: { rate: 0.06, cap: Infinity },
      health: { rate: 0.09, cap: Infinity },
    },
    employerSocial: {
      social: { rate: 0.18, cap: Infinity },
      health: { rate: 0.0, cap: 0 },
    },
  },

  // ═══ TURKEY ═══
  TR: {
    name: "Turkey",
    brackets: [
      { up: 110000, rate: 0.15 },
      { up: 230000, rate: 0.20 },
      { up: 870000, rate: 0.27 },
      { up: 3000000, rate: 0.35 },
      { up: Infinity, rate: 0.40 },
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.09, cap: Infinity },
      health: { rate: 0.05, cap: Infinity },
      unemployment: { rate: 0.01, cap: Infinity },
    },
    employerSocial: {
      pension: { rate: 0.11, cap: Infinity },
      health: { rate: 0.075, cap: Infinity },
      unemployment: { rate: 0.02, cap: Infinity },
    },
  },

  // ═══ BELARUS ═══
  BY: {
    name: "Belarus",
    brackets: [
      { up: Infinity, rate: 0.13 },
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.01, cap: Infinity },
    },
    employerSocial: {
      social: { rate: 0.34, cap: Infinity },
      accident: { rate: 0.006, cap: Infinity },
    },
  },

  // ═══ SAUDI ARABIA ═══
  SA: {
    name: "Saudi Arabia",
    brackets: [
      { up: Infinity, rate: 0 },  // No income tax for individuals
    ],
    deduction: 0,
    empSocial: {
      gosi: { rate: 0.10, cap: 540000 },  // SAR ~540k cap
    },
    employerSocial: {
      gosi: { rate: 0.12, cap: 540000 },  // 9.75% annuity + 2% hazard
    },
  },

  // ═══ UAE ═══
  AE: {
    name: "United Arab Emirates",
    brackets: [
      { up: Infinity, rate: 0 },  // No income tax
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.05, cap: Infinity },  // UAE nationals only; expats: 0
    },
    employerSocial: {
      pension: { rate: 0.125, cap: Infinity }, // UAE nationals; expats: ~0
    },
  },

  // ═══ BAHRAIN ═══
  BH: {
    name: "Bahrain",
    brackets: [
      { up: Infinity, rate: 0 },
    ],
    deduction: 0,
    empSocial: {
      social: { rate: 0.08, cap: Infinity },  // 7% pension + 1% unemployment
    },
    employerSocial: {
      social: { rate: 0.12, cap: Infinity },  // 12% (pension + unemployment)
    },
  },

  // ═══ KAZAKHSTAN ═══
  KZ: {
    name: "Kazakhstan",
    brackets: [
      { up: Infinity, rate: 0.10 },
    ],
    deduction: 0,
    empSocial: {
      pension: { rate: 0.10, cap: 3750000 },  // KZT
      social: { rate: 0.015, cap: Infinity },
      health: { rate: 0.02, cap: Infinity },
    },
    employerSocial: {
      social: { rate: 0.035, cap: Infinity },  // 3.5% compulsory pension
      health: { rate: 0.03, cap: Infinity },
    },
  },
};

// ─── CALCULATION ENGINE ─────────────────────────────────────────

function calcProgressiveTax(income, brackets) {
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (income <= prev) break;
    const taxable = Math.min(income, b.up) - prev;
    tax += taxable * b.rate;
    prev = b.up;
  }
  return tax;
}

function calcSocialContrib(gross, socialDef) {
  let total = 0;
  const breakdown = {};
  for (const [key, def] of Object.entries(socialDef)) {
    if (!def || def.rate === 0) { breakdown[key] = 0; continue; }
    const floor = def.floor || 0;
    const capMin = def.capMin || 0;
    let base = gross;
    if (capMin > 0) base = Math.max(0, Math.min(gross, def.cap) - capMin);
    else base = Math.max(0, Math.min(gross, def.cap || Infinity) - floor);
    const amount = base * def.rate;
    breakdown[key] = amount;
    total += amount;
  }
  return { total, breakdown };
}

function calculateCountry(countryCode, inputAmount, direction = "grossToNet") {
  const td = TAX_DATA[countryCode];
  if (!td) return null;
  const co = COUNTRIES.find(c => c.c === countryCode);
  if (!co) return null;

  const fx = co.fx || 1; // EUR to local currency rate
  let grossEUR; // Input/output always in EUR

  if (direction === "grossToNet") {
    grossEUR = inputAmount;
  } else if (direction === "netToGross") {
    grossEUR = solveForGross(countryCode, inputAmount, "net");
  } else if (direction === "totalToNet") {
    grossEUR = solveForGross(countryCode, inputAmount, "total");
  }

  // Convert to local currency for all bracket/cap calculations
  const gross = grossEUR * fx;

  // Employee social contributions (calculated in local currency)
  let empSocialDef = td.empSocial || {};
  if (countryCode === "FR") {
    empSocialDef = { ...td.empSocial };
    if (empSocialDef.csg) empSocialDef.csg = { ...empSocialDef.csg, rate: 0.092 * 0.9825 };
    if (empSocialDef.crds) empSocialDef.crds = { ...empSocialDef.crds, rate: 0.005 * 0.9825 };
  }
  const empSoc = calcSocialContrib(gross, empSocialDef);

  // Taxable income (in local currency)
  let taxableIncome;
  if (td.taxOnGross) {
    taxableIncome = gross;
  } else {
    taxableIncome = gross - empSoc.total;
  }

  // Apply deduction / personal allowance (credits handled separately below)
  if (td.deduction && countryCode !== "IE" && countryCode !== "IT" && countryCode !== "NL") {
    taxableIncome = Math.max(0, taxableIncome - td.deduction);
  }

  // Special: Denmark labor market contribution (AM-bidrag deducted before tax)
  if (td.laborMarketRate) {
    const amBidrag = gross * td.laborMarketRate;
    taxableIncome = gross - amBidrag;
    if (td.deduction) taxableIncome = Math.max(0, taxableIncome - td.deduction);
  }

  // Income tax (in local currency)
  let incomeTax = calcProgressiveTax(taxableIncome, td.brackets);

  // Special: Ireland USC (on gross income)
  if (td.usc) {
    incomeTax += calcProgressiveTax(gross, td.usc);
  }

  // Special: Finland municipal tax
  if (td.municipalRate && countryCode === "FI") {
    incomeTax += Math.max(0, taxableIncome) * td.municipalRate;
  }

  // Special: Norway — bracket tax + flat 22% on ordinary income
  if (countryCode === "NO") {
    incomeTax += Math.max(0, taxableIncome) * td.municipalRate;
  }

  // Special: Switzerland cantonal tax
  if (td.cantonalRate) {
    incomeTax += Math.max(0, taxableIncome) * td.cantonalRate;
  }

  // Special: UK personal allowance taper (income > £100k)
  if (td.personalAllowanceTaper && gross > td.personalAllowanceTaper.threshold) {
    const excess = gross - td.personalAllowanceTaper.threshold;
    const paReduction = Math.min(12570, excess * td.personalAllowanceTaper.rate);
    const adjustedBrackets = JSON.parse(JSON.stringify(td.brackets));
    adjustedBrackets[0].up = Math.max(0, 12570 - paReduction);
    incomeTax = calcProgressiveTax(gross, adjustedBrackets);
  }

  // Apply tax credits (deducted from computed tax, not taxable income)
  if (countryCode === "IE") incomeTax = Math.max(0, incomeTax - td.deduction);
  if (countryCode === "IT") incomeTax = Math.max(0, incomeTax - td.deduction);
  if (countryCode === "NL") incomeTax = Math.max(0, incomeTax - td.deduction);

  // Solidarity surcharge (Germany)
  let solidarityTax = 0;
  if (td.solidarity && incomeTax > td.solidarity.threshold) {
    solidarityTax = (incomeTax - td.solidarity.threshold) * td.solidarity.rate;
  }

  // Ukraine military surcharge
  if (td.militarySurcharge) {
    solidarityTax = gross * td.militarySurcharge;
  }

  // Total employee deductions (in local currency)
  const totalEmployeeDeductions = empSoc.total + incomeTax + solidarityTax;

  // Special: Denmark AM-bidrag
  let laborMarketContrib = 0;
  if (td.laborMarketRate) {
    laborMarketContrib = gross * td.laborMarketRate;
  }

  const netLocal = gross - totalEmployeeDeductions - laborMarketContrib;

  // Employer social contributions (in local currency)
  const emplerSoc = calcSocialContrib(gross, td.employerSocial || {});
  const totalCompanyCostLocal = gross + emplerSoc.total;

  // Convert all results back to EUR for display
  const toEUR = (v) => v / fx;
  const grossEUROut = toEUR(gross);
  const netEUR = toEUR(Math.max(0, netLocal));
  const incomeTaxEUR = toEUR(incomeTax);
  const solidarityTaxEUR = toEUR(solidarityTax);
  const laborContribEUR = toEUR(laborMarketContrib);
  const empSocEUR = toEUR(empSoc.total);
  const emplerSocEUR = toEUR(emplerSoc.total);
  const totalCostEUR = toEUR(totalCompanyCostLocal);

  // Convert breakdowns to EUR
  const empBreakdownEUR = {};
  for (const [k, v] of Object.entries(empSoc.breakdown)) empBreakdownEUR[k] = toEUR(v);
  const emplerBreakdownEUR = {};
  for (const [k, v] of Object.entries(emplerSoc.breakdown)) emplerBreakdownEUR[k] = toEUR(v);

  return {
    country: countryCode,
    countryName: co.n,
    flag: co.f,
    currency: co.cur,
    fx,
    gross: grossEUROut,
    net: netEUR,
    incomeTax: incomeTaxEUR,
    solidarityTax: solidarityTaxEUR,
    laborMarketContrib: laborContribEUR,
    employeeSocial: empSocEUR,
    employeeSocialBreakdown: empBreakdownEUR,
    employerSocial: emplerSocEUR,
    employerSocialBreakdown: emplerBreakdownEUR,
    totalCompanyCost: totalCostEUR,
    // Percentages based on gross (currency-independent)
    effectiveTaxRate: gross > 0 ? ((gross - Math.max(0, netLocal)) / gross * 100) : 0,
    employerBurdenPct: gross > 0 ? (emplerSoc.total / gross * 100) : 0,
    netPct: gross > 0 ? (Math.max(0, netLocal) / gross * 100) : 0,
    taxPct: gross > 0 ? (incomeTax / gross * 100) : 0,
    socialPct: gross > 0 ? (empSoc.total / gross * 100) : 0,
    months: co.months || 12,
  };
}

function solveForGross(countryCode, targetAmount, targetType) {
  // Newton-style iterative approach
  let lo = 0, hi = targetAmount * 4;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const result = calculateCountry(countryCode, mid, "grossToNet");
    if (!result) return mid;
    const computed = targetType === "net" ? result.net : result.totalCompanyCost;
    if (Math.abs(computed - targetAmount) < 0.5) return mid;
    if (computed < targetAmount) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ─── SVG MAP PATHS (Natural Earth projected) ─────────────────
const MAP_PATHS = {
  AE: "M802.5 686.3L803.3 692.6L800.4 694.8L799.8 692.8L798.1 693.2L797.5 699.4L799.7 700.8L794.8 702.2L791.6 714.3L768 711.5L758.9 700.5L759.2 698.6L762 701.8L768.8 700.2L780.3 701L785 699.1L800.5 682.5L802.5 686.3ZM780.6 700L777.9 700.1L780.6 700Z",
  AL: "M461.6 520.8L461.1 517.4L465 511.9L472.5 517.4L472.2 527.5L477.2 534.8L473.8 540.4L470.6 541.9L469.6 545.5L461.5 537.2L463.8 523.4L461.6 520.8Z",
  AT: "M371.1 456.8L371.1 453.6L373.2 453L377.2 456.7L379.5 453.3L385.1 455.3L395.9 451.2L403.3 454.2L401.4 445.6L406.6 443.1L407.5 440.4L409.8 440.8L410.7 437.9L412.8 440L418.7 440.1L421.5 434.9L439 438.7L438.8 442.8L441.4 447.6L440.7 451.3L434.7 451.8L437.1 453.5L434.9 455.2L435.1 459.9L430.4 464.1L420.6 465L417.4 467.5L398.4 464.2L395.5 459.1L387 460.5L384 463L378.7 460.3L376.7 462L371.6 459.5L371.1 456.8Z",
  BA: "M460.3 501.7L458.3 501.6L458.8 504.5L457.1 503.9L453.5 507.9L453.5 512.9L446.2 509.1L442.4 502.4L434.3 495.6L428.4 487.2L428.9 482.3L433.5 484.3L439.3 481.1L461.7 485.8L459.6 492L463.9 496.1L460.7 496.7L463.1 500.4L460.3 501.7Z",
  BE: "M322.2 403.5L329.7 402.4L331.3 405L337 407L335.5 411.3L340.8 414.1L341.9 417.8L336.2 423L336.7 428L334 428.3L328.2 424.7L327.7 419.9L325.2 422.5L321.8 422.5L320.6 417.7L317.3 417.9L311.9 411.7L309.4 412.6L307.2 410.4L306.5 407.4L313 404L319.2 405.9L322.2 403.5Z",
  BG: "M541.6 519.7L537.2 520.2L534.5 518.3L528.7 519.7L524 522.4L524.3 526.3L522.3 527.1L516.2 527.9L509.1 524.3L494.6 526.8L495.4 522.3L489.3 515.7L491.1 513.8L490.5 509.7L495.2 505.7L490.8 501.9L489.8 496.6L492.7 493.5L495.6 495.3L494.6 498.2L518.4 500.1L530.9 494.6L540.4 496.4L546.9 499.3L546.7 502.1L542.7 503.3L540.5 510.8L536.8 514L541.6 519.7Z",
  BH: "M750 684.2L748.7 683.4L749.6 680.7L750 684.2Z",
  BY: "M576.2 393.8L569.9 394.1L566.9 396.6L565 405.2L561.4 402.3L553.9 403.6L551.7 400.2L548.2 402.9L543.2 400.5L538.7 402.3L533.6 398.5L521.1 396.2L508 397L501 401.7L501.4 394.6L497 391.2L503.7 385.4L499.9 368L507.5 368.7L518.1 362.9L518.6 364.8L520.7 364.9L518.9 362.4L521 355.1L530.2 348.6L527.3 347.6L528.5 342.7L531.8 340.5L537.6 340.7L541.8 335.7L546.7 336.3L548.8 338.6L553.4 338.2L555.2 342.5L562.1 340.1L568.3 344.2L567.4 348.1L569 351.9L567.2 355.5L570.6 358.1L569.9 360L572.9 364.3L576.8 366.7L576.1 369.9L582.5 371.5L584.9 375.4L579.7 380L573 378.6L571.5 381.1L574.4 384.7L576.2 393.8Z",
  CH: "M371.1 453.6L370.8 459.4L376.7 462L378.7 460.3L379.7 461.4L379.5 465.7L376 465.7L376.7 469.5L374.4 467.9L371.1 468.7L369.1 466.4L365.8 474.5L360.9 467L355.1 473.4L348.3 473.6L345.6 467.3L341.6 467.6L338.3 470.6L339.8 465.5L347.4 456.8L347.5 454.5L361 452.8L362.3 450.5L371.1 453.6Z",
  CY: "M585 593.1L597.3 595L594.1 595.1L587.7 599.3L582.5 597.6L581.3 595.3L585 593.1Z",
  CZ: "M457 428.3L450.8 431.6L447 436.4L441.3 437L439.6 440.1L436.4 437.7L431.4 438.1L421.5 434.9L418.7 440.1L414.1 440.3L400.2 429.6L397.5 425.4L398.7 423.3L394.8 417.9L396.5 419.6L399 416.8L415.8 410.1L415 408.3L419 411.2L421.5 408.5L430.9 413.9L434.1 413.8L432.8 416.4L436.7 420.6L440 418.8L438.9 416.3L446.7 418L445.5 420.1L454.5 423.5L457 428.3Z",
  DE: "M371.1 453.6L362.3 450.5L361 452.8L353 452.6L353.5 445.7L358.3 435.3L345.4 432.9L341.8 429.1L343.1 424.6L339.6 421.5L341.7 416L337.3 408.3L339.8 406.7L340.4 403.2L338.1 397.9L345.4 396.4L348 391.5L345 387.9L348 386.4L349.5 381.8L348.3 376L349.7 372.1L357.1 371.6L358 374.7L360.1 372.8L361.6 375.8L362.8 368.9L368.2 369.2L373.5 373.5L366 368.2L365.4 363.4L363 362.9L365.9 359.4L363.2 354L372 354.7L375.7 357.4L374.3 360.3L382.2 362.6L384.8 361.7L383.9 367.2L388.4 367.9L399.3 360.4L409.8 364.9L411.1 369.2L414.8 371L416.2 378.5L413.6 383L418.1 387.9L419.3 394.2L417.9 397.5L421.8 405.3L419.4 411.1L415.3 408.2L415.8 410.1L399 416.8L396.5 419.6L394.8 417.9L398.7 423.3L397.5 425.4L399.7 429L410.7 437.9L409.8 440.8L407.5 440.4L406.6 443.1L400.9 446.3L403.3 454.2L395.9 451.2L385.1 455.3L379.5 453.3L377.2 456.7L375.2 453.9L371.1 453.6ZM409.7 361.6L409.7 363.1L404.9 362.5L405.4 357.9L407.1 357L409.7 361.6Z",
  DK: "M373.1 355.2L363.2 354L362.7 346.4L358.2 343.7L358.5 328.5L363.2 330.2L365.2 326.5L368.1 327L368.6 322.3L366.2 322.2L364.2 326.7L361.4 327.6L359.5 326.2L361 322.7L362.8 320.7L370.3 319.7L375.1 313.4L381.1 310.9L378.1 328.3L384 331L382.5 334.1L378.9 333.9L377.2 339.8L374.6 340.1L375.5 341.7L371.7 345.3L372.5 348.7L370.5 352L372.6 352.6L373.1 355.2ZM399.2 341L395.9 345.7L397.8 348.4L394.8 349.8L394.4 355.3L392.7 355.9L390.8 349.9L386.3 347.8L384.5 341.9L387.7 341.5L390.5 338.4L392.3 342.3L392.7 338.2L396 335.9L399.3 336.7L399.2 341ZM381.4 343.6L382.7 350.7L379.6 351.9L375.4 350.2L374.2 345L381.4 343.6ZM388 354.2L391.5 355.4L391.8 357.3L388.9 358L385 355.9L385.2 353.5L388 354.2ZM422.4 352.3L418.7 351.1L419.4 348.2L422.8 350.5L422.4 352.3ZM382.3 356.3L381.2 354.8L384.2 350.3L382.3 356.3Z",
  EE: "M535.5 314.2L532 312.9L527.3 314L517 306.1L507.6 308.8L509.5 301.1L505.7 302.5L502.5 301L500.1 296.2L501.7 294.1L499.4 291.9L500 287.4L505.4 285.8L508.1 282.8L517.9 282L518.5 280.1L532 283.2L541.6 282.6L542.9 284.5L536.3 294.1L536.9 303.2L539.5 308.8L535.5 314.2ZM491.9 296.8L498.4 299.5L489.6 303.3L486.1 307.9L487.9 304.3L485.1 302.6L484.9 298.8L491.9 296.8ZM494.7 293.4L491.2 295.7L490 292.9L486.7 291.5L492.2 289.2L494.7 293.4ZM498.6 297.9L496 296.9L498.5 296.4L498.6 297.9Z",
  ES: "M266.7 503.2L270.3 505.1L270.1 507.5L282.9 511.5L289.1 511.5L290.3 509.7L295.7 511.4L296.9 514.4L312.9 514.4L313.2 520L302.5 527.4L292.8 529.9L289.8 532.6L291.5 533.7L288.7 534.9L280.2 546.9L281.4 551.9L285.1 555.2L278.5 560L276.1 567.7L268.1 569.9L263.1 576.7L243 577L235.6 580.1L232.9 583.7L229.7 583.6L224.4 577.8L225.9 574.9L224.3 575.8L219.9 571L214.9 572.1L214 567.8L219.1 561.4L215.5 558.5L218.7 552L213.7 545.4L218.4 544.8L218.4 539.8L220.4 537.9L219.5 530.2L225.7 523.8L222.9 523L222.2 520L207.9 521.4L207 517.8L201.6 520.1L203.1 516.2L202 512L199.9 512.6L200.9 510.2L198.1 508.1L198.6 505.9L212.2 499L218.1 501.5L229.3 500.4L241.5 503.1L250 501.9L255.2 503.6L266.7 503.2ZM312.3 544L315.2 545L311.6 549.3L305.1 546.4L310 542.7L312.8 542.1L312.3 544ZM132.6 660.5L129.6 664.1L127.3 660.9L134.5 658.6L132.6 660.5Z",
  FI: "M506 166.1L501.6 154.2L504.5 145L501.3 138.2L502.2 131.8L499.6 131L501.3 120L494 110.6L486.1 107.1L473.5 95.1L477.9 94.7L477.5 90.9L482.4 89.4L490 102.5L498.4 104.1L504.6 100.6L513.3 105.4L520.7 96.2L523.2 80.3L527.9 73.9L533.5 74.2L540.5 70.3L545.3 76.2L552 79.9L553.8 84.7L549.3 91.7L550.4 95.4L545.3 98.2L548.7 100.3L545.8 107.8L547.8 114.7L553.9 117.5L559.8 125.9L551.3 143.3L560.8 166.5L560.8 168.7L557.3 169.8L556.3 177.5L558.4 179.5L556.3 183.1L561 187.8L559.8 191.9L564.8 200.6L559.9 207.1L570.9 217.1L574.1 223.1L568.6 233.4L539.6 264.9L528 267L528.6 263.3L526.6 266.8L522.6 265.9L523.4 268.2L520.8 269.5L519.9 268.3L508.7 273.6L499.7 274.2L495.6 277.1L497.2 273.6L494.6 270.4L492.6 273.4L490.4 273.5L491.6 267.5L480.7 263.1L482.5 246.5L479.3 239.4L480.1 234.2L478 226.7L481.3 220.3L483 220.2L482 217.1L489.1 215.1L489.1 211.5L500.9 201.3L509.8 186.4L516.5 185.2L517 172.8L510.9 168.9L510.4 165L506 166.1Z",
  FR: "M353.5 452.8L351 454.8L347.5 454.5L338.3 469.8L345.8 467.4L348 473.3L346 475.9L349.2 479.9L344.4 483.6L347.8 486.5L346.4 490.3L347.5 493L353.7 494.3L352.4 499L339.6 507L329.9 502.7L326.7 503.6L319.3 501.4L311.4 508.9L312.9 514.4L302 515.3L299 512.4L290.3 509.7L289.1 511.5L282.9 511.5L269.6 507.1L270.3 505.1L266.7 503.2L269.6 501.4L273.3 488.1L271.8 488.4L273.3 478.1L278.2 484.4L276 478.8L272.2 475.9L273.7 475.5L272.7 468.6L266.8 466.1L264.2 462.5L263.4 457.4L267.2 457.5L260.2 456.3L260.9 454.3L257.5 452.4L243.5 449.9L240.1 447.2L243.3 445.5L241 444L244.1 443.8L239.3 442L241.5 439.8L253.5 437L258.4 440.9L260.7 439.4L270.6 439.4L266.1 426.1L271.6 426.2L272.7 429.9L281.7 431.1L287.1 429.2L284.4 428.4L285 425.9L294.7 422L297.9 418.6L298.7 410.3L306.5 407.4L309.4 412.6L311.9 411.7L317.3 417.9L321.8 418.7L321.8 422.5L325.2 422.5L327.7 419.9L328.2 424.7L334 428.3L340.8 428.6L345.4 432.9L358.3 435.3L353.5 445.7L353.5 452.8ZM370.7 510.1L371.4 517.5L368 526.3L364.5 524L362.3 515.3L364.6 512.4L369.2 511.2L369.6 507.7L370.7 510.1ZM797.9 720L792.7 720L797.9 720Z",
  GB: "M258.6 400.3L252.9 403.5L244.2 401L245.5 399.8L242.8 398.7L238 400.3L234.7 396.8L245 390.7L246.5 387.7L245.4 382.5L240.1 384L243.3 379.8L248.5 377L254.7 377.7L255 375.3L257.9 377L255 374.1L256.8 364.6L254 365.3L250.1 359L255.2 353.3L250.5 353.4L246.7 355.8L238.8 354.9L237.9 357.2L235.9 354.7L240.1 345.2L238.1 342.3L238.7 338.8L241 338.7L238.6 337L239 335.3L235.2 339.4L237.1 334.2L233.6 337.4L232 346.9L230 347.2L235.4 326.2L231.1 329.7L226.7 326.8L230.4 324.7L229.2 323.9L232 318.8L229.6 315.7L231.8 313.9L230.7 310.3L231.5 308.7L235.7 308.7L233.3 305.6L234 303L237 302.6L237.3 297.4L242.4 298.5L255.1 296.6L253.6 301.6L246.4 307.4L246 309.1L247.7 309.6L245.1 313.4L251.9 311.4L264.1 311.5L266.9 314.8L260.2 328.1L252.7 332.2L256.6 331.7L258.6 333.9L252.3 337.3L248.3 336.3L263.4 339.2L268 344.2L271.9 357L282.5 365.4L281.3 366.8L284.3 372.7L277.2 371.1L280.5 371.5L285.8 376.6L286.5 379.1L283.7 382.6L285.8 384L288.4 381.8L293 381.9L299.1 385.8L297.6 394L294.6 395.6L294.2 397.9L290.2 398.9L291.5 401L287.2 402.4L296.3 403.8L296.2 406.3L292.1 409.7L285.1 411.9L270.2 410.1L269.3 412.1L264.5 412.4L264.5 414L255.6 412.5L251.9 413.6L249.3 418.8L244.6 416.8L239.6 418.1L236.1 421.5L231.4 421.3L244.6 406.2L254.3 405.9L258.6 400.3ZM225.9 365.9L221.9 366.3L218.2 361.2L215.7 365.2L213.1 365.1L208.1 360.6L211.4 358.9L210.3 357L213.6 356L215.2 352.2L219.2 349.9L226.7 349.4L230.5 355.3L229 357.9L231.8 357.5L232.8 359.9L230.9 359.2L231.5 363.2L227.8 366.4L225.9 365.9ZM226.1 300.9L222.8 305.3L224 306.4L218.6 310.5L220 308L217.9 303.8L221.2 303.7L220.7 301.9L225.7 298.7L226.1 300.9ZM226.6 314.6L226.7 317.6L231 318.9L228 321.8L227.6 319.3L224.9 319.3L220.9 315.5L225.1 311.9L226.6 314.6ZM271.2 264.9L273.5 266.5L271.3 276L271 270.8L267.9 269.6L270.6 268.3L268.9 265.2L270.7 263.6L271.2 264.9ZM230 332.5L225 333.3L226.6 330.3L225.1 328.6L227 327.9L230.1 330.3L230 332.5Z",
  GR: "M526 522.5L528.8 526.1L526.1 527.9L524.1 533.4L514.8 530.6L502.4 533.4L503.4 537L507.8 540L502.1 538L504.1 542.1L499.3 538.8L501.6 542.1L499 541.8L498.3 539.3L494.4 537.3L494.7 535.1L492 536.2L491.6 541.3L498.4 550.7L496.8 551.5L496.9 549.8L494.6 549.3L496 552.2L491.4 554L504.3 560.4L505.1 566.5L500 563L495.7 564.7L499.9 569.3L496.9 570.5L492.9 568.3L496.9 579.8L493.4 576.2L490.1 579.5L486.9 573.7L485.2 576.8L482.3 573.1L483.2 569.9L478.3 564.2L484.6 559.9L494.6 563.8L497.1 561.9L490.1 558.7L481.3 559.9L480 558.1L478.6 559.7L474.8 554L478 553.7L478 552.3L474.9 552.5L470.5 549L467.7 544.9L469.6 545.5L470.6 541.9L473.8 540.4L477.2 534.8L476.6 532.2L482.3 532L486.1 529.1L490.7 529.3L493.4 526.9L505.1 524.7L509.1 524.3L516.2 527.9L522.3 527.1L524.3 526.3L524 522.4L526 522.5ZM503.2 589.3L506.1 588.7L507.5 591.1L520.6 591.2L521.1 593.6L526 591.6L524.6 594.6L512 595.5L508.9 593.2L500.9 592.2L500.7 589.3L503.2 589.3ZM499.2 553L505.8 556.4L509.6 563.6L497.7 554.7L494.3 554.3L499.2 553ZM526.9 549L527.4 552.9L524.5 552.3L525.6 550.4L523.7 551.6L521.6 550.4L526.9 549ZM540.1 585.2L538.9 582.7L543.7 579.9L540.1 585.2ZM523.9 561L521.9 560.5L521.6 557.2L524.5 557.6L523.9 561Z",
  HR: "M408.5 478.2L415.8 478.7L417.8 476.6L420.2 478.9L424.7 478.9L424.2 475.6L427.8 473.6L427.2 470.3L433.8 465.9L447.5 474.9L452.6 475.4L457.6 473.2L458.6 479.7L462.2 482.2L459.7 482.1L458.6 486L455.4 483.5L439.3 481.1L433.5 484.3L428.9 482.3L428.4 487.2L434.3 495.6L442.4 502.4L445.4 508.6L439.2 503.3L430.7 501.9L423.3 494.2L425.9 493.1L421.4 489.1L420.3 483.5L417.4 480.9L415.3 480.4L411.1 486.4L408.5 478.2ZM453.3 512.9L440.5 507.7L447.4 509L453.3 512.9ZM416.9 488.5L415.7 482.4L416.9 488.5ZM419.8 484.7L416.5 483.5L417.6 481.7L419.8 484.7ZM438.1 504.8L434.7 504.2L438.1 504.8ZM441.9 506.4L434.3 505.4L441.9 506.4Z",
  HU: "M487.4 442.5L494.2 448.3L486.1 453.9L477.3 469.5L464.2 470.3L453.3 475.2L448.9 475.2L442.9 472.5L431.7 461.8L435 460.1L434.9 455.2L437.1 453.5L434.7 451.8L440.7 451.3L441.4 447.6L447.1 450.6L456 450.3L457.7 447L464.3 444.9L467.3 445.8L472.2 441L481.1 440.7L484 443.4L487.4 442.5Z",
  IE: "M216.7 351.3L213.6 356L210.3 357L211.4 358.9L208.1 360.6L213.1 365.1L215.7 365.2L218.2 361.2L221.9 366.3L226.3 366.4L224.7 368L227.7 382.3L223.6 390.4L224.9 391.8L219.7 393L219 391.7L208.9 397.5L205.7 396.7L206.2 398.7L202 400.8L192.5 402.2L195.4 399.5L189.9 400.6L194.7 396.9L187.9 397.9L191.9 393.5L187.7 392.3L193.1 391.7L191.9 389.6L194.4 387.6L202.3 385.8L200.3 384.7L191.8 387.3L197.5 379.9L200.9 378.4L190.2 375.5L189.9 373.6L193.6 372.8L191.9 371L194.9 369.9L191.8 369.1L192.4 365.8L190.2 364L204.4 363.7L203.7 362.1L208.2 357.9L202.4 357.3L206 354.2L206.9 350.5L212.5 348.8L212.6 353L215.8 347.2L219.1 349.1L216.7 351.3Z",
  IS: "M139.9 157.3L148.6 154.1L143.8 160L147.7 161.7L146.5 167L150.5 166.5L149.8 170.9L152.6 169.5L157.7 172L155.9 175.3L157.8 181.7L155.5 182.6L153.7 187.6L150.6 187.5L149.8 192.5L145.6 195.9L137.2 198.6L129.8 204.6L118.9 207.5L117.7 210.9L111.2 213.3L97 210.5L94.2 208L95 205.8L92.8 207.1L88.2 203.1L85.4 204.8L74.3 205.3L73.9 200.4L75.6 202.2L78.6 201.3L85.3 194.7L79.9 196L80.8 192L84.1 189.9L78.9 191.6L76 186.5L67.9 185.9L63.6 187.6L61.8 184.5L73.1 181.5L81.3 181.5L82.4 178.7L80 180L75.6 178.5L81.8 173.4L72 170.8L62.8 174.3L57.5 171.9L59.6 170.1L63.2 171.6L61 166.7L65.4 168.7L68.5 167.3L63.4 165.2L66.3 164.6L64 161.2L67.1 161.6L65.6 160.2L66.9 158.4L70.5 160.3L70.9 162.5L74.2 161.6L74.6 164.8L76.3 164L76.2 160.7L71.6 157.7L75.9 156.6L70 155.1L72.1 152.9L76.4 153.1L85.8 161.6L86.1 167.5L83.5 167.8L88.4 177.1L91.4 169.6L94.6 170.9L96.9 160L103.5 166.9L104.5 160.5L109.4 158.3L115.9 167.6L114.5 158.8L118.1 159.1L121.4 162.9L125.1 157.9L127.9 159.5L131.2 158L130.7 152.8L133.4 151.2L135.8 151.4L139.9 157.3Z",
  IT: "M348 473.3L355.1 473.4L360.9 467L366.5 474.3L368.7 466.6L376.7 469.5L376 465.7L379.5 465.7L379.7 461.8L384.6 462.9L387 460.5L395.5 459.1L397.5 463.8L409.6 466.1L406.7 469.2L409 470.3L407.6 472.3L411.2 477.1L405.1 475.2L396.5 479.1L396 481.6L398.8 484.8L396.2 487.7L397.6 493.6L407.9 500.8L412.5 511.5L417.4 516.5L423.2 520.1L432.4 520.5L430 523.6L430.9 525.7L448.9 534.4L453.5 539.2L452.4 543.6L448 538.6L439.4 536.6L435.6 544.4L441.1 548.5L441.7 552.6L436.5 554.8L435.8 559L431.4 564L428.3 564L427.5 561.5L432.8 553.2L428 541.8L421.1 539L419.4 534.3L415.5 535L416.6 533.6L412.8 532.7L409.9 527.9L403.5 527.6L390.6 516L386 514.9L386.3 513.2L380.2 508.3L375.9 496L364.1 491.3L357.1 497.7L352.4 499L353.7 494.3L347.5 493L346.4 490.3L347.8 486.5L344.4 483.6L349.2 479.9L345.9 475.5L348 473.3ZM426.9 561L422.5 569.1L424.3 573L422.6 577.3L417.5 576.4L398 565.3L400.7 561.4L402.3 563L406.4 561.4L410.4 563.6L426.9 561ZM372.1 531.9L373.7 536.1L371.5 550.8L366.8 550L365.9 553L363 553.4L360.9 550.4L362.1 543.4L359.1 531.5L362.3 532.2L368.4 527.7L372.1 531.9Z",
  KZ: "M937.6 516.5L921.1 525.8L914.2 534.8L910.9 532.7L909.8 528.4L898.5 528.6L896.6 519.4L892.1 519.3L892.9 508L890.2 509.3L881.9 499.6L877.6 501.5L866.2 500.6L855 502.2L845.9 491.6L823.3 477.8L799.5 484.5L799.6 527L794.5 527.3L789.2 519.7L782.4 515.5L772.6 517.6L767.4 521.8L768.4 510.6L761.9 509.4L759.3 506.1L756.4 505.9L756.2 501.7L752.1 494L746.7 491.5L748.2 488.9L758.7 490L753.7 485.4L757.5 480.2L773.9 480.5L770 477.6L773.3 470.1L772.7 461.9L767.3 460.3L764.1 462.3L755.3 458.8L738.4 466.1L737.3 468.3L731.4 465.4L730.8 463.4L734.8 462.9L727.5 451.3L719.4 450.9L717.3 444.7L713.6 442.5L714 437.5L717 433L714.9 430.2L715.7 425.9L722.3 416.5L729.1 423.8L733 422.9L731.7 413.9L747.3 404.4L751.7 398.9L757.3 402.4L764.9 399.1L768.1 402.2L775.2 402.2L784.1 409.9L786.4 414.9L787.2 408.6L796.9 414.3L804.3 408.4L809.1 407.8L813.1 410.2L816.6 407.5L821.5 407.9L832.3 415.5L837.2 410.7L839.3 412.7L845.3 412.8L849.5 410.6L851 404.4L840.9 399.9L836.9 396.1L845.3 391.3L843.8 385.8L846.3 381.7L855.9 381.2L847.7 377.3L848 375L850.8 373.9L845.7 372.5L847.2 367.6L859.7 367L877.8 361.6L883.6 362.2L887.2 358.1L911.9 353L912.3 350.3L919.5 346.9L930.6 350.2L935.7 348.1L939.8 358.5L939 364.1L947.4 364.2L949 362.5L951.4 368L953.1 365.2L959.1 367.8L962.7 366.2L959.4 371.3L960.3 375L964.5 372.6L969 374.5L969.9 372.2L974.9 369.7L975 360.8L975 517.2L975 508.2L975 510L967.7 505.1L961.7 507.8L961.1 514.7L945.1 509.9L940.5 510.9L937.6 516.5Z",
  LI: "M371.6 459.5L371.1 456.8L371.6 459.5Z",
  LT: "M493.2 362L493.8 354.5L491.4 351.7L479.1 348.7L477.4 336.7L483 333L494.2 331.7L505.7 333.7L512.4 331.5L514.5 334.7L519.9 336.1L528.5 342.7L527.3 347.6L530.2 348.6L521 355.1L518.9 362.4L520.7 364.9L518.6 364.8L518.1 362.9L512.6 365.1L511.7 367.5L500.6 368.3L498.8 364.3L493.2 362Z",
  LU: "M339.7 420.4L343.1 424.6L341.8 429.1L336.7 428L336.2 423L338.4 419.8L339.7 420.4Z",
  LV: "M528.5 342.7L519.9 336.1L514.5 334.7L512.4 331.5L505.7 333.7L486.5 331.6L477.4 336.7L477.6 325.2L483.7 313.5L491.3 311.1L498 321.1L504 322.3L508.1 318.6L507.6 308.8L517 306.1L527.3 314L532 312.9L536.6 314.3L539.9 317.9L538.2 324.8L540.1 324.7L542.5 329.4L542.9 335.6L537.6 340.7L531.8 340.5L528.5 342.7Z",
  MD: "M528.8 444.4L537.3 441.6L551.9 448.1L552 454.1L555.7 456.8L556 460.6L561.2 467.3L550.3 466.8L550.2 471.8L546.1 478.2L543.5 479L542.2 477.3L543.7 464.6L542.2 460.4L532.1 445.7L528.8 444.4Z",
  ME: "M460.3 501.7L470.9 509.6L468.2 510.6L468.3 513.1L465.8 513.9L464.5 512.2L461.1 517.4L461.6 520.8L453.3 513.4L453.5 507.9L457.1 503.9L458.8 504.5L458.3 501.6L460.3 501.7Z",
  MK: "M482.1 516.5L488.7 515.3L493.5 519L495.4 522.3L494.7 526.6L482.3 532L474.6 531.6L472.2 527.5L472.8 520.9L474.9 518.5L482.1 516.5Z",
  MT: "M417.6 586L415.6 584.7L417.6 586ZM415.3 584.2L414 583.9L415.3 584.2Z",
  NL: "M338.5 412L335.3 410.8L336.7 406.6L331.3 405L329.7 402.4L324.8 402.3L323.6 403.9L315.1 401.4L322.7 402.4L319.7 397.8L324.6 390.9L327.2 382.1L329.9 381.9L337.4 376L346.1 375.1L349.6 377.3L348.1 386.2L345.1 386.9L348 391.5L345.4 396.4L338.1 397.9L340.4 402.1L339.8 406.7L337.3 408.3L338.5 412ZM322.2 403.5L319.2 405.9L314.9 405.4L314.1 403.6L322.2 403.5ZM319.7 398.7L319.7 400.2L317.4 399.1L319.7 398.7ZM328.3 380.3L326.7 380.8L328.3 378.7L328.3 380.3Z",
  NO: "M473.5 95.1L468.8 95.4L470.9 99.5L467.4 106.6L469.9 108.1L467.5 110.9L452.1 106.3L448.5 119.7L443 116.6L438.1 121.3L436.1 127.4L432 131.7L434.5 139.8L425.5 151.9L426.1 155.7L417.4 159.4L416.8 176.4L409.1 190.7L413.1 193.1L413 200.2L412 201.8L405 200.6L401.2 202L395.5 209.8L393.9 215.5L396.7 234.1L395.4 244.2L402 250.7L400.2 256.1L396.7 256.8L399.4 266.4L398.4 272.2L391 280.8L392.1 285.8L390.7 291.8L389.1 292.1L388.1 288.9L383.2 287.6L381 278L377.1 290.5L374 291.3L371.4 288.8L372 291.5L358.6 304.5L352.1 306.4L347.9 306.4L346.7 304.3L344 305.2L344.7 302.6L339.1 300.8L334.1 295.1L335 290.4L339.5 292.7L341.9 290.6L339.5 291.4L337.6 289L338.2 285.7L342.3 281.4L332.7 287.9L330.6 286.9L332.2 280L340.6 277.1L336.1 276.3L339.9 270.1L343.4 267.1L343.4 271.4L347.8 265.3L340 268.1L330.7 280.1L331.3 272.5L335.7 271.9L332 270.5L330.6 266.5L335.3 262.3L331.6 264.3L330.5 263.2L329.5 256.2L345.8 254.4L348.2 257.7L348.2 255.3L353.4 253.2L351.5 253L351.9 249.3L349.4 254L344.1 251.8L342.1 254.5L333.5 255.1L330.4 253.6L329.4 249.3L332.5 248.4L329.3 245.6L328.7 241.4L338.8 243L345.3 241.5L331.8 240.4L330.7 236.3L332.7 236.5L337.8 231.7L343.9 231.9L345 230.7L339.8 231.8L341.8 228.1L352.4 229.4L354.2 228.6L352.8 227L357.9 225.9L345.4 226.1L347.3 222.2L353.1 219.1L358 219.3L362.8 223.8L358.5 217.9L359.5 215.6L362.9 214.6L360.4 211.6L363.3 209.2L367.5 209.8L367.7 212.4L372.7 209.2L375.7 213.6L382.5 212.3L382.2 209.2L388.1 205.8L386.3 204L388.9 202L386.7 201.4L383.9 203.6L384.1 206.4L376 211.3L373.4 207.8L371.8 208.2L371.9 206L380.7 193.9L389.6 187.5L390.6 186.1L387.4 187.3L389.2 182.9L395.4 178.9L398.6 180.5L402.4 175.7L397.8 178.8L395.2 176.8L400.3 164.1L403.5 163L401.2 160L409.4 158.4L412.7 155.9L404.3 157.3L405.1 148.7L408.9 145.4L412 145.4L409.2 143L413.4 138.4L425.4 136.6L416.5 135.1L421.3 128.4L427.1 133.4L428 129.6L423.9 127.8L424.4 124.2L420.3 126.5L419.7 123.2L422.8 119.6L427.3 120.1L424.5 117.4L430.9 113.8L433.7 121.6L432.7 111.7L434.4 110.1L439.6 110.9L445.1 109.2L436.2 108.3L435.6 106.8L443.6 100.6L446.5 93.6L450.2 92.2L451.7 84.7L457.2 88.5L454.9 84.2L458.4 82.6L460.3 78L464.8 76.6L464.4 85.9L467.4 76.2L470.7 73.2L468.7 87.8L472.2 83L474.5 83.5L472.6 79.4L473.5 73.9L478.4 74.6L480.9 71.5L485.9 75.9L484.4 70.2L480.2 66L489.1 65.3L492.5 62.5L498.7 72.2L498.4 66.7L508.5 54.2L507 51.1L510.7 46.5L516.3 50.6L517.9 48.9L520.9 50.4L513.8 66.4L514.2 69.1L515.8 68.5L527.7 48.8L529.1 48.2L529.8 50.4L528.4 61.6L532.2 59.1L534 53.2L537.3 51.6L534.5 47.9L537.8 44.2L545.1 47.2L544.5 51.1L540.6 54.8L544 55.1L543.3 65.7L549.2 50.1L551.7 50.2L557.5 55.6L560.6 54.2L561.9 58.3L565.4 58.8L568.5 61.9L568.7 65L562.4 68.8L548.7 68.2L556.3 72.4L557.1 78.1L560.8 78.8L562.2 75.2L563.9 78.7L564.4 76.9L568 77.2L567.9 83.1L561.4 80.9L560.8 85.7L554.3 88.9L550.4 95.4L549.3 91.7L553.8 84.7L552 79.9L539.2 70.3L533.5 74.2L528.4 73.6L523.7 79.4L520.7 96.2L513.3 105.4L504.6 100.6L498.4 104.1L490 102.5L482.4 89.4L477.5 90.9L477.9 94.7L473.5 95.1ZM438.1 20L381.8 20L438.1 20ZM476 20L534.1 20L476 20ZM482.6 20L512.9 20L482.6 20ZM428.6 106.2L432.2 99.6L434.7 99.6L435.6 104.5L430.6 109.8L425.6 111.9L424.7 110.3L418.2 114.5L414.8 114.6L414.8 113.1L417.8 109.8L422.5 108.9L425.4 104.9L426 94.9L431.3 88.8L428.6 106.2ZM444.7 81.7L449.8 85L448.8 91.3L444.5 91.3L440.8 95.6L438.3 93.7L440.1 87.3L443.4 86.9L442.2 84.6L444.7 81.7Z",
  PL: "M501 401.7L505.5 410.4L505.4 415L492.7 427.1L493.6 434.7L482.8 429.6L471.1 430L468.2 432.6L465.5 432.3L462.6 427.2L458.2 429.8L454.5 423.5L445.5 420.1L446.7 418L438.9 416.3L440 418.8L436.7 420.6L432.8 416.4L434.7 414.4L433.4 413.3L430.9 413.9L421.5 408.5L419.8 410.6L421.8 405.3L417.9 397.5L419.3 394.2L418.1 387.9L413.6 383L416.2 378.5L414.8 371L417.7 372.3L417.5 369.7L414.3 367.8L432.6 363L436 359.1L450.1 355L456.3 357.2L453.3 356.3L455.4 360.9L458.3 362.1L464.1 360.5L495.2 361.8L499.6 365.1L503.6 380.9L503.7 385.4L497 391.2L501.4 394.6L501 401.7Z",
  PT: "M202.3 520L207 517.8L207.9 521.4L222.2 520L222.9 523L226 524.6L219.5 530.2L220.4 537.9L218.4 539.8L218.4 544.8L213.7 545.4L218.7 552L215.5 558.5L219.1 561.4L214 567.8L214.9 572.1L211 573.9L200.3 573.6L202 569.4L201.4 558.6L203.3 558.8L198.5 558.7L197.9 556.3L202.2 551.7L199 555.4L195.9 555.5L203.1 533.3L202.3 520ZM46.7 565.1L51 565.1L48.6 566.4L46.7 565.1ZM124.7 616.5L129.3 617.6L126.3 618.6L124.7 616.5ZM33.5 556.4L30.7 555.1L33.5 556.4Z",
  RO: "M543.5 479L548.5 481.6L554.4 479.4L557.2 481.3L555.9 486.3L551.2 487.3L551.6 484.7L549.7 485.4L546.9 499.3L533.1 494.3L518.4 500.1L494.6 498.2L495.6 495.3L490.7 491.1L492.8 489.1L490.8 487.9L487 489.9L480.3 486.5L481.9 485.6L480.2 484.5L481.5 482.7L476.4 480.1L474.9 475.4L469.9 471.1L478.1 469L486.1 453.9L496.7 446.6L510 448.5L513.6 451.2L524.6 447.8L525.9 445.1L529.6 444.3L542.2 460.4L543.7 464.6L542.2 477.3L543.5 479Z",
  RS: "M492.7 493.5L489.6 498.8L495.1 506.2L490.5 509.7L490.1 515.6L482.1 516.5L483.9 511.7L480.5 510.7L475.1 504.9L470.9 509.9L460.5 502.7L463.1 500.4L460.7 496.7L463.9 495.8L459.7 492.4L461.8 486.1L458.6 486L459.1 482.8L462.2 481.9L458.6 479.7L457.6 473.2L464.2 470.3L469.6 470.9L474.9 475.4L476.4 480.1L481.5 482.7L480.2 484.5L481.9 485.6L480.3 486.5L487 489.9L492.1 488.6L493 489.5L490.7 491.1L492.7 493.5Z",
  SA: "M762.7 720L642.8 720L643.5 714.6L638 704.3L629.5 699L626.2 694.1L625.9 689.7L607.7 663.8L602.6 663.5L605.6 651.1L615.9 652.6L621.8 646.5L628.9 644.9L633.5 640L624.1 630.2L644.3 623.9L655.6 625.8L671.3 634.3L695.4 652.6L720.7 654.6L722.9 659L730.1 659L733.3 666.8L745.8 676.8L744.5 676.7L746.4 680.2L744.7 682L752.3 695.4L757.4 696.4L756.5 698.5L758.9 699L768 711.5L792.3 713.6L796.4 720L762.7 720Z",
  SE: "M388.3 290L390.7 291.8L392.1 285.8L391 280.8L398.4 272.2L399.4 266.4L396.7 256.8L400.2 256.1L402 250.7L395.4 244.2L396.7 234.1L393.9 215.5L395.5 209.8L401.2 202L405 200.6L412 201.8L413.7 198.7L413.1 193.1L409.1 190.7L416.8 176.4L417.4 159.4L426.1 155.7L425.5 151.9L434.5 139.8L432 131.7L436.1 127.4L438.1 121.3L443 116.6L448.5 119.7L452.1 106.3L467.5 110.9L469.9 108.1L467.4 106.6L470.9 99.5L468.8 95.4L473.5 95.1L486.1 107.1L494 110.6L501.3 120L499.6 131L502.2 131.8L501.3 138.2L504.5 145L501.6 154.2L506 166.1L496.3 167.6L493.1 164.8L491.1 166.4L489.5 165.4L488.5 170.4L482.2 174.3L482.6 177.2L480.7 176.1L482.2 180L478.2 186.3L481.7 193.1L474.8 204.6L465.2 212.3L461.8 212L458.8 216.5L454.9 217.6L452.1 221L453.9 221.2L453.5 222.9L450.9 224.8L448.2 223.3L449.6 228.3L446 231L443.8 230L445.9 235L443.5 241.6L444.3 244.8L441.9 244.1L441.3 246.8L442.4 262.1L446.1 264.9L448.9 264L456.5 272.6L458.2 278.1L449 284.7L454.4 284.1L451.9 288.8L439.9 296.2L432.8 296.5L439.4 298.9L436.8 299.8L437.9 303.3L434.6 325.4L430.1 335.2L419.6 335.3L419.3 337.2L414.8 339.4L415.5 344.8L414 346.8L402.1 346.5L402.9 341.5L398.3 333.3L401.3 333.7L400 331.1L401.8 330.9L402.1 328.4L397.8 323.9L388.7 301.3L387 300.9L386.2 289.9L388.3 290ZM459.2 309.4L456.8 311.4L457.7 316.3L450.6 323.7L451.9 321.2L450.5 313.8L454.2 309.4L457.6 308.1L459.2 309.4Z",
  SI: "M435.6 466.3L427.2 470.3L427.8 473.6L424.2 475.6L424.7 478.9L420.2 478.9L417.8 476.6L415.8 478.7L408.5 478.2L411.2 477.1L407.6 472.3L409 470.3L406.7 469.2L409.6 466.1L417.4 467.5L420.6 465L430.4 464.1L431.7 461.8L433.5 461.9L435.6 466.3Z",
  SK: "M491.1 434L487.2 442.7L483.6 443.3L481.1 440.7L472.2 441L467.3 445.8L464.3 444.9L457.7 447L456 450.3L445.9 450.1L440.9 447.2L438.8 442.8L441.3 437L447 436.4L454.8 428.6L459.9 429.8L462.6 427.2L465.9 432.5L471.1 430L476.5 430.9L480.2 429.4L491.1 434Z",
  TR: "M666.1 524.8L674.9 525.7L677.9 524.2L685.7 531.4L686 540.3L692.8 541.7L696.6 545.5L694.5 544.2L692.7 548L689.3 548.5L693.2 559.8L691 564.4L694.2 566.1L696.4 570.9L691.7 574.2L690.1 570.8L677.8 570.1L674.8 572.6L672.2 570.9L666.1 573.1L658.7 573L646.3 577.3L635.5 575L628.5 577.8L621.4 576.1L621.2 582L616.7 586.2L614.3 585.4L613.6 581.3L617 577.6L615.7 574.9L609.7 578.5L603.3 575.9L594 582.6L585.7 584.1L572.4 576.1L565.9 575.4L564.1 581.7L557.1 582.9L552.8 581.1L550.5 577L536.5 577L543.8 573.7L534.7 574.3L537.2 572.3L532.9 567L534.4 563.6L525.7 560.4L527.1 556.5L529.3 559.8L533.6 558.5L530.1 555.7L532.4 553.8L529.3 549.4L531.3 546.6L524.1 547.5L524.7 541.8L529.9 537.2L539 538L540.3 536L541.2 537.6L550.8 537.4L548.8 535.8L550.3 534.7L558.6 533.3L551.8 531.3L552.1 528.1L571.5 529.4L581.2 522.4L590.2 519.3L606.1 518.6L611.2 523.5L615.8 522.9L619 527.5L622.5 526.5L637.3 531.4L646.9 529.4L654.6 531L666.1 524.8ZM541.6 519.7L543.3 524.3L551.3 528L550.3 530.5L536.9 530.9L524.9 540.8L525.4 538.2L530.4 534.7L523.4 533.6L528.8 526.1L526.1 521.9L534.5 518.3L537.2 520.2L541.6 519.7Z",
  UA: "M635.7 459L629.5 459.2L622.6 463.7L613.7 464.8L607.3 470.9L608.2 467L604.7 470.1L605.6 475.7L603.2 472.7L595.1 469.9L591.6 471.7L589.5 470.3L582.8 471.4L576.8 469L578.5 467.2L574.3 465.6L581.7 466.6L583.7 464.9L578.8 464.6L576.2 457.5L577.2 464.5L574.1 464.3L574.4 462.9L567.3 465.7L562 474L556.5 475.8L557.2 481.3L554.4 479.4L548.5 481.6L543.5 479L546.1 478.2L550.2 471.8L550.3 466.8L561.2 467.3L556 460.6L555.7 456.8L552 454.1L551.9 448.1L537.3 441.6L530.9 442.8L525.9 445.1L524.6 447.8L512.8 451.2L509.1 448.3L497.3 446.6L494.2 448.3L487.4 442.5L487.5 440.5L491.1 434L493.9 434.4L492.7 427.1L505.4 415L505.5 410.4L501.5 404.5L501 400.5L504.2 400.8L508 397L522.4 396.3L533.6 398.5L538.7 402.3L543.2 400.5L548.2 402.9L551.7 400.2L553.9 403.6L561.4 402.3L565 405.2L565.3 399.4L569 394.5L579.5 394.5L582 391.1L594.4 390.4L600.5 398.2L597.9 399.5L598.8 405.3L606.6 406L608.9 408.1L611.5 417.1L616.4 416.6L621 419.2L628.4 416.6L634.2 423L636.1 421.3L652.9 427.5L653.2 431.7L649.3 434.8L652.2 437.2L648.9 440.2L651.8 444.3L650.1 449.1L641.3 449.7L636.4 453.2L635.7 459Z",
  XK: "M474.7 518.8L476.9 516.9L480.6 516.6L482.8 514.3L484 511.6L483.7 510.5L482.1 509.2L480.2 508.9L480.6 506.2L479.4 505.5L475.5 505.9L473.2 507.4L472.2 509.3L470.9 509.8L470.1 511L470.9 513.3L472.5 516.7L473.2 518.4L474.7 518.8Z",
};

const MAP_CENTROIDS = {
  AE: [781.1, 698.4],
  AL: [469.2, 528.7],
  AT: [406.3, 451.2],
  BA: [446.2, 497],
  BE: [324.2, 415.4],
  BG: [518.1, 510.7],
  BH: [749.4, 682.5],
  BY: [541, 370.5],
  CH: [359, 462.5],
  CY: [589.3, 596.2],
  CZ: [425.9, 424.3],
  DE: [379.6, 405.4],
  DK: [390.5, 334.5],
  EE: [513.9, 297.2],
  ES: [248, 540],
  FI: [523.8, 173.7],
  FR: [310, 465],
  GB: [265, 370],
  GR: [505.7, 559],
  HR: [435.4, 489.4],
  HU: [463, 458],
  IE: [207.7, 374.7],
  IS: [107.7, 182.3],
  IT: [399, 518.2],
  KZ: [844.3, 440.9],
  LI: [371.4, 458.2],
  LT: [503.8, 349.9],
  LU: [339.7, 424.5],
  LV: [510.2, 324.4],
  MD: [545, 460.3],
  ME: [462.1, 511.2],
  MK: [483.8, 523.7],
  MT: [415.8, 585],
  NL: [331.9, 393.6],
  NO: [420, 200],
  PL: [459.6, 394.9],
  PT: [205, 545],
  RO: [513.6, 472.2],
  RS: [476.4, 493.4],
  SA: [699.5, 672],
  SE: [446.1, 221],
  SI: [421.2, 470.4],
  SK: [465, 438.8],
  TR: [610, 552.3],
  UA: [570.3, 436],
  XK: [477.1, 512.2],
};


// ─── ICONS ──────────────────────────────────────────────────────
function Ic({ n, s = 16, c = "#000" }) {
  const p = { xmlns: "http://www.w3.org/2000/svg", width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    sun: <svg {...p}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
    moon: <svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    globe: <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    map: <svg {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    calculator: <svg {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
    arrowRight: <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    arrowDown: <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    arrowUp: <svg {...p}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    chevR: <svg {...p}><polyline points="9 18 15 12 9 6"/></svg>,
    chevD: <svg {...p}><polyline points="6 9 12 15 18 9"/></svg>,
    plus: <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x: <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    copy: <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    share: <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
    download: <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    search: <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    bar: <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    pie: <svg {...p}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
    users: <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    building: <svg {...p}><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="10" y2="6"/><line x1="14" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/></svg>,
    wallet: <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    info: <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    trendUp: <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    trendDown: <svg {...p}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
    refresh: <svg {...p}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    flag: <svg {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  };
  return icons[n] || null;
}

// ─── CSS ANIMATIONS ─────────────────────────────────────────────
const CSS_ANIMS = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes barGrow { from { width: 0%; } }
@keyframes countUp { from { opacity: 0; } to { opacity: 1; } }
@keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
@keyframes heroFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
.epc-fade { animation: fadeIn 0.35s ease-out; }
.epc-pop { animation: popIn 0.25s ease-out; }
.epc-slide { animation: slideUp 0.4s ease-out; }
.epc-bar { animation: barGrow 0.8s ease-out; }
.epc-float { animation: heroFloat 4s ease-in-out infinite; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (max-width: 768px) {
  .epc-grid-2 { grid-template-columns: 1fr !important; }
  .epc-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
  .epc-hide-mobile { display: none !important; }
  .epc-input-strip { flex-direction: column !important; align-items: stretch !important; }
  .epc-header-tabs { display: none !important; }
  .epc-mobile-nav { display: flex !important; }
  .epc-map-grid { grid-template-columns: 1fr !important; }
}
@media (min-width: 769px) {
  .epc-mobile-nav { display: none !important; }
}
@media print {
  header, footer, .epc-mobile-nav, .epc-no-print { display: none !important; }
  main { padding: 0 !important; }
}
`;

// ─── EXPORT ENGINE ──────────────────────────────────────────────
function exportCSV(results, salary) {
  const rows = [["Country", "Code", "Gross (EUR)", "Net (EUR)", "Income Tax", "Employee Social", "Employer Social", "Total Cost", "Net %", "Effective Tax Rate %"]];
  Object.values(results).sort((a, b) => b.netPct - a.netPct).forEach(r => {
    const co = COUNTRIES.find(c => c.c === r.country);
    rows.push([co?.n || r.country, r.country, r.gross.toFixed(0), r.net.toFixed(0), r.incomeTax.toFixed(0), r.employeeSocial.toFixed(0), r.employerSocial.toFixed(0), r.totalCompanyCost.toFixed(0), r.netPct.toFixed(1), r.effectiveTaxRate.toFixed(1)]);
  });
  const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `EuropePayCalculator_${salary}EUR_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

function exportJSON(results, salary) {
  const data = { salary, date: new Date().toISOString(), countries: Object.values(results).map(r => ({ ...r })) };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `EuropePayCalculator_${salary}EUR.json`;
  a.click(); URL.revokeObjectURL(url);
}

function generateShareURL(country, salary, direction, period) {
  const params = new URLSearchParams({ c: country, s: salary, d: direction, p: period });
  return `${window.location.origin}${window.location.pathname}?${params}`;
}

// ─── DISCLAIMER / COOKIE NOTICE ────────────────────────────────
function DisclaimerBanner({ th, onDismiss }) {
  return <div style={{
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
    background: th.card, borderTop: `1px solid ${th.gbd}`,
    backdropFilter: G.blur, WebkitBackdropFilter: G.blur,
    padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
    boxShadow: "0 -4px 24px rgba(0,0,0,0.1)", gap: 12,
  }} className="epc-slide">
    <div style={{ fontSize: 12, color: th.t2, lineHeight: 1.5, flex: 1 }}>
      <strong style={{ color: th.tx }}>Disclaimer:</strong> Tax calculations are estimates based on 2025/2026 data for educational purposes only. Individual results may vary based on personal circumstances, local regulations, and applicable deductions. Always consult a qualified tax professional.
    </div>
    <button onClick={onDismiss} style={{
      padding: "6px 16px", borderRadius: 8, border: `1px solid ${th.ac}`, background: th.al,
      color: th.ac, fontSize: 12, fontWeight: 700, fontFamily: F, cursor: "pointer", whiteSpace: "nowrap",
    }}>Got it</button>
  </div>;
}

// ─── LANDING HERO ──────────────────────────────────────────────
function LandingHero({ th, onStart }) {
  return <div style={{
    minHeight: "calc(100vh - 56px)", display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "40px 20px", textAlign: "center",
  }} className="epc-fade">
    <div className="epc-float" style={{
      width: 80, height: 80, borderRadius: 24, background: th.gd,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 8px 40px ${th.ac}40`, marginBottom: 32,
    }}>
      <Ic n="globe" s={40} c="#fff" />
    </div>
    <h2 style={{ margin: "0 0 8px", fontSize: 42, fontWeight: 900, letterSpacing: -1.5, color: th.tx, lineHeight: 1.1 }}>
      Europe<span style={{ background: th.gd, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pay</span>Calculator
    </h2>
    <p style={{ margin: "0 0 8px", fontSize: 18, color: th.t2, maxWidth: 520, fontWeight: 500 }}>
      Calculate net salary, gross salary, and total company cost for 45+ European countries in seconds.
    </p>
    <p style={{ margin: "0 0 32px", fontSize: 13, color: th.t3, maxWidth: 480 }}>
      Progressive tax brackets · Social contributions · Employer costs · Side-by-side comparison · Interactive map
    </p>
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
      <button onClick={onStart} style={{
        padding: "14px 32px", borderRadius: 14, border: "none", background: th.gd,
        color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: F, cursor: "pointer",
        boxShadow: `0 4px 20px ${th.ac}40`, display: "flex", alignItems: "center", gap: 8,
        transition: "all 0.2s", letterSpacing: -0.3,
      }}>
        <Ic n="calculator" s={18} c="#fff" /> Start Calculating
      </button>
      <button onClick={() => { onStart(); setTimeout(() => document.querySelector('[data-view="map"]')?.click(), 100); }} style={{
        padding: "14px 32px", borderRadius: 14, border: `1.5px solid ${th.gbd}`, background: th.gbg,
        color: th.tx, fontSize: 16, fontWeight: 700, fontFamily: F, cursor: "pointer",
        backdropFilter: G.blur, display: "flex", alignItems: "center", gap: 8,
      }}>
        <Ic n="map" s={18} c={th.ac} /> Explore Map
      </button>
    </div>
    {/* Quick stats */}
    <div style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { num: "45+", label: "Countries" },
        { num: "3", label: "Calculation Modes" },
        { num: "2025/26", label: "Tax Data" },
        { num: "100%", label: "Free & Open" },
      ].map(s => (
        <div key={s.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: FM, background: th.gd, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.num}</div>
          <div style={{ fontSize: 11, color: th.t3, fontWeight: 600 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>;
}

// ─── REUSABLE COMPONENTS ────────────────────────────────────────

function Btn({ children, onClick, disabled, icon, variant = "primary", size = "md", th, style = {} }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6, border: "none",
    fontFamily: F, fontWeight: 700, cursor: disabled ? "default" : "pointer",
    borderRadius: size === "sm" ? 10 : 12, transition: "all 0.2s",
    opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap",
  };
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 14 }, lg: { padding: "14px 28px", fontSize: 16 } };
  const variants = {
    primary: { background: th.gd, color: "#fff", boxShadow: `0 2px 12px ${th.ac}40` },
    secondary: { background: th.gbg, color: th.tx, border: `1.5px solid ${th.gbd}`, backdropFilter: G.blur },
    ghost: { background: "transparent", color: th.t2, padding: sizes[size].padding },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
    {icon && <Ic n={icon} s={size === "sm" ? 13 : 16} c={variant === "primary" ? "#fff" : th.t2} />}
    {children}
  </button>;
}

function Card({ children, th, style = {}, className = "" }) {
  return <div className={className} style={{
    background: th.card, borderRadius: G.rSm, border: `1px solid ${th.gbd}`,
    backdropFilter: G.blur, WebkitBackdropFilter: G.blur, boxShadow: th.sm,
    ...style,
  }}>{children}</div>;
}

function StatCard({ label, value, sub, color, icon, th, style = {} }) {
  return <Card th={th} style={{ padding: "16px 18px", ...style }} className="epc-slide">
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      {icon && <div style={{ width: 32, height: 32, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Ic n={icon} s={16} c={color} />
      </div>}
      <span style={{ fontSize: 11, fontWeight: 600, color: th.t3, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color: color || th.tx, fontFamily: FM, letterSpacing: -1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: th.t3, marginTop: 4 }}>{sub}</div>}
  </Card>;
}

// ─── DONUT CHART ────────────────────────────────────────────────
function DonutChart({ segments, size = 200, th, centerLabel, centerValue }) {
  const radius = 70;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }}>
    {/* Background circle */}
    <circle cx="100" cy="100" r={radius} fill="none" stroke={th.sh} strokeWidth={strokeWidth} />
    {/* Segments */}
    {segments.filter(s => s.pct > 0).map((seg, i) => {
      const dashLen = (seg.pct / 100) * circumference;
      const el = <circle key={i} cx="100" cy="100" r={radius} fill="none"
        stroke={seg.color} strokeWidth={strokeWidth}
        strokeDasharray={`${dashLen} ${circumference - dashLen}`}
        strokeDashoffset={-offset}
        transform="rotate(-90 100 100)"
        style={{ transition: "stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease" }}
      />;
      offset += dashLen;
      return el;
    })}
    {/* Center text */}
    <text x="100" y="92" textAnchor="middle" fill={th.t3} fontSize="11" fontFamily={F} fontWeight="600">{centerLabel}</text>
    <text x="100" y="116" textAnchor="middle" fill={th.tx} fontSize="22" fontFamily={FM} fontWeight="800">{centerValue}</text>
  </svg>;
}

// ─── STACKED BAR ────────────────────────────────────────────────
function StackedBar({ segments, height = 28, th, style = {} }) {
  return <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height, background: th.sh, ...style }}>
    {segments.filter(s => s.pct > 0).map((seg, i) => (
      <div key={i} className="epc-bar" style={{
        width: `${seg.pct}%`, background: seg.color, display: "flex",
        alignItems: "center", justifyContent: "center", transition: "width 0.6s ease",
        minWidth: seg.pct > 4 ? "auto" : 0,
      }}>
        {seg.pct > 8 && <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
          {seg.pct.toFixed(1)}%
        </span>}
      </div>
    ))}
  </div>;
}

// ─── BREAKDOWN TABLE ────────────────────────────────────────────
function BreakdownTable({ result, th, divisor = 1 }) {
  if (!result) return null;
  const rows = [];

  // Gross
  rows.push({ label: "Gross Salary", amount: result.gross, color: th.tx, bold: true, type: "header" });

  // Employee social breakdown
  Object.entries(result.employeeSocialBreakdown || {}).forEach(([key, amount]) => {
    if (amount > 0) {
      const labels = { pension: "Pension", health: "Health Insurance", unemployment: "Unemployment", nursing: "Nursing Care",
        ni: "National Insurance", niUpper: "NI (Upper)", social: "Social Security", csg: "CSG", crds: "CRDS",
        pensionComp: "Pension (Complementary)", pensionCompT2: "Pension (Tier 2)", disability: "Disability",
        sickness: "Sickness", prsi: "PRSI", ahv: "AHV/IV/EO", alv: "Unemployment (ALV)",
        gosi: "GOSI", usc: "Social Contribution", work: "Work Insurance",
        gesy: "Healthcare (GESY)", laborMarket: "Labor Market (AM)", pension1: "Pension (1st Pillar)", pension2: "Pension (2nd Pillar)" };
      rows.push({ label: labels[key] || key, amount: -amount, color: CHART_COLORS.empSocial, pct: (amount / result.gross * 100).toFixed(1) });
    }
  });

  // Income tax
  if (result.incomeTax > 0) rows.push({ label: "Income Tax", amount: -result.incomeTax, color: CHART_COLORS.tax, pct: result.taxPct.toFixed(1) });
  if (result.solidarityTax > 0) rows.push({ label: "Solidarity/Surcharge", amount: -result.solidarityTax, color: CHART_COLORS.solidarity });
  if (result.laborMarketContrib > 0) rows.push({ label: "Labor Market Contribution", amount: -result.laborMarketContrib, color: CHART_COLORS.other });

  // Net
  rows.push({ label: "Net Salary (Take-Home)", amount: result.net, color: CHART_COLORS.net, bold: true, type: "result" });
  rows.push({ type: "divider" });

  // Employer costs
  rows.push({ label: "Employer Social Contributions", amount: null, color: th.t3, type: "section" });
  Object.entries(result.employerSocialBreakdown || {}).forEach(([key, amount]) => {
    if (amount > 0) {
      const labels = { pension: "Pension", health: "Health Insurance", unemployment: "Unemployment", nursing: "Nursing Care",
        ni: "National Insurance", social: "Social Security/Tax", accident: "Accident Insurance", family: "Family Allowance",
        municipal: "Municipal Tax", chamber: "Chamber Levy", severance: "Severance Fund", housing: "Housing",
        apprenticeship: "Apprenticeship Tax", transport: "Transport", pensionComp: "Pension (Comp T1)",
        pensionCompT2: "Pension (Comp T2)", prsi: "Employer PRSI", ahv: "AHV/IV/EO", alv: "Unemployment (ALV)",
        gosi: "GOSI", usc: "Social Contribution", work: "Work Insurance", disability: "Disability",
        childcare: "Childcare", mutual: "Mutual Health", labor: "Labor Fund", fgsp: "Employee Benefits Fund",
        common: "Common Contingencies", training: "Training", redundancy: "Redundancy Fund",
        hrda: "HR Development", cohesion: "Social Cohesion", atp: "ATP", tfr: "Severance (TFR)",
        other: "Other", reserve: "Reserve Fund", guarantee: "Guarantee", sickness: "Sickness" };
      rows.push({ label: "  + " + (labels[key] || key), amount: amount, color: CHART_COLORS.employer, pct: (amount / result.gross * 100).toFixed(1), isEmployer: true });
    }
  });

  rows.push({ type: "divider" });
  rows.push({ label: "Total Company Cost", amount: result.totalCompanyCost, color: CHART_COLORS.employer, bold: true, type: "total" });

  const fmt = (v) => {
    if (v === null || v === undefined) return "";
    const scaled = v / divisor;
    const abs = Math.abs(scaled);
    const sign = scaled < 0 ? "-" : scaled > 0 && !rows.find(r => r.amount === v && (r.type === "header" || r.type === "result" || r.type === "total")) ? "+" : "";
    return `${sign}€${abs.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return <div>
    {rows.map((row, i) => {
      if (row.type === "divider") return <div key={i} style={{ height: 1, background: th.gbd, margin: "8px 0" }} />;
      if (row.type === "section") return <div key={i} style={{ fontSize: 11, fontWeight: 700, color: th.t3, textTransform: "uppercase", letterSpacing: 0.8, padding: "8px 0 4px" }}>{row.label}</div>;
      const isTotal = row.type === "total";
      const isResult = row.type === "result";
      const isHeader = row.type === "header";
      return <div key={i} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 0", borderBottom: isTotal || isResult ? `2px solid ${row.color}` : "none",
        background: isResult ? `${CHART_COLORS.net}08` : isTotal ? `${CHART_COLORS.employer}08` : "transparent",
        borderRadius: (isResult || isTotal) ? 6 : 0, margin: (isResult || isTotal) ? "4px -8px" : 0,
        paddingLeft: (isResult || isTotal) ? 8 : row.isEmployer ? 4 : 0,
        paddingRight: (isResult || isTotal) ? 8 : 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          {!isHeader && !isResult && !isTotal && <div style={{ width: 4, height: 4, borderRadius: "50%", background: row.color, flexShrink: 0 }} />}
          <span style={{ fontSize: row.bold ? 13 : 12, fontWeight: row.bold ? 700 : 500, color: row.bold ? th.tx : th.t2 }}>{row.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {row.pct && <span style={{ fontSize: 10, fontWeight: 600, color: th.t3, fontFamily: FM }}>{row.pct}%</span>}
          <span style={{ fontSize: row.bold ? 15 : 13, fontWeight: row.bold ? 800 : 600, color: row.amount < 0 ? row.color : row.bold ? th.tx : th.t2, fontFamily: FM }}>
            {fmt(row.amount)}
          </span>
        </div>
      </div>;
    })}
  </div>;
}

// ─── COUNTRY SELECTOR ───────────────────────────────────────────
function CountrySelector({ value, onChange, th, compact = false }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRIES.filter(c =>
    c.n.toLowerCase().includes(search.toLowerCase()) || c.c.toLowerCase().includes(search.toLowerCase())
  );

  const selected = COUNTRIES.find(c => c.c === value);
  const groups = { EU: "EU Member States", EEA: "EEA/EFTA", EFTA: "EEA/EFTA", EUR: "Other European", GULF: "Gulf States", ASIA: "Asia" };

  return <div ref={ref} style={{ position: "relative" }}>
    <button onClick={() => setOpen(!open)} style={{
      display: "flex", alignItems: "center", gap: 8, padding: compact ? "6px 12px" : "10px 16px",
      background: th.gbg, border: `1.5px solid ${open ? th.ac : th.gbd}`, borderRadius: G.rXs,
      cursor: "pointer", fontFamily: F, fontSize: compact ? 13 : 15, fontWeight: 600, color: th.tx,
      backdropFilter: G.blur, WebkitBackdropFilter: G.blur, transition: "all 0.2s",
      minWidth: compact ? 160 : 220,
    }}>
      {selected ? <><span style={{ fontSize: compact ? 16 : 20 }}>{selected.f}</span> {selected.n}</> : "Select country..."}
      <span style={{ marginLeft: "auto" }}><Ic n="chevD" s={14} c={th.t3} /></span>
    </button>
    {open && <div style={{
      position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
      background: th.card, border: `1px solid ${th.gbd}`, borderRadius: G.rXs,
      boxShadow: th.sl, zIndex: 100, maxHeight: 360, overflow: "hidden",
      backdropFilter: G.blur, WebkitBackdropFilter: G.blur, minWidth: 280,
    }} className="epc-pop">
      <div style={{ padding: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: th.sh, borderRadius: 8 }}>
          <Ic n="search" s={14} c={th.t3} />
          <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search countries..."
            style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, fontFamily: F, color: th.tx, flex: 1 }} />
        </div>
      </div>
      <div style={{ maxHeight: 290, overflowY: "auto", padding: "0 4px 4px" }}>
        {Object.entries(groups).map(([grp, label]) => {
          const items = filtered.filter(c => c.grp === grp);
          if (!items.length) return null;
          return <Fragment key={grp}>
            <div style={{ fontSize: 10, fontWeight: 700, color: th.t3, textTransform: "uppercase", letterSpacing: 1, padding: "8px 10px 4px" }}>{label}</div>
            {items.map(c => (
              <button key={c.c} onClick={() => { onChange(c.c); setOpen(false); setSearch(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "8px 10px", border: "none", background: value === c.c ? th.al : "transparent",
                  borderRadius: 8, cursor: "pointer", fontFamily: F, fontSize: 13, fontWeight: value === c.c ? 600 : 400,
                  color: value === c.c ? th.ac : th.tx, textAlign: "left",
                }}>
                <span style={{ fontSize: 18 }}>{c.f}</span>
                <span>{c.n}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: th.t3, fontFamily: FM }}>{c.c}</span>
              </button>
            ))}
          </Fragment>;
        })}
      </div>
    </div>}
  </div>;
}

// ─── MAP VIEW ───────────────────────────────────────────────────
function MapView({ results, onSelect, selected, salary, th }) {
  const [hover, setHover] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, data: null });

  const getColor = (cc) => {
    const r = results[cc];
    if (!r) return th.sh;
    const pct = r.netPct;
    if (pct >= 80) return "#10B981";
    if (pct >= 70) return "#34D399";
    if (pct >= 60) return "#FBBF24";
    if (pct >= 50) return "#F59E0B";
    if (pct >= 40) return "#F97316";
    return "#EF4444";
  };

  return <div style={{ position: "relative" }}>
    <svg viewBox="30 10 700 540" style={{ width: "100%", maxWidth: 800, margin: "0 auto", display: "block" }}>
      {Object.entries(MAP_PATHS).map(([cc, path]) => {
        if (!path || !TAX_DATA[cc]) return null;
        const isSelected = selected === cc;
        const isHovered = hover === cc;
        return <path key={cc} d={path}
          fill={getColor(cc)} stroke={isSelected ? th.ac : "rgba(0,0,0,0.3)"} strokeWidth={isSelected ? 2 : isHovered ? 1.2 : 0.4}
          opacity={isSelected ? 1 : isHovered ? 0.9 : 0.8}
          style={{ cursor: "pointer", transition: "all 0.2s" }}
          onClick={() => onSelect(cc)}
          onMouseEnter={(e) => {
            setHover(cc);
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltip({ show: true, x: rect.x + rect.width / 2, y: rect.y, data: results[cc] });
          }}
          onMouseLeave={() => { setHover(null); setTooltip({ show: false, x: 0, y: 0, data: null }); }}
        />;
      })}
      {/* Country labels */}
      {Object.entries(MAP_CENTROIDS).map(([cc, [cx, cy]]) => {
        if (!TAX_DATA[cc]) return null;
        const co = COUNTRIES.find(c => c.c === cc);
        if (!co) return null;
        return <text key={`lbl-${cc}`} x={cx} y={cy + 3} textAnchor="middle" fontSize="9" fontWeight="700"
          fill={selected === cc ? "#fff" : "rgba(255,255,255,0.95)"} style={{ pointerEvents: "none", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
          {cc}
        </text>;
      })}
    </svg>

    {/* Legend */}
    <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
      {[
        { label: "80%+", color: "#10B981" }, { label: "70-80%", color: "#34D399" },
        { label: "60-70%", color: "#FBBF24" }, { label: "50-60%", color: "#F59E0B" },
        { label: "40-50%", color: "#F97316" }, { label: "<40%", color: "#EF4444" },
      ].map(l => (
        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: th.t2 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
          {l.label} net
        </div>
      ))}
    </div>
  </div>;
}

// ─── COMPARISON VIEW ────────────────────────────────────────────
function ComparisonView({ countries, salary, direction, th, divisor = 1 }) {
  const results = countries.map(cc => calculateCountry(cc, salary, direction)).filter(Boolean);
  if (results.length < 2) return null;
  const cfmt = (v) => `€${(v / divisor).toLocaleString("en", { maximumFractionDigits: 0 })}`;

  return <div className="epc-fade" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(results.length, 4)}, 1fr)`, gap: 12 }}>
    {results.map((r, i) => {
      const co = COUNTRIES.find(c => c.c === r.country);
      return <Card key={r.country} th={th} style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>{co?.f}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: th.tx }}>{co?.n}</div>
            <div style={{ fontSize: 10, color: th.t3 }}>{co?.c}</div>
          </div>
        </div>

        <DonutChart th={th} size={140} centerLabel="Net" centerValue={`${r.netPct.toFixed(0)}%`} segments={[
          { pct: r.netPct, color: CHART_COLORS.net },
          { pct: r.taxPct, color: CHART_COLORS.tax },
          { pct: r.socialPct, color: CHART_COLORS.empSocial },
          { pct: Math.max(0, 100 - r.netPct - r.taxPct - r.socialPct), color: CHART_COLORS.other },
        ]} />

        <div style={{ marginTop: 12 }}>
          {[
            { label: "Net Salary", value: cfmt(r.net), color: CHART_COLORS.net },
            { label: "Income Tax", value: cfmt(r.incomeTax), color: CHART_COLORS.tax },
            { label: "Social Contrib.", value: cfmt(r.employeeSocial), color: CHART_COLORS.empSocial },
            { label: "Employer Cost", value: cfmt(r.employerSocial), color: CHART_COLORS.employer },
            { label: "Total Cost", value: cfmt(r.totalCompanyCost), color: CHART_COLORS.employer, bold: true },
          ].map((row, j) => (
            <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: j < 4 ? `1px solid ${th.gbd}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: row.color }} />
                <span style={{ fontSize: 11, color: th.t2, fontWeight: row.bold ? 600 : 400 }}>{row.label}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: row.bold ? 700 : 600, color: th.tx, fontFamily: FM }}>{row.value}</span>
            </div>
          ))}
        </div>
      </Card>;
    })}
  </div>;
}

// ─── THEME PICKER ───────────────────────────────────────────────
function ThemePicker({ theme, setTheme, th }) {
  return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{
    padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: F,
    cursor: "pointer", border: `1px solid ${th.gbd}`, background: th.gbg, color: th.t2,
    backdropFilter: G.blur, display: "flex", alignItems: "center", gap: 4,
  }}>
    <Ic n={theme === "light" ? "moon" : "sun"} s={13} c={th.t2} />
  </button>;
}

// ─── MAIN APP ───────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch { return "light"; }
  });
  const [country, setCountry] = useState("DE");
  const [salary, setSalary] = useState(65000);
  const [salaryInput, setSalaryInput] = useState("65000");
  const [period, setPeriod] = useState("annual");
  const [direction, setDirection] = useState("grossToNet");
  const [view, setView] = useState("landing"); // landing | dashboard | map | compare
  const [compareCountries, setCompareCountries] = useState(["DE", "FR", "NL", "GB"]);
  const [addingCompare, setAddingCompare] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [shareToast, setShareToast] = useState(false);

  const th = TH[theme];

  // Parse URL params on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("c")) { setCountry(params.get("c")); setView("dashboard"); }
      if (params.get("s")) { const s = parseFloat(params.get("s")); if (!isNaN(s)) { setSalary(s); setSalaryInput(String(s)); } }
      if (params.get("d")) setDirection(params.get("d"));
      if (params.get("p")) setPeriod(params.get("p"));
    } catch {}
  }, []);

  // Inject CSS + SEO
  useEffect(() => {
    if (!document.getElementById("epc-css")) {
      const s = document.createElement("style"); s.id = "epc-css"; s.textContent = CSS_ANIMS; document.head.appendChild(s);
    }
    document.title = "EuropePayCalculator — Net, Gross & Total Cost Calculator for 45+ Countries";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "Calculate net salary, gross salary, and total company cost for 45+ European countries. Compare taxes, social contributions, and employer costs side by side.";
    // OG tags
    const ogTags = { "og:title": "EuropePayCalculator", "og:description": "Net, Gross & Total Cost Calculator for 45+ Countries", "og:type": "website" };
    Object.entries(ogTags).forEach(([prop, content]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", prop); document.head.appendChild(tag); }
      tag.content = content;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "1") setView("dashboard");
      if (e.key === "2") setView("map");
      if (e.key === "3") setView("compare");
      if (e.key === "t" || e.key === "T") setTheme(t => t === "light" ? "dark" : "light");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleShare = () => {
    const url = generateShareURL(country, salary, direction, period);
    navigator.clipboard?.writeText(url).then(() => { setShareToast(true); setTimeout(() => setShareToast(false), 2000); });
  };

  // Calculate current result
  const annualSalary = period === "monthly" ? salary * 12 : salary;
  const result = useMemo(() => calculateCountry(country, annualSalary, direction), [country, annualSalary, direction]);

  // Map results (pre-compute all countries)
  const allResults = useMemo(() => {
    const res = {};
    COUNTRIES.forEach(c => {
      if (TAX_DATA[c.c]) res[c.c] = calculateCountry(c.c, annualSalary, "grossToNet");
    });
    return res;
  }, [annualSalary]);

  const handleSalaryChange = (val) => {
    setSalaryInput(val);
    const num = parseFloat(val.replace(/[^0-9.]/g, ""));
    if (!isNaN(num) && num >= 0) setSalary(num);
  };

  const div = period === "monthly" ? 12 : 1;
  const fmt = (v) => `€${(v / div).toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtAnnual = (v) => `€${v.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtMonth = (v) => `€${(v / 12).toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const periodLabel = period === "monthly" ? "/month" : "/year";
  const altLabel = period === "monthly" ? "/year" : "/month";
  const selectedCo = COUNTRIES.find(c => c.c === country);

  const directionLabels = {
    grossToNet: { icon: "arrowDown", label: "Gross → Net", desc: "Enter gross salary, see net take-home" },
    netToGross: { icon: "arrowUp", label: "Net → Gross", desc: "Enter desired net, calculate required gross" },
    totalToNet: { icon: "building", label: "Total Cost → Net", desc: "Enter total company budget, see net" },
  };

  return <div style={{ minHeight: "100vh", background: th.bg, fontFamily: F, color: th.tx, paddingBottom: view !== "landing" ? 60 : 0 }}>
    {/* Header */}
    <header style={{
      background: th.gbg, borderBottom: `1px solid ${th.gbd}`,
      padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100, backdropFilter: G.blur, WebkitBackdropFilter: G.blur,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setView("landing")}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: th.gd, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 12px ${th.ac}40` }}>
          <Ic n="globe" s={18} c="#fff" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 15, fontWeight: 800, letterSpacing: -0.3, color: th.tx }}>EuropePayCalculator</h1>
          <div style={{ fontSize: 9, color: th.t3, fontWeight: 500 }}>Net · Gross · Total Cost — 45+ Countries</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* View tabs (desktop) */}
        <div className="epc-header-tabs" style={{ display: "flex", gap: 4 }}>
        {[
          { k: "dashboard", icon: "calculator", label: "Calculator" },
          { k: "map", icon: "map", label: "Map" },
          { k: "compare", icon: "bar", label: "Compare" },
        ].map(v => (
          <button key={v.k} data-view={v.k} onClick={() => setView(v.k)} style={{
            padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: F,
            cursor: "pointer", border: v.k === view ? `1.5px solid ${th.ac}` : `1px solid transparent`,
            background: v.k === view ? th.al : "transparent", color: v.k === view ? th.ac : th.t3,
            display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s",
          }}>
            <Ic n={v.icon} s={13} c={v.k === view ? th.ac : th.t3} />
            {v.label}
          </button>
        ))}
        </div>
        {/* Export & Share (desktop) */}
        {view !== "landing" && <div className="epc-hide-mobile" style={{ display: "flex", gap: 4 }}>
          <button onClick={() => exportCSV(allResults, annualSalary)} title="Export CSV" style={{
            padding: "4px 8px", borderRadius: 6, border: `1px solid ${th.gbd}`, background: th.gbg,
            cursor: "pointer", display: "flex", alignItems: "center", color: th.t3,
          }}><Ic n="download" s={13} c={th.t3} /></button>
          <button onClick={handleShare} title="Share URL" style={{
            padding: "4px 8px", borderRadius: 6, border: `1px solid ${th.gbd}`, background: th.gbg,
            cursor: "pointer", display: "flex", alignItems: "center", color: th.t3,
          }}><Ic n="share" s={13} c={th.t3} /></button>
        </div>}
        <ThemePicker theme={theme} setTheme={setTheme} th={th} />
      </div>
    </header>

    {/* Share Toast */}
    {shareToast && <div style={{
      position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 200,
      background: th.card, border: `1px solid ${th.gbd}`, borderRadius: 10,
      padding: "8px 16px", boxShadow: th.sl, backdropFilter: G.blur,
      display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: CHART_COLORS.net,
    }} className="epc-pop">
      <Ic n="check" s={14} c={CHART_COLORS.net} /> Link copied to clipboard
    </div>}

    {/* Landing Page */}
    {view === "landing" && <LandingHero th={th} onStart={() => setView("dashboard")} />}

    {/* Input Strip */}
    {view !== "landing" && <div className="epc-input-strip" style={{
      background: th.gbg, borderBottom: `1px solid ${th.gbd}`,
      padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      backdropFilter: G.blur, WebkitBackdropFilter: G.blur,
    }}>
      <CountrySelector value={country} onChange={setCountry} th={th} compact />

      {/* Salary Input */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, background: th.gbg, border: `1.5px solid ${th.gbd}`, borderRadius: G.rXs, overflow: "hidden" }}>
        <span style={{ padding: "0 10px", fontSize: 16, fontWeight: 700, color: th.ac }}>€</span>
        <input value={salaryInput} onChange={e => handleSalaryChange(e.target.value)}
          style={{
            border: "none", background: "transparent", padding: "8px 4px", fontSize: 18, fontWeight: 700,
            fontFamily: FM, color: th.tx, outline: "none", width: 140, textAlign: "right",
          }} />
      </div>

      {/* Period toggle */}
      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: `1px solid ${th.gbd}` }}>
        {["annual", "monthly"].map(p => (
          <button key={p} onClick={() => {
            if (p !== period) {
              const newSalary = p === "monthly" ? salary / 12 : salary * 12;
              setSalary(Math.round(newSalary));
              setSalaryInput(String(Math.round(newSalary)));
            }
            setPeriod(p);
          }} style={{
            padding: "6px 14px", border: "none", fontSize: 12, fontWeight: 600, fontFamily: F,
            cursor: "pointer", background: period === p ? th.ac : "transparent",
            color: period === p ? "#fff" : th.t3, transition: "all 0.2s",
          }}>
            {p === "annual" ? "Annual" : "Monthly"}
          </button>
        ))}
      </div>

      {/* Direction */}
      <div style={{ display: "flex", gap: 4 }}>
        {Object.entries(directionLabels).map(([key, d]) => (
          <button key={key} onClick={() => setDirection(key)} title={d.desc} style={{
            padding: "6px 12px", borderRadius: 8, border: direction === key ? `1.5px solid ${th.ac}` : `1px solid ${th.gbd}`,
            background: direction === key ? th.al : "transparent", color: direction === key ? th.ac : th.t3,
            fontSize: 11, fontWeight: 600, fontFamily: F, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            transition: "all 0.2s",
          }}>
            <Ic n={d.icon} s={12} c={direction === key ? th.ac : th.t3} />
            {d.label}
          </button>
        ))}
      </div>
    </div>}

    {/* Main Content */}
    {view !== "landing" && <main style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>

      {/* ═══ DASHBOARD VIEW ═══ */}
      {view === "dashboard" && result && <div className="epc-fade">
        {/* Stat Cards */}
        <div className="epc-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard th={th} label={`Net Salary${periodLabel}`} value={fmt(result.net)} sub={`${period === "monthly" ? fmtAnnual(result.net) + "/year" : fmtMonth(result.net) + "/month"} · ${result.netPct.toFixed(1)}% of gross`} color={CHART_COLORS.net} icon="wallet" />
          <StatCard th={th} label={`Income Tax${periodLabel}`} value={fmt(result.incomeTax)} sub={`${result.taxPct.toFixed(1)}% effective rate`} color={CHART_COLORS.tax} icon="arrowDown" />
          <StatCard th={th} label={`Employee Social${periodLabel}`} value={fmt(result.employeeSocial)} sub={`${result.socialPct.toFixed(1)}% of gross`} color={CHART_COLORS.empSocial} icon="users" />
          <StatCard th={th} label={`Total Company Cost${periodLabel}`} value={fmt(result.totalCompanyCost)} sub={`${period === "monthly" ? fmtAnnual(result.totalCompanyCost) + "/year" : fmtMonth(result.totalCompanyCost) + "/month"} · +${result.employerBurdenPct.toFixed(1)}% above gross`} color={CHART_COLORS.employer} icon="building" />
        </div>

        <div className="epc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left: Charts */}
          <div>
            {/* Employee perspective bar */}
            <Card th={th} style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: th.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>
                Employee Perspective: Gross → Net
              </div>
              <StackedBar th={th} height={36} segments={[
                { pct: result.netPct, color: CHART_COLORS.net },
                { pct: result.taxPct, color: CHART_COLORS.tax },
                { pct: result.socialPct, color: CHART_COLORS.empSocial },
                { pct: Math.max(0, 100 - result.netPct - result.taxPct - result.socialPct), color: CHART_COLORS.other },
              ]} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                {[
                  { label: "Net", pct: result.netPct, color: CHART_COLORS.net },
                  { label: "Tax", pct: result.taxPct, color: CHART_COLORS.tax },
                  { label: "Social", pct: result.socialPct, color: CHART_COLORS.empSocial },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: th.t2 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 3, background: s.color }} />
                    {s.label}: {s.pct.toFixed(1)}%
                  </div>
                ))}
              </div>
            </Card>

            {/* Employer perspective bar */}
            <Card th={th} style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: th.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>
                Employer Perspective: Gross → Total Cost
              </div>
              <StackedBar th={th} height={36} segments={[
                { pct: result.totalCompanyCost > 0 ? (result.gross / result.totalCompanyCost * 100) : 0, color: th.ac },
                { pct: result.totalCompanyCost > 0 ? (result.employerSocial / result.totalCompanyCost * 100) : 0, color: CHART_COLORS.employer },
              ]} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: th.t2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 3, background: th.ac }} />
                  Gross: {fmt(result.gross)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: th.t2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 3, background: CHART_COLORS.employer }} />
                  Employer Cost: +{fmt(result.employerSocial)} ({result.employerBurdenPct.toFixed(1)}%)
                </div>
              </div>
            </Card>

            {/* Donut Chart */}
            <Card th={th} style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: th.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12, alignSelf: "flex-start" }}>
                Tax Distribution
              </div>
              <DonutChart th={th} size={220} centerLabel="Net %" centerValue={`${result.netPct.toFixed(1)}%`} segments={[
                { pct: result.netPct, color: CHART_COLORS.net },
                { pct: result.taxPct, color: CHART_COLORS.tax },
                { pct: result.socialPct, color: CHART_COLORS.empSocial },
                { pct: Math.max(0, 100 - result.netPct - result.taxPct - result.socialPct), color: CHART_COLORS.other },
              ]} />
              <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { label: "Take-Home", pct: result.netPct, color: CHART_COLORS.net },
                  { label: "Income Tax", pct: result.taxPct, color: CHART_COLORS.tax },
                  { label: "Social Contrib.", pct: result.socialPct, color: CHART_COLORS.empSocial },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 4, background: s.color }} />
                    <span style={{ color: th.t2, fontWeight: 500 }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: s.color, fontFamily: FM }}>{s.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Detailed Breakdown */}
          <Card th={th} style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: th.t3, textTransform: "uppercase", letterSpacing: 0.8 }}>
                {selectedCo?.f} {selectedCo?.n} — Detailed Breakdown
              </div>
              <div style={{ fontSize: 10, color: th.t3 }}>
                {result.months > 12 ? `${result.months} salary months` : "12 months"}
              </div>
            </div>
            <BreakdownTable result={result} th={th} divisor={div} />
          </Card>
        </div>
      </div>}

      {/* ═══ MAP VIEW ═══ */}
      {view === "map" && <div className="epc-fade">
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: th.tx }}>European Tax Map</h2>
          <p style={{ margin: 0, fontSize: 13, color: th.t2 }}>
            Net salary as % of gross for {fmt(annualSalary * div)}{periodLabel} · Click any country for details
          </p>
        </div>

        <div className="epc-map-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          <Card th={th} style={{ padding: 20 }}>
            <MapView results={allResults} onSelect={setCountry} selected={country} salary={annualSalary} th={th} />
          </Card>

          {result && <Card th={th} style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>{selectedCo?.f}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: th.tx }}>{selectedCo?.n}</div>
                <div style={{ fontSize: 11, color: th.t3 }}>Effective tax rate: {result.effectiveTaxRate.toFixed(1)}%</div>
              </div>
            </div>

            <DonutChart th={th} size={180} centerLabel="Net" centerValue={`${result.netPct.toFixed(0)}%`} segments={[
              { pct: result.netPct, color: CHART_COLORS.net },
              { pct: result.taxPct, color: CHART_COLORS.tax },
              { pct: result.socialPct, color: CHART_COLORS.empSocial },
            ]} />

            <div style={{ marginTop: 16 }}>
              {[
                { label: "Gross", value: fmt(result.gross), color: th.tx },
                { label: "Net Salary", value: fmt(result.net), color: CHART_COLORS.net },
                { label: "Income Tax", value: fmt(result.incomeTax), color: CHART_COLORS.tax },
                { label: "Social Contrib.", value: fmt(result.employeeSocial), color: CHART_COLORS.empSocial },
                { label: "Employer Cost", value: `+${fmt(result.employerSocial)}`, color: CHART_COLORS.employer },
                { label: "Total Cost", value: fmt(result.totalCompanyCost), color: CHART_COLORS.employer },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${th.gbd}` }}>
                  <span style={{ fontSize: 12, color: th.t2, display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: r.color }} />
                    {r.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: FM, color: th.tx }}>{r.value}</span>
                </div>
              ))}
            </div>
          </Card>}
        </div>

        {/* Ranking Table */}
        <Card th={th} style={{ padding: 20, marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: th.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>
            Country Ranking — Highest Net Salary ({fmt(annualSalary * div)} gross{periodLabel})
          </div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {Object.values(allResults)
              .sort((a, b) => b.netPct - a.netPct)
              .map((r, i) => {
                const co = COUNTRIES.find(c => c.c === r.country);
                return <div key={r.country} onClick={() => { setCountry(r.country); setView("dashboard"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                    cursor: "pointer", borderRadius: 8, transition: "all 0.15s",
                    background: country === r.country ? th.al : i % 2 === 0 ? th.sh : "transparent",
                  }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: th.t3, fontFamily: FM, width: 24 }}>#{i + 1}</span>
                  <span style={{ fontSize: 18 }}>{co?.f}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: th.tx, flex: 1 }}>{co?.n}</span>
                  <div style={{ width: 120, height: 6, borderRadius: 3, background: th.sh, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${r.netPct}%`, background: r.netPct > 70 ? CHART_COLORS.net : r.netPct > 50 ? CHART_COLORS.warn : CHART_COLORS.tax }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FM, color: r.netPct > 70 ? CHART_COLORS.net : r.netPct > 50 ? CHART_COLORS.warn : CHART_COLORS.tax, width: 45, textAlign: "right" }}>
                    {r.netPct.toFixed(1)}%
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, fontFamily: FM, color: th.t2, width: 80, textAlign: "right" }}>
                    €{(r.net / div).toLocaleString("en", { maximumFractionDigits: 0 })}
                  </span>
                </div>;
              })}
          </div>
        </Card>
      </div>}

      {/* ═══ COMPARE VIEW ═══ */}
      {view === "compare" && <div className="epc-fade">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: th.tx }}>Country Comparison</h2>
            <p style={{ margin: 0, fontSize: 13, color: th.t2 }}>Compare up to 4 countries side by side</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {compareCountries.map((cc, i) => {
              const co = COUNTRIES.find(c => c.c === cc);
              return <div key={cc} style={{
                display: "flex", alignItems: "center", gap: 4, padding: "4px 10px",
                background: th.al, borderRadius: 20, fontSize: 12, fontWeight: 600, color: th.ac,
              }}>
                {co?.f} {co?.n}
                <button onClick={() => setCompareCountries(compareCountries.filter(c => c !== cc))}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  <Ic n="x" s={12} c={th.ac} />
                </button>
              </div>;
            })}
            {compareCountries.length < 4 && <div style={{ position: "relative" }}>
              <Btn th={th} variant="secondary" size="sm" icon="plus" onClick={() => setAddingCompare(!addingCompare)}>Add</Btn>
              {addingCompare && <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 4, zIndex: 50,
                background: th.card, border: `1px solid ${th.gbd}`, borderRadius: G.rXs,
                boxShadow: th.sl, maxHeight: 300, overflowY: "auto", width: 240, padding: 4,
              }}>
                {COUNTRIES.filter(c => TAX_DATA[c.c] && !compareCountries.includes(c.c)).map(c => (
                  <button key={c.c} onClick={() => { setCompareCountries([...compareCountries, c.c]); setAddingCompare(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 10px",
                      border: "none", background: "transparent", borderRadius: 6, cursor: "pointer",
                      fontFamily: F, fontSize: 12, color: th.tx, textAlign: "left",
                    }}>
                    <span style={{ fontSize: 16 }}>{c.f}</span> {c.n}
                  </button>
                ))}
              </div>}
            </div>}
          </div>
        </div>

        <ComparisonView countries={compareCountries} salary={annualSalary} direction={direction} th={th} divisor={div} />

        {/* Comparison bars */}
        {compareCountries.length >= 2 && <Card th={th} style={{ padding: 20, marginTop: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: th.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 }}>
            Visual Comparison
          </div>
          {compareCountries.map(cc => {
            const r = calculateCountry(cc, annualSalary, direction);
            const co = COUNTRIES.find(c => c.c === cc);
            if (!r) return null;
            return <div key={cc} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{co?.f}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: th.tx, flex: 1 }}>{co?.n}</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: FM, color: CHART_COLORS.net }}>
                  Net: €{(r.net / div).toLocaleString("en", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <StackedBar th={th} height={24} segments={[
                { pct: r.netPct, color: CHART_COLORS.net },
                { pct: r.taxPct, color: CHART_COLORS.tax },
                { pct: r.socialPct, color: CHART_COLORS.empSocial },
                { pct: Math.max(0, 100 - r.netPct - r.taxPct - r.socialPct), color: CHART_COLORS.other },
              ]} />
            </div>;
          })}
          <div style={{ display: "flex", gap: 16, marginTop: 8, justifyContent: "center" }}>
            {[
              { label: "Net", color: CHART_COLORS.net },
              { label: "Tax", color: CHART_COLORS.tax },
              { label: "Social", color: CHART_COLORS.empSocial },
              { label: "Other", color: CHART_COLORS.other },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: th.t2 }}>
                <div style={{ width: 8, height: 8, borderRadius: 3, background: l.color }} /> {l.label}
              </div>
            ))}
          </div>
        </Card>}
      </div>}
    </main>}

    {/* Footer */}
    <footer style={{
      padding: "20px", textAlign: "center", borderTop: `1px solid ${th.gbd}`,
      background: th.gbg, backdropFilter: G.blur, WebkitBackdropFilter: G.blur,
    }}>
      <div style={{ fontSize: 11, color: th.t3, lineHeight: 1.6 }}>
        EuropePayCalculator — Salary calculations for 45+ countries · Tax data updated for 2025/2026<br />
        Calculations are estimates for educational purposes. Consult a tax professional for exact figures.<br />
        <span style={{ fontSize: 10, color: th.t3, opacity: 0.6 }}>Built by Adrian Constantin · europepay.calculator</span>
      </div>
      {view !== "landing" && <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 10, fontSize: 11 }}>
        <button onClick={() => exportCSV(allResults, annualSalary)} style={{ background: "none", border: "none", color: th.ac, cursor: "pointer", fontFamily: F, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <Ic n="download" s={11} c={th.ac} /> Export CSV
        </button>
        <button onClick={() => exportJSON(allResults, annualSalary)} style={{ background: "none", border: "none", color: th.ac, cursor: "pointer", fontFamily: F, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <Ic n="download" s={11} c={th.ac} /> Export JSON
        </button>
        <button onClick={handleShare} style={{ background: "none", border: "none", color: th.ac, cursor: "pointer", fontFamily: F, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <Ic n="share" s={11} c={th.ac} /> Share
        </button>
      </div>}
    </footer>

    {/* Mobile Bottom Nav */}
    {view !== "landing" && <nav className="epc-mobile-nav" style={{
      display: "none", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 150,
      background: th.gbg, borderTop: `1px solid ${th.gbd}`,
      backdropFilter: G.blur, WebkitBackdropFilter: G.blur,
      justifyContent: "space-around", padding: "6px 0 env(safe-area-inset-bottom, 6px)",
    }}>
      {[
        { k: "dashboard", icon: "calculator", label: "Calculator" },
        { k: "map", icon: "map", label: "Map" },
        { k: "compare", icon: "bar", label: "Compare" },
      ].map(v => (
        <button key={v.k} data-view={v.k} onClick={() => setView(v.k)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          padding: "6px 16px", border: "none", background: "transparent", cursor: "pointer",
          fontFamily: F, fontSize: 10, fontWeight: v.k === view ? 700 : 500,
          color: v.k === view ? th.ac : th.t3, transition: "all 0.2s",
        }}>
          <Ic n={v.icon} s={20} c={v.k === view ? th.ac : th.t3} />
          {v.label}
        </button>
      ))}
    </nav>}

    {/* Disclaimer Banner */}
    {showDisclaimer && view !== "landing" && <DisclaimerBanner th={th} onDismiss={() => setShowDisclaimer(false)} />}
  </div>;
}
