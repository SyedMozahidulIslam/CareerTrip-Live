import React from 'react';
import { User, SkillItem, Project, Endorsement } from '../types';
import {
  ShieldCheck,
  Award,
  ExternalLink,
  Github,
  MapPin,
  Clock,
  Code2,
  FileCode,
  X,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface PublicPortfolioModalProps {
  user: User;
  skills: SkillItem[];
  projects: Project[];
  endorsements: Endorsement[];
  onClose: () => void;
  onSelectProject: (projectId: string) => void;
}

export const PublicPortfolioModal: React.FC<PublicPortfolioModalProps> = ({
  user,
  skills,
  projects,
  endorsements,
  onClose,
  onSelectProject,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-xl object-cover border border-zinc-700 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {user.verifiedTier}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">{user.headline}</p>
              <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 font-mono">
                <span>{user.location}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{user.overallScore}/100 Verified Score</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bio */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
          <span className="font-semibold text-zinc-400 uppercase tracking-wider block text-[10px] mb-1">
            Candidate Biography & Verified Focus
          </span>
          {user.bio}
        </div>

        {/* Verified Skills */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Verified Competencies ({skills.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-xs space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-zinc-200">{s.name}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {s.verifiedScore || s.proficiency * 20}%
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>{s.category}</span>
                  <span>{s.evidenceCount} verified artifacts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Preview */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Project Evidence Rooms ({projects.length})
          </h3>
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{p.title}</h4>
                    <p className="text-zinc-400 text-xs mt-0.5">{p.tagline}</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectProject(p.id);
                    }}
                    className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded text-xs font-semibold transition-colors"
                  >
                    Inspect Artifacts →
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.techStack.map((tech) => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Endorsements */}
        {endorsements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Signed Endorsements ({endorsements.length})
            </h3>
            <div className="space-y-2">
              {endorsements.map((e) => (
                <div key={e.id} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-xs space-y-1">
                  <div className="flex justify-between text-zinc-200">
                    <strong>{e.endorserName} ({e.endorserRole}, {e.endorserCompany})</strong>
                    <span className="text-indigo-400 font-mono text-[10px]">{e.relationship}</span>
                  </div>
                  <p className="text-zinc-300 italic text-[11px]">"{e.comment}"</p>
                  <div className="text-[9px] font-mono text-zinc-500 truncate pt-1">
                    Sig: {e.verifiedSignature}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
