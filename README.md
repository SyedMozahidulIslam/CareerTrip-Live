# CareerTrip Live
### A Verifiable Skills and Project Portfolio Network

CareerTrip Live enables software engineers to prove competence through production-grade projects, practical code assessments, transparent evaluation rubrics, and cryptographically attested endorsements—while equipping technical recruiters to discover candidates based on audited evidence rather than resume claims.

---

## Architecture & System Design

CareerTrip Live is built with a modern full-stack TypeScript architecture:

```
├── server.ts                       # Express full-stack API server + Vite middleware
├── src/
│   ├── types/index.ts              # Core domain models (User, Project, Submission, Rubrics, etc.)
│   ├── data/seedData.ts            # Realistic seed corpus (Distributed Systems, WebGL, CUDA, Fullstack)
│   ├── lib/
│   │   ├── scoring.ts              # Pure business logic: 5-dimension rubric weights, verification tiers,
│   │   │                           # candidate matching algorithm, plagiarism AST/token heuristics
│   │   └── scoring.test.ts         # Fast-feedback unit tests (Node.js test runner)
│   ├── components/
│   │   ├── Navbar.tsx              # Multi-persona switcher, navigation, public view trigger
│   │   ├── CandidatePortfolio.tsx  # Module 1: Verified skill matrix, radar, projects, endorsements
│   │   ├── ProjectEvidenceRoom.tsx # Module 2: Audited code viewer, version history, benchmarks, diffs
│   │   ├── AssessmentLab.tsx       # Module 3 & 4: Role challenges, live code runner, Gemini AI evaluation
│   │   ├── RecruiterWorkspace.tsx  # Module 7: Multi-filter candidate discovery, side-by-side comparison, shortlists
│   │   ├── SkillDevelopmentEngine.tsx # Module 6: Benchmark gap analysis, actionable practice milestones
│   │   ├── IntegrityLab.tsx        # Module 8: Suspicious code detection, token overlap, auditor dispositions
│   │   ├── VerificationHub.tsx     # Module 5: Endorsement registry, Ed25519 signatures, immutable audit logs
│   │   ├── AnalyticsProgress.tsx   # Module 9: Verification tier distributions, trajectory tracking, dossier export
│   │   └── PublicPortfolioModal.tsx# Un-gated public portfolio permalink viewer
│   ├── App.tsx                     # Main application state orchestration
│   └── main.tsx                    # React 19 entry point
```

---

## Core Modules & Features

### 1. Professional Profiles & Verification Tiers
- **Strict Evidence Standard**: Unverified claims are **never** labeled as verified.
- **Verification Tiers**:
  - `Evaluator Certified`: Requires &ge; 2 rigorous practical assessments (&ge; 80%) + verified employer endorsement.
  - `Employer Verified`: Direct engineering manager / VP attestation with commit review.
  - `Peer Reviewed`: &ge; 2 endorsements from open source maintainers or senior peers.
  - `Unverified`: Self-reported skills awaiting practical evaluation.
- Public/Private profile visibility toggle and shareable permalink URLs (`?view=portfolio&handle=maya_lin`).

### 2. Project Evidence Rooms
- Deep inspection into real production systems:
  - **ChronosDB**: Raft Consensus & Sharded Storage Engine (Go/Rust, Jepsen partition tests, pipelined replication).
  - **CanvasFlow**: 60 FPS WebGL Graph Engine (GLSL shaders, quadtree spatial indexing, Yjs CRDTs).
  - **VektorStream**: Lock-Free Streaming Vector Indexer (CUDA, Rust, AVX-512 distance calculations).
  - **TaskPulse**: Real-Time Kanban with Offline Sync (IndexedDB queue, conflict resolution).
- Interactive Code & Benchmark viewer with line numbers and architectural rationale.
- Version history with semantic releases (`v1.0.0`, `v1.1.0`, `v1.2.0`) and differential summaries.

### 3. Practical Assessments & Gemini Rubric Evaluation
- Role-specific engineering challenges with scenario, invariants, starter code, and test cases.
- **Gemini Dynamic Challenge Generator**: Create custom real-world challenges for any technology or seniority level.
- **5-Dimension Structured Rubric**:
  - Correctness (35%)
  - System Architecture & Resiliency (25%)
  - Algorithmic & Implementation Quality (20%)
  - Edge Cases & Defensive Handling (10%)
  - Technical Communication & Rationale (10%)
- **Deterministic Test Runner**: Live evaluation of candidate solution assertions before final submission.
- **Independent Human Evaluator Sign-off**: Certified reviewers audit and endorse submissions.

### 4. Recruiter Discovery Workspace
- Faceted candidate discovery by skill, target role, verification tier, and minimum verified score.
- **Candidate Comparison Matrix**: Select up to 3 candidates for side-by-side comparison across verified scores, project artifacts, and endorsement credentials.
- **Shortlist Pipeline**: Organize candidates by recruitment stage (`discovered`, `reviewing_evidence`, `shortlisted`, `interview_scheduled`) with private notes.

### 5. Integrity and Fraud Defense
- Identifies token overlap, synthetic AI template artifacts, and cross-corpus code duplication.
- Provides evidence and confidence percentages for human auditor review instead of automated disqualification.
- Human disposition workflow: "Clear as False Positive", "Request Live Evidence Defense", or commit auditor notes.

### 6. Skill Development Engine & Milestones
- Compares candidate evidence against target engineering benchmarks.
- Classifies deficits into Critical, Recommended, and Optional priorities.
- Generates tailored practice tasks and tracks progress dynamically when milestones are completed.

### 7. Verification Hub & Immutable Audit Logs
- Cryptographically signed endorsements (Ed25519 signature hashes).
- Chronological append-only audit trail logging all submissions, reviews, and status updates.

### 8. Analytics & Exportable Verifiable Dossier
- Visual breakdown of verification tiers across the candidate pool.
- One-click export of candidate evidence dossier as JSON/PDF-ready format.

---

## Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
# Gemini API Key (Server-Side only)
GEMINI_API_KEY="your-gemini-api-key"

# Application hosting URL (Cloud Run / Local)
APP_URL="http://localhost:3000"
```

*Note: If `GEMINI_API_KEY` is not present, CareerTrip Live uses deterministic AI and rubric evaluation fallbacks so all modules remain 100% operational.*

---

## Firebase Integration Setup (Optional / Production)

To configure Firebase Firestore and Authentication:
1. Set up a project in the Firebase Console.
2. Add your Firebase credentials to `firebase-applet-config.json`.
3. Firestore rules are prepared in `firestore.rules`:
   - Role-based security for candidates, recruiters, and evaluators.
   - Restricts modification of `verifiedTier` to authenticated reviewer/admin roles.
   - Secures private recruiter notes and draft submissions.

---

## Verification & Testing

Run the decoupled pure logic unit test suite:

```bash
npx --yes tsx --test src/lib/scoring.test.ts
```

All 6 test suites verify:
- Rubric weighting arithmetic and 0-100 boundary clamping.
- Strict tier gating (preventing unverified claims from being certified).
- Recruiter matching percentages and verified skill requirements.
- Token overlap and plagiarism heuristic detection.
- Learning plan priority rankings.

Build the application for production:

```bash
npm run build
```

Run in development mode:

```bash
npm run dev
```

---

## Known Considerations & Design Decisions
- **Safe Code Execution**: Arbitrary candidate code is evaluated via static inspection, deterministic assertion checks, and sandboxed simulation. Untrusted code is never executed directly in the host server context.
- **Human-in-the-Loop AI**: AI scores serve as recommendations; official verified tier status requires evaluator certification or signed employer endorsement.
