import React, { useState } from 'react';
import { User, SkillItem, Project, RecruiterShortlist } from '../types';
import {
  Search,
  Filter,
  ShieldCheck,
  Award,
  Users,
  Code2,
  FileCode,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  ArrowRight,
  Eye,
  GitCommit,
  ExternalLink,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

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

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    if (c.role !== 'candidate') return false;

    // Search query matching
    const query = searchQuery.toLowerCase().trim();
    const candSkills = allSkills[c.id] || [];
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.headline.toLowerCase().includes(query) ||
      c.targetRole.toLowerCase().includes(query) ||
      candSkills.some((s) => s.name.toLowerCase().includes(query));

    // Tier filter
    const matchesTier = tierFilter === 'all' || c.verifiedTier === tierFilter;

    // Score filter
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Recruiter Discovery Workspace</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold">
              EVIDENCE-FIRST TALENT SOURCING
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-1">
            Search candidates by verifiable code artifacts, evaluated consensus logic, and cryptographically signed endorsements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedForComparison.length > 0 && (
            <button
              onClick={() => setShowComparisonModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Compare Candidates ({selectedForComparison.length}/3)</span>
            </button>
          )}

          <button
            onClick={() => setShowShortlistDrawer(true)}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shortlisted ({shortlists.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by skill (Raft, WebGL, CUDA), name, or target role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Verification Tiers</option>
              <option value="Evaluator Certified">Evaluator Certified</option>
              <option value="Employer Verified">Employer Verified</option>
              <option value="Peer Reviewed">Peer Reviewed</option>
              <option value="Unverified">Unverified</option>
            </select>

            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400">
              <span className="whitespace-nowrap font-mono">Min Score: {minScore}%</span>
              <input
                type="range"
                min={50}
                max={95}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-20 accent-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
          <span>Found {filteredCandidates.length} verifiable candidate profiles</span>
          <span className="text-[11px] text-zinc-500">Evidence Rooms verified via git diffs and test results</span>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => {
          const candSkills = allSkills[candidate.id] || [];
          const candProjects = allProjects.filter((p) => p.userId === candidate.id);
          const isShortlisted = shortlists.some((s) => s.candidateId === candidate.id);
          const isCompared = selectedForComparison.includes(candidate.id);

          return (
            <div
              key={candidate.id}
              className={`bg-zinc-900 border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between transition-all ${
                isCompared ? 'border-indigo-500 ring-1 ring-indigo-500/40' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                {/* Candidate Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={candidate.avatarUrl}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shadow-sm"
                    />
                    <div>
                      <h3
                        onClick={() => onSelectCandidate(candidate)}
                        className="font-bold text-white text-sm hover:text-indigo-400 cursor-pointer transition-colors"
                      >
                        {candidate.name}
                      </h3>
                      <div className="text-[11px] text-zinc-400">@{candidate.handle}</div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.2 rounded-full border mt-1 ${
                        candidate.verifiedTier === 'Evaluator Certified'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : candidate.verifiedTier === 'Employer Verified'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                          : candidate.verifiedTier === 'Peer Reviewed'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {candidate.verifiedTier}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block font-mono">Verified Score</span>
                    <span className="font-mono text-base font-bold text-emerald-400">
                      {candidate.overallScore}/100
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  {candidate.headline}
                </p>

                {/* Verified Skills Tags */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {candSkills.slice(0, 3).map((s) => (
                      <span
                        key={s.id}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800 flex items-center gap-1 font-mono"
                      >
                        {s.name}
                        {s.verifiedScore && <strong className="text-emerald-400">({s.verifiedScore}%)</strong>}
                      </span>
                    ))}
                    {candSkills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-zinc-500">
                        +{candSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Evidence Rooms Preview */}
                <div className="bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800/80 space-y-1.5 text-xs">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Active Evidence Rooms ({candProjects.length})
                  </span>
                  {candProjects.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onInspectProject(p.id)}
                      className="flex items-center justify-between text-zinc-300 hover:text-indigo-400 cursor-pointer pt-0.5 transition-colors"
                    >
                      <span className="truncate font-medium text-[11px]">{p.title}</span>
                      <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap pl-2">
                        {p.evidenceFiles.length} artifacts →
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={isCompared}
                    onChange={() => toggleComparison(candidate.id)}
                    className="rounded bg-zinc-950 border-zinc-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Compare</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenShortlistModal(candidate.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                      isShortlisted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    <Bookmark className="w-3 h-3" />
                    <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                  </button>

                  <button
                    onClick={() => onSelectCandidate(candidate)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View Evidence</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Comparison Modal Matrix */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-5xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  Candidate Side-by-Side Comparison Matrix
                </h3>
                <p className="text-xs text-zinc-400">
                  Compare verified score dimensions, evidence artifact density, and audit trail.
                </p>
              </div>
              <button onClick={() => setShowComparisonModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparedCandidates.map((cand) => {
                const cSkills = allSkills[cand.id] || [];
                const cProjects = allProjects.filter((p) => p.userId === cand.id);
                return (
                  <div key={cand.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-4 text-xs">
                    <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                      <img src={cand.avatarUrl} alt={cand.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-white text-sm">{cand.name}</div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {cand.verifiedTier}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b border-zinc-900">
                        <span className="text-zinc-400">Overall Verified Score</span>
                        <strong className="text-emerald-400 font-mono">{cand.overallScore}/100</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-900">
                        <span className="text-zinc-400">Target Role</span>
                        <span className="text-zinc-200">{cand.targetRole}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-900">
                        <span className="text-zinc-400">Experience</span>
                        <span className="text-zinc-200">{cand.yearsExperience} Years</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-900">
                        <span className="text-zinc-400">Evidence Rooms</span>
                        <span className="text-zinc-200">{cProjects.length} Projects</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-900">
                        <span className="text-zinc-400">Evidence Files Count</span>
                        <span className="text-zinc-200">{cProjects.reduce((a, b) => a + b.evidenceFiles.length, 0)} Artifacts</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Top Verified Skills</span>
                      {cSkills.map((s) => (
                        <div key={s.id} className="bg-zinc-900 p-1.5 rounded flex justify-between font-mono text-[11px]">
                          <span className="text-zinc-300 truncate">{s.name}</span>
                          <span className="text-emerald-400">{s.verifiedScore || s.proficiency * 20}%</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setShowComparisonModal(false);
                        onSelectCandidate(cand);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors mt-2"
                    >
                      Inspect Full Portfolio
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Shortlist Modal / Drawer */}
      {showShortlistDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60">
          <div className="bg-zinc-900 border-l border-zinc-800 w-full max-w-md h-full p-6 space-y-5 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Recruiter Shortlist ({shortlists.length})</h3>
              </div>
              <button onClick={() => setShowShortlistDrawer(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            {shortlists.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">No candidates shortlisted yet.</p>
            ) : (
              <div className="space-y-3">
                {shortlists.map((sl) => {
                  const cand = candidates.find((c) => c.id === sl.candidateId);
                  if (!cand) return null;
                  return (
                    <div key={sl.id} className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-zinc-200">{cand.name}</div>
                        <span className="font-mono text-emerald-400 font-semibold">{sl.matchScore}% Match</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">{cand.headline}</div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono uppercase">
                          Stage: {sl.stage.replace('_', ' ')}
                        </span>
                      </div>

                      {sl.notes && (
                        <p className="text-[11px] text-zinc-300 italic bg-zinc-900/60 p-2 rounded border border-zinc-800">
                          "{sl.notes}"
                        </p>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-zinc-800/80">
                        <button
                          onClick={() => {
                            setShowShortlistDrawer(false);
                            onSelectCandidate(cand);
                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          View Evidence →
                        </button>
                        <button
                          onClick={() => onRemoveFromShortlist(cand.id)}
                          className="text-xs text-rose-400 hover:text-rose-300"
                        >
                          Remove
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Update Shortlist Notes & Stage</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Recruitment Pipeline Stage</label>
                <select
                  value={stageSelect}
                  onChange={(e) => setStageSelect(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                >
                  <option value="discovered">Discovered</option>
                  <option value="reviewing_evidence">Reviewing Project Evidence</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview_scheduled">Technical Interview Scheduled</option>
                  <option value="rejected">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Recruiter Evaluation Note</label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Strong consensus background, validated Jepsen partition test suite."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNotesId(null)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveShortlistNote(editingNotesId)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Save Shortlist Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
