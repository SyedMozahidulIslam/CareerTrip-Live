import React, { useState, useEffect } from 'react';
import { User, Project, AssessmentSubmission, Endorsement } from '../types';

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
      specification: 'CareerTrip Live - Verifiable Competency & Evidence Dossier',
      dossierVersion: '2.0.0-SWISS',
      exportTimestamp: new Date().toISOString(),
      candidateIdentity: {
        name: currentUser.name,
        handle: currentUser.handle,
        email: currentUser.email,
        verifiedTier: currentUser.verifiedTier,
        overallScore: currentUser.overallScore,
        headline: currentUser.headline,
        yearsExperience: currentUser.yearsExperience,
      },
      verifiedEvidenceRooms: candidateProjects.map((p) => ({
        roomIdentifier: p.id,
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
      verifiedAttestations: candidateEndorsements.map((e) => ({
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
    a.download = `CareerTrip_Dossier_${currentUser.handle.toUpperCase()}.json`;
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Specification Strip */}
      <div className="bg-[#000000] border border-[#272727]">
        <div className="px-6 py-2 border-b border-[#272727] bg-[#0A0A0C] flex flex-wrap items-center justify-between font-mono text-[10px] text-[#767676]">
          <div className="flex items-center gap-3">
            <span className="text-[#F1F2F2]">METRICS SPEC // 08.0</span>
            <span>/</span>
            <span>DATA AGGREGATION: CONTINUOUS REAL-TIME</span>
          </div>
          <div className="flex items-center gap-3">
            <span>AUDIT STANDARDS: STRICT REPUTATION METRICS</span>
            <span>/</span>
            <span className="text-[#F56B2A]">ACTIVE SUBJECT: @{currentUser.handle.toUpperCase()}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-light text-[#F1F2F2] tracking-tight">
              Analytics & Progression Metrics
            </h1>
            <p className="text-sm text-[#767676] font-mono">
              Quantitative verification trajectories, assessment score distributions, and portable dossier export.
            </p>
          </div>

          <button
            onClick={handleExportDossier}
            className="px-4 py-2 bg-[#F56B2A] hover:bg-[#ff7b3d] text-black font-mono text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
          >
            [EXPORT VERIFIABLE DOSSIER (JSON)]
          </button>
        </div>
      </div>

      {/* Metric Cells */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#000000] border border-[#272727] p-4 space-y-1">
          <span className="text-[10px] text-[#767676] uppercase tracking-wider block">INDEXED CANDIDATES</span>
          <div className="text-2xl font-bold text-[#F1F2F2]">{metrics.totalCandidates}</div>
          <span className="text-[10px] text-[#F56B2A] block">
            {metrics.certifiedCandidates} EVALUATOR CERTIFIED
          </span>
        </div>

        <div className="bg-[#000000] border border-[#272727] p-4 space-y-1">
          <span className="text-[10px] text-[#767676] uppercase tracking-wider block">EVIDENCE ROOMS TRACKED</span>
          <div className="text-2xl font-bold text-[#F1F2F2]">{metrics.totalProjects}</div>
          <span className="text-[10px] text-[#767676] block">
            {metrics.totalEvidenceFiles} AUDITED ARTIFACTS
          </span>
        </div>

        <div className="bg-[#000000] border border-[#272727] p-4 space-y-1">
          <span className="text-[10px] text-[#767676] uppercase tracking-wider block">PRACTICAL ASSESSMENTS</span>
          <div className="text-2xl font-bold text-[#F1F2F2]">{metrics.totalSubmissions}</div>
          <span className="text-[10px] text-[#F1F2F2] block">
            {metrics.verifiedSubmissions} HUMAN AUDITED
          </span>
        </div>

        <div className="bg-[#000000] border border-[#272727] p-4 space-y-1">
          <span className="text-[10px] text-[#767676] uppercase tracking-wider block">INTEGRITY DEFENSE ACCURACY</span>
          <div className="text-2xl font-bold text-[#F56B2A]">98.4%</div>
          <span className="text-[10px] text-[#767676] block">
            ZERO AUTO-DISQUALIFICATION
          </span>
        </div>
      </div>

      {/* Two-Column Aligned Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tier Distribution Table (6 cols) */}
        <div className="lg:col-span-6 bg-[#000000] border border-[#272727]">
          <div className="px-5 py-3 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between font-mono text-xs">
            <h3 className="font-semibold text-[#F1F2F2] uppercase tracking-wider">
              08.1 // VERIFICATION TIER DISTRIBUTION
            </h3>
            <span className="text-[10px] text-[#767676]">NETWORK AUDIT</span>
          </div>

          <div className="p-5 space-y-4 font-mono text-xs">
            <p className="text-[#767676] text-[11px] font-sans leading-relaxed">
              Strict gatekeeping ensures candidates cannot self-assign verification tiers without signed proof.
            </p>

            <div className="space-y-3 pt-2">
              {Object.entries(tierDist).map(([tier, count]: [string, any]) => {
                const total = (Object.values(tierDist) as number[]).reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((count / total) * 100);

                return (
                  <div key={tier} className="space-y-1.5 border border-[#1C1C1F] p-3 bg-[#08080A]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#F1F2F2] font-semibold">{tier.toUpperCase()}</span>
                      <span className="text-[#F56B2A]">{count} UNITS [{pct}.0%]</span>
                    </div>
                    {/* 2px thin rectangular meter */}
                    <div className="w-full bg-[#1A1A1A] h-1 border border-[#272727]">
                      <div
                        className={`h-full ${
                          tier === 'Evaluator Certified'
                            ? 'bg-[#F56B2A]'
                            : tier === 'Employer Verified'
                            ? 'bg-[#F1F2F2]'
                            : tier === 'Peer Reviewed'
                            ? 'bg-[#A0A2A4]'
                            : 'bg-[#404040]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Candidate Progression Timeline (6 cols) */}
        <div className="lg:col-span-6 bg-[#000000] border border-[#272727]">
          <div className="px-5 py-3 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between font-mono text-xs">
            <h3 className="font-semibold text-[#F1F2F2] uppercase tracking-wider">
              08.2 // CANDIDATE TRAJECTORY // @{currentUser.handle.toUpperCase()}
            </h3>
            <span className="text-[10px] text-[#F56B2A] font-bold">
              {currentUser.overallScore}.0% COMPOSITE
            </span>
          </div>

          <div className="p-5 space-y-4 font-mono text-xs">
            <div className="space-y-2 border border-[#202020] bg-[#08080A] p-4">
              <div className="flex justify-between text-[10px] text-[#767676] pb-1 border-b border-[#1A1A1D] uppercase">
                <span>QUARTER</span>
                <span>ACHIEVED DELIVERABLE</span>
                <span>SCORE</span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex justify-between items-center text-[#D0D1D2]">
                  <span className="text-[10px] text-[#767676]">2026-Q1</span>
                  <span className="font-sans">Initial Storage Engine Specifications</span>
                  <span className="text-[#A0A2A4]">74.0%</span>
                </div>
                <div className="flex justify-between items-center text-[#D0D1D2]">
                  <span className="text-[10px] text-[#767676]">2026-Q2</span>
                  <span className="font-sans">Partition Consensus Practical Challenge</span>
                  <span className="text-[#F1F2F2]">88.0%</span>
                </div>
                <div className="flex justify-between items-center text-[#D0D1D2]">
                  <span className="text-[10px] text-[#767676]">2026-Q3</span>
                  <span className="font-sans">VP Engineering & Evaluator Signed Attestation</span>
                  <span className="text-[#F56B2A] font-bold">94.0%</span>
                </div>
              </div>
            </div>

            <div className="p-4 border border-[#202020] bg-[#0A0A0E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong className="text-[#F1F2F2] uppercase block text-xs">PORTABLE DOSSIER ARTIFACT:</strong>
                <span className="text-[10px] text-[#767676]">Export machine-readable JSON verification proof.</span>
              </div>
              <button
                onClick={handleExportDossier}
                className="px-3 py-1.5 bg-[#F1F2F2] hover:bg-[#ffffff] text-black font-semibold uppercase text-[11px] transition-colors shrink-0"
              >
                [DOWNLOAD JSON]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
