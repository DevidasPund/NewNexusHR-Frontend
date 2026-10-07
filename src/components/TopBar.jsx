import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './ui/Primitives';
import { ROLE_LABEL } from '../lib/constants';
import { relativeTime } from '../lib/format';
import api from '../lib/api';
import {
  IconMenu,
  IconSun,
  IconMoon,
  IconBell,
  IconGear,
  IconChevron,
  IconLogout,
  IconSparkle,
} from './ui/icons';

export default function TopBar({ onMenu }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const notifRef = useRef(null);
  const menuRef = useRef(null);

  const loadNotifs = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifs(data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = async () => {
    await api.post('/notifications/read-all');
    loadNotifs();
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-elevated/80 px-4 backdrop-blur"
      style={{ borderColor: 'var(--border)' }}
    >
      <button onClick={onMenu} className="rounded-lg p-2 text-muted hover:bg-card-hover hover:text-ink lg:hidden">
        <IconMenu />
      </button>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="rounded-lg p-2 text-muted transition hover:bg-card-hover hover:text-ink"
        title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
      >
        {theme === 'dark' ? <IconSun /> : <IconMoon />}
      </button>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setShowNotifs((s) => !s)}
          className="relative rounded-lg p-2 text-muted transition hover:bg-card-hover hover:text-ink"
        >
          <IconBell />
          {unread > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
              style={{ background: 'var(--danger)' }}
            >
              {unread}
            </span>
          )}
        </button>
        {showNotifs && (
          <div
            className="absolute right-0 mt-2 w-80 animate-fade-in rounded-2xl border bg-elevated shadow-card"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            <div className="flex items-center justify-between border-b p-3.5" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm font-semibold text-ink">Notifications</span>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="custom-scroll max-h-80 overflow-y-auto">
              {notifs.length === 0 && <div className="p-5 text-center text-xs text-muted">No notifications</div>}
              {notifs.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 border-b p-3.5 last:border-0"
                  style={{ borderColor: 'var(--border)', opacity: n.read ? 0.6 : 1 }}
                >
                  <span className="mt-0.5 text-accent"><IconSparkle size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-ink">{n.title}</div>
                    <div className="text-xs text-muted">{n.body}</div>
                    <div className="mono-label mt-1">{relativeTime(n.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/settings')}
        className="rounded-lg p-2 text-muted transition hover:bg-card-hover hover:text-ink"
      >
        <IconGear />
      </button>

      {/* Avatar dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((s) => !s)}
          className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition hover:bg-card-hover"
        >
          <Avatar name={user?.fullName} colorKey={user?.avatarColor} size="sm" />
          <IconChevron size={16} className="text-muted" />
        </button>
        {showMenu && (
          <div
            className="absolute right-0 mt-2 w-56 animate-fade-in rounded-2xl border bg-elevated p-1.5 shadow-card"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            <div className="border-b px-3 py-2.5" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm font-semibold text-ink">{user?.fullName}</div>
              <div className="text-xs text-muted">{user?.email}</div>
              <div className="mono-label mt-1">{ROLE_LABEL[user?.role]}</div>
            </div>
            <button
              onClick={() => { setShowMenu(false); navigate('/settings'); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink transition hover:bg-card-hover"
            >
              <IconGear size={16} /> Settings
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition hover:bg-card-hover"
              style={{ color: 'var(--danger)' }}
            >
              <IconLogout size={16} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
