import React, { useState } from 'react';
import { Project, EvidenceFile, ProjectVersion } from '../types';

interface ProjectEvidenceRoomProps {
  project: Project;
  onBack: () => void;
  onAddEvidence: (file: Partial<EvidenceFile>) => void;
  onAddVersion: (ver: Partial<ProjectVersion>) => void;
}

export const ProjectEvidenceRoom: React.FC<ProjectEvidenceRoomProps> = ({
  project,
  onBack,
  onAddEvidence,
  onAddVersion,
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'architecture' | 'versions' | 'contributions'>('files');
  const [selectedFileId, setSelectedFileId] = useState<string>(project.evidenceFiles[0]?.id || '');
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [showAddVersionModal, setShowAddVersionModal] = useState(false);

  // New Evidence Form State
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'code' | 'benchmark' | 'diagram'>('code');
  const [newFileLang, setNewFileLang] = useState('typescript');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileExplanation, setNewFileExplanation] = useState('');

  // New Version Form State
  const [newVersionNum, setNewVersionNum] = useState(`v1.${project.versionHistory.length}.0`);
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [newVersionDiff, setNewVersionDiff] = useState('');

  const currentFile = project.evidenceFiles.find((f) => f.id === selectedFileId) || project.evidenceFiles[0];

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName || !newFileContent) return;
    onAddEvidence({
      name: newFileName,
      type: newFileType,
      language: newFileLang,
      contentOrUrl: newFileContent,
      explanation: newFileExplanation,
      verifiedStatus: 'unverified',
    });
    setShowAddEvidenceModal(false);
    setNewFileName('');
    setNewFileContent('');
    setNewFileExplanation('');
  };

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionNum || !newVersionNotes) return;
    onAddVersion({
      version: newVersionNum,
      notes: newVersionNotes,
      diffSummary: newVersionDiff,
      commitHash: Math.random().toString(16).substring(2, 10),
    });
    setShowAddVersionModal(false);
    setNewVersionNotes('');
    setNewVersionDiff('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#272727] pb-4">
        <button
          onClick={onBack}
          className="font-mono text-xs text-[#767676] hover:text-[#F1F2F2] flex items-center gap-1.5 uppercase tracking-wider transition-colors"
        >
          <span>[← RETURN TO DOSSIER]</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddVersionModal(true)}
            className="px-3 py-1.5 bg-[#0F0E12] hover:bg-[#F1F2F2] hover:text-[#000000] text-[#F1F2F2] border border-[#272727] font-mono text-xs uppercase tracking-wider transition-colors"
          >
            [PUBLISH REVISION]
          </button>
          <button
            onClick={() => setShowAddEvidenceModal(true)}
            className="px-3.5 py-1.5 bg-[#F56B2A] hover:bg-[#ff7b3d] text-black font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            [+ UPLOAD ARTIFACT]
          </button>
        </div>
      </div>

      {/* Room Specification Banner */}
      <div className="bg-[#000000] border border-[#272727]">
        <div className="px-6 py-2 border-b border-[#272727] bg-[#0A0A0C] flex flex-wrap items-center justify-between font-mono text-[10px] text-[#767676]">
          <div className="flex items-center gap-3">
            <span className="text-[#F1F2F2]">ROOM SPEC // {project.id.toUpperCase()}</span>
            <span>/</span>
            <span>VERIFICATION STATUS: {project.verifiedStatus.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>REPOSITORY ACCESS: READ-ONLY AUDIT</span>
            <span>/</span>
            <span className="text-[#F56B2A]">ACTIVE REVISION: {project.versionHistory[0]?.version}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-light text-[#F1F2F2] tracking-tight">
                {project.title}
              </h1>
              <p className="text-sm text-[#767676] font-mono">
                {project.tagline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#0F0E12] hover:bg-[#F1F2F2] hover:text-[#000000] text-[#F1F2F2] border border-[#272727] font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  [SOURCE REPO ↗]
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#0F0E12] hover:bg-[#F56B2A] hover:text-black text-[#F56B2A] border border-[#F56B2A] font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  [LIVE DEMO ↗]
                </a>
              )}
            </div>
          </div>

          {/* Tech Stack Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1C1C1F] font-mono text-[10px]">
            <span className="text-[#767676] uppercase tracking-wider mr-1">TECH STACK:</span>
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-[#08080A] border border-[#272727] text-[#D0D1D2]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Numbered Tab Navigation */}
      <div className="flex items-stretch border-b border-[#272727] overflow-x-auto bg-[#070709] divide-x divide-[#272727]">
        {[
          { id: 'files', num: '03.1', label: `ARTIFACTS & CODE (${project.evidenceFiles.length})` },
          { id: 'architecture', num: '03.2', label: 'ARCHITECTURE SPEC' },
          { id: 'versions', num: '03.3', label: `REVISION LOGS (${project.versionHistory.length})` },
          { id: 'contributions', num: '03.4', label: `VERIFIED CONTRIBUTIONS (${project.keyContributions.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#000000] text-[#F1F2F2] border-t-2 border-t-[#F56B2A]'
                : 'text-[#767676] hover:text-[#F1F2F2] hover:bg-[#0B0B0E]'
            }`}
          >
            <span className="text-[10px] text-[#555555]">{tab.num}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Artifacts & Code Viewer */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Index Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="font-mono text-[10px] text-[#767676] uppercase tracking-wider block px-1">
              INDEX // EVIDENCE ARTIFACTS
            </span>
            <div className="border border-[#272727] bg-[#000000] divide-y divide-[#1C1C1F]">
              {project.evidenceFiles.length === 0 ? (
                <div className="p-6 font-mono text-xs text-[#767676] text-center">
                  NO ARTIFACTS ATTACHED
                </div>
              ) : (
                project.evidenceFiles.map((file, idx) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1 ${
                      file.id === (currentFile?.id || '')
                        ? 'bg-[#0F0E12] border-l-2 border-l-[#F56B2A]'
                        : 'hover:bg-[#08080A]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-[#F1F2F2] font-semibold truncate">{file.name}</span>
                      <span className="text-[10px] text-[#F56B2A] uppercase">{file.type}</span>
                    </div>
                    <div className="font-mono text-[10px] text-[#767676] flex items-center justify-between">
                      <span>LANG: {file.language || 'RAW'}</span>
                      <span>FILE_0{idx + 1}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Code Viewer Panel (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {currentFile ? (
              <div className="border border-[#272727] bg-[#050507]">
                {/* File Header */}
                <div className="px-4 py-2.5 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F56B2A]">SOURCE:</span>
                    <span className="text-[#F1F2F2] font-semibold">{currentFile.name}</span>
                    <span className="text-[10px] text-[#767676] uppercase">[{currentFile.language}]</span>
                  </div>
                  <span className="text-[10px] text-[#767676] uppercase">
                    INTEGRITY CHECKED // AUDITED
                  </span>
                </div>

                {/* Technical Rationale Bar */}
                {currentFile.explanation && (
                  <div className="px-4 py-3 border-b border-[#202020] bg-[#08080A] font-mono text-xs text-[#D0D1D2]">
                    <strong className="text-[#F56B2A] uppercase mr-1">RATIONALE:</strong>
                    {currentFile.explanation}
                  </div>
                )}

                {/* Preformatted Code Content */}
                <pre className="p-5 overflow-x-auto font-mono text-xs text-[#F1F2F2] bg-[#000000] leading-relaxed max-h-[550px]">
                  {currentFile.contentOrUrl}
                </pre>
              </div>
            ) : (
              <div className="p-12 text-center font-mono text-xs text-[#767676] border border-[#272727]">
                SELECT AN ARTIFACT FROM THE DIRECTORY
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Architecture Specification */}
      {activeTab === 'architecture' && (
        <div className="bg-[#000000] border border-[#272727] p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#F56B2A] uppercase tracking-wider block">
              SPEC 01 // PROBLEM STATEMENT & SYSTEM CONSTRAINTS
            </span>
            <div className="p-5 border border-[#202020] bg-[#08080A] text-sm text-[#D0D1D2] leading-relaxed">
              {project.problemStatement}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#767676] uppercase tracking-wider block">
              SPEC 02 // ARCHITECTURAL FORMULATION & FAULT TOLERANCE
            </span>
            <div className="p-5 border border-[#202020] bg-[#08080A] text-sm text-[#D0D1D2] leading-relaxed whitespace-pre-line">
              {project.architectureOverview}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#767676] uppercase tracking-wider block">
              SPEC 03 // FULL PRODUCTION CONTEXT
            </span>
            <div className="p-5 border border-[#202020] bg-[#08080A] text-sm text-[#D0D1D2] leading-relaxed">
              {project.description}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Version History & Diffs */}
      {activeTab === 'versions' && (
        <div className="bg-[#000000] border border-[#272727] p-6 space-y-4">
          <div className="font-mono text-xs text-[#767676] uppercase tracking-wider pb-2 border-b border-[#272727]">
            REVISION TIMELINE // REVERSE CHRONOLOGICAL
          </div>
          <div className="space-y-3">
            {project.versionHistory.map((ver, idx) => (
              <div
                key={ver.version}
                className="p-4 border border-[#202020] bg-[#08080A] space-y-2 font-mono text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#F1F2F2] px-2 py-0.5 bg-[#121216] border border-[#333333]">
                      {ver.version}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] text-[#F56B2A] font-semibold">
                        [LATEST RELEASE]
                      </span>
                    )}
                    {ver.commitHash && (
                      <span className="text-[10px] text-[#767676]">
                        COMMIT: {ver.commitHash}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#767676]">
                    RELEASED: {ver.releaseDate}
                  </span>
                </div>

                <p className="text-[#D0D1D2] font-sans text-xs leading-relaxed">
                  {ver.notes}
                </p>

                {ver.diffSummary && (
                  <div className="text-[11px] text-[#767676] bg-[#000000] p-2.5 border border-[#1C1C1F]">
                    <strong className="text-[#F1F2F2]">DIFF: </strong>
                    {ver.diffSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Verified Contributions */}
      {activeTab === 'contributions' && (
        <div className="bg-[#000000] border border-[#272727] p-6 space-y-4">
          <div className="font-mono text-xs text-[#767676] uppercase tracking-wider pb-2 border-b border-[#272727]">
            INDEPENDENT CONTRIBUTION ATTESTATIONS
          </div>
          <div className="space-y-3">
            {project.keyContributions.map((kc) => (
              <div
                key={kc.id}
                className="p-4 border border-[#202020] bg-[#08080A] space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-3 font-mono">
                  <h4 className="font-bold text-[#F1F2F2] text-sm">{kc.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 border border-[#333333] text-[#F56B2A] uppercase">
                    {kc.verificationStatus.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[#D0D1D2] font-sans leading-relaxed">
                  {kc.description}
                </p>
                {kc.verifiedBy && (
                  <div className="text-[11px] font-mono text-[#767676] pt-2 border-t border-[#1C1C1F] flex items-center justify-between">
                    <span>ATTESTED BY: <strong className="text-[#F1F2F2]">{kc.verifiedBy}</strong></span>
                    {kc.verifiedAt && <span>DATE: {kc.verifiedAt}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Evidence Artifact */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="bg-[#000000] border border-[#272727] max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#272727] pb-3">
              <h3 className="font-mono text-xs font-bold text-[#F1F2F2] uppercase tracking-wider">
                [UPLOAD EVIDENCE ARTIFACT]
              </h3>
              <button onClick={() => setShowAddEvidenceModal(false)} className="font-mono text-xs text-[#767676] hover:text-[#F1F2F2]">[X]</button>
            </div>
            <form onSubmit={handleCreateEvidence} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">FILE IDENTIFIER / NAME</label>
                <input
                  type="text"
                  placeholder="e.g. raft_pipeline.go, benchmark_latency.json"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  required
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] focus:outline-none focus:border-[#F56B2A]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#767676] mb-1 uppercase text-[10px]">ARTIFACT TYPE</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] focus:outline-none focus:border-[#F56B2A]"
                  >
                    <option value="code">Source Code</option>
                    <option value="benchmark">Benchmark Log</option>
                    <option value="diagram">Architecture Spec</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#767676] mb-1 uppercase text-[10px]">SYNTAX / FORMAT</label>
                  <input
                    type="text"
                    value={newFileLang}
                    onChange={(e) => setNewFileLang(e.target.value)}
                    className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] focus:outline-none focus:border-[#F56B2A]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">ARCHITECTURAL RATIONALE</label>
                <input
                  type="text"
                  placeholder="Explain why this source artifact proves system competency"
                  value={newFileExplanation}
                  onChange={(e) => setNewFileExplanation(e.target.value)}
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] focus:outline-none focus:border-[#F56B2A]"
                />
              </div>
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">CONTENT (CODE / JSON)</label>
                <textarea
                  rows={6}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="// Paste clean, unformatted raw code or benchmark data..."
                  required
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] focus:outline-none focus:border-[#F56B2A]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#202020]">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="px-4 py-2 bg-[#0F0E12] text-[#767676] hover:text-[#F1F2F2] uppercase text-xs"
                >
                  [DISCARD]
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F56B2A] text-black font-semibold uppercase text-xs"
                >
                  [COMMIT ARTIFACT]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Publish Version */}
      {showAddVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="bg-[#000000] border border-[#272727] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#272727] pb-3">
              <h3 className="font-mono text-xs font-bold text-[#F1F2F2] uppercase tracking-wider">
                [PUBLISH REVISION & DIFF]
              </h3>
              <button onClick={() => setShowAddVersionModal(false)} className="font-mono text-xs text-[#767676] hover:text-[#F1F2F2]">[X]</button>
            </div>
            <form onSubmit={handleCreateVersion} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">VERSION IDENTIFIER</label>
                <input
                  type="text"
                  value={newVersionNum}
                  onChange={(e) => setNewVersionNum(e.target.value)}
                  required
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] focus:outline-none focus:border-[#F56B2A]"
                />
              </div>
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">RELEASE NOTES</label>
                <textarea
                  rows={3}
                  value={newVersionNotes}
                  onChange={(e) => setNewVersionNotes(e.target.value)}
                  placeholder="Key architectural changes and benchmark validations..."
                  required
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] font-sans focus:outline-none focus:border-[#F56B2A]"
                />
              </div>
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">DIFF SUMMARY</label>
                <input
                  type="text"
                  placeholder="e.g. Ring buffer introduced; eliminated 4 socket allocations per message"
                  value={newVersionDiff}
                  onChange={(e) => setNewVersionDiff(e.target.value)}
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2] focus:outline-none focus:border-[#F56B2A]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#202020]">
                <button
                  type="button"
                  onClick={() => setShowAddVersionModal(false)}
                  className="px-4 py-2 bg-[#0F0E12] text-[#767676] hover:text-[#F1F2F2] uppercase text-xs"
                >
                  [DISCARD]
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F1F2F2] text-black font-semibold uppercase text-xs"
                >
                  [PUBLISH REVISION]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
