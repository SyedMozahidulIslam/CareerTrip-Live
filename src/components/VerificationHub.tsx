import React, { useState } from 'react';
import { User, Endorsement, AuditLog, Project } from '../types';

interface VerificationHubProps {
  currentUser: User;
  candidates: User[];
  projects: Project[];
  endorsements: Endorsement[];
  auditLogs: AuditLog[];
  onAddEndorsement: (endorsementData: Partial<Endorsement>) => void;
}

export const VerificationHub: React.FC<VerificationHubProps> = ({
  currentUser,
  candidates,
  projects,
  endorsements,
  auditLogs,
  onAddEndorsement,
}) => {
  const [showEndorsementModal, setShowEndorsementModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || '');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [endorserName, setEndorserName] = useState(currentUser.name);
  const [endorserRole, setEndorserRole] = useState(currentUser.headline);
  const [endorserCompany, setEndorserCompany] = useState('Senior Technology Council');
  const [relationship, setRelationship] = useState<Endorsement['relationship']>('Manager');
  const [endorsementComment, setEndorsementComment] = useState('');
  const [skillName, setSkillName] = useState('Distributed Consensus & Storage Systems');

  const handleCreateEndorsement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId || !endorsementComment) return;

    onAddEndorsement({
      candidateId: selectedCandidateId,
      projectId: selectedProjectId || undefined,
      skillName,
      endorserName,
      endorserRole,
      endorserCompany,
      relationship,
      comment: endorsementComment,
    });

    setShowEndorsementModal(false);
    setEndorsementComment('');
  };

  const candidateProjects = projects.filter((p) => p.userId === selectedCandidateId);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Specification Strip */}
      <div className="bg-[#000000] border border-[#272727]">
        <div className="px-6 py-2 border-b border-[#272727] bg-[#0A0A0C] flex flex-wrap items-center justify-between font-mono text-[10px] text-[#767676]">
          <div className="flex items-center gap-3">
            <span className="text-[#F1F2F2]">ATTESTATION SPEC // 06.0</span>
            <span>/</span>
            <span>REGISTRY: CRYPTOGRAPHIC ED25519 AUDIT TRAIL</span>
          </div>
          <div className="flex items-center gap-3">
            <span>REGISTERED ATTESTATIONS: {endorsements.length}</span>
            <span>/</span>
            <span className="text-[#F56B2A]">IMMUTABLE AUDIT LOGS: {auditLogs.length}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-light text-[#F1F2F2] tracking-tight">
              Verification & Attestation Hub
            </h1>
            <p className="text-sm text-[#767676] font-mono">
              Independent employer signatures, verified code reviews, and append-only audit records.
            </p>
          </div>

          <button
            onClick={() => setShowEndorsementModal(true)}
            className="px-4 py-2 bg-[#F56B2A] hover:bg-[#ff7b3d] text-black font-mono text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
          >
            [+ RECORD VERIFIED ATTESTATION]
          </button>
        </div>
      </div>

      {/* Core Policy Specification Box */}
      <div className="bg-[#08080A] border border-[#272727] p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#F56B2A]"></span>
          <span className="font-bold text-[#F1F2F2] uppercase tracking-wider">
            CAREERTRIP VERIFICATION POLICY SPECIFICATION
          </span>
        </div>
        <p className="text-[#D0D1D2] font-sans leading-relaxed text-sm">
          <strong className="text-[#F56B2A]">Never label unverified claims as verified.</strong> Unattested skills and self-reported projects remain explicitly marked as <em>UNVERIFIED</em> until supported by cryptographic employer signature, certified evaluator assessment, or peer review.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-[#000000] border border-[#202020] space-y-1">
            <span className="text-[#F56B2A] font-bold text-[10px] block uppercase">EVALUATOR CERTIFIED</span>
            <p className="text-[#767676] text-[10px] font-sans">2+ practical challenges &ge; 80% + employer verified repository.</p>
          </div>
          <div className="p-3 bg-[#000000] border border-[#202020] space-y-1">
            <span className="text-[#F1F2F2] font-bold text-[10px] block uppercase">EMPLOYER VERIFIED</span>
            <p className="text-[#767676] text-[10px] font-sans">Engineering manager attestation with verified commit log review.</p>
          </div>
          <div className="p-3 bg-[#000000] border border-[#202020] space-y-1">
            <span className="text-[#A0A2A4] font-bold text-[10px] block uppercase">PEER REVIEWED</span>
            <p className="text-[#767676] text-[10px] font-sans">2+ signed attestations from open source maintainers or staff peers.</p>
          </div>
          <div className="p-3 bg-[#000000] border border-[#202020] space-y-1">
            <span className="text-[#767676] font-bold text-[10px] block uppercase">UNVERIFIED</span>
            <p className="text-[#767676] text-[10px] font-sans">Self-reported claims awaiting practical verification.</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Attestation Registry (7 cols) & Immutable Audit Trail (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Attestation Registry (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#000000] border border-[#272727]">
            <div className="px-5 py-3 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between font-mono text-xs">
              <h3 className="font-semibold text-[#F1F2F2] uppercase tracking-wider">
                06.1 // SIGNED ATTESTATION REGISTRY ({endorsements.length})
              </h3>
              <span className="text-[10px] text-[#767676]">ED25519 SIGNATURES</span>
            </div>

            <div className="p-5 space-y-4">
              {endorsements.map((end) => (
                <div
                  key={end.id}
                  className="p-4 border border-[#202020] bg-[#08080A] space-y-3 font-mono text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-[#F1F2F2] text-sm">{end.endorserName}</div>
                      <div className="text-[10px] text-[#767676]">
                        {end.endorserRole} // {end.endorserCompany}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 border border-[#333333] text-[#F56B2A] uppercase">
                      {end.relationship}
                    </span>
                  </div>

                  <p className="text-[#D0D1D2] font-sans text-xs italic leading-relaxed">
                    "{end.comment}"
                  </p>

                  {end.projectTitle && (
                    <div className="text-[10px] text-[#767676] pt-1">
                      VERIFIED REPOSITORY: <strong className="text-[#F1F2F2]">{end.projectTitle}</strong>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[9px] text-[#767676] pt-2 border-t border-[#1C1C1F]">
                    <span className="truncate max-w-sm">SIG: {end.verifiedSignature}</span>
                    <span>{new Date(end.createdAt).toISOString().split('T')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Immutable System Event Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#000000] border border-[#272727]">
            <div className="px-5 py-3 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between font-mono text-xs">
              <h3 className="font-semibold text-[#F1F2F2] uppercase tracking-wider">
                06.2 // IMMUTABLE SYSTEM EVENT LOG ({auditLogs.length})
              </h3>
              <span className="text-[10px] text-[#767676]">APPEND-ONLY</span>
            </div>

            <div className="p-4 space-y-2.5 max-h-[620px] overflow-y-auto font-mono text-xs">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 border border-[#1C1C1F] bg-[#08080A] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#F56B2A] font-bold">{log.action}</span>
                    <span className="text-[#767676]">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[#D0D1D2] font-sans text-xs leading-relaxed">
                    {log.details}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-[#767676] pt-1 border-t border-[#141416]">
                    <span>ACTOR: {log.actor}</span>
                    <span>TYPE: {log.targetType.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Submit Endorsement */}
      {showEndorsementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="bg-[#000000] border border-[#272727] max-w-lg w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#272727] pb-3">
              <h3 className="text-xs font-bold text-[#F1F2F2] uppercase tracking-wider">
                [RECORD CRYPTOGRAPHIC ATTESTATION]
              </h3>
              <button onClick={() => setShowEndorsementModal(false)} className="text-[#767676] hover:text-[#F1F2F2]">[X]</button>
            </div>

            <form onSubmit={handleCreateEndorsement} className="space-y-3">
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">TARGET CANDIDATE</label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                >
                  {candidates.filter(c => c.role === 'candidate').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} [@{c.handle}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">VERIFIED REPOSITORY (OPTIONAL)</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                >
                  <option value="">NO SPECIFIC REPOSITORY (GENERAL COMPETENCY)</option>
                  {candidateProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#767676] mb-1 uppercase text-[10px]">YOUR NAME</label>
                  <input
                    type="text"
                    value={endorserName}
                    onChange={(e) => setEndorserName(e.target.value)}
                    required
                    className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                  />
                </div>
                <div>
                  <label className="block text-[#767676] mb-1 uppercase text-[10px]">YOUR TITLE / ROLE</label>
                  <input
                    type="text"
                    value={endorserRole}
                    onChange={(e) => setEndorserRole(e.target.value)}
                    required
                    className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#767676] mb-1 uppercase text-[10px]">ORGANIZATION</label>
                  <input
                    type="text"
                    value={endorserCompany}
                    onChange={(e) => setEndorserCompany(e.target.value)}
                    required
                    className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                  />
                </div>
                <div>
                  <label className="block text-[#767676] mb-1 uppercase text-[10px]">RELATIONSHIP</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                  >
                    <option value="Manager">DIRECT MANAGER / VP</option>
                    <option value="Senior Colleague">SENIOR STAFF PEER</option>
                    <option value="Mentor">TECHNICAL MENTOR</option>
                    <option value="Open Source Maintainer">OPEN SOURCE MAINTAINER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">VERIFIABLE ATTESTATION ASSESSMENT</label>
                <textarea
                  rows={4}
                  value={endorsementComment}
                  onChange={(e) => setEndorsementComment(e.target.value)}
                  placeholder="Detail observed code contributions, architectural decisions, and production metrics..."
                  required
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] font-sans"
                />
              </div>

              <div className="p-2.5 bg-[#08080A] border border-[#202020] text-[10px] text-[#767676]">
                COMMITTING THIS ATTESTATION ISSUES AN ED25519 SIGNATURE RECORDED TO THE IMMUTABLE AUDIT STREAM.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#202020]">
                <button
                  type="button"
                  onClick={() => setShowEndorsementModal(false)}
                  className="px-4 py-2 bg-[#0F0E12] text-[#767676] uppercase text-xs"
                >
                  [DISCARD]
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F56B2A] text-black font-semibold uppercase text-xs"
                >
                  [SIGN & RECORD ATTESTATION]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
