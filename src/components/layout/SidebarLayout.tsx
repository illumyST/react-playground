import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Icon } from '@/components';
import type { IconName } from '@/components';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: 'House' },
  { to: '/grouping', label: 'Grouping Tool', icon: 'UsersThree' },
  { to: '/emoji', label: 'Emoji', icon: 'Smiley' },
  { to: '/weather', label: 'Weather Api', icon: 'CloudSun' },
  { to: '/metronome', label: 'Metronome', icon: 'Metronome' },
  { to: '/webmcp', label: 'WebMCP', icon: 'Globe' },
  { to: '/docusaurus', label: 'Docusaurus', icon: 'FileDoc' },
  { to: '/remotion', label: 'Remotion', icon: 'FilmSlate' },
];

const SidebarLayout = (): React.ReactNode => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile topbar */}
      <div className="sticky top-0 z-20 flex h-[48px] items-center bg-surface-1 border-b border-outline-2 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <button
          className="accessible-zone ml-md"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="size-[24px]" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[256px] border-r border-outline-2 bg-surface-1 transition-transform ${
          !sidebarOpen ? '-translate-x-full' : ''
        } lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="p-lg">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="mb-xl flex items-center gap-md hover:opacity-80 transition-opacity"
          >
            <img src="/stone.svg" alt="Stone logo" className="h-[28px] w-auto" />
            <span className="title-lg">Stone&apos;s Home</span>
          </Link>
          <nav>
            <ul className="space-y-xs">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-md rounded-md px-lg py-sm transition-colors hover:overlay-2 ${
                        isActive ? 'bg-surface-4 font-bold' : ''
                      }`
                    }
                  >
                    <Icon iconName={item.icon} size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-main overflow-auto bg-surface-3 p-2xl lg:ml-[256px]">
        <Outlet />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          data-state={sidebarOpen ? 'open' : 'closed'}
          className="fixed inset-0 z-30 bg-overlay-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarLayout;
