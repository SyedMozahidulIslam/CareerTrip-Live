import React from 'react';
import { User, SkillItem, Project, Endorsement } from '../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-[#000000] border border-[#272727] max-w-4xl w-full p-6 sm:p-8 space-y-6 font-mono text-xs max-h-[90vh] overflow-y-auto">
        {/* Top Identification Strip */}
        <div className="flex items-start justify-between border-b border-[#272727] pb-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 object-cover border border-[#272727] grayscale"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-light text-[#F1F2F2] tracking-tight">{user.name}</h2>
                <span className="text-[10px] px-2 py-0.5 border border-[#F56B2A] text-[#F56B2A] uppercase font-bold">
                  [{user.verifiedTier}]
                </span>
              </div>
              <p className="text-xs text-[#767676] font-sans mt-0.5">{user.headline}</p>
              <div className="flex items-center gap-3 text-[10px] text-[#767676] mt-1">
                <span>LOC: {user.location}</span>
                <span>/</span>
                <span className="text-[#F56B2A] font-bold">SCORE: {user.overallScore}/100</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#767676] hover:text-[#F1F2F2] px-2 py-1 border border-[#272727] bg-[#0A0A0C]"
          >
            [CLOSE DOSSIER]
          </button>
        </div>

        {/* Technical Summary */}
        <div className="p-4 border border-[#202020] bg-[#08080A] space-y-1">
          <span className="text-[10px] text-[#767676] uppercase tracking-wider block">
            CANDIDATE TECHNICAL STATEMENT
          </span>
          <p className="text-[#D0D1D2] font-sans text-xs leading-relaxed">
            {user.bio}
          </p>
        </div>

        {/* Verified Competencies */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-[#767676] uppercase tracking-wider">
            01 // AUDITED TECHNICAL COMPETENCIES ({skills.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {skills.map((s) => (
              <div
                key={s.id}
                className="p-3 border border-[#202020] bg-[#08080A] flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-semibold text-[#F1F2F2] block">{s.name}</span>
                  <span className="text-[9px] text-[#767676] uppercase">{s.category} // {s.evidenceCount} ARTIFACTS</span>
                </div>
                <span className="font-bold text-[#F56B2A]">
                  {s.verifiedScore || s.proficiency * 20}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Projects */}
        <div className="space-y-2">
          <h3 className="text-[10px] text-[#767676] uppercase tracking-wider">
            02 // AUDITED EVIDENCE ROOMS ({projects.length})
          </h3>
          <div className="space-y-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-4 border border-[#202020] bg-[#08080A] space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#F1F2F2] text-sm">{p.title}</h4>
                    <p className="text-[#767676] text-xs font-sans mt-0.5">{p.tagline}</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectProject(p.id);
                    }}
                    className="px-2.5 py-1 bg-[#F1F2F2] hover:bg-[#ffffff] text-black text-[10px] uppercase font-semibold transition-colors"
                  >
                    [INSPECT ARTIFACTS →]
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[9px]">
                  {p.techStack.map((tech) => (
                    <span key={tech} className="px-1.5 py-0.5 bg-[#000000] border border-[#272727] text-[#D0D1D2]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signed Attestations */}
        {endorsements.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-[10px] text-[#767676] uppercase tracking-wider">
              03 // SIGNED ATTESTATIONS ({endorsements.length})
            </h3>
            <div className="space-y-2">
              {endorsements.map((e) => (
                <div key={e.id} className="p-3 border border-[#202020] bg-[#08080A] space-y-1">
                  <div className="flex justify-between text-[#F1F2F2]">
                    <strong>{e.endorserName} [{e.endorserRole}, {e.endorserCompany}]</strong>
                    <span className="text-[#F56B2A] text-[10px] uppercase">{e.relationship}</span>
                  </div>
                  <p className="text-[#767676] italic font-serif text-xs">"{e.comment}"</p>
                  <div className="text-[9px] text-[#555555] pt-1">
                    SIG: {e.verifiedSignature}
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
