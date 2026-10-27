/**
 * CareerTrip Live - Core Evaluation, Verification, and Matching Logic
 * Decoupled pure functions for deterministic testing and validation.
 */

export interface DimensionScores {
  correctness: number;
  architecture: number;
  implementation: number;
  edge_cases: number;
  communication: number;
}

export type VerificationTier = 'Unverified' | 'Peer Reviewed' | 'Employer Verified' | 'Evaluator Certified';

export interface CandidateSkill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 1-5
  verifiedScore?: number; // 0-100
  verificationLevel: VerificationTier;
  endorsementsCount: number;
}

export interface EndorsementInput {
  relationship: 'Manager' | 'Senior Colleague' | 'Mentor' | 'Open Source Maintainer';
  verifiedSignature: string;
  status: 'active' | 'revoked';
}

export interface PlagiarismResult {
  isSuspicious: boolean;
  confidence: number; // 0 - 100
  similarityScore: number; // 0 - 100
  flags: string[];
}

/**
 * Weights for standard assessment rubric dimensions
 */
export const RUBRIC_WEIGHTS: Record<keyof DimensionScores, number> = {
  correctness: 0.35,
  architecture: 0.25,
  implementation: 0.20,
  edge_cases: 0.10,
  communication: 0.10,
};

/**
 * Computes weighted total score (0 to 100) from dimension scores.
 * All dimension scores must be within 0-100.
 */
export function calculateOverallScore(dimensionScores: DimensionScores): number {
  let total = 0;
  let weightSum = 0;

  for (const [dim, weight] of Object.entries(RUBRIC_WEIGHTS) as [keyof DimensionScores, number][]) {
    const score = Math.max(0, Math.min(100, dimensionScores[dim] ?? 0));
    total += score * weight;
    weightSum += weight;
  }

  return Math.round((total / (weightSum || 1)) * 10) / 10;
}

/**
 * Calculates candidate verified tier strictly based on evidence:
 * - 'Evaluator Certified': Has at least 2 rigorous assessments with score >= 80 and active employer endorsement
 * - 'Employer Verified': Has at least 1 verified employer/manager endorsement + 1 project verified
 * - 'Peer Reviewed': Has at least 2 peer/mentor endorsements or verified assessments >= 65
 * - 'Unverified': Otherwise
 * NEVER marks unverified claims as verified.
 */
export function computeVerificationTier(params: {
  assessmentsCount: number;
  avgAssessmentScore: number;
  employerEndorsements: number;
  peerEndorsements: number;
  verifiedProjectsCount: number;
}): VerificationTier {
  const { assessmentsCount, avgAssessmentScore, employerEndorsements, peerEndorsements, verifiedProjectsCount } = params;

  if (assessmentsCount >= 2 && avgAssessmentScore >= 80 && employerEndorsements >= 1) {
    return 'Evaluator Certified';
  }

  if (employerEndorsements >= 1 && verifiedProjectsCount >= 1) {
    return 'Employer Verified';
  }

  if (peerEndorsements >= 2 || (assessmentsCount >= 1 && avgAssessmentScore >= 65)) {
    return 'Peer Reviewed';
  }

  return 'Unverified';
}

/**
 * Calculates candidate match percentage against recruiter job requirements.
 */
export function evaluateCandidateMatch(
  candidateSkills: CandidateSkill[],
  requiredSkills: { name: string; minimumProficiency: number; mustBeVerified?: boolean }[]
): {
  matchPercentage: number;
  matchedCount: number;
  missingSkills: string[];
  verifiedMatchPercentage: number;
} {
  if (requiredSkills.length === 0) {
    return { matchPercentage: 100, matchedCount: 0, missingSkills: [], verifiedMatchPercentage: 100 };
  }

  let matched = 0;
  let verifiedMatched = 0;
  const missing: string[] = [];

  for (const req of requiredSkills) {
    const found = candidateSkills.find(
      s => s.name.toLowerCase().trim() === req.name.toLowerCase().trim()
    );

    if (found && found.proficiency >= req.minimumProficiency) {
      if (req.mustBeVerified && found.verificationLevel === 'Unverified') {
        missing.push(`${req.name} (Requires Verified Status)`);
        continue;
      }
      matched++;
      if (found.verificationLevel !== 'Unverified') {
        verifiedMatched++;
      }
    } else {
      missing.push(req.name);
    }
  }

  const matchPercentage = Math.round((matched / requiredSkills.length) * 100);
  const verifiedMatchPercentage = Math.round((verifiedMatched / requiredSkills.length) * 100);

  return {
    matchPercentage,
    matchedCount: matched,
    missingSkills: missing,
    verifiedMatchPercentage,
  };
}

/**
 * Pure heuristic check for potential plagiarism and submission duplication.
 * Calculates n-gram token overlap and boilerplate similarity.
 */
export function detectPlagiarismHeuristics(
  submissionCode: string,
  referenceCorpus: string[]
): PlagiarismResult {
  if (!submissionCode || submissionCode.trim().length < 40) {
    return { isSuspicious: false, confidence: 10, similarityScore: 0, flags: [] };
  }

  const clean = (s: string) =>
    s
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

  const candidateClean = clean(submissionCode);
  const candidateTokens = new Set(candidateClean.split(/[\s,;{}()]+/));

  let maxSimilarity = 0;
  const flags: string[] = [];

  for (const ref of referenceCorpus) {
    const refClean = clean(ref);
    const refTokens = new Set(refClean.split(/[\s,;{}()]+/));

    // Jaccard similarity of token set
    const intersection = new Set([...candidateTokens].filter(x => refTokens.has(x)));
    const union = new Set([...candidateTokens, ...refTokens]);
    const sim = union.size > 0 ? (intersection.size / union.size) * 100 : 0;

    if (sim > maxSimilarity) {
      maxSimilarity = sim;
    }
  }

  // Exact substring duplicates
  if (maxSimilarity > 85) {
    flags.push('Extremely high token overlap (>85%) with known corpus submission.');
  } else if (maxSimilarity > 65) {
    flags.push('Elevated structural overlap (>65%) detected across key algorithmic blocks.');
  }

  // Check for common boilerplates or exact signature reuse
  if (candidateClean.includes('github.com/copypaste') || candidateClean.includes('stackoverflow.com')) {
    flags.push('Uncredited external link or artifact reference embedded in code.');
  }

  const isSuspicious = maxSimilarity >= 70;
  const confidence = isSuspicious ? Math.min(95, Math.round(maxSimilarity * 0.95)) : 20;

  return {
    isSuspicious,
    confidence,
    similarityScore: Math.round(maxSimilarity),
    flags,
  };
}

/**
 * Computes skill gaps and prioritizes learning path recommendations.
 */
export function prioritizeSkillGaps(
  currentSkills: { name: string; level: number; verified: boolean }[],
  targetRoleBenchmarks: { name: string; requiredLevel: number; weight: 'critical' | 'recommended' | 'optional' }[]
): {
  skillName: string;
  gap: number;
  priority: 'critical' | 'recommended' | 'optional';
  reason: string;
}[] {
  const gaps: {
    skillName: string;
    gap: number;
    priority: 'critical' | 'recommended' | 'optional';
    reason: string;
  }[] = [];

  for (const benchmark of targetRoleBenchmarks) {
    const existing = currentSkills.find(
      s => s.name.toLowerCase().trim() === benchmark.name.toLowerCase().trim()
    );

    const currentLevel = existing ? existing.level : 0;
    const isVerified = existing ? existing.verified : false;
    const gap = benchmark.requiredLevel - currentLevel;

    if (gap > 0 || !isVerified) {
      let reason = '';
      if (!existing) {
        reason = `Missing essential skill required at level ${benchmark.requiredLevel} for this role.`;
      } else if (gap > 0) {
        reason = `Current level is ${currentLevel}/5, benchmark requires level ${benchmark.requiredLevel}/5.`;
      } else if (!isVerified) {
        reason = `Skill self-reported at level ${currentLevel}/5 but has not been verified through assessment or project evidence.`;
      }

      gaps.push({
        skillName: benchmark.name,
        gap: Math.max(1, gap),
        priority: benchmark.weight,
        reason,
      });
    }
  }

  // Sort by critical first, then gap size descending
  const priorityOrder = { critical: 3, recommended: 2, optional: 1 };
  return gaps.sort((a, b) => {
    const pDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (pDiff !== 0) return pDiff;
    return b.gap - a.gap;
  });
}
