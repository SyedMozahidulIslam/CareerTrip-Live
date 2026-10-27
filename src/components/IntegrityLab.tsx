import React, { useState } from 'react';
import { IntegrityFinding } from '../types';
import {
  Fingerprint,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Eye,
  Info,
  Sliders,
  Scale,
  Sparkles,
  FileCode
} from 'lucide-react';

interface IntegrityLabProps {
  findings: IntegrityFinding[];
  onSetDisposition: (findingId: string, status: IntegrityFinding['status'], notes?: string) => void;
}

export const IntegrityLab: React.FC<IntegrityLabProps> = ({
  findings,
  onSetDisposition,
}) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string>(findings[0]?.id || '');
  const [auditorNoteInput, setAuditorNoteInput] = useState('');
  const [showDispositionModal, setShowDispositionModal] = useState(false);
  const [modalStatus, setModalStatus] = useState<IntegrityFinding['status']>('cleared');

  const selectedFinding = findings.find((f) => f.id === selectedFindingId) || findings[0];

  const handleOpenDisposition = (status: IntegrityFinding['status']) => {
    setModalStatus(status);
    setAuditorNoteInput(selectedFinding?.auditorNotes || '');
    setShowDispositionModal(true);
  };

  const handleSaveDisposition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFinding) return;
    onSetDisposition(selectedFinding.id, modalStatus, auditorNoteInput);
    setShowDispositionModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-rose-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Integrity & Plagiarism Scrutiny Lab</h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold">
            HUMAN-AUDITED FRAUD DEFENSE
          </span>
        </div>
        <p className="text-xs text-zinc-300 max-w-4xl leading-relaxed">
          Our integrity engine analyzes token n-grams, AST similarity, synthetic markdown signatures, and cross-corpus duplications.
          Crucially, results provide evidence and confidence levels for human reviewer disposition—never automatically accusing or disqualifying candidates.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-zinc-400 uppercase text-[10px] tracking-wider block">Audited Findings</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{findings.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-zinc-400 uppercase text-[10px] tracking-wider block">Pending Review</span>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {findings.filter((f) => f.status === 'pending_review').length}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-zinc-400 uppercase text-[10px] tracking-wider block">Cleared (False Positives)</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {findings.filter((f) => f.status === 'cleared').length}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <span className="text-zinc-400 uppercase text-[10px] tracking-wider block">Review Discipline</span>
          <div className="text-sm font-semibold text-zinc-300 mt-2 flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-indigo-400" />
            Zero Auto-Disqualification
          </div>
        </div>
      </div>

      {/* Main Investigation Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Findings List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block px-1">
            Flagged Submissions for Inspection
          </span>

          <div className="space-y-2">
            {findings.map((f) => {
              const isSelected = f.id === selectedFinding?.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFindingId(f.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 text-xs ${
                    isSelected
                      ? 'bg-zinc-850 border-rose-500/50 ring-1 ring-rose-500/20'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-white">{f.candidateName}</div>
                      <div className="text-[11px] text-zinc-400">{f.challengeTitle}</div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        f.severity === 'alert'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : f.severity === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {f.severity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <span className="font-mono text-zinc-500">{f.category}</span>
                    <span className="font-mono font-semibold text-rose-300">
                      {f.confidence}% Confidence
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-zinc-800/80">
                    <span
                      className={`capitalize font-medium ${
                        f.status === 'cleared'
                          ? 'text-emerald-400'
                          : f.status === 'flagged'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      Status: {f.status.replace('_', ' ')}
                    </span>
                    <span className="text-zinc-500">ID: {f.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Evidence Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedFinding ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-5 shadow-sm text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileSearch className="w-4 h-4 text-rose-400" />
                    Evidence Analysis Dossier
                  </h3>
                  <p className="text-zinc-400 text-[11px]">
                    Candidate: <strong className="text-zinc-200">{selectedFinding.candidateName}</strong> · Challenge: <strong className="text-zinc-200">{selectedFinding.challengeTitle}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block font-mono">Detection Confidence</span>
                  <span className="text-lg font-bold font-mono text-rose-400">
                    {selectedFinding.confidence}%
                  </span>
                </div>
              </div>

              {/* Anomaly Category */}
              <div>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Categorized Anomaly Pattern
                </span>
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-zinc-200">
                  {selectedFinding.category}
                </div>
              </div>

              {/* Concrete Evidence Findings */}
              <div>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Concrete Evidence Findings
                </span>
                <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 text-zinc-200 leading-relaxed font-mono text-[11px] whitespace-pre-line">
                  {selectedFinding.evidence}
                </div>
              </div>

              {/* Auditor Recommendation */}
              <div className="bg-indigo-950/20 p-3.5 rounded-lg border border-indigo-500/30 space-y-1">
                <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Recommended Review Action
                </span>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {selectedFinding.recommendation}
                </p>
              </div>

              {/* Existing Auditor Notes if any */}
              {selectedFinding.auditorNotes && (
                <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    Recorded Auditor Disposition Note:
                  </span>
                  <p className="text-zinc-300 italic text-xs">
                    "{selectedFinding.auditorNotes}"
                  </p>
                </div>
              )}

              {/* Disposition Action Buttons */}
              <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-zinc-500">
                  Current Status: <strong className="text-zinc-300 capitalize">{selectedFinding.status.replace('_', ' ')}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDisposition('cleared')}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Clear as False Positive</span>
                  </button>

                  <button
                    onClick={() => handleOpenDisposition('flagged')}
                    className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Request Live Evidence Defense</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-xs bg-zinc-900 border border-zinc-800 rounded-xl">
              Select an item on the left to inspect evidence.
            </div>
          )}
        </div>
      </div>

      {/* Disposition Modal */}
      {showDispositionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              Record Human Auditor Disposition
            </h3>
            <p className="text-xs text-zinc-400">
              Set final disposition for {selectedFinding?.candidateName}'s submission.
            </p>

            <form onSubmit={handleSaveDisposition} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Disposition Decision</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                >
                  <option value="cleared">Cleared (Standard Idiom / False Positive)</option>
                  <option value="flagged">Flagged (Requires Interactive Code Defense)</option>
                  <option value="pending_review">Pending Additional Evidence</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Auditor Technical Notes</label>
                <textarea
                  rows={4}
                  value={auditorNoteInput}
                  onChange={(e) => setAuditorNoteInput(e.target.value)}
                  placeholder="Explain why this was cleared or what specific lines need live defense during interview..."
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDispositionModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Commit Disposition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
