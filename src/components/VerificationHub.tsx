import React, { useState } from 'react';
import { User, Endorsement, AuditLog, Project } from '../types';
import {
  ShieldCheck,
  Award,
  KeyRound,
  FileCheck,
  History,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Send,
  UserCheck,
  Building,
  Briefcase,
  Lock,
  ExternalLink
} from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Verification & Endorsement Hub</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              TRANSPARENT REPUTATION & AUDIT DECISIONS
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-1">
            Independent employer attestations, cryptographic signatures, and verifiable decision logs.
          </p>
        </div>

        <button
          onClick={() => setShowEndorsementModal(true)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record Verified Endorsement</span>
        </button>
      </div>

      {/* Core Verification Policy Card */}
      <div className="bg-zinc-950 border border-emerald-500/30 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            CareerTrip Live Verification Standard
          </h2>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-emerald-400">Never label unverified claims as verified.</strong> Unattested skills and self-reported projects remain explicitly marked as <em>Unverified</em> until supported by rigorous, audited evidence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 space-y-1">
            <span className="font-semibold text-emerald-400 block text-[11px]">Evaluator Certified</span>
            <p className="text-zinc-400 text-[10px]">2+ assessments scored &ge; 80% + employer verified project.</p>
          </div>
          <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 space-y-1">
            <span className="font-semibold text-indigo-400 block text-[11px]">Employer Verified</span>
            <p className="text-zinc-400 text-[10px]">Direct manager attestation with commit diff review.</p>
          </div>
          <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 space-y-1">
            <span className="font-semibold text-sky-400 block text-[11px]">Peer Reviewed</span>
            <p className="text-zinc-400 text-[10px]">2+ endorsements from open source maintainers or senior peers.</p>
          </div>
          <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 space-y-1">
            <span className="font-semibold text-amber-400 block text-[11px]">Unverified</span>
            <p className="text-zinc-400 text-[10px]">Self-reported claims awaiting practical evaluation.</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Endorsements Registry & Immutable Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Endorsements (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Verified Endorsements Registry ({endorsements.length})
              </h3>
              <span className="text-[11px] text-zinc-500 font-mono">Ed25519 Signatures</span>
            </div>

            <div className="space-y-3">
              {endorsements.map((end) => (
                <div
                  key={end.id}
                  className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4 space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-zinc-200 text-sm">{end.endorserName}</strong>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold">
                          {end.relationship}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {end.endorserRole} · {end.endorserCompany}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">Candidate</span>
                      <strong className="text-white text-xs">{end.candidateName}</strong>
                    </div>
                  </div>

                  <p className="text-zinc-300 italic leading-relaxed text-xs">
                    "{end.comment}"
                  </p>

                  {end.projectTitle && (
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-1">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Verified Project: <strong className="text-zinc-300">{end.projectTitle}</strong></span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-2 border-t border-zinc-850">
                    <span className="truncate max-w-xs">Sig: {end.verifiedSignature}</span>
                    <span>{new Date(end.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Immutable Audit Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" />
                Immutable Verification Audit Trail ({auditLogs.length})
              </h3>
              <span className="text-[11px] text-zinc-500 font-mono">Append-Only</span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 space-y-1.5 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 font-semibold text-[11px] truncate">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-[11px] font-sans leading-relaxed">
                    {log.details}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                    <span>Actor: {log.actor} ({log.actorRole})</span>
                    <span>Type: {log.targetType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Record Endorsement Modal */}
      {showEndorsementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Submit Cryptographically Signed Endorsement
              </h3>
              <button onClick={() => setShowEndorsementModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateEndorsement} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Target Candidate</label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                >
                  {candidates.filter(c => c.role === 'candidate').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.headline})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Associated Project Evidence Room (Optional)</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                >
                  <option value="">No specific project (General skill endorsement)</option>
                  {candidateProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={endorserName}
                    onChange={(e) => setEndorserName(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Your Role / Title</label>
                  <input
                    type="text"
                    value={endorserRole}
                    onChange={(e) => setEndorserRole(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Organization / Company</label>
                  <input
                    type="text"
                    value={endorserCompany}
                    onChange={(e) => setEndorserCompany(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Professional Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                  >
                    <option value="Manager">Direct Manager / VP</option>
                    <option value="Senior Colleague">Senior Colleague / Staff Peer</option>
                    <option value="Mentor">Technical Mentor</option>
                    <option value="Open Source Maintainer">Open Source Maintainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Verifiable Contribution Assessment</label>
                <textarea
                  rows={4}
                  value={endorsementComment}
                  onChange={(e) => setEndorsementComment(e.target.value)}
                  placeholder="Detail specific code contributions, architectural decisions, and production impact you observed..."
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                />
              </div>

              <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded text-[11px] text-zinc-400">
                Submitting this endorsement generates an immutable Ed25519 signature hash recorded to the public audit log.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEndorsementModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
                >
                  Sign & Submit Endorsement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
