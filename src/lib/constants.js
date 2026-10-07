export const ACCENTS = ['violet', 'green', 'blue', 'amber', 'pink'];

// Map an entity colorKey to Tailwind-ish inline styles for icon tiles / avatars.
export const COLOR_TILE = {
  violet: { bg: 'rgba(124,108,240,0.16)', fg: '#a99bff' },
  blue: { bg: 'rgba(74,163,255,0.16)', fg: '#7cc0ff' },
  green: { bg: 'rgba(52,211,153,0.16)', fg: '#5ee0b0' },
  amber: { bg: 'rgba(245,181,68,0.18)', fg: '#f6c56d' },
  pink: { bg: 'rgba(244,114,182,0.16)', fg: '#f79ccd' },
};

export const tileColor = (key) => COLOR_TILE[key] || COLOR_TILE.violet;

// Status pill palettes keyed by semantic meaning.
export const STATUS_STYLE = {
  ACTIVE: { bg: 'rgba(52,211,153,0.14)', fg: '#34d399' },
  ON_LEAVE: { bg: 'rgba(245,181,68,0.16)', fg: '#f5b544' },
  INACTIVE: { bg: 'rgba(148,148,180,0.16)', fg: '#9a94c4' },
  PRESENT: { bg: 'rgba(52,211,153,0.14)', fg: '#34d399' },
  LATE: { bg: 'rgba(245,181,68,0.16)', fg: '#f5b544' },
  WFH: { bg: 'rgba(74,163,255,0.14)', fg: '#4aa3ff' },
  HALF_DAY: { bg: 'rgba(148,148,180,0.16)', fg: '#9a94c4' },
  ABSENT: { bg: 'rgba(244,63,110,0.14)', fg: '#f43f6e' },
  LEAVE: { bg: 'rgba(124,108,240,0.16)', fg: '#a99bff' },
  PENDING: { bg: 'rgba(245,181,68,0.16)', fg: '#f5b544' },
  APPROVED: { bg: 'rgba(52,211,153,0.14)', fg: '#34d399' },
  REJECTED: { bg: 'rgba(244,63,110,0.14)', fg: '#f43f6e' },
  CANCELLED: { bg: 'rgba(148,148,180,0.16)', fg: '#9a94c4' },
  DRAFT: { bg: 'rgba(148,148,180,0.16)', fg: '#9a94c4' },
  GENERATED: { bg: 'rgba(74,163,255,0.14)', fg: '#4aa3ff' },
  PAID: { bg: 'rgba(52,211,153,0.14)', fg: '#34d399' },
  PUBLISHED: { bg: 'rgba(52,211,153,0.14)', fg: '#34d399' },
  LOW: { bg: 'rgba(52,211,153,0.14)', fg: '#34d399' },
  MEDIUM: { bg: 'rgba(245,181,68,0.16)', fg: '#f5b544' },
  HIGH: { bg: 'rgba(244,63,110,0.14)', fg: '#f43f6e' },
};

export const statusStyle = (key) =>
  STATUS_STYLE[key] || { bg: 'rgba(148,148,180,0.16)', fg: '#9a94c4' };

// Fixed categorical order for charts (dataviz: assign in order, never cycle).
// Ordered so adjacent hues clear the CVD + normal-vision separation floors
// (validated: worst adjacent ΔE 20.6 normal / 9.2 CVD). Direct labels + legends
// provide the secondary encoding the low light-mode contrast requires.
export const CHART_SERIES = ['#7c6cf0', '#34d399', '#f5b544', '#4aa3ff', '#f472b6'];

export const ROLE_LABEL = {
  ADMIN: 'HR Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
};

// Nav visibility by minimum role rank.
export const ROLE_RANK = { EMPLOYEE: 1, MANAGER: 2, ADMIN: 3 };
