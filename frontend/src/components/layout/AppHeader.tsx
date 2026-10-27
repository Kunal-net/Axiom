import React from 'react';
import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { UserProfile } from '../../types/contract';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onNavigate: (route: string) => void;
  onSearch?: (query: string) => void;
  onToggleMobileMenu?: () => void;
  userProfile?: UserProfile;
  onLogout?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onNavigate,
  onSearch,
  onToggleMobileMenu,
  userProfile,
  onLogout,
}) => {
  const userInitial = userProfile?.name?.trim()
    ? userProfile.name.trim().charAt(0).toUpperCase()
    : 'K';

  return (
    <header className="h-14 bg-[#F7F4EE] z-20 px-6 sm:px-8 border-b border-[#E6E0D6] flex items-center justify-between gap-4 sticky top-0 select-none">
      {/* Search Input with ⌘K Shortcut Badge */}
      <div className="relative flex-1 max-w-[420px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A857D] w-4 h-4" />
        <input
          type="text"
          placeholder="Search your documents, clauses, or insights..."
          onChange={(e) => onSearch?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onNavigate('history');
            }
          }}
          className="w-full bg-[#FFFDFA] border border-[#E6E0D6] rounded-md pl-9 pr-12 py-1.5 text-xs text-[#111110] placeholder:text-[#8A857D] outline-none focus:border-[#111110] transition-colors"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-[#E6E0D6] bg-[#F7F4EE] text-[#8A857D] text-[10px] font-mono select-none">
          ⌘K
        </span>
      </div>

      {/* Right Utility Controls */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with Red Dot */}
        <button
          onClick={() => onNavigate('history')}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[#716B63] hover:text-[#111110] hover:bg-[#EAE5DC]/60 transition-colors relative cursor-pointer"
          title="Notifications & Activity"
          type="button"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D92228] rounded-full"></span>
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => onNavigate('settings')}
          className="w-8 h-8 rounded-full bg-[#111110] flex items-center justify-center shadow-xs text-white text-xs font-semibold cursor-pointer hover:ring-2 hover:ring-[#111110]/20 transition-all select-none"
          title={userProfile?.name ? `${userProfile.name} • ${userProfile.email}` : 'Profile & Settings'}
        >
          <span>{userInitial}</span>
        </div>

        {/* Mobile menu trigger */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-md text-[#716B63] hover:text-[#111110] hover:bg-[#EAE5DC]/60"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="md:hidden w-8 h-8 rounded-md flex items-center justify-center text-[#716B63] hover:text-[#D92228] hover:bg-[#FCE4DF]/50 transition-colors"
            title="Sign Out of Axiom"
            type="button"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
