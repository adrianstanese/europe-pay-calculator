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

// ─── SVG MAP PATHS (simplified Europe) ──────────────────────────
const MAP_PATHS = {
  DE: "M 285 165 L 300 155 L 315 160 L 320 175 L 315 195 L 305 210 L 290 215 L 275 205 L 270 190 L 275 175 Z",
  FR: "M 225 195 L 250 185 L 275 195 L 280 215 L 270 240 L 250 255 L 230 250 L 215 235 L 210 215 Z",
  GB: "M 215 125 L 225 115 L 235 120 L 240 140 L 235 160 L 225 165 L 215 155 L 210 140 Z",
  ES: "M 195 250 L 225 240 L 250 250 L 255 275 L 240 295 L 215 300 L 195 290 L 185 270 Z",
  IT: "M 285 225 L 300 220 L 310 235 L 305 260 L 295 285 L 285 300 L 280 280 L 275 255 L 280 240 Z",
  PT: "M 175 260 L 190 255 L 195 275 L 190 295 L 180 300 L 172 285 Z",
  NL: "M 270 150 L 282 148 L 288 155 L 285 165 L 275 168 L 268 160 Z",
  BE: "M 258 165 L 272 162 L 278 170 L 275 178 L 262 180 L 255 172 Z",
  AT: "M 290 195 L 310 190 L 330 195 L 335 205 L 320 210 L 300 212 L 288 205 Z",
  CH: "M 268 200 L 285 197 L 292 205 L 288 215 L 275 218 L 266 210 Z",
  PL: "M 320 155 L 345 150 L 360 160 L 365 180 L 350 190 L 330 188 L 318 175 Z",
  CZ: "M 305 175 L 325 172 L 335 180 L 330 192 L 315 195 L 302 188 Z",
  SK: "M 335 182 L 355 178 L 365 185 L 358 195 L 340 198 L 332 192 Z",
  HU: "M 330 200 L 350 195 L 365 202 L 362 215 L 345 220 L 328 213 Z",
  RO: "M 360 200 L 385 195 L 400 205 L 398 222 L 382 230 L 362 225 L 355 212 Z",
  BG: "M 370 230 L 390 225 L 405 235 L 400 248 L 385 255 L 368 248 Z",
  GR: "M 360 260 L 378 255 L 390 265 L 385 285 L 370 295 L 355 285 L 350 270 Z",
  HR: "M 315 215 L 330 210 L 340 220 L 335 232 L 320 238 L 310 228 Z",
  SI: "M 305 212 L 318 210 L 325 218 L 320 226 L 308 228 L 302 220 Z",
  RS: "M 345 225 L 360 220 L 370 230 L 368 245 L 355 252 L 342 245 L 340 235 Z",
  BA: "M 325 228 L 340 225 L 348 235 L 345 248 L 332 252 L 322 242 Z",
  ME: "M 340 250 L 352 248 L 358 255 L 355 265 L 345 268 L 338 260 Z",
  MK: "M 358 252 L 372 248 L 380 258 L 375 268 L 362 272 L 355 262 Z",
  AL: "M 350 268 L 362 265 L 368 275 L 365 290 L 355 295 L 348 282 Z",
  XK: "M 350 248 L 360 245 L 368 252 L 365 262 L 355 265 L 348 258 Z",
  SE: "M 305 60 L 315 55 L 325 65 L 330 95 L 325 130 L 315 145 L 305 135 L 300 105 L 298 80 Z",
  NO: "M 275 50 L 295 40 L 310 55 L 308 80 L 300 105 L 290 120 L 280 110 L 270 85 L 268 65 Z",
  FI: "M 340 45 L 360 40 L 375 55 L 380 85 L 370 120 L 355 135 L 340 125 L 335 95 L 332 65 Z",
  DK: "M 285 140 L 295 135 L 305 140 L 308 152 L 298 158 L 288 155 L 283 148 Z",
  IE: "M 190 130 L 205 125 L 212 135 L 210 150 L 200 158 L 188 150 L 185 140 Z",
  EE: "M 360 115 L 378 112 L 385 120 L 382 130 L 368 134 L 358 126 Z",
  LV: "M 358 132 L 378 128 L 386 136 L 382 148 L 368 152 L 356 144 Z",
  LT: "M 348 150 L 368 146 L 376 155 L 372 168 L 358 172 L 346 164 Z",
  LU: "M 262 178 L 270 176 L 274 182 L 271 188 L 264 190 L 260 184 Z",
  MT: "M 290 310 L 298 308 L 302 314 L 298 320 L 290 318 Z",
  CY: "M 420 275 L 432 272 L 440 280 L 436 290 L 425 294 L 418 286 Z",
  UA: "M 380 160 L 410 150 L 435 165 L 440 185 L 425 200 L 400 205 L 385 195 L 375 178 Z",
  MD: "M 400 195 L 412 192 L 418 200 L 415 212 L 405 216 L 398 208 Z",
  BY: "M 370 140 L 395 135 L 410 148 L 408 168 L 392 175 L 375 170 L 368 155 Z",
  TR: "M 400 250 L 430 240 L 465 248 L 475 265 L 460 280 L 430 285 L 405 278 L 395 265 Z",
  IS: "M 130 40 L 165 35 L 180 48 L 175 62 L 155 68 L 135 62 L 125 52 Z",
  CH2: null, // Use CH
  LI: "M 290 200 L 294 198 L 296 204 L 293 208 L 289 206 Z",
  SA: "M 445 310 L 475 300 L 500 315 L 495 340 L 470 350 L 445 340 Z",
  AE: "M 500 320 L 520 315 L 528 328 L 522 340 L 505 342 L 498 332 Z",
  BH: "M 495 310 L 502 308 L 506 315 L 502 320 L 496 318 Z",
  KZ: "M 460 155 L 510 140 L 545 160 L 540 185 L 510 195 L 475 190 L 455 175 Z",
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
    <svg viewBox="100 20 460 340" style={{ width: "100%", maxWidth: 700, margin: "0 auto", display: "block" }}>
      {Object.entries(MAP_PATHS).map(([cc, path]) => {
        if (!path || !TAX_DATA[cc]) return null;
        const isSelected = selected === cc;
        const isHovered = hover === cc;
        return <path key={cc} d={path}
          fill={getColor(cc)} stroke={isSelected ? th.ac : th.tx} strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 0.5}
          opacity={isSelected ? 1 : isHovered ? 0.9 : 0.75}
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
      {Object.entries(MAP_PATHS).map(([cc, path]) => {
        if (!path || !TAX_DATA[cc]) return null;
        // Get centroid approximation from path
        const co = COUNTRIES.find(c => c.c === cc);
        if (!co) return null;
        const nums = path.match(/[\d.]+/g).map(Number);
        const xs = nums.filter((_, i) => i % 2 === 0);
        const ys = nums.filter((_, i) => i % 2 === 1);
        const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
        const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
        return <text key={`lbl-${cc}`} x={cx} y={cy + 2} textAnchor="middle" fontSize="7" fontWeight="700"
          fill={selected === cc ? "#fff" : "rgba(255,255,255,0.9)"} style={{ pointerEvents: "none", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
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
