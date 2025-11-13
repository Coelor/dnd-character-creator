import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Scroll, Calendar, Settings, LogOut, Menu } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';

interface SidebarProps {
  user: User;
  signOut: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Characters', href: '/characters', icon: Users },
  { name: 'Campaigns', href: '/campaigns', icon: Scroll },
  { name: 'Sessions', href: '/sessions', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ user, signOut }: SidebarProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  
  return (
    <aside
      className={`
        flex flex-col h-screen border-r transition-all
        ${collapsed ? 'w-20' : 'w-64'}
      `}
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
              D&D Manager
            </h2>
          )}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-(--color-surface-hover)"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>
      </div>
      
      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-(--color-accent) flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${isActive ? 'bg-(--color-accent) text-white' : 'hover:bg-(--color-surface-hover)'}
              `}
              style={!isActive ? { color: 'var(--color-text)' } : undefined}
              title={collapsed ? item.name : undefined}
            >
              <Icon size={20} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Sign Out */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={signOut}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-all
            hover:bg-red-50 hover:text-red-600
          `}
          style={{ color: 'var(--color-text)' }}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut size={20} />
          {!collapsed && (
            <span className="text-sm font-medium">Sign out</span>
          )}
        </button>
      </div>
    </aside>
  );
}