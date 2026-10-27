import React, { useState } from 'react';
import { User, SkillItem, Project, RecruiterShortlist } from '../types';

interface RecruiterWorkspaceProps {
  candidates: User[];
  allSkills: Record<string, SkillItem[]>;
  allProjects: Project[];
  shortlists: RecruiterShortlist[];
  onAddToShortlist: (candidateId: string, notes: string, stage: RecruiterShortlist['stage']) => void;
  onRemoveFromShortlist: (candidateId: string) => void;
  onSelectCandidate: (candidate: User) => void;
  onInspectProject: (projectId: string) => void;
}

export const RecruiterWorkspace: React.FC<RecruiterWorkspaceProps> = ({
  candidates,
  allSkills,
  allProjects,
  shortlists,
  onAddToShortlist,
  onRemoveFromShortlist,
  onSelectCandidate,
  onInspectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(60);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showShortlistDrawer, setShowShortlistDrawer] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [stageSelect, setStageSelect] = useState<RecruiterShortlist['stage']>('reviewing_evidence');

  const filteredCandidates = candidates.filter((c) => {
    if (c.role !== 'candidate') return false;
    const query = searchQuery.toLowerCase().trim();
    const candSkills = allSkills[c.id] || [];
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.headline.toLowerCase().includes(query) ||
      c.targetRole.toLowerCase().includes(query) ||
      candSkills.some((s) => s.name.toLowerCase().includes(query));

    const matchesTier = tierFilter === 'all' || c.verifiedTier === tierFilter;
    const matchesScore = c.overallScore >= minScore;
    return matchesSearch && matchesTier && matchesScore;
  });

  const toggleComparison = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter((x) => x !== id));
    } else {
      if (selectedForComparison.length >= 3) {
        alert('You can compare at most 3 candidates simultaneously.');
        return;
      }
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  const comparedCandidates = candidates.filter((c) => selectedForComparison.includes(c.id));

  const handleOpenShortlistModal = (candId: string) => {
    const existing = shortlists.find((s) => s.candidateId === candId);
    setEditingNotesId(candId);
    setNoteText(existing ? existing.notes : '');
    setStageSelect(existing ? existing.stage : 'reviewing_evidence');
  };

  const handleSaveShortlistNote = (candId: string) => {
    onAddToShortlist(candId, noteText, stageSelect);
    setEditingNotesId(null);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Specification Strip */}
      <div className="bg-[#000000] border border-[#272727]">
        <div className="px-6 py-2 border-b border-[#272727] bg-[#0A0A0C] flex flex-wrap items-center justify-between font-mono text-[10px] text-[#767676]">
          <div className="flex items-center gap-3">
            <span className="text-[#F1F2F2]">RECRUITER WORKSPACE // SPEC-01.0</span>
            <span>/</span>
            <span>EVIDENCE-BASED SOURCING INTERFACE</span>
          </div>
          <div className="flex items-center gap-3">
            <span>INDEXED CANDIDATES: {filteredCandidates.length}</span>
            <span>/</span>
            <span className="text-[#F56B2A]">SHORTLISTED: {shortlists.length}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-light text-[#F1F2F2] tracking-tight">
              Recruiter Research Directory
            </h1>
            <p className="text-sm text-[#767676] font-mono">
              Dense, structured technical search filtered by verified code repositories and audit trails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedForComparison.length > 0 && (
              <button
                onClick={() => setShowComparisonModal(true)}
                className="px-3.5 py-2 bg-[#F56B2A] text-black font-mono text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
              >
                [COMPARE SELECTED ({selectedForComparison.length}/3)]
              </button>
            )}

            <button
              onClick={() => setShowShortlistDrawer(true)}
              className="px-3.5 py-2 bg-[#0F0E12] hover:bg-[#F1F2F2] hover:text-[#000000] text-[#F1F2F2] border border-[#272727] font-mono text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              [SHORTLIST PIPELINE ({shortlists.length})]
            </button>
          </div>
        </div>
      </div>

      {/* Structured Technical Filter Bar */}
      <div className="bg-[#08080A] border border-[#272727] p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex-1 flex items-center gap-2 bg-[#000000] border border-[#202020] px-3 py-2">
          <span className="text-[#767676] uppercase">SEARCH:</span>
          <input
            type="text"
            placeholder="Type skill keyword (Raft, WebGL, CUDA), target role, or engineer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[#F1F2F2] placeholder-[#555555] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#000000] border border-[#202020] px-3 py-1.5">
            <span className="text-[#767676] uppercase text-[10px]">TIER:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-transparent text-[#F1F2F2] focus:outline-none cursor-pointer"
            >
              <option value="all">ALL VERIFIED TIERS</option>
              <option value="Evaluator Certified">EVALUATOR CERTIFIED</option>
              <option value="Employer Verified">EMPLOYER VERIFIED</option>
              <option value="Peer Reviewed">PEER REVIEWED</option>
              <option value="Unverified">UNVERIFIED CLAIMS</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#000000] border border-[#202020] px-3 py-1.5">
            <span className="text-[#767676] uppercase text-[10px]">MIN SCORE: {minScore}%</span>
            <input
              type="range"
              min={50}
              max={95}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-20 accent-[#F56B2A]"
            />
          </div>
        </div>
      </div>

      {/* Dense Aligned Candidate Rows (Table Layout instead of generic cards) */}
      <div className="border border-[#272727] bg-[#000000] overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#272727] bg-[#0A0A0C] text-[10px] text-[#767676] uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">CMP</th>
              <th className="py-3 px-4">ENGINEER // IDENTIFIER</th>
              <th className="py-3 px-4">TIER // SCORE</th>
              <th className="py-3 px-4">VERIFIED SKILLS SPEC</th>
              <th className="py-3 px-4">PRIMARY EVIDENCE ROOM</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1F]">
            {filteredCandidates.map((candidate) => {
              const candSkills = allSkills[candidate.id] || [];
              const candProjects = allProjects.filter((p) => p.userId === candidate.id);
              const isShortlisted = shortlists.some((s) => s.candidateId === candidate.id);
              const isCompared = selectedForComparison.includes(candidate.id);

              return (
                <tr
                  key={candidate.id}
                  className={`transition-colors ${
                    isCompared ? 'bg-[#101014]' : 'hover:bg-[#070709]'
                  }`}
                >
                  {/* Compare checkbox */}
                  <td className="py-4 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleComparison(candidate.id)}
                      className="accent-[#F56B2A] cursor-pointer"
                    />
                  </td>

                  {/* Candidate Identity */}
                  <td className="py-4 px-4 space-y-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={candidate.avatarUrl}
                        alt={candidate.name}
                        className="w-9 h-9 object-cover border border-[#272727] grayscale"
                      />
                      <div>
                        <div
                          onClick={() => onSelectCandidate(candidate)}
                          className="font-bold text-[#F1F2F2] hover:text-[#F56B2A] cursor-pointer text-sm"
                        >
                          {candidate.name}
                        </div>
                        <div className="text-[10px] text-[#767676]">
                          @{candidate.handle} // {candidate.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#A0A2A4] font-sans line-clamp-1">
                      {candidate.headline}
                    </div>
                  </td>

                  {/* Tier & Score */}
                  <td className="py-4 px-4 space-y-1">
                    <div className="font-bold text-sm text-[#F56B2A]">
                      {candidate.overallScore}.0%
                    </div>
                    <div className="text-[10px] text-[#F1F2F2] uppercase tracking-wider">
                      [{candidate.verifiedTier}]
                    </div>
                  </td>

                  {/* Skills Spec */}
                  <td className="py-4 px-4 space-y-1">
                    <div className="flex flex-wrap gap-1.5">
                      {candSkills.slice(0, 3).map((s) => (
                        <span
                          key={s.id}
                          className="text-[10px] px-1.5 py-0.5 bg-[#0A0A0D] border border-[#222225] text-[#D0D1D2]"
                        >
                          {s.name} {s.verifiedScore && <strong className="text-[#F56B2A]">({s.verifiedScore}%)</strong>}
                        </span>
                      ))}
                      {candSkills.length > 3 && (
                        <span className="text-[10px] text-[#767676] self-center">
                          +{candSkills.length - 3} MORE
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Primary Project Evidence Room */}
                  <td className="py-4 px-4 space-y-1">
                    {candProjects[0] ? (
                      <div
                        onClick={() => onInspectProject(candProjects[0].id)}
                        className="cursor-pointer group"
                      >
                        <div className="text-[#F1F2F2] group-hover:text-[#F56B2A] font-semibold text-xs truncate max-w-[220px]">
                          {candProjects[0].title}
                        </div>
                        <div className="text-[10px] text-[#767676]">
                          {candProjects[0].evidenceFiles.length} FILES // {candProjects[0].versionHistory.length} REVS
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#767676] text-[10px]">NO ROOMS</span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenShortlistModal(candidate.id)}
                      className={`px-2.5 py-1 text-[10px] uppercase font-semibold border transition-colors ${
                        isShortlisted
                          ? 'border-[#F56B2A] text-[#F56B2A] bg-[#000000]'
                          : 'border-[#272727] text-[#767676] hover:text-[#F1F2F2] bg-[#0F0E12]'
                      }`}
                    >
                      {isShortlisted ? '[SHORTLISTED]' : '[SHORTLIST]'}
                    </button>

                    <button
                      onClick={() => onSelectCandidate(candidate)}
                      className="px-2.5 py-1 text-[10px] uppercase font-semibold bg-[#F1F2F2] hover:bg-[#ffffff] text-black transition-colors"
                    >
                      [DOSSIER →]
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Candidate Comparison Modal Matrix */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="bg-[#000000] border border-[#272727] max-w-5xl w-full p-6 space-y-5 font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#272727] pb-3">
              <div>
                <h3 className="text-xs font-bold text-[#F1F2F2] uppercase tracking-wider">
                  CANDIDATE COMPARISON MATRIX // SIDE-BY-SIDE AUDIT
                </h3>
                <p className="text-[10px] text-[#767676]">
                  Strict technical parameter alignment across verified competencies.
                </p>
              </div>
              <button onClick={() => setShowComparisonModal(false)} className="text-[#767676] hover:text-[#F1F2F2]">[X]</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparedCandidates.map((cand) => {
                const cSkills = allSkills[cand.id] || [];
                const cProjects = allProjects.filter((p) => p.userId === cand.id);

                return (
                  <div key={cand.id} className="border border-[#202020] bg-[#08080A] p-4 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#1C1C1F]">
                      <img src={cand.avatarUrl} alt={cand.name} className="w-10 h-10 object-cover border border-[#272727] grayscale" />
                      <div>
                        <div className="font-bold text-[#F1F2F2] text-sm">{cand.name}</div>
                        <span className="text-[10px] text-[#F56B2A]">
                          [{cand.verifiedTier}]
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-[#141416]">
                        <span className="text-[#767676]">VERIFIED SCORE</span>
                        <strong className="text-[#F56B2A]">{cand.overallScore}%</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#141416]">
                        <span className="text-[#767676]">TARGET ROLE</span>
                        <span className="text-[#F1F2F2] truncate max-w-[140px]">{cand.targetRole}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#141416]">
                        <span className="text-[#767676]">EXPERIENCE</span>
                        <span className="text-[#F1F2F2]">{cand.yearsExperience} YRS</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#141416]">
                        <span className="text-[#767676]">EVIDENCE ROOMS</span>
                        <span className="text-[#F1F2F2]">{cProjects.length} ROOMS</span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-[#767676] uppercase block">TOP VERIFIED COMPETENCIES:</span>
                      {cSkills.map((s) => (
                        <div key={s.id} className="p-1.5 bg-[#000000] border border-[#1A1A1D] flex justify-between text-[10px]">
                          <span className="text-[#D0D1D2] truncate">{s.name}</span>
                          <span className="text-[#F56B2A] font-bold">{s.verifiedScore || s.proficiency * 20}%</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setShowComparisonModal(false);
                        onSelectCandidate(cand);
                      }}
                      className="w-full py-2 bg-[#F1F2F2] hover:bg-[#ffffff] text-black uppercase font-semibold text-xs transition-colors mt-2"
                    >
                      [INSPECT FULL DOSSIER]
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Shortlist Pipeline Modal */}
      {showShortlistDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80">
          <div className="bg-[#000000] border-l border-[#272727] w-full max-w-md h-full p-6 space-y-4 font-mono text-xs overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#272727] pb-3">
              <h3 className="text-xs font-bold text-[#F1F2F2] uppercase tracking-wider">
                SHORTLIST PIPELINE ({shortlists.length})
              </h3>
              <button onClick={() => setShowShortlistDrawer(false)} className="text-[#767676] hover:text-[#F1F2F2]">[X]</button>
            </div>

            {shortlists.length === 0 ? (
              <p className="text-[#767676] text-center py-8">NO CANDIDATES SHORTLISTED YET</p>
            ) : (
              <div className="space-y-3">
                {shortlists.map((sl) => {
                  const cand = candidates.find((c) => c.id === sl.candidateId);
                  if (!cand) return null;
                  return (
                    <div key={sl.id} className="p-3.5 border border-[#202020] bg-[#08080A] space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#F1F2F2] text-sm">{cand.name}</strong>
                        <span className="text-[#F56B2A]">{sl.matchScore}% MATCH</span>
                      </div>
                      <div className="text-[10px] text-[#767676]">{cand.headline}</div>
                      <div className="text-[10px] px-2 py-0.5 bg-[#000000] border border-[#272727] text-[#D0D1D2] uppercase inline-block">
                        STAGE: {sl.stage.replace('_', ' ')}
                      </div>

                      {sl.notes && (
                        <p className="text-[11px] text-[#767676] italic font-sans p-2 border border-[#1A1A1D] bg-[#050507]">
                          "{sl.notes}"
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-[#1C1C1F]">
                        <button
                          onClick={() => {
                            setShowShortlistDrawer(false);
                            onSelectCandidate(cand);
                          }}
                          className="text-[#F1F2F2] hover:text-[#F56B2A] uppercase"
                        >
                          [OPEN DOSSIER →]
                        </button>
                        <button
                          onClick={() => onRemoveFromShortlist(cand.id)}
                          className="text-[#767676] hover:text-[#F56B2A] uppercase"
                        >
                          [REMOVE]
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Shortlist Notes Modal */}
      {editingNotesId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="bg-[#000000] border border-[#272727] max-w-md w-full p-6 space-y-4 font-mono text-xs">
            <h3 className="font-bold text-[#F1F2F2] uppercase tracking-wider text-xs">
              [UPDATE SHORTLIST STAGE & NOTES]
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">PIPELINE STAGE</label>
                <select
                  value={stageSelect}
                  onChange={(e) => setStageSelect(e.target.value as any)}
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                >
                  <option value="discovered">DISCOVERED</option>
                  <option value="reviewing_evidence">REVIEWING PROJECT EVIDENCE</option>
                  <option value="shortlisted">SHORTLISTED</option>
                  <option value="interview_scheduled">TECHNICAL INTERVIEW SCHEDULED</option>
                  <option value="rejected">ARCHIVED</option>
                </select>
              </div>

              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">EVALUATION NOTE</label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record observations regarding test suite, architecture, or consensus logic..."
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#202020]">
                <button
                  type="button"
                  onClick={() => setEditingNotesId(null)}
                  className="px-4 py-2 bg-[#0F0E12] text-[#767676] uppercase text-xs"
                >
                  [DISCARD]
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveShortlistNote(editingNotesId)}
                  className="px-4 py-2 bg-[#F56B2A] text-black font-semibold uppercase text-xs"
                >
                  [SAVE PIPELINE RECORD]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
