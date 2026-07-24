import React from 'react';
import {
  LayoutDashboard,
  FolderUp,
  FileCheck2,
  FileSpreadsheet,
  BookOpenCheck,
  PlusCircle,
  Users,
  ArrowRightLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export type NavTab = 'dashboard' | 'assignments' | 'upload' | 'results' | 'reports';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onQuickUploadClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onQuickUploadClick,
}) => {
  const { activeTeam, toggleTeam, teamMembers } = useAuth();

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Verification stats & summary',
    },
    {
      id: 'assignments' as NavTab,
      label: 'Assignments',
      icon: BookOpenCheck,
      description: 'Course certificate tasks',
    },
    {
      id: 'upload' as NavTab,
      label: 'Bulk Upload',
      icon: FolderUp,
      description: 'Folder & multi-file scan',
    },
    {
      id: 'results' as NavTab,
      label: 'Results Audit',
      icon: FileCheck2,
      description: 'Audit table & fake detection',
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports & Export',
      icon: FileSpreadsheet,
      description: 'Excel, PDF & CSV export',
    },
  ];

  return (
    <>
      {/* Mobile Horizontal Scrollable Tab Bar */}
      <div className="block md:hidden w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 sticky top-14 sm:top-16 z-30 shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Quick Toggle Team Button on Mobile Bar */}
          <button
            id="mobile-toggle-team-btn"
            onClick={toggleTeam}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 whitespace-nowrap shrink-0"
            title="Toggle Team"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="max-w-[120px] truncate">{activeTeam}</span>
          </button>
        </div>
      </div>

      {/* Desktop Vertical Sidebar */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex-col justify-between shrink-0 transition-colors">
        <div className="space-y-6">
          {/* Navigation Heading */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3">
              Lecturer Navigation
            </h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                    <div className="flex-1 truncate">
                      <div>{item.label}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Active Team Widget with Toggle Team Button */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-500" />
                <span>Active Team</span>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {teamMembers.length} Members
              </span>
            </div>

            <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
              {activeTeam}
            </div>

            <button
              id="sidebar-toggle-team-btn"
              onClick={toggleTeam}
              className="w-full py-1.5 px-2 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-[11px] rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs transition-all flex items-center justify-center gap-1.5"
              title="Toggle Next Department Team"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Toggle Team</span>
            </button>
          </div>

          {/* Quick Bulk Action */}
          {onQuickUploadClick && (
            <div>
              <button
                id="sidebar-quick-upload-btn"
                onClick={onQuickUploadClick}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Quick Folder Upload</span>
              </button>
            </div>
          )}
        </div>

        {/* Info Widget */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <div className="font-semibold text-slate-900 dark:text-slate-200 mb-1">
              Verification Rules Active
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              QR portal check, OCR name comparison & SHA-256 duplicate detection active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
