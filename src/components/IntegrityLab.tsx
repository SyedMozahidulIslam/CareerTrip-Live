import React, { useState } from 'react';
import { IntegrityFinding } from '../types';

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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Specification Strip */}
      <div className="bg-[#000000] border border-[#272727]">
        <div className="px-6 py-2 border-b border-[#272727] bg-[#0A0A0C] flex flex-wrap items-center justify-between font-mono text-[10px] text-[#767676]">
          <div className="flex items-center gap-3">
            <span className="text-[#F1F2F2]">INTEGRITY SPEC // 07.0</span>
            <span>/</span>
            <span>ALGORITHM: JACCARD N-GRAM + AST TOKEN OVERLAP</span>
          </div>
          <div className="flex items-center gap-3">
            <span>AUTOMATED DISQUALIFICATION: STRICTLY DISABLED</span>
            <span>/</span>
            <span className="text-[#F56B2A]">HUMAN DISPOSITION: MANDATORY</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-light text-[#F1F2F2] tracking-tight">
            Integrity & Plagiarism Scrutiny Lab
          </h1>
          <p className="text-sm text-[#767676] font-mono max-w-4xl leading-relaxed">
            Corpus analysis flags code overlap, template artifacts, and claim inconsistencies for accredited human review.
            Under no circumstances does the system automatically accuse or disqualify candidates.
          </p>
        </div>
      </div>

      {/* Metrics Row: Aligned Industrial Cells */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#000000] border border-[#272727] p-4 space-y-1">
          <span className="text-[10px] text-[#767676] uppercase tracking-wider block">LOGGED FINDINGS</span>
          <div className="text-2xl font-bold text-[#F1F2F2]">{findings.length}</div>
        </div>
        <div className="bg-[#000000] border border-[#272727] p-4 space-y-1">
          <span className="text-[10px] text-[#767676] uppercase tracking-wider block">PENDING HUMAN REVIEW</span>
          <div className="text-2xl font-bold text-[#F56B2A]">
            {findings.filter((f) => f.status === 'pending_review').length}
          </div>
        </div>
        <div className="bg-[#000000] border border-[#272727] p-4 space-y-1">
          <span className="text-[10px] text-[#767676] uppercase tracking-wider block">CLEARED (FALSE POSITIVES)</span>
          <div className="text-2xl font-bold text-[#F1F2F2]">
            {findings.filter((f) => f.status === 'cleared').length}
          </div>
        </div>
        <div className="bg-[#000000] border border-[#272727] p-4 space-y-1">
          <span className="text-[10px] text-[#767676] uppercase tracking-wider block">DISPOSITION MANDATE</span>
          <div className="text-xs font-bold text-[#F1F2F2] pt-2 uppercase">
            HUMAN AUDIT REQUIRED
          </div>
        </div>
      </div>

      {/* Split Investigation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Flagged Submissions (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="font-mono text-[10px] text-[#767676] uppercase tracking-wider block px-1">
            FLAGGED ENTRIES FOR AUDITOR REVIEW
          </span>

          <div className="space-y-2">
            {findings.map((f) => {
              const isSelected = f.id === selectedFinding?.id;

              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFindingId(f.id)}
                  className={`p-4 border cursor-pointer transition-colors space-y-2 font-mono text-xs ${
                    isSelected
                      ? 'border-[#F56B2A] bg-[#0A0A0E]'
                      : 'border-[#202020] bg-[#08080A] hover:border-[#333333]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-[#F1F2F2]">{f.candidateName}</div>
                      <div className="text-[10px] text-[#767676]">{f.challengeTitle}</div>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 border uppercase ${
                        f.severity === 'alert'
                          ? 'border-[#F56B2A] text-[#F56B2A]'
                          : f.severity === 'warning'
                          ? 'border-[#F1F2F2] text-[#F1F2F2]'
                          : 'border-[#404040] text-[#767676]'
                      }`}
                    >
                      {f.severity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#767676] pt-1">
                    <span>{f.category}</span>
                    <span className="text-[#F56B2A] font-bold">{f.confidence}% CONFIDENCE</span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-[#555555] pt-1 border-t border-[#1C1C1F]">
                    <span>STATUS: {f.status.toUpperCase()}</span>
                    <span>ID: {f.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Evidence Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedFinding ? (
            <div className="bg-[#000000] border border-[#272727] p-6 space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-[#F1F2F2] uppercase tracking-wider">
                    EVIDENCE ANALYSIS DOSSIER // {selectedFinding.id}
                  </h3>
                  <p className="text-[10px] text-[#767676]">
                    SUBJECT: {selectedFinding.candidateName} // {selectedFinding.challengeTitle}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#767676] block">CONFIDENCE</span>
                  <span className="text-lg font-bold text-[#F56B2A]">
                    {selectedFinding.confidence}.0%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#767676] uppercase tracking-wider block mb-1">
                  CATEGORIZED PATTERN
                </span>
                <div className="p-3 bg-[#08080A] border border-[#202020] text-[#F1F2F2]">
                  {selectedFinding.category}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#767676] uppercase tracking-wider block mb-1">
                  OBSERVED EVIDENCE EXTRACT
                </span>
                <div className="p-4 bg-[#08080A] border border-[#202020] text-[#D0D1D2] leading-relaxed text-[11px] whitespace-pre-line">
                  {selectedFinding.evidence}
                </div>
              </div>

              <div className="p-3.5 bg-[#0A0A0E] border border-[#272727] space-y-1">
                <span className="text-[10px] text-[#F56B2A] uppercase tracking-wider block">
                  RECOMMENDED REVIEW ACTION:
                </span>
                <p className="text-[#D0D1D2] font-sans text-xs">
                  {selectedFinding.recommendation}
                </p>
              </div>

              {selectedFinding.auditorNotes && (
                <div className="p-3.5 bg-[#08080A] border border-[#202020] space-y-1">
                  <span className="text-[10px] text-[#F1F2F2] uppercase tracking-wider block">
                    RECORDED AUDITOR DISPOSITION NOTE:
                  </span>
                  <p className="text-[#767676] italic font-serif text-xs">
                    "{selectedFinding.auditorNotes}"
                  </p>
                </div>
              )}

              {/* Disposition Action Buttons */}
              <div className="pt-3 border-t border-[#202020] flex flex-wrap items-center justify-between gap-3">
                <div className="text-[10px] text-[#767676] uppercase">
                  CURRENT DISPOSITION: <strong className="text-[#F1F2F2]">{selectedFinding.status.toUpperCase()}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDisposition('cleared')}
                    className="px-3 py-1.5 bg-[#0F0E12] hover:bg-[#F1F2F2] hover:text-[#000000] text-[#F1F2F2] border border-[#272727] uppercase text-[10px] transition-colors"
                  >
                    [CLEAR AS FALSE POSITIVE]
                  </button>

                  <button
                    onClick={() => handleOpenDisposition('flagged')}
                    className="px-3 py-1.5 bg-[#F56B2A] hover:bg-[#ff7b3d] text-black font-semibold uppercase text-[10px] transition-colors"
                  >
                    [REQUEST LIVE CODE DEFENSE]
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center font-mono text-xs text-[#767676] border border-[#272727]">
              SELECT AN ENTRY TO INSPECT EVIDENCE
            </div>
          )}
        </div>
      </div>

      {/* Modal: Disposition Entry */}
      {showDispositionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="bg-[#000000] border border-[#272727] max-w-md w-full p-6 space-y-4 font-mono text-xs">
            <h3 className="font-bold text-[#F1F2F2] uppercase tracking-wider text-xs">
              [COMMIT HUMAN AUDITOR DISPOSITION]
            </h3>
            <p className="text-[#767676] text-[10px]">
              RECORD FINDING DISPOSITION FOR {selectedFinding?.candidateName.toUpperCase()}
            </p>

            <form onSubmit={handleSaveDisposition} className="space-y-3">
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">DECISION STATUS</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as any)}
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                >
                  <option value="cleared">CLEARED (FALSE POSITIVE / CONVENTIONAL SYNTAX)</option>
                  <option value="flagged">FLAGGED (REQUIRES LIVE DEFENSE IN INTERVIEW)</option>
                  <option value="pending_review">PENDING ADDITIONAL ARTIFACT AUDIT</option>
                </select>
              </div>

              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">AUDITOR TECHNICAL NOTE</label>
                <textarea
                  rows={4}
                  value={auditorNoteInput}
                  onChange={(e) => setAuditorNoteInput(e.target.value)}
                  placeholder="State technical rationale for clearance or lines of inquiry during technical defense..."
                  required
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#202020]">
                <button
                  type="button"
                  onClick={() => setShowDispositionModal(false)}
                  className="px-4 py-2 bg-[#0F0E12] text-[#767676] uppercase text-xs"
                >
                  [DISCARD]
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F56B2A] text-black font-semibold uppercase text-xs"
                >
                  [COMMIT DISPOSITION]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
