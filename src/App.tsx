import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { CandidatePortfolio } from './components/CandidatePortfolio';
import { ProjectEvidenceRoom } from './components/ProjectEvidenceRoom';
import { AssessmentLab } from './components/AssessmentLab';
import { RecruiterWorkspace } from './components/RecruiterWorkspace';
import { SkillDevelopmentEngine } from './components/SkillDevelopmentEngine';
import { IntegrityLab } from './components/IntegrityLab';
import { VerificationHub } from './components/VerificationHub';
import { AnalyticsProgress } from './components/AnalyticsProgress';
import { PublicPortfolioModal } from './components/PublicPortfolioModal';
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
  EvidenceFile,
  ProjectVersion,
  LearningMilestone,
} from './types';
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
} from './data/seedData';
import { Layers, ArrowLeft } from 'lucide-react';

export default function App() {
  const [allUsers, setAllUsers] = useState<User[]>(SEED_USERS);
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]); // Maya Lin
  const [allSkills, setAllSkills] = useState<Record<string, SkillItem[]>>(SEED_SKILLS);
  const [allProjects, setAllProjects] = useState<Project[]>(SEED_PROJECTS);
  const [challenges, setChallenges] = useState<AssessmentChallenge[]>(SEED_CHALLENGES);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>(SEED_SUBMISSIONS);
  const [endorsements, setEndorsements] = useState<Endorsement[]>(SEED_ENDORSEMENTS);
  const [learningPlans, setLearningPlans] = useState<Record<string, LearningPlan>>(SEED_LEARNING_PLANS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [integrityFindings, setIntegrityFindings] = useState<IntegrityFinding[]>(SEED_INTEGRITY_FINDINGS);
  const [shortlists, setShortlists] = useState<RecruiterShortlist[]>([]);

  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('portfolio');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showPublicModal, setShowPublicModal] = useState(false);

  // Check URL query parameters for permalink view
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const handleParam = params.get('handle');

    if (viewParam === 'portfolio' && handleParam) {
      const match = allUsers.find((u) => u.handle === handleParam);
      if (match) {
        setCurrentUser(match);
        setShowPublicModal(true);
      }
    } else if (viewParam === 'recruiter') {
      setCurrentView('recruiter');
    }
  }, []);

  // Fetch initial data from server API
  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAllUsers(data);
      })
      .catch((err) => console.log('Using seeded users fallback', err));

    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAllProjects(data);
      })
      .catch((err) => console.log('Using seeded projects fallback', err));

    fetch('/api/challenges')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setChallenges(data);
      })
      .catch((err) => console.log('Using seeded challenges fallback', err));

    fetch('/api/submissions')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setSubmissions(data);
      })
      .catch((err) => console.log('Using seeded submissions fallback', err));

    fetch('/api/endorsements')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setEndorsements(data);
      })
      .catch((err) => console.log('Using seeded endorsements fallback', err));

    fetch('/api/recruiter/shortlists')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setShortlists(data);
      })
      .catch((err) => console.log('Using shortlists fallback', err));

    fetch('/api/integrity/findings')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setIntegrityFindings(data);
      })
      .catch((err) => console.log('Using integrity findings fallback', err));

    fetch('/api/audit-logs')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAuditLogs(data);
      })
      .catch((err) => console.log('Using audit logs fallback', err));
  }, []);

  // Handlers
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'recruiter') {
      setCurrentView('recruiter');
    } else if (user.role === 'reviewer' || user.role === 'admin') {
      setCurrentView('integrity');
    } else {
      setCurrentView('portfolio');
    }
  };

  const handleUpdateUser = async (updated: Partial<User>) => {
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data: User = await res.json();
        setCurrentUser(data);
        setAllUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      }
    } catch {
      const data: User = { ...currentUser, ...updated };
      setCurrentUser(data);
      setAllUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
    }
  };

  const handleAddEvidence = async (projectId: string, file: Partial<EvidenceFile>) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(file),
      });
      if (res.ok) {
        const newFile: EvidenceFile = await res.json();
        setAllProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? { ...p, evidenceFiles: [...p.evidenceFiles, newFile] }
              : p
          )
        );
      }
    } catch {
      const fallbackFile: EvidenceFile = {
        id: `ev_${Date.now()}`,
        name: file.name || 'artifact',
        type: file.type || 'code',
        language: file.language || 'typescript',
        contentOrUrl: file.contentOrUrl || '',
        explanation: file.explanation || '',
        verifiedStatus: 'unverified',
      };
      setAllProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, evidenceFiles: [...p.evidenceFiles, fallbackFile] }
            : p
        )
      );
    }
  };

  const handleAddVersion = async (projectId: string, ver: Partial<ProjectVersion>) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ver),
      });
      if (res.ok) {
        const newVer: ProjectVersion = await res.json();
        setAllProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? { ...p, versionHistory: [newVer, ...p.versionHistory] }
              : p
          )
        );
      }
    } catch {
      const fallbackVer: ProjectVersion = {
        version: ver.version || 'v1.1.0',
        releaseDate: new Date().toISOString().split('T')[0],
        notes: ver.notes || '',
        diffSummary: ver.diffSummary,
        commitHash: Math.random().toString(16).substring(2, 10),
      };
      setAllProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, versionHistory: [fallbackVer, ...p.versionHistory] }
            : p
        )
      );
    }
  };

  const handleNewSubmission = (sub: AssessmentSubmission) => {
    setSubmissions((prev) => [sub, ...prev]);
    fetch('/api/audit-logs')
      .then((r) => r.json())
      .then((data) => setAuditLogs(data))
      .catch(() => {});
  };

  const handleHumanReview = async (submissionId: string, reviewData: any) => {
    try {
      const res = await fetch(`/api/submissions/${submissionId}/human-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        const updatedSub: AssessmentSubmission = await res.json();
        setSubmissions((prev) =>
          prev.map((s) => (s.id === submissionId ? updatedSub : s))
        );
        const uRes = await fetch('/api/users');
        if (uRes.ok) {
          const uData = await uRes.json();
          setAllUsers(uData);
          const me = uData.find((u: User) => u.id === currentUser.id);
          if (me) setCurrentUser(me);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateChallenge = async (params: {
    roleCategory: string;
    difficulty: string;
    focusArea: string;
  }): Promise<AssessmentChallenge> => {
    const res = await fetch('/api/gemini/generate-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const newChal: AssessmentChallenge = await res.json();
    setChallenges((prev) => [newChal, ...prev]);
    return newChal;
  };

  const handleUpdateMilestoneStatus = async (
    milestoneId: string,
    status: LearningMilestone['status']
  ) => {
    try {
      const res = await fetch(
        `/api/learning-plans/${currentUser.id}/milestones/${milestoneId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }
      );
      if (res.ok) {
        const updatedPlan: LearningPlan = await res.json();
        setLearningPlans((prev) => ({ ...prev, [currentUser.id]: updatedPlan }));
      }
    } catch {
      const plan = learningPlans[currentUser.id];
      if (plan) {
        const m = plan.milestones.find((x) => x.id === milestoneId);
        if (m) m.status = status;
        const comp = plan.milestones.filter((x) => x.status === 'completed').length;
        plan.progressPercentage = Math.round((comp / plan.milestones.length) * 100);
        setLearningPlans({ ...learningPlans, [currentUser.id]: { ...plan } });
      }
    }
  };

  const handleRegeneratePlan = async (targetRole: string) => {
    const res = await fetch('/api/gemini/gap-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId: currentUser.id, targetRole }),
    });
    const plan: LearningPlan = await res.json();
    setLearningPlans((prev) => ({ ...prev, [currentUser.id]: plan }));
  };

  const handleAddToShortlist = async (
    candidateId: string,
    notes: string,
    stage: RecruiterShortlist['stage']
  ) => {
    const res = await fetch('/api/recruiter/shortlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, notes, stage }),
    });
    if (res.ok) {
      const sl = await res.json();
      setShortlists((prev) => {
        const exists = prev.find((x) => x.candidateId === candidateId);
        if (exists) return prev.map((x) => (x.candidateId === candidateId ? sl : x));
        return [...prev, sl];
      });
    }
  };

  const handleRemoveFromShortlist = async (candidateId: string) => {
    await fetch(`/api/recruiter/shortlists/${candidateId}`, { method: 'DELETE' });
    setShortlists((prev) => prev.filter((s) => s.candidateId !== candidateId));
  };

  const handleSetDisposition = async (
    findingId: string,
    status: IntegrityFinding['status'],
    notes?: string
  ) => {
    const res = await fetch(`/api/integrity/findings/${findingId}/disposition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, auditorNotes: notes }),
    });
    if (res.ok) {
      const updated: IntegrityFinding = await res.json();
      setIntegrityFindings((prev) =>
        prev.map((f) => (f.id === findingId ? updated : f))
      );
    }
  };

  const handleAddEndorsement = async (endorsementData: Partial<Endorsement>) => {
    const res = await fetch('/api/endorsements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(endorsementData),
    });
    if (res.ok) {
      const newEnd: Endorsement = await res.json();
      setEndorsements((prev) => [...prev, newEnd]);
      const uRes = await fetch('/api/users');
      if (uRes.ok) {
        const uData = await uRes.json();
        setAllUsers(uData);
      }
    }
  };

  const candidateSkills = allSkills[currentUser.id] || [];
  const candidateProjects = allProjects.filter((p) => p.userId === currentUser.id);
  const candidateSubmissions = submissions.filter((s) => s.candidateId === currentUser.id);
  const candidateEndorsements = endorsements.filter((e) => e.candidateId === currentUser.id);
  const candidatePlan = learningPlans[currentUser.id] || null;

  const currentProject = selectedProjectId
    ? allProjects.find((p) => p.id === selectedProjectId) || null
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setSelectedProjectId(null);
          setCurrentView(view);
        }}
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        onOpenPublicView={() => setShowPublicModal(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {selectedProjectId && currentProject ? (
          <ProjectEvidenceRoom
            project={currentProject}
            onBack={() => setSelectedProjectId(null)}
            onAddEvidence={(file) => handleAddEvidence(currentProject.id, file)}
            onAddVersion={(ver) => handleAddVersion(currentProject.id, ver)}
          />
        ) : currentView === 'portfolio' ? (
          <CandidatePortfolio
            user={currentUser}
            skills={candidateSkills}
            projects={candidateProjects}
            submissions={candidateSubmissions}
            endorsements={candidateEndorsements}
            onSelectProject={(pId) => setSelectedProjectId(pId)}
            onNavigateToAssessments={() => setCurrentView('assessments')}
            onNavigateToLearning={() => setCurrentView('learning')}
            onUpdateUser={handleUpdateUser}
          />
        ) : currentView === 'projects' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  All Evidence Rooms Across Network
                </h1>
                <p className="text-xs text-zinc-400">
                  Inspect deep code implementations, version diffs, and verified benchmarks.
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-500">{allProjects.length} Rooms Tracked</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map((p) => {
                const owner = allUsers.find((u) => u.id === p.userId);
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all rounded-xl p-5 space-y-3 cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 font-mono">
                        {owner?.name || 'Candidate'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                        {p.verifiedStatus}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base hover:text-indigo-400 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {p.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.techStack.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                      <span>{p.evidenceFiles.length} Evidence Artifacts</span>
                      <span className="text-indigo-400 font-medium">Enter Room →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : currentView === 'assessments' ? (
          <AssessmentLab
            challenges={challenges}
            submissions={submissions}
            currentUser={currentUser}
            onNewSubmission={handleNewSubmission}
            onHumanReview={handleHumanReview}
            onGenerateChallenge={handleGenerateChallenge}
          />
        ) : currentView === 'recruiter' ? (
          <RecruiterWorkspace
            candidates={allUsers}
            allSkills={allSkills}
            allProjects={allProjects}
            shortlists={shortlists}
            onAddToShortlist={handleAddToShortlist}
            onRemoveFromShortlist={handleRemoveFromShortlist}
            onSelectCandidate={(cand) => {
              setCurrentUser(cand);
              setCurrentView('portfolio');
            }}
            onInspectProject={(pId) => setSelectedProjectId(pId)}
          />
        ) : currentView === 'learning' ? (
          <SkillDevelopmentEngine
            currentUser={currentUser}
            skills={candidateSkills}
            learningPlan={candidatePlan}
            onUpdateMilestoneStatus={handleUpdateMilestoneStatus}
            onRegeneratePlan={handleRegeneratePlan}
            onNavigateToAssessments={() => setCurrentView('assessments')}
          />
        ) : currentView === 'verification' ? (
          <VerificationHub
            currentUser={currentUser}
            candidates={allUsers}
            projects={allProjects}
            endorsements={endorsements}
            auditLogs={auditLogs}
            onAddEndorsement={handleAddEndorsement}
          />
        ) : currentView === 'integrity' ? (
          <IntegrityLab
            findings={integrityFindings}
            onSetDisposition={handleSetDisposition}
          />
        ) : currentView === 'analytics' ? (
          <AnalyticsProgress
            currentUser={currentUser}
            allUsers={allUsers}
            allProjects={allProjects}
            allSubmissions={submissions}
            allEndorsements={endorsements}
          />
        ) : null}
      </main>

      {/* Public Portfolio Modal */}
      {showPublicModal && (
        <PublicPortfolioModal
          user={currentUser}
          skills={candidateSkills}
          projects={candidateProjects}
          endorsements={candidateEndorsements}
          onClose={() => setShowPublicModal(false)}
          onSelectProject={(pId) => {
            setShowPublicModal(false);
            setSelectedProjectId(pId);
          }}
        />
      )}
    </div>
  );
}
