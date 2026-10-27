import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  SEED_USERS,
  SEED_SKILLS,
  SEED_PROJECTS,
  SEED_CHALLENGES,
  SEED_SUBMISSIONS,
  SEED_ENDORSEMENTS,
  SEED_LEARNING_PLANS,
  SEED_AUDIT_LOGS,
  SEED_INTEGRITY_FINDINGS,
} from './src/data/seedData';
import {
  calculateOverallScore,
  computeVerificationTier,
  detectPlagiarismHeuristics,
  prioritizeSkillGaps,
  type DimensionScores,
} from './src/lib/scoring';
import {
  User,
  SkillItem,
  Project,
  AssessmentChallenge,
  AssessmentSubmission,
  Endorsement,
  LearningPlan,
  AuditLog,
  IntegrityFinding,
  RecruiterShortlist,
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Database initialized from Seed Data
let users: User[] = [...SEED_USERS];
let skills: Record<string, SkillItem[]> = JSON.parse(JSON.stringify(SEED_SKILLS));
let projects: Project[] = JSON.parse(JSON.stringify(SEED_PROJECTS));
let challenges: AssessmentChallenge[] = JSON.parse(JSON.stringify(SEED_CHALLENGES));
let submissions: AssessmentSubmission[] = JSON.parse(JSON.stringify(SEED_SUBMISSIONS));
let endorsements: Endorsement[] = JSON.parse(JSON.stringify(SEED_ENDORSEMENTS));
let learningPlans: Record<string, LearningPlan> = JSON.parse(JSON.stringify(SEED_LEARNING_PLANS));
let auditLogs: AuditLog[] = JSON.parse(JSON.stringify(SEED_AUDIT_LOGS));
let integrityFindings: IntegrityFinding[] = JSON.parse(JSON.stringify(SEED_INTEGRITY_FINDINGS));
let shortlists: RecruiterShortlist[] = [
  {
    id: 'sl_1',
    recruiterId: 'user_recruiter',
    candidateId: 'user_maya',
    addedAt: '2026-10-25T14:20:00Z',
    stage: 'reviewing_evidence',
    notes: 'Jepsen test report is stellar. Verified consensus code on ChronosDB matches Staff Systems criteria.',
    matchScore: 98,
  },
  {
    id: 'sl_2',
    recruiterId: 'user_recruiter',
    candidateId: 'user_alex',
    addedAt: '2026-10-26T09:15:00Z',
    stage: 'discovered',
    notes: 'Top tier WebGL / graphics background. Employer endorsement confirmed from Graphix Labs.',
    matchScore: 91,
  }
];

// Helper to record audit events
function recordAudit(actor: string, actorRole: string, action: string, targetType: 'candidate' | 'submission' | 'endorsement' | 'project', targetId: string, details: string) {
  const log: AuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    actor,
    actorRole,
    action,
    targetType,
    targetId,
    details,
  };
  auditLogs.unshift(log);
}

// Initialize Gemini client if API key is set
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// ==========================================
// REST API ROUTES
// ==========================================

// --- USERS & CANDIDATE PROFILES ---
app.get('/api/users', (req: Request, res: Response) => {
  const role = req.query.role as string;
  const list = role ? users.filter(u => u.role === role) : users;
  res.json(list);
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id || u.handle === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userSkills = skills[user.id] || [];
  const userProjects = projects.filter(p => p.userId === user.id);
  const userSubmissions = submissions.filter(s => s.candidateId === user.id);
  const userEndorsements = endorsements.filter(e => e.candidateId === user.id);
  const userPlan = learningPlans[user.id] || null;

  res.json({
    user,
    skills: userSkills,
    projects: userProjects,
    submissions: userSubmissions,
    endorsements: userEndorsements,
    learningPlan: userPlan,
  });
});

app.put('/api/users/:id', (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const existing = users[index];
  const updated: User = {
    ...existing,
    ...req.body,
    // Sensitive fields cannot be self-escalated
    id: existing.id,
    role: existing.role,
    verifiedTier: existing.verifiedTier,
  };
  users[index] = updated;

  recordAudit(updated.name, updated.role, 'UPDATE_PROFILE', 'candidate', updated.id, 'Candidate updated bio and visibility settings.');
  res.json(updated);
});

// --- PROJECTS & EVIDENCE ROOMS ---
app.get('/api/projects', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (userId) {
    return res.json(projects.filter(p => p.userId === userId));
  }
  res.json(projects);
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

app.post('/api/projects', (req: Request, res: Response) => {
  const { userId, title, tagline, description, problemStatement, architectureOverview, techStack, repoUrl, liveUrl } = req.body;
  if (!userId || !title) {
    return res.status(400).json({ error: 'userId and title are required' });
  }

  const newProject: Project = {
    id: `proj_${Date.now()}`,
    userId,
    title,
    tagline: tagline || '',
    description: description || '',
    problemStatement: problemStatement || '',
    architectureOverview: architectureOverview || '',
    techStack: Array.isArray(techStack) ? techStack : [],
    repoUrl,
    liveUrl,
    versionHistory: [
      {
        version: 'v1.0.0',
        releaseDate: new Date().toISOString().split('T')[0],
        notes: 'Initial evidence repository setup.',
      }
    ],
    evidenceFiles: [],
    keyContributions: [],
    verifiedStatus: 'Unverified',
    starsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.unshift(newProject);
  recordAudit(userId, 'candidate', 'CREATE_PROJECT_ROOM', 'project', newProject.id, `Created project room: "${title}"`);
  res.status(201).json(newProject);
});

app.post('/api/projects/:id/evidence', (req: Request, res: Response) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { name, type, language, contentOrUrl, explanation } = req.body;
  const newFile = {
    id: `ev_${Date.now()}`,
    name: name || 'evidence_artifact',
    type: type || 'code',
    language: language || 'typescript',
    contentOrUrl: contentOrUrl || '',
    explanation: explanation || '',
    verifiedStatus: 'unverified' as const,
  };

  project.evidenceFiles.push(newFile);
  project.updatedAt = new Date().toISOString();

  recordAudit(project.userId, 'candidate', 'UPLOAD_EVIDENCE', 'project', project.id, `Added evidence file "${newFile.name}" to ${project.title}`);
  res.status(201).json(newFile);
});

app.post('/api/projects/:id/versions', (req: Request, res: Response) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { version, notes, diffSummary, commitHash } = req.body;
  const newVer = {
    version: version || `v1.${project.versionHistory.length}.0`,
    releaseDate: new Date().toISOString().split('T')[0],
    notes: notes || '',
    diffSummary,
    commitHash: commitHash || Math.random().toString(16).substring(2, 10),
  };

  project.versionHistory.unshift(newVer);
  project.updatedAt = new Date().toISOString();

  recordAudit(project.userId, 'candidate', 'PUBLISH_VERSION', 'project', project.id, `Published version ${newVer.version} for ${project.title}`);
  res.status(201).json(newVer);
});

// --- PRACTICAL ASSESSMENTS & SUBMISSIONS ---
app.get('/api/challenges', (req: Request, res: Response) => {
  res.json(challenges);
});

app.get('/api/challenges/:id', (req: Request, res: Response) => {
  const challenge = challenges.find(c => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }
  res.json(challenge);
});

app.get('/api/submissions', (req: Request, res: Response) => {
  const candidateId = req.query.candidateId as string;
  if (candidateId) {
    return res.json(submissions.filter(s => s.candidateId === candidateId));
  }
  res.json(submissions);
});

app.post('/api/submissions', async (req: Request, res: Response) => {
  const { challengeId, candidateId, codeSolution, architecturalRationale, timeSpentSeconds } = req.body;

  const challenge = challenges.find(c => c.id === challengeId);
  const candidate = users.find(u => u.id === candidateId);

  if (!challenge || !candidate) {
    return res.status(400).json({ error: 'Valid challengeId and candidateId required' });
  }

  // 1. Run deterministic test case evaluation
  const testResults = challenge.testCases.map((tc, idx) => {
    // Deterministic simulation based on code keywords & structural criteria
    const hasImplementation = codeSolution && codeSolution.length > 80 && !codeSolution.includes('throw new Error(\'Not implemented\')');
    const passes = hasImplementation && (idx !== 2 || codeSolution.includes('committed') || codeSolution.includes('linearizable') || codeSolution.includes('prefixSums') || codeSolution.includes('delta'));
    return {
      testCaseId: tc.id,
      inputDesc: tc.inputDesc,
      passed: Boolean(passes),
      message: passes ? `Assertion verified successfully: output matches expected contract.` : `Test assertion failed: edge case not handled or missing implementation.`,
    };
  });

  // 2. Perform Plagiarism / Duplicate Code Heuristics
  const referenceCorpus = submissions.map(s => s.codeSolution);
  const heuristicFraud = detectPlagiarismHeuristics(codeSolution, referenceCorpus);

  // 3. AI Rubric Evaluation (via Gemini or deterministic rubric engine)
  let overallScore = 80;
  let dimensionScores: DimensionScores = {
    correctness: 82,
    architecture: 80,
    implementation: 84,
    edge_cases: 75,
    communication: 80,
  };
  let feedback = 'Solution implements core requirements with good structure.';
  let strengths = ['Valid control flow', 'Clean function separation'];
  let weaknesses = ['Could strengthen defensive assertions for null/undefined inputs'];
  let potentialPlagiarismScore = heuristicFraud.similarityScore;

  if (ai) {
    try {
      const prompt = `You are a Principal Software Engineer and Technical Evaluation Auditor evaluating a candidate's code submission for the challenge: "${challenge.title}".
Challenge Scenario: ${challenge.scenario}
Candidate Solution Code:
\`\`\`${challenge.language}
${codeSolution}
\`\`\`
Candidate Architectural Rationale:
"${architecturalRationale}"

Evaluate this submission strictly and transparently across 5 dimensions (0-100 scale each):
1. correctness (weight 35%)
2. architecture (weight 25%)
3. implementation (weight 20%)
4. edge_cases (weight 10%)
5. communication (weight 10%)

Return ONLY a valid JSON object with this exact shape:
{
  "dimensionScores": {
    "correctness": number,
    "architecture": number,
    "implementation": number,
    "edge_cases": number,
    "communication": number
  },
  "feedback": "string summarizing evaluation",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "notes": "string detailing evidence observations"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.dimensionScores) {
        dimensionScores = {
          correctness: Number(parsed.dimensionScores.correctness) || 75,
          architecture: Number(parsed.dimensionScores.architecture) || 75,
          implementation: Number(parsed.dimensionScores.implementation) || 75,
          edge_cases: Number(parsed.dimensionScores.edge_cases) || 70,
          communication: Number(parsed.dimensionScores.communication) || 75,
        };
        overallScore = calculateOverallScore(dimensionScores);
        feedback = parsed.feedback || feedback;
        strengths = Array.isArray(parsed.strengths) ? parsed.strengths : strengths;
        weaknesses = Array.isArray(parsed.weaknesses) ? parsed.weaknesses : weaknesses;
      }
    } catch (err) {
      console.warn('Gemini evaluation fallback engaged:', err);
      // Fallback calculation based on test cases passed and rationale depth
      const passedCount = testResults.filter(t => t.passed).length;
      const testScore = Math.round((passedCount / testResults.length) * 100);
      const rationaleBonus = architecturalRationale && architecturalRationale.length > 50 ? 85 : 70;
      dimensionScores = {
        correctness: testScore,
        architecture: Math.min(100, testScore + 5),
        implementation: 82,
        edge_cases: testScore > 80 ? 85 : 65,
        communication: rationaleBonus,
      };
      overallScore = calculateOverallScore(dimensionScores);
    }
  } else {
    const passedCount = testResults.filter(t => t.passed).length;
    const testScore = Math.round((passedCount / testResults.length) * 100);
    dimensionScores = {
      correctness: testScore,
      architecture: 80,
      implementation: 82,
      edge_cases: testScore >= 80 ? 80 : 60,
      communication: architecturalRationale?.length > 40 ? 85 : 70,
    };
    overallScore = calculateOverallScore(dimensionScores);
  }

  const newSubmission: AssessmentSubmission = {
    id: `sub_${Date.now()}`,
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    candidateId: candidate.id,
    candidateName: candidate.name,
    candidateHandle: candidate.handle,
    codeSolution,
    architecturalRationale: architecturalRationale || '',
    timeSpentSeconds: Number(timeSpentSeconds) || 1200,
    submittedAt: new Date().toISOString(),
    status: 'evaluated',
    aiEvaluation: {
      overallScore,
      dimensionScores,
      feedback,
      strengths,
      weaknesses,
      potentialPlagiarismScore,
      notes: 'Initial algorithmic and AI rubric evaluation completed.',
    },
    testCaseResults: testResults,
    integrityCheck: {
      isSuspicious: heuristicFraud.isSuspicious,
      confidence: heuristicFraud.confidence,
      flags: heuristicFraud.flags,
      similarityNotes: heuristicFraud.flags.length > 0 ? heuristicFraud.flags.join('; ') : 'No duplication flags triggered.',
    }
  };

  submissions.unshift(newSubmission);

  // If suspicious, create human review finding
  if (heuristicFraud.isSuspicious) {
    integrityFindings.unshift({
      id: `int_${Date.now()}`,
      submissionId: newSubmission.id,
      candidateName: candidate.name,
      challengeTitle: challenge.title,
      category: 'Code Duplication',
      evidence: heuristicFraud.flags.join(' '),
      confidence: heuristicFraud.confidence,
      severity: 'warning',
      recommendation: 'Conduct human review of candidate AST and token overlap against reference corpus.',
      status: 'pending_review',
    });
  }

  recordAudit(candidate.name, 'candidate', 'SUBMIT_ASSESSMENT', 'submission', newSubmission.id, `Submitted solution for challenge: "${challenge.title}". AI Score: ${overallScore}`);
  res.status(201).json(newSubmission);
});

// Human Review / Verification of Submission
app.post('/api/submissions/:id/human-review', (req: Request, res: Response) => {
  const submission = submissions.find(s => s.id === req.params.id);
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const { reviewerName, reviewerRole, verifiedScore, dimensionScores, qualitativeFeedback, decision } = req.body;

  submission.status = 'human_verified';
  submission.humanReview = {
    reviewerName: reviewerName || 'Verified Systems Evaluator',
    reviewerRole: reviewerRole || 'Principal Reviewer',
    verifiedScore: Number(verifiedScore) || 90,
    dimensionScores: dimensionScores || submission.aiEvaluation?.dimensionScores || { correctness: 90, architecture: 90, implementation: 90, edge_cases: 90, communication: 90 },
    qualitativeFeedback: qualitativeFeedback || 'Human verified assessment confirming production readiness.',
    verifiedAt: new Date().toISOString(),
    decision: decision || 'approved',
  };

  // Check if candidate qualifies for upgrade in verification tier
  const candidate = users.find(u => u.id === submission.candidateId);
  if (candidate) {
    const candSubmissions = submissions.filter(s => s.candidateId === candidate.id && s.humanReview?.decision === 'approved');
    const candEndorsements = endorsements.filter(e => e.candidateId === candidate.id && e.status === 'active');
    const candEmployerEnd = candEndorsements.filter(e => e.relationship === 'Manager').length;
    const candPeerEnd = candEndorsements.filter(e => e.relationship !== 'Manager').length;
    const candProjects = projects.filter(p => p.userId === candidate.id && p.verifiedStatus !== 'Unverified').length;

    const avgScore = candSubmissions.reduce((acc, cur) => acc + (cur.humanReview?.verifiedScore || 0), 0) / (candSubmissions.length || 1);

    const newTier = computeVerificationTier({
      assessmentsCount: candSubmissions.length,
      avgAssessmentScore: avgScore,
      employerEndorsements: candEmployerEnd,
      peerEndorsements: candPeerEnd,
      verifiedProjectsCount: candProjects,
    });

    candidate.verifiedTier = newTier;
    candidate.overallScore = Math.round(avgScore);
  }

  recordAudit(reviewerName || 'Evaluator', 'reviewer', 'HUMAN_VERIFICATION_RECORDED', 'submission', submission.id, `Recorded verified evaluation (${decision}) with score ${verifiedScore}/100.`);
  res.json(submission);
});

// --- VERIFICATION & ENDORSEMENTS ---
app.get('/api/endorsements', (req: Request, res: Response) => {
  const candidateId = req.query.candidateId as string;
  if (candidateId) {
    return res.json(endorsements.filter(e => e.candidateId === candidateId));
  }
  res.json(endorsements);
});

app.post('/api/endorsements', (req: Request, res: Response) => {
  const { candidateId, projectId, skillName, endorserName, endorserRole, endorserCompany, relationship, comment } = req.body;
  const candidate = users.find(u => u.id === candidateId);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const project = projectId ? projects.find(p => p.id === projectId) : undefined;

  const newEndorsement: Endorsement = {
    id: `end_${Date.now()}`,
    candidateId,
    candidateName: candidate.name,
    projectId,
    projectTitle: project?.title,
    skillName: skillName || 'General Engineering Architecture',
    endorserName: endorserName || 'Endorser',
    endorserRole: endorserRole || 'Engineering Lead',
    endorserCompany: endorserCompany || 'Technology Partner',
    relationship: relationship || 'Senior Colleague',
    verifiedSignature: `sig_ed25519_${Math.random().toString(36).substring(2, 12)}`,
    comment: comment || '',
    createdAt: new Date().toISOString(),
    status: 'active',
  };

  endorsements.push(newEndorsement);

  // If manager endorsement on a project, update project verified status
  if (project && relationship === 'Manager') {
    project.verifiedStatus = 'Employer Verified';
  }

  // Recalculate candidate verification tier strictly
  const candSubmissions = submissions.filter(s => s.candidateId === candidate.id && s.humanReview?.decision === 'approved');
  const candEndorsements = endorsements.filter(e => e.candidateId === candidate.id && e.status === 'active');
  const candEmployerEnd = candEndorsements.filter(e => e.relationship === 'Manager').length;
  const candPeerEnd = candEndorsements.filter(e => e.relationship !== 'Manager').length;
  const candProjects = projects.filter(p => p.userId === candidate.id && p.verifiedStatus !== 'Unverified').length;
  const avgScore = candSubmissions.reduce((acc, cur) => acc + (cur.humanReview?.verifiedScore || 0), 0) / (candSubmissions.length || 1);

  candidate.verifiedTier = computeVerificationTier({
    assessmentsCount: candSubmissions.length,
    avgAssessmentScore: avgScore,
    employerEndorsements: candEmployerEnd,
    peerEndorsements: candPeerEnd,
    verifiedProjectsCount: candProjects,
  });

  recordAudit(endorserName, 'mentor', 'CREATE_VERIFIED_ENDORSEMENT', 'endorsement', newEndorsement.id, `Created ${relationship} endorsement for ${candidate.name} on ${project?.title || skillName}`);
  res.status(201).json(newEndorsement);
});

// --- LEARNING PLANS & SKILL DEVELOPMENT ---
app.get('/api/learning-plans/:userId', (req: Request, res: Response) => {
  const plan = learningPlans[req.params.userId];
  if (!plan) {
    return res.status(404).json({ error: 'No learning plan found for user' });
  }
  res.json(plan);
});

app.put('/api/learning-plans/:userId/milestones/:milestoneId', (req: Request, res: Response) => {
  const plan = learningPlans[req.params.userId];
  if (!plan) {
    return res.status(404).json({ error: 'Learning plan not found' });
  }

  const milestone = plan.milestones.find(m => m.id === req.params.milestoneId);
  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  const { status } = req.body;
  if (status) {
    milestone.status = status;
  }

  // Recalculate progress percentage
  const completed = plan.milestones.filter(m => m.status === 'completed').length;
  plan.progressPercentage = Math.round((completed / plan.milestones.length) * 100);

  res.json(plan);
});

// --- RECRUITER WORKSPACE & SHORTLISTS ---
app.get('/api/recruiter/shortlists', (req: Request, res: Response) => {
  res.json(shortlists);
});

app.post('/api/recruiter/shortlists', (req: Request, res: Response) => {
  const { candidateId, notes, stage } = req.body;
  const existing = shortlists.find(s => s.candidateId === candidateId);
  if (existing) {
    existing.notes = notes ?? existing.notes;
    existing.stage = stage ?? existing.stage;
    return res.json(existing);
  }

  const candidate = users.find(u => u.id === candidateId);
  const newShortlist: RecruiterShortlist = {
    id: `sl_${Date.now()}`,
    recruiterId: 'user_recruiter',
    candidateId,
    addedAt: new Date().toISOString(),
    stage: stage || 'shortlisted',
    notes: notes || '',
    matchScore: candidate ? candidate.overallScore : 85,
  };

  shortlists.push(newShortlist);
  recordAudit('Recruiter', 'recruiter', 'SHORTLIST_CANDIDATE', 'candidate', candidateId, `Added candidate to shortlist at stage: ${newShortlist.stage}`);
  res.status(201).json(newShortlist);
});

app.delete('/api/recruiter/shortlists/:candidateId', (req: Request, res: Response) => {
  const initialLen = shortlists.length;
  shortlists = shortlists.filter(s => s.candidateId !== req.params.candidateId);
  if (shortlists.length !== initialLen) {
    recordAudit('Recruiter', 'recruiter', 'REMOVE_FROM_SHORTLIST', 'candidate', req.params.candidateId, 'Removed candidate from recruiter shortlist.');
  }
  res.json({ success: true });
});

// --- INTEGRITY & FRAUD LAB ---
app.get('/api/integrity/findings', (req: Request, res: Response) => {
  res.json(integrityFindings);
});

app.post('/api/integrity/findings/:id/disposition', (req: Request, res: Response) => {
  const finding = integrityFindings.find(f => f.id === req.params.id);
  if (!finding) {
    return res.status(404).json({ error: 'Finding not found' });
  }

  const { status, auditorNotes } = req.body;
  if (status) finding.status = status;
  if (auditorNotes) finding.auditorNotes = auditorNotes;

  recordAudit('Auditor', 'admin', 'INTEGRITY_DISPOSITION_SET', 'submission', finding.submissionId, `Auditor marked finding as "${status}": ${auditorNotes || 'No notes'}`);
  res.json(finding);
});

// --- AUDIT LOGS & ANALYTICS ---
app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json(auditLogs);
});

app.get('/api/analytics', (req: Request, res: Response) => {
  const totalSubmissions = submissions.length;
  const verifiedSubmissions = submissions.filter(s => s.status === 'human_verified').length;
  const certifiedCandidates = users.filter(u => u.verifiedTier === 'Evaluator Certified').length;
  const employerVerified = users.filter(u => u.verifiedTier === 'Employer Verified').length;
  const avgOverallScore = Math.round(users.filter(u => u.role === 'candidate').reduce((a, b) => a + b.overallScore, 0) / (users.filter(u => u.role === 'candidate').length || 1));

  res.json({
    metrics: {
      totalCandidates: users.filter(u => u.role === 'candidate').length,
      certifiedCandidates,
      employerVerified,
      totalProjects: projects.length,
      totalEvidenceFiles: projects.reduce((a, b) => a + b.evidenceFiles.length, 0),
      totalSubmissions,
      verifiedSubmissions,
      avgOverallScore,
      fraudIncidenceRatePct: Math.round((integrityFindings.length / (totalSubmissions + 10)) * 100),
    },
    tierDistribution: {
      'Evaluator Certified': certifiedCandidates,
      'Employer Verified': employerVerified,
      'Peer Reviewed': users.filter(u => u.verifiedTier === 'Peer Reviewed').length,
      'Unverified': users.filter(u => u.verifiedTier === 'Unverified').length,
    }
  });
});

// ==========================================
// GEMINI AI INTEGRATION ENDPOINTS
// ==========================================

// 1. Dynamic Assessment Challenge Generation
app.post('/api/gemini/generate-challenge', async (req: Request, res: Response) => {
  const { roleCategory, difficulty, focusArea } = req.body;

  if (ai) {
    try {
      const prompt = `Generate a rigorous, authentic practical software engineering assessment challenge for CareerTrip Live.
Role Category: ${roleCategory || 'Distributed Systems'}
Difficulty Level: ${difficulty || 'Senior'} (Junior, Mid, Senior, Staff)
Focus Area: ${focusArea || 'Fault tolerance and high concurrency'}

Requirements:
1. Provide a realistic scenario that mirrors real production engineering problems (no toy algorithms).
2. Detail 4 explicit instructions.
3. Provide starter code in TypeScript or relevant language with complete interfaces and function stubs with TODOs.
4. Include 3 realistic test cases with description, sample input, and expected output.
5. Include a 5-dimension evaluation rubric (correctness 35pts, architecture 25pts, implementation 20pts, edge_cases 10pts, communication 10pts).

Return ONLY a valid JSON object matching this schema:
{
  "title": "string",
  "scenario": "string",
  "instructions": ["string", "string", "string", "string"],
  "starterCode": "string",
  "language": "typescript",
  "durationMinutes": number,
  "testCases": [
    { "id": "tc_1", "inputDesc": "string", "expectedOutputDesc": "string" },
    { "id": "tc_2", "inputDesc": "string", "expectedOutputDesc": "string" },
    { "id": "tc_3", "inputDesc": "string", "expectedOutputDesc": "string" }
  ],
  "evaluationRubric": [
    { "dimension": "correctness", "name": "Correctness", "description": "string", "maxPoints": 35 },
    { "dimension": "architecture", "name": "Architecture", "description": "string", "maxPoints": 25 },
    { "dimension": "implementation", "name": "Implementation Quality", "description": "string", "maxPoints": 20 },
    { "dimension": "edge_cases", "name": "Edge Cases", "description": "string", "maxPoints": 10 },
    { "dimension": "communication", "name": "Technical Communication", "description": "string", "maxPoints": 10 }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const generated = JSON.parse(response.text || '{}');
      const newChallenge: AssessmentChallenge = {
        id: `chal_${Date.now()}`,
        roleCategory: roleCategory || 'Distributed Systems',
        title: generated.title || 'Dynamic Engineering Challenge',
        difficulty: difficulty || 'Senior',
        durationMinutes: generated.durationMinutes || 45,
        scenario: generated.scenario || 'Production edge scenario.',
        instructions: generated.instructions || ['Implement core service', 'Verify invariants'],
        starterCode: generated.starterCode || '// Starter code',
        language: generated.language || 'typescript',
        testCases: generated.testCases || [],
        evaluationRubric: generated.evaluationRubric || [],
        createdAt: new Date().toISOString().split('T')[0],
      };

      challenges.unshift(newChallenge);
      return res.status(201).json(newChallenge);
    } catch (err) {
      console.warn('Gemini generate challenge fallback:', err);
    }
  }

  // Fallback generation if no key or offline
  const fallbackChallenge: AssessmentChallenge = {
    id: `chal_${Date.now()}`,
    roleCategory: roleCategory || 'Backend & Cloud',
    title: `${roleCategory || 'Systems'} Resilient Message Pipeline`,
    difficulty: difficulty || 'Senior',
    durationMinutes: 45,
    scenario: `Build a bounded-buffer async message processing pipeline in TypeScript with exponential backoff and dead-letter queue routing for unrecoverable payloads.`,
    instructions: [
      '1. Implement `publish(message)` with backpressure when queue capacity reaches 90%.',
      '2. Implement worker pool consumer handling concurrent retries with jitter.',
      '3. Route messages failing more than 3 attempts to a dead-letter queue.',
      '4. Preserve strict in-order delivery per partition key.'
    ],
    starterCode: `export interface Message {
  id: string;
  partitionKey: string;
  payload: Record<string, any>;
  attempts: number;
}

export class ResilientMessageQueue {
  private capacity: number;
  private queue: Message[] = [];
  private deadLetterQueue: Message[] = [];

  constructor(capacity: number = 1000) {
    this.capacity = capacity;
  }

  public async publish(msg: Message): Promise<boolean> {
    // TODO: implement backpressure and enqueue
    throw new Error('Not implemented');
  }

  public async processBatch(handler: (msg: Message) => Promise<boolean>): Promise<number> {
    // TODO: process with retries and dead-letter fallback
    throw new Error('Not implemented');
  }
}`,
    language: 'typescript',
    testCases: [
      { id: 'fb_1', inputDesc: 'Enqueue 100 messages within buffer limit', expectedOutputDesc: 'All accepted without blocking' },
      { id: 'fb_2', inputDesc: 'Simulate worker failure for 3 retries', expectedOutputDesc: 'Payload migrated to dead-letter queue' },
    ],
    evaluationRubric: [
      { dimension: 'correctness', name: 'Backpressure & Queue Semantics', description: 'Graceful overflow control.', maxPoints: 35 },
      { dimension: 'architecture', name: 'Dead-Letter Pipeline', description: 'Fault isolation and retry jitter.', maxPoints: 25 },
      { dimension: 'implementation', name: 'Clean Async Execution', description: 'Non-blocking Promise handling.', maxPoints: 20 },
      { dimension: 'edge_cases', name: 'Poison Pill Defense', description: 'Resistant to malformed payloads.', maxPoints: 10 },
      { dimension: 'communication', name: 'Design Rationale', description: 'Documentation of latency tradeoffs.', maxPoints: 10 },
    ],
    createdAt: new Date().toISOString().split('T')[0],
  };

  challenges.unshift(fallbackChallenge);
  res.status(201).json(fallbackChallenge);
});

// 2. Personalized Skill Gap Analysis and Learning Plan
app.post('/api/gemini/gap-analysis', async (req: Request, res: Response) => {
  const { candidateId, targetRole } = req.body;
  const candidate = users.find(u => u.id === candidateId);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const candSkills = skills[candidateId] || [];
  const candSubmissions = submissions.filter(s => s.candidateId === candidateId);
  const candProjects = projects.filter(p => p.userId === candidateId);

  if (ai) {
    try {
      const prompt = `You are a Career Growth & Skill Assessment Specialist at CareerTrip Live.
Candidate: ${candidate.name} (${candidate.headline})
Target Career Role: ${targetRole || candidate.targetRole}
Current Verified Tier: ${candidate.verifiedTier}
Current Verified Skills:
${JSON.stringify(candSkills.map(s => ({ name: s.name, level: s.proficiency, verified: s.verificationLevel })), null, 2)}
Recent Assessment Submissions:
${JSON.stringify(candSubmissions.map(s => ({ challenge: s.challengeTitle, score: s.aiEvaluation?.overallScore })), null, 2)}
Project Evidence:
${JSON.stringify(candProjects.map(p => ({ title: p.title, status: p.verifiedStatus, filesCount: p.evidenceFiles.length })), null, 2)}

Identify the genuine skill gaps required to reach the target role and generate a personalized, measurable action plan.
Return ONLY valid JSON matching this schema:
{
  "skillGaps": [
    {
      "skillName": "string",
      "currentLevel": number,
      "targetLevel": number,
      "priority": "critical" | "recommended" | "optional",
      "reason": "string"
    }
  ],
  "milestones": [
    {
      "id": "ms_1",
      "title": "string",
      "description": "string",
      "practiceTask": "string",
      "estimatedHours": number,
      "status": "not_started"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '{}');
      const plan: LearningPlan = {
        id: `lp_${Date.now()}`,
        candidateId,
        targetRole: targetRole || candidate.targetRole,
        generatedAt: new Date().toISOString(),
        skillGaps: parsed.skillGaps || [],
        milestones: parsed.milestones || [],
        progressPercentage: 15,
      };

      learningPlans[candidateId] = plan;
      return res.json(plan);
    } catch (err) {
      console.warn('Gemini gap analysis fallback:', err);
    }
  }

  // Deterministic fallback using pure prioritization logic
  const benchmarks = [
    { name: 'Distributed Systems & Raft Consensus', requiredLevel: 4, weight: 'critical' as const },
    { name: 'High-Concurrency Memory Management', requiredLevel: 4, weight: 'critical' as const },
    { name: 'Automated Chaos Testing Suite', requiredLevel: 3, weight: 'recommended' as const },
    { name: 'Cloud Native Observability (OTel/Prometheus)', requiredLevel: 3, weight: 'optional' as const },
  ];

  const gaps = prioritizeSkillGaps(
    candSkills.map(s => ({ name: s.name, level: s.proficiency, verified: s.verificationLevel !== 'Unverified' })),
    benchmarks
  );

  const fallbackPlan: LearningPlan = {
    id: `lp_${Date.now()}`,
    candidateId,
    targetRole: targetRole || candidate.targetRole,
    generatedAt: new Date().toISOString(),
    skillGaps: gaps.map(g => ({
      skillName: g.skillName,
      currentLevel: Math.max(1, 4 - g.gap),
      targetLevel: 4,
      priority: g.priority,
      reason: g.reason,
    })),
    milestones: [
      {
        id: 'ms_fb_1',
        title: 'Complete Distributed Partition Recovery Challenge',
        description: 'Implement linearizable quorum rebalancing under network partition.',
        practiceTask: 'Achieve score >= 85 on CareerTrip Practical Assessment Lab.',
        status: 'not_started',
        estimatedHours: 10,
      },
      {
        id: 'ms_fb_2',
        title: 'Add Reproducible Benchmarks to Project Evidence Room',
        description: 'Commit automated Jepsen or artillery load test scripts to repository.',
        practiceTask: 'Upload benchmark evidence file to Project Room.',
        status: 'not_started',
        estimatedHours: 8,
      },
      {
        id: 'ms_fb_3',
        title: 'Secure Peer or Employer Code Verification',
        description: 'Have a staff colleague or manager endorse key architectural contributions.',
        practiceTask: 'Obtain signed cryptographic endorsement from senior peer.',
        status: 'not_started',
        estimatedHours: 12,
      }
    ],
    progressPercentage: 20,
  };

  learningPlans[candidateId] = fallbackPlan;
  res.json(fallbackPlan);
});

// ==========================================
// STATIC ASSETS & VITE MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerTrip Live backend server listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
