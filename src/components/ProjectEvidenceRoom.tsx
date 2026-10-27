import React, { useState } from 'react';
import { Project, EvidenceFile, ProjectVersion } from '../types';
import {
  Code2,
  GitBranch,
  GitCommit,
  Layers,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Github,
  Plus,
  ArrowLeft,
  Calendar,
  Sparkles,
  Cpu,
  BarChart2,
  Terminal,
  FileText
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'architecture' | 'files' | 'versions' | 'contributions'>('files');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddVersionModal(true)}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <GitCommit className="w-3.5 h-3.5 text-sky-400" />
            <span>Publish Revision</span>
          </button>
          <button
            onClick={() => setShowAddEvidenceModal(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Evidence Artifact</span>
          </button>
        </div>
      </div>

      {/* Evidence Room Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                ROOM ID: {project.id.toUpperCase()}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {project.verifiedStatus}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{project.title}</h1>
            <p className="text-sm text-zinc-300 max-w-3xl">{project.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Repository</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Demonstration</span>
              </a>
            )}
          </div>
        </div>

        {/* Tech Stack Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 mr-2">Core Tech:</span>
          {project.techStack.map((tech) => (
            <span key={tech} className="text-xs px-2.5 py-0.5 rounded bg-zinc-950 text-zinc-200 border border-zinc-800 font-mono">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'files'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <FileCode className="w-4 h-4 text-sky-400" />
          <span>Evidence Artifacts & Code ({project.evidenceFiles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'architecture'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Architecture & Problem Formulation</span>
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'versions'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <span>Version History & Diffs ({project.versionHistory.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('contributions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            activeTab === 'contributions'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Verified Contributions ({project.keyContributions.length})</span>
        </button>
      </div>

      {/* Tab 1: Artifacts & Code Explorer */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block px-1">
              Select Evidence Artifact
            </span>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 space-y-1">
              {project.evidenceFiles.length === 0 ? (
                <div className="p-4 text-xs text-zinc-500 text-center">No evidence files uploaded yet.</div>
              ) : (
                project.evidenceFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-colors flex items-start gap-2.5 ${
                      file.id === (currentFile?.id || '')
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {file.type === 'benchmark' ? (
                      <BarChart2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Terminal className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="overflow-hidden">
                      <div className="truncate font-mono font-semibold">{file.name}</div>
                      <div className="text-[10px] text-zinc-400 truncate capitalize">{file.type} · {file.language || 'text'}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="lg:col-span-3 space-y-4">
            {currentFile ? (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
                <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono text-xs font-semibold text-zinc-200">{currentFile.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono uppercase">
                      {currentFile.language || 'text'}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                    Verified Artifact
                  </span>
                </div>

                {/* Explanation block */}
                {currentFile.explanation && (
                  <div className="px-4 py-2.5 bg-zinc-900/40 border-b border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-200">Architectural Rationale: </strong>
                      {currentFile.explanation}
                    </div>
                  </div>
                )}

                {/* Raw source display with line numbers */}
                <pre className="p-4 overflow-x-auto text-xs font-mono text-zinc-200 bg-zinc-950 leading-relaxed max-h-[500px]">
                  {currentFile.contentOrUrl}
                </pre>
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 text-xs bg-zinc-900 border border-zinc-800 rounded-xl">
                Select an evidence file or click "Upload Evidence Artifact" above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Architecture & Problem Formulation */}
      {activeTab === 'architecture' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Problem Statement & System Constraints
            </h3>
            <div className="bg-zinc-950/70 p-4 rounded-lg border border-zinc-800 text-zinc-200 text-sm leading-relaxed">
              {project.problemStatement || 'Detailed problem formulation.'}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              System Architecture & Implementation Approach
            </h3>
            <div className="bg-zinc-950/70 p-4 rounded-lg border border-zinc-800 text-zinc-200 text-sm leading-relaxed whitespace-pre-line">
              {project.architectureOverview || 'Architecture breakdown.'}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Full Project Description & Production Context
            </h3>
            <div className="bg-zinc-950/70 p-4 rounded-lg border border-zinc-800 text-zinc-200 text-sm leading-relaxed">
              {project.description}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Version History & Diffs */}
      {activeTab === 'versions' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Release Evolution & Differential Notes
          </h3>
          <div className="space-y-4">
            {project.versionHistory.map((ver, idx) => (
              <div
                key={ver.version}
                className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-4 space-y-2 relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-white text-sm px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                      {ver.version}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                        LATEST RELEASE
                      </span>
                    )}
                    {ver.commitHash && (
                      <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                        <GitCommit className="w-3.5 h-3.5 text-zinc-400" />
                        {ver.commitHash}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {ver.releaseDate}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{ver.notes}</p>
                {ver.diffSummary && (
                  <div className="mt-2 p-2 bg-zinc-900 border border-zinc-800/80 rounded text-[11px] font-mono text-zinc-400">
                    <strong className="text-zinc-300">Diff Summary: </strong> {ver.diffSummary}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Verified Contributions */}
      {activeTab === 'contributions' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Independent Contribution Attestations
          </h3>
          <div className="space-y-4">
            {project.keyContributions.map((kc) => (
              <div key={kc.id} className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-white">{kc.title}</h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    kc.verificationStatus === 'employer_verified'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : kc.verificationStatus === 'peer_endorsed'
                      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {kc.verificationStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{kc.description}</p>
                {kc.verifiedBy && (
                  <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                    <span>Verified by: <strong className="text-zinc-200">{kc.verifiedBy}</strong></span>
                    {kc.verifiedAt && <span className="font-mono text-[10px]">{kc.verifiedAt}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Upload Evidence Artifact</h3>
              <button onClick={() => setShowAddEvidenceModal(false)} className="text-zinc-400 hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={handleCreateEvidence} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. raft_election.go, latency_benchmark.json"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Artifact Type</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                  >
                    <option value="code">Source Code</option>
                    <option value="benchmark">Benchmark Log</option>
                    <option value="diagram">Architecture Model</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Language / Format</label>
                  <input
                    type="text"
                    value={newFileLang}
                    onChange={(e) => setNewFileLang(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Architectural Explanation (Why this proves skill)</label>
                <input
                  type="text"
                  placeholder="Explains zero-allocation transport and failure recovery"
                  value={newFileExplanation}
                  onChange={(e) => setNewFileExplanation(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Source Code / Benchmark Content</label>
                <textarea
                  rows={6}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="Paste raw source code or JSON benchmarks..."
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 font-mono text-zinc-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Save Artifact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Version Modal */}
      {showAddVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Publish Revision & Diff</h3>
              <button onClick={() => setShowAddVersionModal(false)} className="text-zinc-400 hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={handleCreateVersion} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Version Number</label>
                <input
                  type="text"
                  value={newVersionNum}
                  onChange={(e) => setNewVersionNum(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Release Notes</label>
                <textarea
                  rows={3}
                  value={newVersionNotes}
                  onChange={(e) => setNewVersionNotes(e.target.value)}
                  placeholder="What improvements or fixes were made in this version?"
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-zinc-300 mb-1">Differential Summary (Key architectural delta)</label>
                <input
                  type="text"
                  placeholder="e.g. Added ring buffer, removed 4 allocations per message"
                  value={newVersionDiff}
                  onChange={(e) => setNewVersionDiff(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2 text-zinc-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVersionModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                >
                  Publish Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
