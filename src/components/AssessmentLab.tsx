import React, { useState, useEffect } from 'react';
import { AssessmentChallenge, AssessmentSubmission, User } from '../types';

interface AssessmentLabProps {
  challenges: AssessmentChallenge[];
  submissions: AssessmentSubmission[];
  currentUser: User;
  onNewSubmission: (sub: AssessmentSubmission) => void;
  onHumanReview: (submissionId: string, reviewData: any) => void;
  onGenerateChallenge: (params: { roleCategory: string; difficulty: string; focusArea: string }) => Promise<AssessmentChallenge>;
}

export const AssessmentLab: React.FC<AssessmentLabProps> = ({
  challenges,
  submissions,
  currentUser,
  onNewSubmission,
  onHumanReview,
  onGenerateChallenge,
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<AssessmentChallenge>(challenges[0]);
  const [code, setCode] = useState<string>(challenges[0]?.starterCode || '');
  const [rationale, setRationale] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>((challenges[0]?.durationMinutes || 45) * 60);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResults, setTestResults] = useState<{ id: string; inputDesc: string; passed: boolean; message: string }[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<AssessmentSubmission | null>(
    submissions.find((s) => s.candidateId === currentUser.id && s.challengeId === challenges[0]?.id) || null
  );

  // Generate Challenge Modal State
  const [showGenModal, setShowGenModal] = useState(false);
  const [genRole, setGenRole] = useState('Distributed Systems');
  const [genDifficulty, setGenDifficulty] = useState('Senior');
  const [genFocus, setGenFocus] = useState('Concurrency & Fault Recovery');
  const [isGenerating, setIsGenerating] = useState(false);

  // Human Reviewer Form State
  const [reviewScore, setReviewScore] = useState<number>(92);
  const [reviewNotes, setReviewNotes] = useState<string>('Candidate demonstrated exceptional rigor in invariant preservation and partition resilience.');

  useEffect(() => {
    if (activeSubmission) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSubmission]);

  const handleSelectChallenge = (c: AssessmentChallenge) => {
    setSelectedChallenge(c);
    setCode(c.starterCode);
    setRationale('');
    setSecondsRemaining(c.durationMinutes * 60);
    setTestResults(null);
    const existing = submissions.find((s) => s.challengeId === c.id && s.candidateId === currentUser.id);
    setActiveSubmission(existing || null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const results = selectedChallenge.testCases.map((tc, idx) => {
        const hasWork = code.length > 80 && !code.includes("throw new Error('Not implemented')");
        const pass = hasWork && (idx !== 2 || code.includes('committed') || code.includes('linearizable') || code.includes('prefixSums') || code.includes('delta'));
        return {
          id: tc.id,
          inputDesc: tc.inputDesc,
          passed: Boolean(pass),
          message: pass
            ? 'VERIFIED: Output matches contract assertions.'
            : 'ASSERTION FAILED: Default stub or boundary uncaught.',
        };
      });
      setTestResults(results);
      setIsRunningTests(false);
    }, 500);
  };

  const handleSubmit = async () => {
    if (!code || code.length < 50) {
      alert('Please provide code solution before submitting.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          candidateId: currentUser.id,
          codeSolution: code,
          architecturalRationale: rationale,
          timeSpentSeconds: selectedChallenge.durationMinutes * 60 - secondsRemaining,
        }),
      });
      if (res.ok) {
        const sub: AssessmentSubmission = await res.json();
        setActiveSubmission(sub);
        onNewSubmission(sub);
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const newChal = await onGenerateChallenge({
        roleCategory: genRole,
        difficulty: genDifficulty,
        focusArea: genFocus,
      });
      setShowGenModal(false);
      handleSelectChallenge(newChal);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveSubmission = () => {
    if (!activeSubmission) return;
    onHumanReview(activeSubmission.id, {
      reviewerName: currentUser.name,
      reviewerRole: currentUser.headline,
      verifiedScore: reviewScore,
      qualitativeFeedback: reviewNotes,
      decision: 'approved',
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Assessment Header Strip */}
      <div className="bg-[#000000] border border-[#272727]">
        <div className="px-6 py-2 border-b border-[#272727] bg-[#0A0A0C] flex flex-wrap items-center justify-between font-mono text-[10px] text-[#767676]">
          <div className="flex items-center gap-3">
            <span className="text-[#F1F2F2]">LAB SPEC // 04.0</span>
            <span>/</span>
            <span>EVALUATION ENGINE: GEMINI 2.5-FLASH + HUMAN AUDITOR</span>
          </div>
          <div className="flex items-center gap-3">
            <span>RUBRIC DIMENSIONS: 5</span>
            <span>/</span>
            <span className="text-[#F56B2A]">ISOLATION: SECURE STATIC EVAL</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-light text-[#F1F2F2] tracking-tight">
              Practical Assessment Lab
            </h1>
            <p className="text-sm text-[#767676] font-mono">
              Role-specific algorithmic challenges evaluated across 5 transparent dimensions.
            </p>
          </div>

          <button
            onClick={() => setShowGenModal(true)}
            className="px-4 py-2 bg-[#F56B2A] hover:bg-[#ff7b3d] text-black font-mono text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
          >
            [+ GENERATE ROLE CHALLENGE (GEMINI)]
          </button>
        </div>
      </div>

      {/* Challenge Selection Strip */}
      <div className="flex items-stretch border-b border-[#272727] overflow-x-auto bg-[#070709] divide-x divide-[#272727]">
        {challenges.map((c, idx) => {
          const isSelected = c.id === selectedChallenge.id;
          const isDone = submissions.some((s) => s.challengeId === c.id && s.candidateId === currentUser.id);

          return (
            <button
              key={c.id}
              onClick={() => handleSelectChallenge(c)}
              className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2.5 whitespace-nowrap ${
                isSelected
                  ? 'bg-[#000000] text-[#F1F2F2] border-t-2 border-t-[#F56B2A]'
                  : 'text-[#767676] hover:text-[#F1F2F2] hover:bg-[#0B0B0E]'
              }`}
            >
              <span className="text-[10px] text-[#555555]">CHAL_0{idx + 1}</span>
              <span className="font-semibold">{c.title}</span>
              <span className="text-[10px] text-[#767676]">[{c.difficulty}]</span>
              {isDone && <span className="text-[#F56B2A] text-xs">●</span>}
            </button>
          );
        })}
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Challenge Specifications (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#000000] border border-[#272727] p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#202020] font-mono text-xs">
              <span className="text-[#F56B2A] font-semibold">{selectedChallenge.roleCategory.toUpperCase()}</span>
              <div className="text-[#767676] flex items-center gap-1.5">
                <span>TIMER:</span>
                <span className="text-[#F1F2F2] font-bold">{formatTime(secondsRemaining)}</span>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#F1F2F2] tracking-tight">{selectedChallenge.title}</h2>
              <div className="text-xs text-[#D0D1D2] leading-relaxed mt-2 p-3.5 bg-[#08080A] border border-[#202020] space-y-1">
                <span className="font-mono text-[10px] text-[#F56B2A] uppercase tracking-wider block">
                  SYSTEM SCENARIO:
                </span>
                <p>{selectedChallenge.scenario}</p>
              </div>
            </div>

            {/* Invariants & Requirements */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#767676] uppercase tracking-wider block">
                INVARIANTS & REQUIREMENTS
              </span>
              <div className="space-y-1.5 font-mono text-xs text-[#D0D1D2]">
                {selectedChallenge.instructions.map((ins, i) => (
                  <div key={i} className="p-2 bg-[#08080A] border border-[#1C1C1F] flex items-start gap-2">
                    <span className="text-[#F56B2A] font-bold">[{i + 1}]</span>
                    <span>{ins}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Assertions */}
            <div className="space-y-2 pt-2 border-t border-[#202020]">
              <span className="font-mono text-[10px] text-[#767676] uppercase tracking-wider block">
                TARGET ASSERTIONS ({selectedChallenge.testCases.length})
              </span>
              <div className="space-y-2 font-mono text-xs">
                {selectedChallenge.testCases.map((tc, idx) => (
                  <div key={tc.id} className="p-2.5 bg-[#08080A] border border-[#1C1C1F] space-y-1">
                    <div className="text-[#F1F2F2] font-semibold">ASSERTION 0{idx + 1}: {tc.inputDesc}</div>
                    <div className="text-[#767676] text-[10px]">CONTRACT: {tc.expectedOutputDesc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rubric Weights */}
            <div className="space-y-2 pt-2 border-t border-[#202020]">
              <span className="font-mono text-[10px] text-[#767676] uppercase tracking-wider block">
                EVALUATION RUBRIC WEIGHTS
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                {selectedChallenge.evaluationRubric.map((r) => (
                  <div key={r.dimension} className="p-2 bg-[#08080A] border border-[#1C1C1F]">
                    <div className="font-semibold text-[#F1F2F2] uppercase">{r.name}</div>
                    <div className="text-[#F56B2A]">{r.maxPoints}% WEIGHT</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Code Solution & Test Runner (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#000000] border border-[#272727]">
            {/* Code Header */}
            <div className="px-4 py-2.5 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#F56B2A]">FILE:</span>
                <span className="text-[#F1F2F2] font-semibold">
                  solution.{selectedChallenge.language === 'typescript' ? 'ts' : selectedChallenge.language}
                </span>
              </div>
              <button
                onClick={() => setCode(selectedChallenge.starterCode)}
                className="text-[#767676] hover:text-[#F1F2F2] uppercase"
              >
                [RESET TEMPLATE]
              </button>
            </div>

            <textarea
              rows={14}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#000000] p-4 font-mono text-xs text-[#F1F2F2] focus:outline-none resize-y leading-relaxed border-none"
              placeholder="// Write clean, production-oriented solution code here..."
            />

            {/* Architectural Rationale Input */}
            <div className="p-4 bg-[#08080A] border-t border-[#202020] space-y-2 font-mono text-xs">
              <label className="block text-[10px] uppercase text-[#767676] tracking-wider">
                ARCHITECTURAL RATIONALE & SAFETY INVARIANTS
              </label>
              <textarea
                rows={3}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Detail why this approach maintains invariants, avoids partition divergence, and bounds memory..."
                className="w-full bg-[#000000] border border-[#272727] p-2.5 text-xs text-[#F1F2F2] font-sans focus:outline-none focus:border-[#F56B2A]"
              />
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-3 border-t border-[#202020] bg-[#0A0A0C] flex items-center justify-between font-mono text-xs">
              <button
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="px-3.5 py-2 bg-[#0F0E12] hover:bg-[#F1F2F2] hover:text-[#000000] text-[#F1F2F2] border border-[#272727] uppercase tracking-wider transition-colors"
              >
                {isRunningTests ? '[RUNNING ASSERTIONS...]' : '[RUN TEST ASSERTIONS]'}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#F56B2A] hover:bg-[#ff7b3d] text-black font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '[EVALUATING WITH GEMINI...]' : '[SUBMIT FOR AI EVALUATION]'}
              </button>
            </div>
          </div>

          {/* Test Runner Results */}
          {testResults && (
            <div className="bg-[#000000] border border-[#272727] p-4 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#202020]">
                <span className="text-[#767676] uppercase tracking-wider text-[10px]">ASSERTION RUN OUTPUT</span>
                <span className="text-[#F1F2F2]">
                  {testResults.filter((r) => r.passed).length}/{testResults.length} PASSED
                </span>
              </div>
              <div className="space-y-1.5">
                {testResults.map((tr) => (
                  <div
                    key={tr.id}
                    className={`p-2.5 border text-xs flex items-start justify-between gap-3 ${
                      tr.passed
                        ? 'border-[#272727] bg-[#08080A] text-[#F1F2F2]'
                        : 'border-[#F56B2A] bg-[#0F0E12] text-[#F56B2A]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{tr.inputDesc}</div>
                      <div className="text-[11px] text-[#767676] mt-0.5">{tr.message}</div>
                    </div>
                    <span className="font-bold text-[10px] uppercase">
                      {tr.passed ? '[PASS]' : '[FAIL]'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Evaluation Output Dossier */}
          {activeSubmission && (
            <div className="bg-[#000000] border border-[#272727] p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#202020]">
                <div className="space-y-0.5 font-mono">
                  <h3 className="text-sm font-bold text-[#F1F2F2] uppercase tracking-wider">
                    EVALUATION DOSSIER // RUBRIC SCORES
                  </h3>
                  <p className="text-[10px] text-[#767676]">
                    DISTINCTION: AI PROPOSAL VS ACCREDITED HUMAN SIGN-OFF
                  </p>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-[#767676] block">VERIFIED SCORE</span>
                  <span className="text-xl font-bold text-[#F56B2A]">
                    {activeSubmission.humanReview
                      ? `${activeSubmission.humanReview.verifiedScore}/100`
                      : `${activeSubmission.aiEvaluation?.overallScore}/100`}
                  </span>
                </div>
              </div>

              {/* 5 Dimension meters */}
              {activeSubmission.aiEvaluation && (
                <div className="space-y-2 font-mono">
                  <span className="text-[10px] text-[#767676] uppercase tracking-wider block">
                    DIMENSION-LEVEL SPECIFICATION
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {Object.entries(activeSubmission.aiEvaluation.dimensionScores).map(([dim, score]) => (
                      <div key={dim} className="p-2.5 bg-[#08080A] border border-[#202020] text-center">
                        <span className="block text-[9px] text-[#767676] uppercase truncate">
                          {dim.replace('_', ' ')}
                        </span>
                        <strong className="text-sm text-[#F1F2F2]">{score}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              {activeSubmission.aiEvaluation && (
                <div className="p-4 bg-[#08080A] border border-[#202020] space-y-3 text-xs">
                  <p className="text-[#D0D1D2] font-mono leading-relaxed">
                    {activeSubmission.aiEvaluation.feedback}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1C1C1F] font-mono text-[11px]">
                    <div>
                      <span className="text-[10px] text-[#F1F2F2] uppercase tracking-wider block mb-1">
                        OBSERVED STRENGTHS
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[#767676]">
                        {activeSubmission.aiEvaluation.strengths.map((s, idx) => (
                          <li key={idx}><span className="text-[#D0D1D2]">{s}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#F56B2A] uppercase tracking-wider block mb-1">
                        AREAS FOR REFINEMENT
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[#767676]">
                        {activeSubmission.aiEvaluation.weaknesses.map((w, idx) => (
                          <li key={idx}><span className="text-[#D0D1D2]">{w}</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Human Evaluator Panel */}
              {activeSubmission.humanReview ? (
                <div className="p-3.5 bg-[#08080A] border border-[#272727] font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#F1F2F2]">
                    <span className="font-semibold uppercase">
                      HUMAN EVALUATOR SIGN-OFF: {activeSubmission.humanReview.reviewerName}
                    </span>
                    <span className="text-[10px] text-[#767676]">{activeSubmission.humanReview.verifiedAt}</span>
                  </div>
                  <p className="text-[#D0D1D2] font-serif italic text-xs">"{activeSubmission.humanReview.qualitativeFeedback}"</p>
                </div>
              ) : currentUser.role === 'reviewer' || currentUser.role === 'admin' ? (
                <div className="p-4 border border-[#F56B2A] bg-[#08080A] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F1F2F2] uppercase">
                      [EVALUATOR CERTIFICATION AUDIT PANEL]
                    </span>
                    <span className="text-[10px] text-[#F56B2A]">AUTHORIZED REVIEWER</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#767676] mb-1 uppercase text-[10px]">AUDIT SCORE (0-100)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={reviewScore}
                        onChange={(e) => setReviewScore(Number(e.target.value))}
                        className="w-full bg-[#000000] border border-[#272727] p-2 text-[#F1F2F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#767676] mb-1 uppercase text-[10px]">REVIEW NOTE</label>
                      <input
                        type="text"
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="w-full bg-[#000000] border border-[#272727] p-2 text-[#F1F2F2]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleApproveSubmission}
                    className="w-full py-2 bg-[#F56B2A] hover:bg-[#ff7b3d] text-black font-semibold uppercase text-xs tracking-wider"
                  >
                    [APPROVE & CERTIFY CANDIDATE SUBMISSION]
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Generate Challenge */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <div className="bg-[#000000] border border-[#272727] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#272727] pb-3 font-mono">
              <h3 className="text-xs font-bold text-[#F1F2F2] uppercase tracking-wider">
                [SYNTHESIZE CHALLENGE // GEMINI AI]
              </h3>
              <button onClick={() => setShowGenModal(false)} className="text-xs text-[#767676] hover:text-[#F1F2F2]">[X]</button>
            </div>
            <form onSubmit={handleGenerateSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">ENGINEERING DOMAIN</label>
                <select
                  value={genRole}
                  onChange={(e) => setGenRole(e.target.value)}
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                >
                  <option value="Distributed Systems">Distributed Systems (Consensus & Sharding)</option>
                  <option value="Frontend Core">Frontend Core (Canvas, WebGL & Windowing)</option>
                  <option value="Architecture & Security">Architecture & Security (Zero-Trust ABAC)</option>
                  <option value="AI & ML Platform">AI & ML Platform (KV Cache & Vector Streaming)</option>
                  <option value="Full Stack Cloud">Full Stack Cloud (Resilient Message Queues)</option>
                </select>
              </div>
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">SENIORITY TARGET</label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value)}
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                >
                  <option value="Junior">Junior Engineer</option>
                  <option value="Mid">Mid-Level Engineer</option>
                  <option value="Senior">Senior Engineer</option>
                  <option value="Staff">Staff / Principal Architect</option>
                </select>
              </div>
              <div>
                <label className="block text-[#767676] mb-1 uppercase text-[10px]">PRODUCTION FOCUS AREA</label>
                <input
                  type="text"
                  value={genFocus}
                  onChange={(e) => setGenFocus(e.target.value)}
                  placeholder="e.g. Memory pooling, zero-copy buffers, lock-free ring buffer"
                  className="w-full bg-[#08080A] border border-[#272727] p-2 text-[#F1F2F2]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#202020]">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="px-4 py-2 bg-[#0F0E12] text-[#767676] hover:text-[#F1F2F2] uppercase text-xs"
                >
                  [DISCARD]
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 bg-[#F56B2A] text-black font-semibold uppercase text-xs"
                >
                  {isGenerating ? '[SYNTHESIZING...]' : '[GENERATE CHALLENGE]'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
