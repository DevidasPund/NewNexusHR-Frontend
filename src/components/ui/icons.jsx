// Minimal inline icon set (stroke=currentColor) so we ship no icon dependency.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const Svg = ({ children, size = 20, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...rest}>
    {children}
  </svg>
);

export const IconDashboard = (p) => (
  <Svg {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></Svg>
);
export const IconUsers = (p) => (
  <Svg {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.2a3 3 0 0 1 0 5.6" /><path d="M17 20a5.5 5.5 0 0 0-2.8-4.8" /></Svg>
);
export const IconClock = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></Svg>
);
export const IconCalendar = (p) => (
  <Svg {...p}><rect x="3.5" y="4.5" width="17" height="16" rx="2.5" /><path d="M3.5 9h17M8 3v3M16 3v3" /></Svg>
);
export const IconWallet = (p) => (
  <Svg {...p}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18M16 14.5h2.5" /></Svg>
);
export const IconChart = (p) => (
  <Svg {...p}><path d="M4 19V5M4 19h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></Svg>
);
export const IconTrophy = (p) => (
  <Svg {...p}><path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" /><path d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3" /><path d="M12 12v4M9 20h6M10 20l.5-4M14 20l-.5-4" /></Svg>
);
export const IconPulse = (p) => (
  <Svg {...p}><path d="M3 12h4l2-6 4 12 2-6h6" /></Svg>
);
export const IconBell = (p) => (
  <Svg {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10.5 19a1.5 1.5 0 0 0 3 0" /></Svg>
);
export const IconGear = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></Svg>
);
export const IconSun = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></Svg>
);
export const IconMoon = (p) => (
  <Svg {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" /></Svg>
);
export const IconMenu = (p) => (
  <Svg {...p}><path d="M4 6h16M4 12h16M4 18h16" /></Svg>
);
export const IconLock = (p) => (
  <Svg {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></Svg>
);
export const IconLogout = (p) => (
  <Svg {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 12H3m0 0 3-3m-3 3 3 3" /></Svg>
);
export const IconChevron = (p) => (
  <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>
);
export const IconPlus = (p) => (
  <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
);
export const IconSearch = (p) => (
  <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
);
export const IconCheck = (p) => (
  <Svg {...p}><path d="M20 6 9 17l-5-5" /></Svg>
);
export const IconX = (p) => (
  <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>
);
export const IconClose = IconX;
export const IconSparkle = (p) => (
  <Svg {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /><path d="M12 9l1.5 1.5L12 12l-1.5-1.5L12 9Z" /></Svg>
);
export const IconDownload = (p) => (
  <Svg {...p}><path d="M12 4v10m0 0 4-4m-4 4-4-4" /><path d="M5 19h14" /></Svg>
);
export const IconBuilding = (p) => (
  <Svg {...p}><rect x="5" y="3" width="14" height="18" rx="1.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></Svg>
);
export const IconMapPin = (p) => (
  <Svg {...p}><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></Svg>
);
export const IconMail = (p) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></Svg>
);
export const IconPhone = (p) => (
  <Svg {...p}><path d="M5 4h3l1.5 4.5-2 1.5a11 11 0 0 0 5 5l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 1-2Z" /></Svg>
);
