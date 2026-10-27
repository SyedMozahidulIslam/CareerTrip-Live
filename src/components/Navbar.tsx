import React from 'react';
import { User } from '../types';

export type AppView =
  | 'recruiter'
  | 'portfolio'
  | 'projects'
  | 'assessments'
  | 'learning'
  | 'verification'
  | 'integrity'
  | 'analytics';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  onOpenPublicView: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  allUsers,
  onSelectUser,
  onOpenPublicView,
}) => {
  const navItems: { view: AppView; num: string; label: string }[] = [
    { view: 'recruiter', num: '01', label: 'DISCOVERY' },
    { view: 'portfolio', num: '02', label: 'PORTFOLIO' },
    { view: 'projects', num: '03', label: 'EVIDENCE ROOMS' },
    { view: 'assessments', num: '04', label: 'ASSESSMENTS' },
    { view: 'learning', num: '05', label: 'SKILL GAPS' },
    { view: 'verification', num: '06', label: 'VERIFICATION' },
    { view: 'integrity', num: '07', label: 'INTEGRITY' },
    { view: 'analytics', num: '08', label: 'METRICS' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#000000] border-b border-[#272727] text-[#F1F2F2]">
      {/* Top Status Bar: Swiss metadata strip */}
      <div className="border-b border-[#1A1A1A] px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-[10px] font-mono tracking-wider text-[#767676]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#F1F2F2]">
            <span className="w-1.5 h-1.5 bg-[#F56B2A] inline-block"></span>
            CAREERTRIP // OPERATIONAL SPECIFICATION
          </span>
          <span className="hidden sm:inline text-[#333333]">|</span>
          <span className="hidden sm:inline">REF: ISO-27001 AUDITABLE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">SYSTEM STATE: NOMINAL</span>
          <span className="text-[#333333]">|</span>
          <span>TZ: UTC-7</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch justify-between h-14">
          {/* Brand & Catalogue Code */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none pr-6 border-r border-[#272727]"
            onClick={() => setCurrentView('portfolio')}
          >
            <div className="w-6 h-6 bg-[#F56B2A] flex items-center justify-center font-mono font-bold text-black text-xs">
              CT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[#F1F2F2] uppercase">
                  CareerTrip
                </span>
                <span className="text-[10px] font-mono text-[#F56B2A] font-semibold tracking-wider">
                  LIVE
                </span>
              </div>
              <div className="text-[9px] font-mono text-[#767676] tracking-widest uppercase">
                Verifiable Network
              </div>
            </div>
          </div>

          {/* Navigation Links (Numbered Editorial Grid) */}
          <nav className="hidden xl:flex items-stretch">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`px-3.5 flex flex-col justify-center border-r border-[#272727] text-left transition-colors relative ${
                    isActive
                      ? 'bg-[#0F0E12] text-[#F1F2F2]'
                      : 'text-[#767676] hover:text-[#F1F2F2] hover:bg-[#070708]'
                  }`}
                >
                  <span className="font-mono text-[9px] text-[#767676] block tracking-tighter">
                    {item.num}
                  </span>
                  <span className="font-mono text-[11px] font-medium tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F56B2A]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 pl-4">
            <button
              onClick={onOpenPublicView}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-[#F1F2F2] bg-transparent hover:bg-[#F1F2F2] hover:text-[#000000] border border-[#272727] transition-colors uppercase tracking-wider"
              title="Preview candidate dossier as seen by external recruiters"
            >
              <span>[PUBLIC DOSSIER]</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="flex items-center bg-[#0F0E12] border border-[#272727] px-2 py-1">
              <span className="text-[10px] font-mono text-[#767676] mr-1.5 uppercase tracking-wider">
                ACTOR:
              </span>
              <label htmlFor="user-persona-select" className="sr-only">Switch active persona</label>
              <select
                id="user-persona-select"
                value={currentUser.id}
                onChange={(e) => {
                  const sel = allUsers.find((u) => u.id === e.target.value);
                  if (sel) onSelectUser(sel);
                }}
                className="bg-transparent text-[11px] font-mono text-[#F1F2F2] focus:outline-none cursor-pointer pr-1"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#000000] text-[#F1F2F2]">
                    {u.name} [{u.role === 'candidate' ? u.verifiedTier.toUpperCase() : u.role.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-navigation for Medium/Mobile viewports */}
      <div className="xl:hidden flex items-center overflow-x-auto border-t border-[#272727] bg-[#070709] divide-x divide-[#272727] text-[11px] font-mono">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`px-3 py-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentView === item.view
                ? 'bg-[#000000] text-[#F56B2A] font-semibold'
                : 'text-[#767676] hover:text-[#F1F2F2]'
            }`}
          >
            <span className="text-[9px] text-[#555555]">{item.num}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
