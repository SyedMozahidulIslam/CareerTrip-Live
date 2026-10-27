/**
 * CareerTrip Live - Central Type Definitions
 */

export type UserRole = 'candidate' | 'recruiter' | 'reviewer' | 'mentor' | 'admin';

export type VerificationTier = 'Unverified' | 'Peer Reviewed' | 'Employer Verified' | 'Evaluator Certified';

export interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  headline: string;
  bio: string;
  location: string;
  targetRole: string;
  yearsExperience: number;
  publicProfile: boolean;
  verifiedTier: VerificationTier;
  overallScore: number;
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Distributed Systems' | 'Frontend Core' | 'Backend & Cloud' | 'AI & ML' | 'Architecture & Security';
  proficiency: number; // 1 to 5
  verifiedScore?: number; // 0 to 100
  verificationLevel: VerificationTier;
  evidenceCount: number;
  lastAssessedAt?: string;
  endorsementsCount: number;
}

export interface ProjectVersion {
  version: string;
  releaseDate: string;
  notes: string;
  diffSummary?: string;
  commitHash?: string;
}

export interface EvidenceFile {
  id: string;
  name: string;
  type: 'code' | 'diagram' | 'benchmark' | 'screenshot';
  language?: string;
  contentOrUrl: string;
  explanation: string;
  verifiedStatus: 'unverified' | 'verified';
}

export interface ContributionItem {
  id: string;
  title: string;
  description: string;
  verificationStatus: 'self_reported' | 'peer_endorsed' | 'employer_verified';
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  tagline: string;
  description: string;
  problemStatement: string;
  architectureOverview: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  versionHistory: ProjectVersion[];
  evidenceFiles: EvidenceFile[];
  keyContributions: ContributionItem[];
  verifiedStatus: VerificationTier;
  starsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RubricDimension {
  dimension: 'correctness' | 'architecture' | 'implementation' | 'edge_cases' | 'communication';
  name: string;
  description: string;
  maxPoints: number;
}

export interface TestCase {
  id: string;
  inputDesc: string;
  expectedOutputDesc: string;
  sampleInput?: string;
  sampleOutput?: string;
  hidden?: boolean;
}

export interface AssessmentChallenge {
  id: string;
  roleCategory: string;
  title: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
  durationMinutes: number;
  scenario: string;
  instructions: string[];
  starterCode: string;
  language: string;
  testCases: TestCase[];
  evaluationRubric: RubricDimension[];
  createdAt: string;
}

export interface AssessmentSubmission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  candidateId: string;
  candidateName: string;
  candidateHandle: string;
  codeSolution: string;
  architecturalRationale: string;
  timeSpentSeconds: number;
  submittedAt: string;
  status: 'submitted' | 'evaluating' | 'evaluated' | 'human_verified';
  aiEvaluation?: {
    overallScore: number;
    dimensionScores: {
      correctness: number;
      architecture: number;
      implementation: number;
      edge_cases: number;
      communication: number;
    };
    feedback: string;
    strengths: string[];
    weaknesses: string[];
    potentialPlagiarismScore: number;
    notes: string;
  };
  humanReview?: {
    reviewerName: string;
    reviewerRole: string;
    verifiedScore: number;
    dimensionScores: {
      correctness: number;
      architecture: number;
      implementation: number;
      edge_cases: number;
      communication: number;
    };
    qualitativeFeedback: string;
    verifiedAt: string;
    decision: 'approved' | 'needs_revision' | 'rejected';
  };
  testCaseResults: {
    testCaseId: string;
    inputDesc: string;
    passed: boolean;
    message: string;
  }[];
  integrityCheck: {
    isSuspicious: boolean;
    confidence: number;
    flags: string[];
    similarityNotes: string;
  };
}

export interface Endorsement {
  id: string;
  candidateId: string;
  candidateName: string;
  projectId?: string;
  projectTitle?: string;
  skillName?: string;
  endorserName: string;
  endorserRole: string;
  endorserCompany: string;
  relationship: 'Manager' | 'Senior Colleague' | 'Mentor' | 'Open Source Maintainer';
  verifiedSignature: string;
  comment: string;
  createdAt: string;
  status: 'active' | 'revoked';
}

export interface SkillGapItem {
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'critical' | 'recommended' | 'optional';
  reason: string;
}

export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  practiceTask: string;
  status: 'not_started' | 'in_progress' | 'completed';
  estimatedHours: number;
}

export interface LearningPlan {
  id: string;
  candidateId: string;
  targetRole: string;
  generatedAt: string;
  skillGaps: SkillGapItem[];
  milestones: LearningMilestone[];
  progressPercentage: number;
}

export interface RecruiterShortlist {
  id: string;
  recruiterId: string;
  candidateId: string;
  addedAt: string;
  stage: 'discovered' | 'reviewing_evidence' | 'shortlisted' | 'interview_scheduled' | 'rejected';
  notes: string;
  matchScore: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  targetType: 'candidate' | 'submission' | 'endorsement' | 'project';
  targetId: string;
  details: string;
}

export interface IntegrityFinding {
  id: string;
  submissionId: string;
  candidateName: string;
  challengeTitle: string;
  category: 'Code Duplication' | 'Suspicious AI Pattern' | 'Claim Inconsistency' | 'Plagiarism Indicator';
  evidence: string;
  confidence: number;
  severity: 'info' | 'warning' | 'alert';
  recommendation: string;
  status: 'pending_review' | 'cleared' | 'flagged';
  auditorNotes?: string;
}
