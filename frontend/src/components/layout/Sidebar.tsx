import React, { useState } from 'react';
import { 
  LayoutGrid, 
  FileText, 
  GitCompare, 
  Clock, 
  Settings, 
  ChevronRight, 
  Globe, 
  FileSearch, 
  FileCheck2, 
  BookOpen, 
  LogOut 
} from 'lucide-react';
import clsx from 'clsx';
import { UserProfile } from '../../types/contract';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenTemplates?: () => void;
  userProfile?: UserProfile;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  onOpenTemplates,
  userProfile,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // Exact navigation item order specified in reference
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'analyze', label: 'Analyze', icon: FileText },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'templates', label: 'Templates', icon: BookOpen, action: 'templates' },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const userInitial = userProfile?.name?.trim()
    ? userProfile.name.trim().charAt(0).toUpperCase()
    : 'K';

  const userRole = userProfile?.role?.trim()
    ? userProfile.role.trim().charAt(0).toUpperCase() + userProfile.role.trim().slice(1)
    : 'Student';

  return (
    <aside
      className={clsx(
        'bg-[#F7F4EE] border-r border-[#E6E0D6] flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0 h-screen sticky top-0 relative',
        collapsed ? 'w-20' : 'w-60 lg:w-64'
      )}
    >
      {/* Top Header & Brand Wordmark */}
      <div className="flex flex-col pt-6">
        <div className="flex items-center justify-between px-5 pb-5">
          <div 
            onClick={() => onNavigate('dashboard')} 
            className="flex flex-col cursor-pointer overflow-hidden group select-none"
          >
            {!collapsed ? (
              <>
                <span className="font-display font-bold text-[22px] tracking-[0.14em] text-[#111110] leading-none">
                  AXIOM
                </span>
                <span className="text-[9px] font-sans font-bold tracking-[0.26em] text-[#8A857D] uppercase mt-1">
                  INTELLIGENCE
                </span>
              </>
            ) : (
              <span className="font-display font-bold text-xl text-[#111110] leading-none">
                A
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-[#8A857D] hover:text-[#111110] hover:bg-[#EAE5DC]/60 transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={clsx('w-4 h-4 transition-transform', collapsed ? 'rotate-0' : 'opacity-70')} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action === 'templates' && onOpenTemplates) {
                    onOpenTemplates();
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={clsx(
                  'w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-md text-xs sm:text-[13px] font-medium transition-colors text-left cursor-pointer',
                  isActive
                    ? 'bg-[#111110] text-[#FFFFFF] shadow-xs'
                    : 'text-[#1D1B18] hover:bg-[#EAE5DC]/60 hover:text-[#111110]'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-[#FFFFFF]' : 'text-[#111110]')} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}

          {/* Contextual links for active results or report */}
          {(currentRoute === 'results' || currentRoute === 'report') && (
            <div className="pt-2 mt-2 border-t border-[#E6E0D6]/60">
              <span className={clsx('text-[10px] font-semibold text-[#8A857D] uppercase tracking-wider px-3 mb-1 block', collapsed && 'hidden')}>
                Active Document
              </span>
              <button
                onClick={() => onNavigate('results')}
                className={clsx(
                  'w-full flex items-center gap-3 px-3.5 py-2 rounded-md text-xs font-medium transition-colors text-left cursor-pointer',
                  currentRoute === 'results'
                    ? 'bg-[#111110] text-[#FFFFFF]'
                    : 'text-[#716B63] hover:bg-[#EAE5DC]/60 hover:text-[#1D1B18]'
                )}
                title="Analysis Results"
              >
                <FileCheck2 className="w-4 h-4 shrink-0 text-[#286344]" />
                {!collapsed && <span className="truncate">Results Workspace</span>}
              </button>
              <button
                onClick={() => onNavigate('report')}
                className={clsx(
                  'w-full flex items-center gap-3 px-3.5 py-2 rounded-md text-xs font-medium transition-colors text-left cursor-pointer',
                  currentRoute === 'report'
                    ? 'bg-[#111110] text-[#FFFFFF]'
                    : 'text-[#716B63] hover:bg-[#EAE5DC]/60 hover:text-[#1D1B18]'
                )}
                title="Analysis Report"
              >
                <FileSearch className="w-4 h-4 shrink-0 text-[#365B91]" />
                {!collapsed && <span className="truncate">Audit Report</span>}
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Middle/Lower Section: Architectural Corinthian Pillar Composition */}
      {!collapsed && (
        <div className="relative w-full flex-1 min-h-[240px] max-h-[460px] overflow-hidden my-auto select-none pointer-events-none flex items-end justify-start bg-[var(--color-axiom-bg,#F7F4EE)]">
          {/* Subtle architectural drafting grid lines */}
          <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#E6E0D6_1px,transparent_1px),linear-gradient(to_bottom,#E6E0D6_1px,transparent_1px)] bg-[size:14px_14px]" />

          {/* Classical Corinthian pillar with diagonal roofline and complete pointed red graphic */}
          <img
            src="/images/sidebar-pillar.png"
            srcSet="/images/sidebar-pillar.png 1x, /images/sidebar-pillar@2x.png 2x"
            alt="Classical Corinthian column architectural composition with red brand shard"
            className="w-full h-full object-contain object-left-bottom mix-blend-multiply relative z-10"
          />
        </div>
      )}

      {/* Bottom Area: Landing Page Switcher, Logout & User Profile */}
      <div className="p-3 space-y-1 select-none z-10">
        <button
          onClick={() => onNavigate('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-[#1D1B18] hover:bg-[#EAE5DC]/60 transition-colors cursor-pointer"
          title="Back to Landing Page"
        >
          <Globe className="w-4 h-4 shrink-0 text-[#8A857D]" />
          {!collapsed && <span>Public Landing</span>}
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-[#D92228] hover:bg-[#FCE4DF]/60 transition-colors cursor-pointer"
            title="Sign Out of Axiom"
          >
            <LogOut className="w-4 h-4 shrink-0 text-[#D92228]" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        )}

        <div className="border-t border-[#E6E0D6] my-2" />

        {/* User Profile Pill */}
        <div 
          onClick={() => onNavigate('settings')}
          className={clsx(
            'flex items-center justify-between p-2 rounded-md hover:bg-[#EAE5DC]/60 transition-colors cursor-pointer',
            collapsed ? 'justify-center p-2' : ''
          )}
          title="Account Settings"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#111110] flex items-center justify-center shrink-0 shadow-xs text-white font-medium text-xs">
              {userInitial}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-medium text-[#111110] truncate">
                  {userProfile?.name || 'Kunal Suryanshi'}
                </span>
                <span className="text-[11px] text-[#8A857D] truncate">
                  {userRole}
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronRight className="w-3.5 h-3.5 text-[#8A857D] shrink-0" />
          )}
        </div>
      </div>
    </aside>
  );
};
