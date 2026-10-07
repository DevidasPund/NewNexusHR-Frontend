import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { NAV_ITEMS } from './nav';
import { IconLock } from './ui/icons';
import { ROLE_RANK, ROLE_LABEL } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './ui/Primitives';

export default function SideNav({ onNavigate }) {
  const { user } = useAuth();
  const rank = ROLE_RANK[user?.role] || 1;

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-elevated" style={{ borderColor: 'var(--border)' }}>
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <div className="px-3">
        <div className="mono-label px-3 pb-2">Menu</div>
      </div>

      <nav className="custom-scroll flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {NAV_ITEMS.map((item) => {
          const locked = (ROLE_RANK[item.minRole] || 1) > rank;
          const Icon = item.icon;

          if (locked) {
            return (
              <div
                key={item.to}
                className="nav-link cursor-not-allowed opacity-55"
                title={`Requires ${ROLE_LABEL[item.minRole]} access`}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                <IconLock size={14} />
              </div>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar name={user?.fullName} colorKey={user?.avatarColor} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink">{user?.fullName}</div>
            <div className="mono-label">{ROLE_LABEL[user?.role]}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
