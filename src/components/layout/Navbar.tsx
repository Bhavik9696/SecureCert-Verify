import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { Shield, Sun, Moon, LogOut, Bell, Building2, Users, ChevronDown, Check, ArrowRightLeft } from 'lucide-react';
import { FacultyTeam } from '../../types/index.js';

export const Navbar: React.FC = () => {
  const { user, logout, activeTeam, availableTeams, teamMembers, setActiveTeam, toggleTeam } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsTeamMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-sm sm:text-lg text-slate-900 dark:text-white tracking-tight truncate">
                SecureCert <span className="text-blue-600 dark:text-blue-400">Verify</span>
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800">
                Lecturer Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden lg:block">
              Bulk Certificate Verification & Discrepancy Detection System
            </p>
          </div>
        </div>

        {/* Right: Controls & Lecturer Profile */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Active Team Dropdown & Quick Toggle */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-1">
              <button
                id="toggle-team-quick-btn"
                onClick={toggleTeam}
                className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors border border-blue-200/60 dark:border-blue-900/60 items-center gap-1"
                title="Cycle to next department team"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs font-bold hidden xl:inline">Toggle</span>
              </button>

              <button
                id="toggle-team-dropdown-btn"
                onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
                title="Select Academic Department Team"
              >
                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="max-w-[65px] xs:max-w-[90px] sm:max-w-[150px] truncate text-[11px] sm:text-xs">
                  {activeTeam}
                </span>
                <ChevronDown className={`w-3 h-3 opacity-60 transition-transform shrink-0 ${isTeamMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Team Dropdown Menu */}
            {isTeamMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Active Team
                  </span>
                  <button
                    onClick={() => {
                      toggleTeam();
                      setIsTeamMenuOpen(false);
                    }}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <ArrowRightLeft className="w-3 h-3" />
                    <span>Quick Toggle</span>
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {availableTeams.map((team) => {
                    const isSelected = activeTeam === team;
                    return (
                      <button
                        key={team}
                        onClick={() => {
                          setActiveTeam(team);
                          setIsTeamMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <Building2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          <span className="truncate">{team}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="px-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 text-[10px]">{teamMembers.length} Members</span>
                  <button
                    onClick={() => {
                      setIsTeamMenuOpen(false);
                      setShowTeamModal(true);
                    }}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-[10px]"
                  >
                    View Roster →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Notification Icon */}
          <button
            id="notifications-btn"
            className="hidden xs:flex p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative"
            title="System Alerts"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
          </button>

          {/* Lecturer Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
              }
              alt={user?.name || 'Lecturer'}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {user?.name || 'Dr. Rajesh Sharma'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {user?.email || 'lecturer@university.edu'}
              </div>
            </div>

            <button
              id="logout-btn"
              onClick={logout}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
              title="Logout Lecturer Session"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Team Roster Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>{activeTeam}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Faculty team members & certificate verification auditors
                </p>
              </div>
              <button
                onClick={() => setShowTeamModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
                >
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {member.name}
                    </div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                      {member.role}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{member.email}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  toggleTeam();
                }}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold rounded-xl border border-blue-200 dark:border-blue-800 flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Toggle To Next Team</span>
              </button>

              <button
                onClick={() => setShowTeamModal(false)}
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
