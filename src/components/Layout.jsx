import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from './SideNav';
import TopBar from './TopBar';

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <SideNav />
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full animate-fade-in">
            <SideNav onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <TopBar onMenu={() => setDrawerOpen(true)} />
        <main className="custom-scroll flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
