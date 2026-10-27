import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOverallScore,
  computeVerificationTier,
  evaluateCandidateMatch,
  detectPlagiarismHeuristics,
  prioritizeSkillGaps,
  type DimensionScores,
  type CandidateSkill
} from './scoring';

test('calculateOverallScore applies correct rubric weights', () => {
  const scores: DimensionScores = {
    correctness: 90,     // 90 * 0.35 = 31.5
    architecture: 80,    // 80 * 0.25 = 20.0
    implementation: 85,  // 85 * 0.20 = 17.0
    edge_cases: 70,      // 70 * 0.10 = 7.0
    communication: 90,   // 90 * 0.10 = 9.0
  };
  // sum = 31.5 + 20 + 17 + 7 + 9 = 84.5
  const result = calculateOverallScore(scores);
  assert.equal(result, 84.5);
});

test('calculateOverallScore clamps boundary inputs between 0 and 100', () => {
  const extremeScores: DimensionScores = {
    correctness: 120,
    architecture: -10,
    implementation: 100,
    edge_cases: 0,
    communication: 50,
  };
  const result = calculateOverallScore(extremeScores);
  // clamped: 100*0.35 + 0*0.25 + 100*0.20 + 0*0.10 + 50*0.10 = 35 + 0 + 20 + 0 + 5 = 60
  assert.equal(result, 60);
});

test('computeVerificationTier enforces strict evidence gates', () => {
  // Evaluator Certified requires >= 2 assessments >= 80 and >= 1 employer endorsement
  const certified = computeVerificationTier({
    assessmentsCount: 2,
    avgAssessmentScore: 88,
    employerEndorsements: 1,
    peerEndorsements: 3,
    verifiedProjectsCount: 2,
  });
  assert.equal(certified, 'Evaluator Certified');

  // Employer Verified requires employer endorsement and verified project
  const employerVer = computeVerificationTier({
    assessmentsCount: 0,
    avgAssessmentScore: 0,
    employerEndorsements: 1,
    peerEndorsements: 0,
    verifiedProjectsCount: 1,
  });
  assert.equal(employerVer, 'Employer Verified');

  // Peer Reviewed requires >=2 peer endorsements or 1 verified assessment >= 65
  const peerRev = computeVerificationTier({
    assessmentsCount: 1,
    avgAssessmentScore: 72,
    employerEndorsements: 0,
    peerEndorsements: 0,
    verifiedProjectsCount: 0,
  });
  assert.equal(peerRev, 'Peer Reviewed');

  // Unverified if no valid proof
  const unverified = computeVerificationTier({
    assessmentsCount: 1,
    avgAssessmentScore: 50,
    employerEndorsements: 0,
    peerEndorsements: 1,
    verifiedProjectsCount: 0,
  });
  assert.equal(unverified, 'Unverified');
});

test('evaluateCandidateMatch calculates accurate percentage and flags unverified requirements', () => {
  const candidateSkills: CandidateSkill[] = [
    { id: '1', name: 'TypeScript', category: 'Language', proficiency: 5, verificationLevel: 'Evaluator Certified', endorsementsCount: 4 },
    { id: '2', name: 'Distributed Systems', category: 'Backend', proficiency: 4, verificationLevel: 'Employer Verified', endorsementsCount: 2 },
    { id: '3', name: 'Kubernetes', category: 'DevOps', proficiency: 3, verificationLevel: 'Unverified', endorsementsCount: 0 },
  ];

  const requirements = [
    { name: 'TypeScript', minimumProficiency: 4 },
    { name: 'Distributed Systems', minimumProficiency: 3 },
    { name: 'Kubernetes', minimumProficiency: 3, mustBeVerified: true },
    { name: 'Kafka', minimumProficiency: 3 },
  ];

  const match = evaluateCandidateMatch(candidateSkills, requirements);
  // Matched: TS (prof 5 >= 4), DistSys (4 >= 3). Kubernetes fails mustBeVerified. Kafka missing.
  assert.equal(match.matchedCount, 2);
  assert.equal(match.matchPercentage, 50);
  assert.equal(match.missingSkills.length, 2);
  assert.ok(match.missingSkills.some(s => s.includes('Kubernetes')));
  assert.ok(match.missingSkills.some(s => s.includes('Kafka')));
});

test('detectPlagiarismHeuristics identifies token overlap', () => {
  const reference = [
    `function handleRequest(req, res) {
       const user = authenticate(req);
       if (!user) return res.status(401).send("Unauthorized");
       return res.json({ success: true, data: user.profile });
     }`
  ];

  const copyCat = `// Copied code with minor whitespace
     function handleRequest(req, res) {
       const user = authenticate(req);
       if (!user) return res.status(401).send("Unauthorized");
       return res.json({ success: true, data: user.profile });
     }`;

  const unique = `export async function processPipeline(eventStream) {
    const partitioned = await stream.groupByKey('region');
    return partitioned.aggregate((acc, cur) => acc + cur.latency);
  }`;

  const copyResult = detectPlagiarismHeuristics(copyCat, reference);
  assert.equal(copyResult.isSuspicious, true);
  assert.ok(copyResult.similarityScore > 75);

  const uniqueResult = detectPlagiarismHeuristics(unique, reference);
  assert.equal(uniqueResult.isSuspicious, false);
});

test('prioritizeSkillGaps ranks critical gaps above recommended', () => {
  const current = [
    { name: 'React', level: 4, verified: true },
    { name: 'Node.js', level: 2, verified: true },
  ];

  const benchmarks = [
    { name: 'Node.js', requiredLevel: 4, weight: 'recommended' as const },
    { name: 'System Design', requiredLevel: 3, weight: 'critical' as const },
    { name: 'Docker', requiredLevel: 2, weight: 'optional' as const },
  ];

  const gaps = prioritizeSkillGaps(current, benchmarks);
  assert.equal(gaps[0].skillName, 'System Design');
  assert.equal(gaps[0].priority, 'critical');
  assert.equal(gaps[1].skillName, 'Node.js');
  assert.equal(gaps[1].priority, 'recommended');
  assert.equal(gaps[2].skillName, 'Docker');
  assert.equal(gaps[2].priority, 'optional');
});
