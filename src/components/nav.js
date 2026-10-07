import {
  IconDashboard,
  IconUsers,
  IconClock,
  IconCalendar,
  IconWallet,
  IconTrophy,
  IconChart,
  IconGear,
  IconBuilding,
} from './ui/icons';

// minRole: the lowest role that may access. Items above the user's rank render locked.
export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, minRole: 'EMPLOYEE', end: true },
  { to: '/employees', label: 'Employees', icon: IconUsers, minRole: 'EMPLOYEE' },
  { to: '/departments', label: 'Departments', icon: IconBuilding, minRole: 'MANAGER' },
  { to: '/attendance', label: 'Attendance', icon: IconClock, minRole: 'EMPLOYEE' },
  { to: '/leave', label: 'Leave', icon: IconCalendar, minRole: 'EMPLOYEE' },
  { to: '/payroll', label: 'Payroll', icon: IconWallet, minRole: 'EMPLOYEE' },
  { to: '/performance', label: 'Performance', icon: IconTrophy, minRole: 'EMPLOYEE' },
  { to: '/analytics', label: 'Analytics', icon: IconChart, minRole: 'MANAGER' },
  { to: '/settings', label: 'Settings', icon: IconGear, minRole: 'EMPLOYEE' },
];
