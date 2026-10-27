import React from 'react';
import { User } from '../types';
import {
  ShieldCheck,
  Briefcase,
  Code2,
  GraduationCap,
  Sparkles,
  Users,
  Search,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  BarChart3,
  Fingerprint
} from 'lucide-react';

export type AppView =
  | 'portfolio'
  | 'projects'
  | 'assessments'
  | 'recruiter'
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
  return (
    <header className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800 text-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('portfolio')}>
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-white/10">
              <span className="text-lg tracking-tighter">CT</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-base tracking-tight text-white">CareerTrip</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">LIVE</span>
              </div>
              <p className="text-[10px] text-zinc-400 tracking-wide font-mono">VERIFIABLE SKILLS & EVIDENCE NETWORK</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('recruiter')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                currentView === 'recruiter'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recruiter Discovery</span>
            </button>

            <button
              onClick={() => setCurrentView('portfolio')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                currentView === 'portfolio'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>My Portfolio</span>
            </button>

            <button
              onClick={() => setCurrentView('projects')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                currentView === 'projects'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Evidence Rooms</span>
            </button>

            <button
              onClick={() => setCurrentView('assessments')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                currentView === 'assessments'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Assessment Lab</span>
            </button>

            <button
              onClick={() => setCurrentView('learning')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                currentView === 'learning'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
              <span>Skill Gaps</span>
            </button>

            <button
              onClick={() => setCurrentView('verification')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                currentView === 'verification'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verification</span>
            </button>

            <button
              onClick={() => setCurrentView('integrity')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                currentView === 'integrity'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5 text-rose-400" />
              <span>Integrity Lab</span>
            </button>

            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center space-x-1.5 ${
                currentView === 'analytics'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Right Controls: User Switcher & Public Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenPublicView}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 text-xs text-zinc-300 bg-zinc-800/80 hover:bg-zinc-800 hover:text-white border border-zinc-700 rounded-md transition-colors"
              title="Preview candidate dossier as seen by external recruiters"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>Public View</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative group">
              <label htmlFor="user-persona-select" className="sr-only">Switch active persona</label>
              <div className="flex items-center space-x-2 bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 hover:border-zinc-600 transition-colors">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-zinc-600"
                />
                <select
                  id="user-persona-select"
                  value={currentUser.id}
                  onChange={(e) => {
                    const sel = allUsers.find(u => u.id === e.target.value);
                    if (sel) onSelectUser(sel);
                  }}
                  className="bg-transparent text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer pr-1"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-zinc-900 text-zinc-200">
                      {u.name} ({u.role === 'candidate' ? u.verifiedTier : u.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-between px-3 py-2 bg-zinc-950/80 border-t border-zinc-800 text-xs overflow-x-auto gap-2">
        <button onClick={() => setCurrentView('recruiter')} className={`px-2 py-1 rounded ${currentView === 'recruiter' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Recruiter</button>
        <button onClick={() => setCurrentView('portfolio')} className={`px-2 py-1 rounded ${currentView === 'portfolio' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Portfolio</button>
        <button onClick={() => setCurrentView('projects')} className={`px-2 py-1 rounded ${currentView === 'projects' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Evidence</button>
        <button onClick={() => setCurrentView('assessments')} className={`px-2 py-1 rounded ${currentView === 'assessments' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Assessments</button>
        <button onClick={() => setCurrentView('learning')} className={`px-2 py-1 rounded ${currentView === 'learning' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Skill Gaps</button>
        <button onClick={() => setCurrentView('verification')} className={`px-2 py-1 rounded ${currentView === 'verification' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Verification</button>
        <button onClick={() => setCurrentView('integrity')} className={`px-2 py-1 rounded ${currentView === 'integrity' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}>Integrity</button>
      </div>
    </header>
  );
};
