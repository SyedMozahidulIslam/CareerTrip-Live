import React, { useState } from 'react';
import { User, SkillItem, Project, AssessmentSubmission, Endorsement } from '../types';

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
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveProfile = () => {
    onUpdateUser({ bio: bioInput, targetRole: targetRoleInput });
    setIsEditingBio(false);
  };

  const getTierIndicator = (tier: string) => {
    switch (tier) {
      case 'Evaluator Certified':
        return {
          code: 'CERT-01',
          label: 'EVALUATOR CERTIFIED',
          color: 'text-[#F56B2A]',
          border: 'border-[#F56B2A]',
          dot: 'bg-[#F56B2A]',
          desc: 'Independently evaluated by accredited systems reviewer with employer-verified code repository.',
        };
      case 'Employer Verified':
        return {
          code: 'EMP-02',
          label: 'EMPLOYER VERIFIED',
          color: 'text-[#F1F2F2]',
          border: 'border-[#F1F2F2]',
          dot: 'bg-[#F1F2F2]',
          desc: 'Attested by direct engineering manager or VP with cryptographic commit signature.',
        };
      case 'Peer Reviewed':
        return {
          code: 'PEER-03',
          label: 'PEER REVIEWED',
          color: 'text-[#B0B2B4]',
          border: 'border-[#404040]',
          dot: 'bg-[#B0B2B4]',
          desc: 'Endorsed by open-source maintainers or senior staff colleagues.',
        };
      default:
        return {
          code: 'UNV-00',
          label: 'UNVERIFIED CLAIM',
          color: 'text-[#767676]',
          border: 'border-[#272727]',
          dot: 'bg-[#767676]',
          desc: 'Self-reported skills. Requires practical assessment or employer attestation to attain verified status.',
        };
    }
  };

  const tierMeta = getTierIndicator(user.verifiedTier);

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, SkillItem[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dossier Header Card: Editorial Industrial Layout */}
      <section className="bg-[#000000] border border-[#272727]">
        {/* Top Section Index Bar */}
        <div className="px-6 py-2 border-b border-[#272727] bg-[#0A0A0C] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#767676]">
          <div className="flex items-center gap-3">
            <span className="text-[#F1F2F2] font-semibold">DOSSIER // REF-{user.handle.toUpperCase()}</span>
            <span>/</span>
            <span>SPEC: CANDIDATE PORTFOLIO</span>
          </div>
          <div className="flex items-center gap-3">
            <span>INDEX: 02.0</span>
            <span>/</span>
            <span className="text-[#F56B2A]">STATUS: {tierMeta.code}</span>
          </div>
        </div>

        {/* Candidate Identity Block */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 object-cover border border-[#272727] grayscale contrast-125"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-light text-[#F1F2F2] tracking-tight">
                    {user.name}
                  </h1>
                  <span className="font-mono text-xs text-[#767676]">
                    @{user.handle}
                  </span>
                  <div className={`px-2 py-0.5 border ${tierMeta.border} flex items-center gap-1.5`}>
                    <span className={`w-1.5 h-1.5 ${tierMeta.dot}`}></span>
                    <span className={`font-mono text-[10px] font-semibold tracking-wider ${tierMeta.color}`}>
                      {tierMeta.label}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-normal text-[#D0D1D2] max-w-2xl">
                  {user.headline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#767676] pt-1">
                  <span>LOC: {user.location}</span>
                  <span>/</span>
                  <span>EXP: {user.yearsExperience} YRS</span>
                  <span>/</span>
                  <span className="text-[#F1F2F2]">
                    VERIFIED SCORE: <strong className="text-[#F56B2A]">{user.overallScore}/100</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Technical Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 text-[11px] font-mono text-[#F1F2F2] bg-[#0F0E12] hover:bg-[#F1F2F2] hover:text-[#000000] border border-[#272727] transition-colors uppercase tracking-wider"
              >
                {copiedLink ? '[LINK COPIED]' : '[SHARE DOSSIER]'}
              </button>
              <button
                onClick={() => onUpdateUser({ publicProfile: !user.publicProfile })}
                className={`px-3 py-1.5 text-[11px] font-mono border transition-colors uppercase tracking-wider flex items-center gap-1.5 ${
                  user.publicProfile
                    ? 'border-[#F56B2A] text-[#F56B2A] bg-[#000000]'
                    : 'border-[#272727] text-[#767676] bg-[#0F0E12]'
                }`}
              >
                <span className={`w-1.5 h-1.5 ${user.publicProfile ? 'bg-[#F56B2A]' : 'bg-[#767676]'}`}></span>
                <span>{user.publicProfile ? 'PUBLIC VISIBILITY' : 'PRIVATE PROFILE'}</span>
              </button>
              <button
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="px-3 py-1.5 text-[11px] font-mono bg-[#F56B2A] hover:bg-[#ff7b3d] text-black font-semibold transition-colors uppercase tracking-wider"
              >
                {isEditingBio ? '[CANCEL]' : '[EDIT PARAMETERS]'}
              </button>
            </div>
          </div>

          {/* Edit Bio Drawer */}
          {isEditingBio ? (
            <div className="mt-6 pt-6 border-t border-[#272727] space-y-4 bg-[#0B0B0D] p-5">
              <div>
                <label className="block text-[11px] font-mono text-[#767676] uppercase tracking-wider mb-1">
                  TARGET ENGINEERING ROLE
                </label>
                <input
                  type="text"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  className="w-full bg-[#000000] border border-[#272727] px-3 py-2 text-sm text-[#F1F2F2] font-mono focus:outline-none focus:border-[#F56B2A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#767676] uppercase tracking-wider mb-1">
                  PROFESSIONAL SUMMARY & SYSTEM FOCUS
                </label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={3}
                  className="w-full bg-[#000000] border border-[#272727] px-3 py-2 text-sm text-[#F1F2F2] font-sans focus:outline-none focus:border-[#F56B2A]"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-[#F1F2F2] hover:bg-[#ffffff] text-black text-xs font-mono font-semibold uppercase tracking-wider"
              >
                [COMMIT CHANGES]
              </button>
            </div>
          ) : (
            <div className="pt-6 border-t border-[#272727] grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
              <div className="md:col-span-8 space-y-1">
                <span className="font-mono text-[10px] text-[#767676] uppercase tracking-wider block">
                  TECHNICAL STATEMENT // ARCHITECTURAL FOCUS
                </span>
                <p className="text-[#D0D1D2] leading-relaxed text-sm">
                  {user.bio}
                </p>
              </div>
              <div className="md:col-span-4 p-4 border border-[#272727] bg-[#0A0A0C] space-y-1.5">
                <span className="font-mono text-[10px] text-[#F56B2A] uppercase tracking-wider block">
                  TARGET BENCHMARK TRAJECTORY
                </span>
                <p className="font-mono text-sm text-[#F1F2F2] font-semibold">
                  {user.targetRole}
                </p>
                <span className="text-[10px] font-mono text-[#767676] block">
                  Evidence verification cycle: ACTIVE
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Verification Guarantee Strip */}
        <div className="px-6 py-3 border-t border-[#272727] bg-[#070709] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#767676]">
            <span className="text-[#F56B2A] font-bold">●</span>
            <span>
              <strong className="text-[#F1F2F2]">VERIFICATION POLICY:</strong> {tierMeta.desc}
            </span>
          </div>
          <button
            onClick={onNavigateToAssessments}
            className="text-[11px] font-mono text-[#F56B2A] hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            [TAKE PRACTICAL ASSESSMENT →]
          </button>
        </div>
      </section>

      {/* Main Grid: Skills Matrix (Left) & Project Evidence Rooms (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Technical Skills Matrix & Endorsements (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skills Matrix */}
          <div className="bg-[#000000] border border-[#272727]">
            <div className="px-5 py-3 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold text-[#F1F2F2] uppercase tracking-wider">
                02.1 // VERIFIED COMPETENCY SPECIFICATION
              </h2>
              <span className="font-mono text-[10px] text-[#767676]">
                {skills.length} UNITS
              </span>
            </div>

            <div className="p-5 space-y-6">
              {Object.entries(skillsByCategory).map(([category, catSkills], catIdx) => (
                <div key={category} className="space-y-3">
                  <div className="text-[10px] font-mono text-[#767676] uppercase tracking-widest border-b border-[#1A1A1A] pb-1">
                    {`SEC 0${catIdx + 1} / ${category.toUpperCase()}`}
                  </div>
                  <div className="space-y-3">
                    {catSkills.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 bg-[#08080A] border border-[#202020] space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#F1F2F2]">{s.name}</span>
                          {s.verifiedScore ? (
                            <span className="font-mono font-bold text-[#F56B2A] text-xs">
                              {s.verifiedScore}.0%
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] text-[#767676] border border-[#272727] px-1.5 py-0.5">
                              UNVERIFIED
                            </span>
                          )}
                        </div>

                        {/* Thin 2px rectangular meter */}
                        <div className="w-full bg-[#1A1A1A] h-1">
                          <div
                            className={`h-full ${
                              s.verificationLevel === 'Evaluator Certified'
                                ? 'bg-[#F56B2A]'
                                : s.verificationLevel === 'Employer Verified'
                                ? 'bg-[#F1F2F2]'
                                : s.verificationLevel === 'Peer Reviewed'
                                ? 'bg-[#767676]'
                                : 'bg-[#333333]'
                            }`}
                            style={{ width: `${(s.proficiency / 5) * 100}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between font-mono text-[10px] text-[#767676] pt-1">
                          <span>ARTIFACTS: {s.evidenceCount} FILES</span>
                          <span>ENDORSEMENTS: {s.endorsementsCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={onNavigateToLearning}
                  className="w-full py-2.5 bg-[#0F0E12] hover:bg-[#F1F2F2] hover:text-[#000000] text-[#F1F2F2] border border-[#272727] font-mono text-xs uppercase tracking-wider transition-colors text-center block"
                >
                  [INSPECT SKILL GAPS & CURRICULUM →]
                </button>
              </div>
            </div>
          </div>

          {/* Endorsements Dossier */}
          <div className="bg-[#000000] border border-[#272727]">
            <div className="px-5 py-3 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold text-[#F1F2F2] uppercase tracking-wider">
                02.2 // ATTESTED ENDORSEMENTS
              </h2>
              <span className="font-mono text-[10px] text-[#767676]">
                {endorsements.length} VERIFIED
              </span>
            </div>

            <div className="p-5 space-y-4">
              {endorsements.length === 0 ? (
                <div className="p-4 border border-[#272727] bg-[#08080A] text-xs font-mono text-[#767676] text-center">
                  NO SIGNED ENDORSEMENTS LOGGED
                </div>
              ) : (
                endorsements.map((end) => (
                  <div
                    key={end.id}
                    className="p-4 bg-[#08080A] border border-[#202020] space-y-2.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-[#F1F2F2]">{end.endorserName}</div>
                        <div className="text-[11px] text-[#767676] font-mono">
                          {end.endorserRole} // {end.endorserCompany}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 border border-[#333333] text-[#F1F2F2] uppercase">
                        {end.relationship}
                      </span>
                    </div>

                    <p className="text-[#D0D1D2] italic font-serif text-[12px] leading-relaxed">
                      "{end.comment}"
                    </p>

                    <div className="font-mono text-[9px] text-[#767676] truncate pt-2 border-t border-[#1C1C1F]">
                      ATTESTATION SIG: {end.verifiedSignature}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Project Evidence Rooms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#272727] pb-3">
            <div>
              <h2 className="font-mono text-xs font-semibold text-[#F1F2F2] uppercase tracking-wider">
                02.3 // PROJECT EVIDENCE ROOMS
              </h2>
              <p className="text-xs text-[#767676] mt-0.5">
                Technical repositories containing source code, benchmarks, and commit history.
              </p>
            </div>
            <span className="font-mono text-xs text-[#F56B2A]">
              {projects.length} ROOMS AUDITED
            </span>
          </div>

          {/* Project Items */}
          <div className="space-y-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#000000] border border-[#272727] p-6 space-y-5 transition-colors hover:border-[#404040]"
              >
                {/* Project Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3
                        onClick={() => onSelectProject(proj.id)}
                        className="text-lg font-bold text-[#F1F2F2] hover:text-[#F56B2A] cursor-pointer tracking-tight"
                      >
                        {proj.title}
                      </h3>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 border border-[#333333] text-[#F1F2F2] uppercase">
                        {proj.verifiedStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[#767676] font-mono">{proj.tagline}</p>
                  </div>

                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="px-3.5 py-2 bg-[#F1F2F2] hover:bg-[#ffffff] text-black font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors shrink-0"
                  >
                    [ENTER EVIDENCE ROOM →]
                  </button>
                </div>

                <p className="text-xs text-[#D0D1D2] leading-relaxed">
                  {proj.description}
                </p>

                {/* Problem & Architecture Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#08080A] p-4 border border-[#202020]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#F56B2A] uppercase tracking-wider block">
                      SYSTEM CONSTRAINT / PROBLEM
                    </span>
                    <p className="text-[#D0D1D2] text-[11px] leading-relaxed">
                      {proj.problemStatement}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#767676] uppercase tracking-wider block">
                      ARCHITECTURAL FORMULATION
                    </span>
                    <p className="text-[#D0D1D2] text-[11px] leading-relaxed">
                      {proj.architectureOverview}
                    </p>
                  </div>
                </div>

                {/* Tech Stack Metadata Tokens */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-[#767676] mr-2 uppercase tracking-wider">TECH:</span>
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-[#0D0D10] border border-[#272727] text-[#D0D1D2]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Evidence Artifacts Footer */}
                <div className="flex items-center justify-between text-xs font-mono text-[#767676] pt-3 border-t border-[#1C1C1F]">
                  <div className="flex items-center gap-4">
                    <span>{proj.evidenceFiles.length} EVIDENCE FILES</span>
                    <span>/</span>
                    <span>{proj.versionHistory.length} RELEASES ({proj.versionHistory[0]?.version})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#F1F2F2] hover:text-[#F56B2A] uppercase underline"
                      >
                        [REPO]
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#F1F2F2] hover:text-[#F56B2A] uppercase underline"
                      >
                        [DEMO]
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Assessment Submissions Record */}
          <div className="bg-[#000000] border border-[#272727]">
            <div className="px-5 py-3 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between">
              <h3 className="font-mono text-xs font-semibold text-[#F1F2F2] uppercase tracking-wider">
                02.4 // AUDITED ASSESSMENT LOGS ({submissions.length})
              </h3>
              <button
                onClick={onNavigateToAssessments}
                className="font-mono text-[11px] text-[#F56B2A] hover:underline uppercase"
              >
                [LAUNCH ASSESSMENT LAB →]
              </button>
            </div>

            <div className="p-5 space-y-4">
              {submissions.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-[#767676] border border-[#272727]">
                  NO PRACTICAL ASSESSMENTS FILED YET
                </div>
              ) : (
                submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 bg-[#08080A] border border-[#202020] space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#F1F2F2]">{sub.challengeTitle}</span>
                      <span className="font-mono font-bold text-[#F56B2A] text-sm">
                        {sub.humanReview
                          ? `${sub.humanReview.verifiedScore}/100 [HUMAN AUDITED]`
                          : `${sub.aiEvaluation?.overallScore}/100 [AI RUBRIC]`}
                      </span>
                    </div>

                    {/* Dimension Scores Table */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono text-[11px]">
                      <div className="border border-[#202020] p-2 bg-[#050507]">
                        <span className="block text-[9px] text-[#767676] uppercase">Correctness</span>
                        <strong className="text-[#F1F2F2] text-xs">
                          {sub.humanReview?.dimensionScores.correctness || sub.aiEvaluation?.dimensionScores.correctness}%
                        </strong>
                      </div>
                      <div className="border border-[#202020] p-2 bg-[#050507]">
                        <span className="block text-[9px] text-[#767676] uppercase">Architecture</span>
                        <strong className="text-[#F1F2F2] text-xs">
                          {sub.humanReview?.dimensionScores.architecture || sub.aiEvaluation?.dimensionScores.architecture}%
                        </strong>
                      </div>
                      <div className="border border-[#202020] p-2 bg-[#050507]">
                        <span className="block text-[9px] text-[#767676] uppercase">Implementation</span>
                        <strong className="text-[#F1F2F2] text-xs">
                          {sub.humanReview?.dimensionScores.implementation || sub.aiEvaluation?.dimensionScores.implementation}%
                        </strong>
                      </div>
                      <div className="border border-[#202020] p-2 bg-[#050507]">
                        <span className="block text-[9px] text-[#767676] uppercase">Edge Cases</span>
                        <strong className="text-[#F1F2F2] text-xs">
                          {sub.humanReview?.dimensionScores.edge_cases || sub.aiEvaluation?.dimensionScores.edge_cases}%
                        </strong>
                      </div>
                      <div className="border border-[#202020] p-2 bg-[#050507]">
                        <span className="block text-[9px] text-[#767676] uppercase">Communication</span>
                        <strong className="text-[#F1F2F2] text-xs">
                          {sub.humanReview?.dimensionScores.communication || sub.aiEvaluation?.dimensionScores.communication}%
                        </strong>
                      </div>
                    </div>

                    {sub.humanReview && (
                      <p className="text-[11px] text-[#767676] italic font-serif border-t border-[#1C1C1F] pt-2">
                        Evaluator Note ({sub.humanReview.reviewerName}): "{sub.humanReview.qualitativeFeedback}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
