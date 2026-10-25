import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onNavigate: (route: string) => void;
  onSearch?: (query: string) => void;
  onToggleMobileMenu?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onNavigate,
  onSearch,
  onToggleMobileMenu,
}) => {
  return (
    <header className="h-16 bg-[#FFFDFA]/90 backdrop-blur-xl z-20 px-6 sm:px-8 shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-[#E6E0D6] flex items-center justify-between gap-4 sticky top-0">
      {/* Search Input with ⌘K Badge */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#979087] w-4 h-4" />
        <input
          type="text"
          placeholder="Search your documents..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full bg-[#F7F4EE]/60 hover:bg-[#F7F4EE] focus:bg-[#FFFDFA] pl-9 pr-14 py-2 rounded-lg text-[#1D1B18] placeholder:text-[#979087] text-xs transition-all outline-none border border-transparent focus:border-[#E6E0D6]"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#E6E0D6]/60 text-[#716B63] text-[10px] font-mono">
          ⌘K
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with unread dot */}
        <button
          onClick={() => onNavigate('history')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors relative"
          title="Notifications & Activity"
          type="button"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#A83224] rounded-full"></span>
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => onNavigate('settings')}
          className="w-8 h-8 rounded-full bg-[#1C1B19] flex items-center justify-center shadow-sm text-white text-xs font-medium cursor-pointer hover:ring-2 hover:ring-[#1C1B19]/20 transition-all"
          title="Profile & Settings"
        >
          <span>K</span>
        </div>

        {/* Mobile menu trigger */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4]"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
};
