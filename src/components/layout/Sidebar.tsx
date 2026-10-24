import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  GitCompare, 
  Clock, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Globe,
  FileSearch,
  FileCheck2,
  ChevronsUpDown,
  BookOpen
} from 'lucide-react';
import clsx from 'clsx';
import { UserProfile } from '../../types/contract';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenTemplates?: () => void;
  userProfile?: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  onOpenTemplates,
  userProfile
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze', icon: FileText },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'templates', label: 'Templates', icon: BookOpen, action: 'templates' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        'bg-[#FFFDFA] border-r border-[#E6E0D6] flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0 h-screen sticky top-0 shadow-[0_1px_8px_rgba(0,0,0,0.04)]',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Top Header & Logo */}
      <div className="flex flex-col gap-6 pt-5">
        <div className="flex items-center justify-between px-4">
          <div 
            onClick={() => onNavigate('dashboard')} 
            className="flex items-center gap-3 cursor-pointer overflow-hidden group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1C1B19] text-[#FFFFFF] flex items-center justify-center font-serif text-lg italic font-medium shrink-0 shadow-sm transition-transform group-hover:scale-105">
              A
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-sans text-[16px] font-medium tracking-tight text-[#1D1B18] leading-tight">
                  Axiom
                </span>
                <span className="text-[10px] text-[#716B63] uppercase tracking-widest font-medium">
                  Intelligence
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-[#979087] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
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
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-medium',
                  isActive
                    ? 'bg-[#F0ECE4] text-[#1D1B18] shadow-[0_1px_4px_rgba(0,0,0,0.03)]'
                    : 'text-[#716B63] hover:bg-[#EAE5DC] hover:text-[#1D1B18]'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={clsx('w-5 h-5 shrink-0', isActive ? 'text-[#1D1B18]' : 'text-[#716B63]')} />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}

          {/* Contextual links for active results or report */}
          {(currentRoute === 'results' || currentRoute === 'report') && (
            <div className="pt-2 mt-2 border-t border-[#E6E0D6]/60">
              <span className={clsx('text-[10px] font-semibold text-[#979087] uppercase tracking-wider px-3 mb-1 block', collapsed && 'hidden')}>
                Active Document
              </span>
              <button
                onClick={() => onNavigate('results')}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
                  currentRoute === 'results'
                    ? 'bg-[#F0ECE4] text-[#1D1B18] font-medium'
                    : 'text-[#716B63] hover:bg-[#EAE5DC] hover:text-[#1D1B18]'
                )}
                title="Analysis Results"
              >
                <FileCheck2 className="w-4 h-4 shrink-0 text-[#286344]" />
                {!collapsed && <span className="truncate">Results Workspace</span>}
              </button>
              <button
                onClick={() => onNavigate('report')}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
                  currentRoute === 'report'
                    ? 'bg-[#F0ECE4] text-[#1D1B18] font-medium'
                    : 'text-[#716B63] hover:bg-[#EAE5DC] hover:text-[#1D1B18]'
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

      {/* Bottom Area: Landing Page Switcher & User Profile Pill */}
      <div className="p-3 border-t border-[#E6E0D6]/70 space-y-2">
        <button
          onClick={() => onNavigate('landing')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#716B63] hover:text-[#1D1B18] hover:bg-[#F0ECE4] transition-colors"
          title="Back to Landing Page"
        >
          <Globe className="w-4 h-4 shrink-0 text-[#979087]" />
          {!collapsed && <span>Public Landing</span>}
        </button>

        {/* User Profile Pill matching Stitch */}
        <div 
          onClick={() => onNavigate('settings')}
          className={clsx(
            'flex items-center justify-between p-2.5 rounded-xl bg-[#F0ECE4]/70 hover:bg-[#F0ECE4] transition-colors cursor-pointer',
            collapsed ? 'justify-center p-2' : ''
          )}
          title="Account Settings"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1C1B19] flex items-center justify-center shrink-0 shadow-sm text-white font-medium text-xs">
              {userProfile?.name?.charAt(0) || 'K'}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-[#1D1B18] truncate">
                  {userProfile?.name || 'Kunal'}
                </span>
                <span className="text-[11px] text-[#716B63] truncate">
                  Free plan
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronsUpDown className="w-4 h-4 text-[#716B63] shrink-0" />
          )}
        </div>
      </div>
    </aside>
  );
};
