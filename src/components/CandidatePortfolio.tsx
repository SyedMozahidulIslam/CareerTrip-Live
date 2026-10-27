import React, { useState } from 'react';
import { User, SkillItem, Project, AssessmentSubmission, Endorsement } from '../types';
import {
  ShieldCheck,
  Award,
  ExternalLink,
  Github,
  Globe,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  FileCode,
  Share2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  Layers,
  Sparkles
} from 'lucide-react';

interface CandidatePortfolioProps {
  user: User;
  skills: SkillItem[];
  projects: Project[];
  submissions: AssessmentSubmission[];
  endorsements: Endorsement[];
  onSelectProject: (projectId: string) => void;
  onNavigateToAssessments: () => void;
  onNavigateToLearning: () => void;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const CandidatePortfolio: React.FC<CandidatePortfolioProps> = ({
  user,
  skills,
  projects,
  submissions,
  endorsements,
  onSelectProject,
  onNavigateToAssessments,
  onNavigateToLearning,
  onUpdateUser,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);
  const [targetRoleInput, setTargetRoleInput] = useState(user.targetRole);

  const handleCopyLink = () => {
    const url = `${window.location.origin}?view=portfolio&handle=${user.handle}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveProfile = () => {
    onUpdateUser({ bio: bioInput, targetRole: targetRoleInput });
    setIsEditingBio(false);
  };

  // Tier color styling
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Evaluator Certified':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          desc: 'Independently evaluated by certified systems reviewer with employer verified code.',
        };
      case 'Employer Verified':
        return {
          bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          dot: 'bg-indigo-400',
          desc: 'Verified by engineering manager or VP with cryptographic signoff.',
        };
      case 'Peer Reviewed':
        return {
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          dot: 'bg-sky-400',
          desc: 'Endorsed by open source maintainers or verified senior colleagues.',
        };
      default:
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          desc: 'Self-reported skills. Requires assessment or endorsement to reach verified status.',
        };
    }
  };

  const tierMeta = getTierBadge(user.verifiedTier);

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, SkillItem[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Hero */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:sum-24 rounded-2xl object-cover border-2 border-zinc-700 shadow-md"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-white tracking-tight">{user.name}</h1>
                <span className="text-xs text-zinc-400 font-mono">@{user.handle}</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tierMeta.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${tierMeta.dot}`}></span>
                  {user.verifiedTier}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-300">{user.headline}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-zinc-500" />{user.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-500" />{user.yearsExperience} Years Exp</span>
                <span className="flex items-center gap-1 text-zinc-300 font-mono"><Award className="w-3.5 h-3.5 text-indigo-400" />Score: <strong className="text-white">{user.overallScore}/100</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Portfolio'}</span>
            </button>
            <button
              onClick={() => onUpdateUser({ publicProfile: !user.publicProfile })}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
                user.publicProfile
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${user.publicProfile ? 'bg-emerald-400' : 'bg-zinc-500'}`}></span>
              <span>{user.publicProfile ? 'Public to Recruiters' : 'Private Profile'}</span>
            </button>
            <button
              onClick={() => setIsEditingBio(!isEditingBio)}
              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
            >
              {isEditingBio ? 'Cancel' : 'Edit Goals'}
            </button>
          </div>
        </div>

        {/* Bio and Career Goal Section */}
        {isEditingBio ? (
          <div className="mt-6 pt-6 border-t border-zinc-800 space-y-3 bg-zinc-950/60 p-4 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Engineering Role</label>
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Professional Bio & Evidence Focus</label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded transition-colors"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-zinc-800 flex flex-col md:flex-row justify-between gap-4 text-xs">
            <div className="max-w-2xl text-zinc-300 leading-relaxed">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] block mb-1">Focus & Background</span>
              {user.bio}
            </div>
            <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/80 min-w-[240px]">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] block mb-1">Target Trajectory</span>
              <p className="text-sm font-semibold text-indigo-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                {user.targetRole}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">Verified benchmark tracking active</p>
            </div>
          </div>
        )}
      </section>

      {/* Trust & Transparency Banner */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-3.5 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>CareerTrip Verification Integrity:</strong> {tierMeta.desc}
          </span>
        </div>
        <button
          onClick={onNavigateToAssessments}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium whitespace-nowrap pl-4"
        >
          Take Assessment <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Grid: Verified Skills & Evidence Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Skills Breakdown & Rubric Performance */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                Verified Skills Matrix
              </h2>
              <span className="text-[11px] text-zinc-400 font-mono">{skills.length} Tracked</span>
            </div>

            {skills.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">
                No skills configured yet.
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {catSkills.map((s) => (
                        <div
                          key={s.id}
                          className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-2.5 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-zinc-200">{s.name}</span>
                            {s.verifiedScore ? (
                              <span className="font-mono font-semibold text-emerald-400 text-[11px]">
                                {s.verifiedScore}%
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-400/90 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                                Unverified
                              </span>
                            )}
                          </div>

                          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.verificationLevel === 'Evaluator Certified'
                                  ? 'bg-emerald-500'
                                  : s.verificationLevel === 'Employer Verified'
                                  ? 'bg-indigo-500'
                                  : s.verificationLevel === 'Peer Reviewed'
                                  ? 'bg-sky-500'
                                  : 'bg-zinc-600'
                              }`}
                              style={{ width: `${(s.proficiency / 5) * 100}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-0.5">
                            <span className="flex items-center gap-1">
                              <FileCode className="w-3 h-3 text-zinc-500" />
                              {s.evidenceCount} Evidence files
                            </span>
                            <span>{s.endorsementsCount} Endorsements</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-zinc-800">
              <button
                onClick={onNavigateToLearning}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                View Skill Gap & Learning Plan
              </button>
            </div>
          </div>

          {/* Endorsements Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Endorsements ({endorsements.length})
            </h2>

            {endorsements.length === 0 ? (
              <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs text-zinc-400 text-center">
                <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
                No verified endorsements yet. Request manager or mentor sign-off in the Verification Hub.
              </div>
            ) : (
              <div className="space-y-3">
                {endorsements.map((end) => (
                  <div key={end.id} className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3 text-xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-zinc-200">{end.endorserName}</div>
                        <div className="text-[11px] text-zinc-400">{end.endorserRole} · {end.endorserCompany}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                        {end.relationship}
                      </span>
                    </div>
                    <p className="text-zinc-300 italic text-[11px] leading-relaxed">"{end.comment}"</p>
                    <div className="text-[9px] font-mono text-zinc-500 truncate pt-1 border-t border-zinc-800/60">
                      Sig: {end.verifiedSignature}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Project Evidence Rooms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                Project Evidence Rooms
              </h2>
              <p className="text-xs text-zinc-400">
                Audited source code, benchmarks, architectural models, and revision history.
              </p>
            </div>
            <span className="text-xs text-zinc-400 font-mono">{projects.length} Rooms Active</span>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
              <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-medium text-zinc-300">No project evidence rooms created yet.</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Evidence rooms show recruiters your real code, architecture diagrams, commit history, and verified benchmarks.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all rounded-xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onSelectProject(proj.id)}>
                          {proj.title}
                        </h3>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTierBadge(proj.verifiedStatus).bg}`}>
                          {proj.verifiedStatus}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{proj.tagline}</p>
                    </div>

                    <button
                      onClick={() => onSelectProject(proj.id)}
                      className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Enter Evidence Room</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>

                  {/* Architecture & Problem Snapshot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-0.5">Problem Statement</span>
                      <p className="text-zinc-300 line-clamp-2 text-[11px]">{proj.problemStatement || 'Production latency and concurrency scaling bottleneck.'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-0.5">Architecture Model</span>
                      <p className="text-zinc-300 line-clamp-2 text-[11px]">{proj.architectureOverview || 'Modular decoupled architecture with fault-tolerant recovery.'}</p>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Evidence Artifacts Bar */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                        {proj.evidenceFiles.length} Evidence Artifacts
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-zinc-500" />
                        {proj.versionHistory.length} Versions ({proj.versionHistory[0]?.version || 'v1.0.0'})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white flex items-center gap-1 text-[11px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Repo</span>
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white flex items-center gap-1 text-[11px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assessment History Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Verified Assessment Submissions ({submissions.length})
              </h2>
              <button
                onClick={onNavigateToAssessments}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Launch Assessment Lab →
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-950/60 rounded-lg border border-zinc-800">
                No assessments taken yet. Complete role challenges in the Assessment Lab to earn verified score credentials.
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div key={sub.id} className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-200">{sub.challengeTitle}</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {sub.humanReview ? `${sub.humanReview.verifiedScore}/100 (Human Verified)` : `${sub.aiEvaluation?.overallScore}/100 (AI Evaluated)`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] text-zinc-400 pt-1">
                      <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                        <span className="block text-zinc-500">Correctness</span>
                        <strong className="text-zinc-200">{sub.humanReview?.dimensionScores.correctness || sub.aiEvaluation?.dimensionScores.correctness}%</strong>
                      </div>
                      <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                        <span className="block text-zinc-500">Architecture</span>
                        <strong className="text-zinc-200">{sub.humanReview?.dimensionScores.architecture || sub.aiEvaluation?.dimensionScores.architecture}%</strong>
                      </div>
                      <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                        <span className="block text-zinc-500">Implementation</span>
                        <strong className="text-zinc-200">{sub.humanReview?.dimensionScores.implementation || sub.aiEvaluation?.dimensionScores.implementation}%</strong>
                      </div>
                      <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                        <span className="block text-zinc-500">Edge Cases</span>
                        <strong className="text-zinc-200">{sub.humanReview?.dimensionScores.edge_cases || sub.aiEvaluation?.dimensionScores.edge_cases}%</strong>
                      </div>
                      <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
                        <span className="block text-zinc-500">Communication</span>
                        <strong className="text-zinc-200">{sub.humanReview?.dimensionScores.communication || sub.aiEvaluation?.dimensionScores.communication}%</strong>
                      </div>
                    </div>

                    {sub.humanReview && (
                      <p className="text-[11px] text-zinc-300 italic pt-1 border-t border-zinc-800">
                        Reviewer Note ({sub.humanReview.reviewerName}): "{sub.humanReview.qualitativeFeedback}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
