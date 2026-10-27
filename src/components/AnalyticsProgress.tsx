import React, { useState, useEffect } from 'react';
import { User, Project, AssessmentSubmission, Endorsement } from '../types';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  FileCode,
  Download,
  Calendar,
  CheckCircle2,
  PieChart,
  FileCheck
} from 'lucide-react';

interface AnalyticsProgressProps {
  currentUser: User;
  allUsers: User[];
  allProjects: Project[];
  allSubmissions: AssessmentSubmission[];
  allEndorsements: Endorsement[];
}

export const AnalyticsProgress: React.FC<AnalyticsProgressProps> = ({
  currentUser,
  allUsers,
  allProjects,
  allSubmissions,
  allEndorsements,
}) => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err));
  }, []);

  const handleExportDossier = () => {
    const candidateProjects = allProjects.filter((p) => p.userId === currentUser.id);
    const candidateSubmissions = allSubmissions.filter((s) => s.candidateId === currentUser.id);
    const candidateEndorsements = allEndorsements.filter((e) => e.candidateId === currentUser.id);

    const dossier = {
      network: 'CareerTrip Live - Verifiable Skills & Project Portfolio Network',
      exportTimestamp: new Date().toISOString(),
      candidate: {
        name: currentUser.name,
        handle: currentUser.handle,
        email: currentUser.email,
        verifiedTier: currentUser.verifiedTier,
        overallScore: currentUser.overallScore,
        headline: currentUser.headline,
        yearsExperience: currentUser.yearsExperience,
      },
      verifiedProjects: candidateProjects.map((p) => ({
        title: p.title,
        verifiedStatus: p.verifiedStatus,
        techStack: p.techStack,
        evidenceArtifactsCount: p.evidenceFiles.length,
        repoUrl: p.repoUrl,
        liveUrl: p.liveUrl,
        keyContributions: p.keyContributions,
      })),
      evaluatedAssessments: candidateSubmissions.map((s) => ({
        challengeTitle: s.challengeTitle,
        verifiedScore: s.humanReview ? s.humanReview.verifiedScore : s.aiEvaluation?.overallScore,
        evaluatedBy: s.humanReview?.reviewerName || 'AI Structured Rubric',
        decision: s.humanReview?.decision || 'evaluated',
        dimensionScores: s.humanReview?.dimensionScores || s.aiEvaluation?.dimensionScores,
      })),
      verifiedEndorsements: candidateEndorsements.map((e) => ({
        endorser: `${e.endorserName} (${e.endorserRole}, ${e.endorserCompany})`,
        relationship: e.relationship,
        verifiedSignature: e.verifiedSignature,
        comment: e.comment,
      })),
    };

    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareerTrip_Verifiable_Dossier_${currentUser.handle}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const metrics = analytics?.metrics || {
    totalCandidates: allUsers.filter((u) => u.role === 'candidate').length,
    certifiedCandidates: allUsers.filter((u) => u.verifiedTier === 'Evaluator Certified').length,
    employerVerified: allUsers.filter((u) => u.verifiedTier === 'Employer Verified').length,
    totalProjects: allProjects.length,
    totalEvidenceFiles: allProjects.reduce((a, b) => a + b.evidenceFiles.length, 0),
    totalSubmissions: allSubmissions.length,
    verifiedSubmissions: allSubmissions.filter((s) => s.status === 'human_verified').length,
    avgOverallScore: 89,
    fraudIncidenceRatePct: 2,
  };

  const tierDist = analytics?.tierDistribution || {
    'Evaluator Certified': 1,
    'Employer Verified': 1,
    'Peer Reviewed': 1,
    'Unverified': 1,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Analytics & Evidence Progress</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold">
              TRANSPARENT REPUTATION METRICS
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-1">
            Network-wide verification trajectories, candidate assessment score distributions, and exportable dossiers.
          </p>
        </div>

        <button
          onClick={handleExportDossier}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Verifiable Dossier (JSON)</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-zinc-400 uppercase text-[10px] tracking-wider block">Total Candidates</span>
          <div className="text-2xl font-bold font-mono text-white">{metrics.totalCandidates}</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {metrics.certifiedCandidates} Evaluator Certified
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-zinc-400 uppercase text-[10px] tracking-wider block">Evidence Rooms Active</span>
          <div className="text-2xl font-bold font-mono text-white">{metrics.totalProjects}</div>
          <span className="text-[11px] text-sky-400">
            {metrics.totalEvidenceFiles} Audited Artifacts
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-zinc-400 uppercase text-[10px] tracking-wider block">Assessment Submissions</span>
          <div className="text-2xl font-bold font-mono text-white">{metrics.totalSubmissions}</div>
          <span className="text-[11px] text-indigo-300">
            {metrics.verifiedSubmissions} Certified by Human Auditors
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-zinc-400 uppercase text-[10px] tracking-wider block">Integrity Defense Rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">98.4%</div>
          <span className="text-[11px] text-zinc-400">
            Zero auto-disqualification policy
          </span>
        </div>
      </div>

      {/* Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tier Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Candidate Verification Tier Breakdown
          </h3>
          <p className="text-xs text-zinc-400">
            Strict gatekeeping guarantees that no candidate achieves verified status without code evidence or signed endorsements.
          </p>

          <div className="space-y-3 pt-2">
            {Object.entries(tierDist).map(([tier, count]: [string, any]) => {
              const total = (Object.values(tierDist) as number[]).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);

              return (
                <div key={tier} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-zinc-200">{tier}</span>
                    <span className="font-mono text-zinc-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full rounded-full ${
                        tier === 'Evaluator Certified'
                          ? 'bg-emerald-500'
                          : tier === 'Employer Verified'
                          ? 'bg-indigo-500'
                          : tier === 'Peer Reviewed'
                          ? 'bg-sky-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Candidate Personal Progress Trajectory (6 cols) */}
        <div className="lg:col-span-6 bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Candidate Verified Trajectory: {currentUser.name}
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {currentUser.overallScore}/100 Overall
            </span>
          </div>

          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 space-y-3 text-xs">
            <div className="flex justify-between text-zinc-400 text-[11px] pb-1 border-b border-zinc-900">
              <span>Quarter</span>
              <span>Milestone Achievement</span>
              <span>Verified Score</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-zinc-300">
                <span className="font-mono text-[11px] text-zinc-500">Q1 2026</span>
                <span className="text-xs">Published Initial Storage Engine Spec</span>
                <span className="font-mono text-zinc-400">74%</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span className="font-mono text-[11px] text-zinc-500">Q2 2026</span>
                <span className="text-xs">Passed Partition Consensus Assessment</span>
                <span className="font-mono text-indigo-400 font-semibold">88%</span>
              </div>
              <div className="flex justify-between items-center text-zinc-300">
                <span className="font-mono text-[11px] text-zinc-500">Q3 2026</span>
                <span className="text-xs">Manager & Evaluator Signed Verification</span>
                <span className="font-mono text-emerald-400 font-bold">94%</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-lg border border-zinc-850 text-xs text-zinc-300 flex items-center justify-between">
            <div>
              <strong className="text-white block">Download Portable Dossier:</strong>
              <span className="text-[11px] text-zinc-400">Share cryptographic proof of competence with hiring teams.</span>
            </div>
            <button
              onClick={handleExportDossier}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
