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
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user_maya',
    name: 'Maya Lin',
    handle: 'maya_lin',
    email: 'maya.lin@distributed.dev',
    role: 'candidate',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    headline: 'Staff Distributed Systems Engineer | Raft & Sharded Storage Architect',
    bio: '8+ years designing fault-tolerant consensus systems, distributed log engines, and sub-millisecond key-value storage. Author of ChronosDB.',
    location: 'Seattle, WA (Remote)',
    targetRole: 'Principal Systems Architect',
    yearsExperience: 8,
    publicProfile: true,
    verifiedTier: 'Evaluator Certified',
    overallScore: 94,
    githubUrl: 'https://github.com/maya-lin',
    portfolioUrl: 'https://mayalin.systems',
    linkedinUrl: 'https://linkedin.com/in/mayalin-systems',
  },
  {
    id: 'user_alex',
    name: 'Alex Rivera',
    handle: 'alex_rivera',
    email: 'alex@canvasflow.io',
    role: 'candidate',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    headline: 'Senior Frontend Architect | WebGL, Canvas Engines & Realtime Sync',
    bio: 'Building 60 FPS collaborative graphic surfaces and offline-first state machines. Led performance optimization at scale.',
    location: 'San Francisco, CA',
    targetRole: 'Staff Frontend Engineer',
    yearsExperience: 6,
    publicProfile: true,
    verifiedTier: 'Employer Verified',
    overallScore: 89,
    githubUrl: 'https://github.com/alexrivera-ui',
    portfolioUrl: 'https://alexrivera.design',
  },
  {
    id: 'user_samira',
    name: 'Samira Patel',
    handle: 'samira_patel',
    email: 'samira.patel@tensorstream.ai',
    role: 'candidate',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    headline: 'AI Infrastructure & ML Platform Specialist | Vector Search & KV Cache',
    bio: 'Bridging low-latency C++/CUDA inference engines with distributed streaming pipelines. Open source contributor to vector indexing algorithms.',
    location: 'Boston, MA (Hybrid)',
    targetRole: 'Senior ML Systems Engineer',
    yearsExperience: 5,
    publicProfile: true,
    verifiedTier: 'Peer Reviewed',
    overallScore: 86,
    githubUrl: 'https://github.com/spatel-ai',
  },
  {
    id: 'user_jordan',
    name: 'Jordan Hayes',
    handle: 'jordan_hayes',
    email: 'jordan@hayescodes.net',
    role: 'candidate',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    headline: 'Full Stack Product Engineer | React, TypeScript & Microservices',
    bio: 'Passionate about human-centered product development and clean code. Transitioning from mid-level to senior full stack responsibilities.',
    location: 'Austin, TX',
    targetRole: 'Senior Full Stack Engineer',
    yearsExperience: 3,
    publicProfile: true,
    verifiedTier: 'Unverified',
    overallScore: 68,
    githubUrl: 'https://github.com/jordanhayes',
  },
  {
    id: 'user_recruiter',
    name: 'Sarah Chen',
    handle: 'sarah_nexus',
    email: 'schen@nexus-talent.com',
    role: 'recruiter',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    headline: 'Lead Technical Talent Partner at Nexus Systems Group',
    bio: 'Scouting top 1% systems and frontend engineers with verifiable production track records.',
    location: 'New York, NY',
    targetRole: 'Recruiting Lead',
    yearsExperience: 10,
    publicProfile: false,
    verifiedTier: 'Evaluator Certified',
    overallScore: 98,
  },
  {
    id: 'user_evaluator',
    name: 'Dr. Marcus Vance',
    handle: 'marcus_vance',
    email: 'mvance@acm-evaluations.org',
    role: 'reviewer',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    headline: 'Senior Systems Evaluator & Verification Fellow',
    bio: 'Independent code auditor and technical evaluation council reviewer. Focus on consensus algorithms and zero-trust verification.',
    location: 'Boulder, CO',
    targetRole: 'Principal Evaluator',
    yearsExperience: 14,
    publicProfile: true,
    verifiedTier: 'Evaluator Certified',
    overallScore: 99,
  }
];

export const SEED_SKILLS: Record<string, SkillItem[]> = {
  user_maya: [
    {
      id: 'sk_m1',
      name: 'Distributed Consensus (Raft/Paxos)',
      category: 'Distributed Systems',
      proficiency: 5,
      verifiedScore: 96,
      verificationLevel: 'Evaluator Certified',
      evidenceCount: 4,
      lastAssessedAt: '2026-09-14',
      endorsementsCount: 3,
    },
    {
      id: 'sk_m2',
      name: 'Go & Rust Systems Programming',
      category: 'Backend & Cloud',
      proficiency: 5,
      verifiedScore: 94,
      verificationLevel: 'Evaluator Certified',
      evidenceCount: 5,
      lastAssessedAt: '2026-09-14',
      endorsementsCount: 2,
    },
    {
      id: 'sk_m3',
      name: 'LSM-Tree & KV Storage Engines',
      category: 'Distributed Systems',
      proficiency: 5,
      verifiedScore: 93,
      verificationLevel: 'Employer Verified',
      evidenceCount: 3,
      lastAssessedAt: '2026-08-20',
      endorsementsCount: 2,
    },
    {
      id: 'sk_m4',
      name: 'Zero-Allocation Network Protocols',
      category: 'Architecture & Security',
      proficiency: 4,
      verifiedScore: 90,
      verificationLevel: 'Evaluator Certified',
      evidenceCount: 2,
      lastAssessedAt: '2026-09-14',
      endorsementsCount: 1,
    },
  ],
  user_alex: [
    {
      id: 'sk_a1',
      name: 'Canvas & WebGL Engine Architecture',
      category: 'Frontend Core',
      proficiency: 5,
      verifiedScore: 92,
      verificationLevel: 'Employer Verified',
      evidenceCount: 4,
      lastAssessedAt: '2026-10-02',
      endorsementsCount: 2,
    },
    {
      id: 'sk_a2',
      name: 'TypeScript & State Machine Patterns',
      category: 'Frontend Core',
      proficiency: 5,
      verifiedScore: 90,
      verificationLevel: 'Employer Verified',
      evidenceCount: 3,
      lastAssessedAt: '2026-10-02',
      endorsementsCount: 1,
    },
    {
      id: 'sk_a3',
      name: 'Real-time CRDT Collaboration',
      category: 'Distributed Systems',
      proficiency: 4,
      verifiedScore: 85,
      verificationLevel: 'Peer Reviewed',
      evidenceCount: 2,
      lastAssessedAt: '2026-07-15',
      endorsementsCount: 2,
    },
  ],
  user_samira: [
    {
      id: 'sk_s1',
      name: 'Vector Indexing (HNSW / IVFPQ)',
      category: 'AI & ML',
      proficiency: 5,
      verifiedScore: 89,
      verificationLevel: 'Peer Reviewed',
      evidenceCount: 3,
      lastAssessedAt: '2026-09-29',
      endorsementsCount: 2,
    },
    {
      id: 'sk_s2',
      name: 'CUDA / C++ Inference Pipelines',
      category: 'AI & ML',
      proficiency: 4,
      verifiedScore: 84,
      verificationLevel: 'Peer Reviewed',
      evidenceCount: 2,
      lastAssessedAt: '2026-09-29',
      endorsementsCount: 1,
    },
  ],
  user_jordan: [
    {
      id: 'sk_j1',
      name: 'React 19 & TypeScript UI',
      category: 'Frontend Core',
      proficiency: 4,
      verificationLevel: 'Unverified',
      evidenceCount: 1,
      endorsementsCount: 0,
    },
    {
      id: 'sk_j2',
      name: 'REST & GraphQL API Design',
      category: 'Backend & Cloud',
      proficiency: 3,
      verificationLevel: 'Unverified',
      evidenceCount: 1,
      endorsementsCount: 0,
    },
    {
      id: 'sk_j3',
      name: 'Distributed Systems Architecture',
      category: 'Distributed Systems',
      proficiency: 2,
      verificationLevel: 'Unverified',
      evidenceCount: 0,
      endorsementsCount: 0,
    },
  ]
};

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_chronos',
    userId: 'user_maya',
    title: 'ChronosDB: Raft Consensus & Sharded Log Engine',
    tagline: 'High-throughput linearizable storage engine written in Go with Raft cluster membership changes.',
    description: 'ChronosDB was engineered to support linearizable reads and zero-data-loss failover under simulated network partitions. Handles 180,000 writes/sec on 3-node NVMe instances with sub-2ms commit latency.',
    problemStatement: 'Existing key-value storage lacked deterministic verification of split-brain edge cases during rapid leader re-election, risking dirty reads and stale cluster state.',
    architectureOverview: 'Implemented Raft 2.0 consensus with pipelined append entries, asynchronous disk fsync batching, and an LSM-tree storage layout with zero-allocation memory pooling.',
    techStack: ['Go', 'Raft Protocol', 'RocksDB', 'gRPC', 'Prometheus', 'Jepsen Testing'],
    liveUrl: 'https://chronos-benchmarks.demo',
    repoUrl: 'https://github.com/maya-lin/chronosdb-raft',
    verifiedStatus: 'Evaluator Certified',
    starsCount: 342,
    createdAt: '2026-02-10',
    updatedAt: '2026-09-18',
    versionHistory: [
      {
        version: 'v1.2.0',
        releaseDate: '2026-09-18',
        notes: 'Pipelined log replication with zero-copy socket buffers; verified by Jepsen network partition test suite.',
        diffSummary: 'Added raft_pipeline.go with ring buffer, removed 4 allocations per message.',
        commitHash: '8f4a1c0d',
      },
      {
        version: 'v1.1.0',
        releaseDate: '2026-05-30',
        notes: 'Dynamic cluster membership joint consensus algorithm.',
        diffSummary: 'Implemented joint consensus transition states and membership voting quorum.',
        commitHash: '5e2b79a1',
      },
      {
        version: 'v1.0.0',
        releaseDate: '2026-02-10',
        notes: 'Initial production baseline Raft engine.',
        diffSummary: 'Base commit with leader election and log compaction snapshots.',
        commitHash: '1a9f30cd',
      }
    ],
    evidenceFiles: [
      {
        id: 'ev_c1',
        name: 'raft_pipelined_transport.go',
        type: 'code',
        language: 'go',
        explanation: 'Core ring buffer transport handling out-of-order acknowledgment and pipelined RPCs.',
        verifiedStatus: 'verified',
        contentOrUrl: `// Pipelined Raft Log Streaming Transport
package consensus

import (
  "sync/atomic"
  "time"
)

type PipelineSender struct {
  peerID     uint64
  msgQueue   chan *AppendEntriesRequest
  ackWindow  int64
  inflight   atomic.Int64
}

func (p *PipelineSender) DispatchBatch(entries []*LogEntry, term uint64) error {
  if p.inflight.Load() > p.ackWindow {
    return ErrPipelineWindowExhausted
  }
  p.inflight.Add(1)
  p.msgQueue <- &AppendEntriesRequest{
    Term:         term,
    Entries:      entries,
    TimestampNano: time.Now().UnixNano(),
  }
  return nil
}`,
      },
      {
        id: 'ev_c2',
        name: 'jepsen_partition_benchmark.json',
        type: 'benchmark',
        language: 'json',
        explanation: 'Deterministic Jepsen split-brain partition suite result showing 0 lost writes and 100% linearizability.',
        verifiedStatus: 'verified',
        contentOrUrl: `{
  "nemesis": "split_brain_3_way",
  "operations_tested": 2500000,
  "linearizability": {
    "valid": true,
    "violations": 0,
    "max_stale_read_ms": 0.0
  },
  "p99_latency_ms": 1.84,
  "throughput_ops_per_sec": 184200
}`,
      }
    ],
    keyContributions: [
      {
        id: 'kc_1',
        title: 'Architected and built Pipelined Raft Replication',
        description: 'Designed ring-buffered pipelined transport that reduced replication roundtrip latency from 8.2ms to 1.84ms.',
        verificationStatus: 'employer_verified',
        verifiedBy: 'Dr. Marcus Vance, ACM Evaluation Fellow',
        verifiedAt: '2026-09-15',
      },
      {
        id: 'kc_2',
        title: 'Automated Chaos & Jepsen Verification',
        description: 'Set up continuous cluster partition simulation verifying absence of stale read anomalies across 2.5 million operations.',
        verificationStatus: 'employer_verified',
        verifiedBy: 'Elena Rostova, VP Engineering at VectorScale',
        verifiedAt: '2026-08-10',
      }
    ]
  },
  {
    id: 'proj_canvasflow',
    userId: 'user_alex',
    title: 'CanvasFlow: 60fps WebGL Graph Engine',
    tagline: 'Infinite collaborative canvas capable of rendering 100,000 nodes with real-time CRDT synchronization.',
    description: 'Designed a high-performance graphics pipeline utilizing WebGL instanced rendering, quad-tree spatial indexing, and Yjs CRDTs for frictionless multi-user editing.',
    problemStatement: 'DOM and standard HTML5 2D canvas drop below 15 FPS when visualizing graphs exceeding 5,000 nodes with active collaborative pointers.',
    architectureOverview: 'Custom WebGL vertex shader instancing batching draw calls into a single render pass. Spatial partitioning with a dynamic PR-quadtree keeps viewport culling under 0.8ms.',
    techStack: ['TypeScript', 'WebGL 2.0', 'GLSL', 'Yjs CRDT', 'WebSockets', 'Vite'],
    liveUrl: 'https://canvasflow-demo.app',
    repoUrl: 'https://github.com/alexrivera-ui/canvasflow',
    verifiedStatus: 'Employer Verified',
    starsCount: 512,
    createdAt: '2026-03-01',
    updatedAt: '2026-10-05',
    versionHistory: [
      {
        version: 'v2.1.0',
        releaseDate: '2026-10-05',
        notes: 'Added GPU-accelerated bezier edge routing and multi-user cursor heatmaps.',
        commitHash: '3c8e41bf',
      },
      {
        version: 'v2.0.0',
        releaseDate: '2026-06-12',
        notes: 'Migrated from 2D canvas context to WebGL 2 instanced mesh pipeline.',
        commitHash: '9a11ef02',
      }
    ],
    evidenceFiles: [
      {
        id: 'ev_cf1',
        name: 'instanced_nodes.vert',
        type: 'code',
        language: 'glsl',
        explanation: 'GLSL shader packing node coordinates, radius, and color into single 32-byte uniform attributes.',
        verifiedStatus: 'verified',
        contentOrUrl: `#version 300 es
layout(location = 0) in vec2 a_quad;
layout(location = 1) in vec4 a_instance_pos_size;
layout(location = 2) in vec4 a_instance_color;

uniform mat3 u_matrix;
out vec4 v_color;

void main() {
  vec2 pos = a_instance_pos_size.xy + (a_quad * a_instance_pos_size.zw);
  gl_Position = vec4((u_matrix * vec3(pos, 1.0)).xy, 0.0, 1.0);
  v_color = a_instance_color;
}`,
      }
    ],
    keyContributions: [
      {
        id: 'kc_cf1',
        title: 'Single-Pass WebGL Node Renderer',
        description: 'Replaced SVG/DOM graph with instanced WebGL rendering, maintaining steady 60 FPS on 100k nodes.',
        verificationStatus: 'employer_verified',
        verifiedBy: 'Senior Staff Frontend Architect, Miro Alum',
        verifiedAt: '2026-10-06',
      }
    ]
  },
  {
    id: 'proj_vektorstream',
    userId: 'user_samira',
    title: 'VektorStream: Streaming Vector Indexer',
    tagline: 'Asynchronous streaming vector ingestion engine for dense embeddings with lock-free graph updates.',
    description: 'Enables real-time ingestion of high-dimensional embeddings (1536d) with sub-10ms insertion latency without locking the global nearest neighbor index.',
    problemStatement: 'Standard vector databases stall queries during bulk batch insertion due to exclusive read/write locks on graph edges.',
    architectureOverview: 'Lock-free Hierarchical Navigable Small World (HNSW) graph with double-buffered edge lists and SIMD AVX-512 distance calculations.',
    techStack: ['C++', 'Rust', 'CUDA', 'Python', 'Apache Arrow', 'gRPC'],
    repoUrl: 'https://github.com/spatel-ai/vektorstream',
    verifiedStatus: 'Peer Reviewed',
    starsCount: 189,
    createdAt: '2026-04-18',
    updatedAt: '2026-09-28',
    versionHistory: [
      {
        version: 'v0.9.4',
        releaseDate: '2026-09-28',
        notes: 'SIMD AVX-512 cosine distance acceleration kernel with 3.4x throughput boost.',
        commitHash: '7d3290ab',
      }
    ],
    evidenceFiles: [
      {
        id: 'ev_vs1',
        name: 'hnsw_lockfree_graph.rs',
        type: 'code',
        language: 'rust',
        explanation: 'Lock-free atomic pointer swap for incoming neighbor edge lists.',
        verifiedStatus: 'verified',
        contentOrUrl: `// Lock-Free HNSW Neighbor Updating
use std::sync::atomic::{AtomicPtr, Ordering};

pub struct AtomicNeighborList {
  head: AtomicPtr<Vec<u32>>,
}

impl AtomicNeighborList {
  pub fn swap_neighbors(&self, new_neighbors: Vec<u32>) {
    let boxed = Box::into_raw(Box::new(new_neighbors));
    let prev = self.head.swap(boxed, Ordering::AcqRel);
    if !prev.is_null() {
      unsafe { drop(Box::from_raw(prev)); }
    }
  }
}`,
      }
    ],
    keyContributions: [
      {
        id: 'kc_vs1',
        title: 'Lock-Free HNSW Insertion Mechanism',
        description: 'Devised atomic double-buffered neighbor edge swap preserving 99.8% recall during concurrent query spikes.',
        verificationStatus: 'peer_endorsed',
        verifiedBy: 'Maintainer of Faiss Rust Bindings',
        verifiedAt: '2026-09-30',
      }
    ]
  },
  {
    id: 'proj_taskpulse',
    userId: 'user_jordan',
    title: 'TaskPulse: Real-Time Kanban with Offline Sync',
    tagline: 'Collaborative task board with IndexedDB local caching and optimistic UI updates.',
    description: 'A responsive Kanban board supporting drag-and-drop task workflows, optimistic conflict resolution, and background sync when reconnecting to network.',
    problemStatement: 'Team members working in low-connectivity environments frequently lose drafted updates or encounter desync clashes.',
    architectureOverview: 'Client-side state managed via Zustand and IndexedDB sync adapter, communicating with a Node.js Express API and PostgreSQL database.',
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Node.js', 'IndexedDB', 'PostgreSQL'],
    repoUrl: 'https://github.com/jordanhayes/taskpulse',
    verifiedStatus: 'Unverified',
    starsCount: 24,
    createdAt: '2026-08-01',
    updatedAt: '2026-09-12',
    versionHistory: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-09-12',
        notes: 'Initial release with drag-and-drop and offline persistence.',
        commitHash: '2f114e90',
      }
    ],
    evidenceFiles: [
      {
        id: 'ev_tp1',
        name: 'syncQueue.ts',
        type: 'code',
        language: 'typescript',
        explanation: 'Local queue processor that dispatches stored offline mutations sequentially upon online event.',
        verifiedStatus: 'unverified',
        contentOrUrl: `export class SyncQueue {
  private queue: Array<{ id: string; action: string; payload: any }> = [];

  enqueue(mutation: { id: string; action: string; payload: any }) {
    this.queue.push(mutation);
    localStorage.setItem('tp_sync_queue', JSON.stringify(this.queue));
  }

  async flush(apiEndpoint: string) {
    while (this.queue.length > 0) {
      const item = this.queue[0];
      await fetch(apiEndpoint, { method: 'POST', body: JSON.stringify(item) });
      this.queue.shift();
    }
  }
}`,
      }
    ],
    keyContributions: [
      {
        id: 'kc_tp1',
        title: 'Offline Sync Queue & IndexedDB Layer',
        description: 'Implemented queue for buffering offline actions and replaying on reconnect.',
        verificationStatus: 'self_reported',
      }
    ]
  }
];

export const SEED_CHALLENGES: AssessmentChallenge[] = [
  {
    id: 'chal_dist_sharded',
    roleCategory: 'Distributed Systems',
    title: 'Distributed Key-Value Store with Linearizable Rebalancing',
    difficulty: 'Staff',
    durationMinutes: 45,
    language: 'typescript',
    scenario: 'You are designing the coordinator node for a distributed key-value cluster that shards data across 5 storage nodes using consistent hashing. A node partition has occurred, causing two storage nodes to fail heartbeats while 3 continue. Your task is to implement the safe rebalancing algorithm that migrates keys to active replica nodes without violating read linearizability or serving stale data.',
    instructions: [
      '1. Implement `rebalanceCluster(activeNodes, failedNodes, keyspaceMap)` to compute the minimum key migrations required.',
      '2. Guard against split-brain scenarios: if activeNodes does not constitute a strict quorum (> 50% of total original nodes), throw a QuorumUnavailableException.',
      '3. Implement `resolveReadQuorum(key, replicaResponses)` to pick the version with the highest monotonic timestamp, rejecting uncommitted writes.',
      '4. Ensure memory efficiency: do not clone or mutate the entire cluster keyspace in-place.'
    ],
    starterCode: `/**
 * Distributed Sharded Rebalancing Challenge
 * Implement safe linearizable keyspace partition recovery.
 */

export interface KeyRecord {
  key: string;
  value: string;
  version: number;
  committed: boolean;
}

export interface RebalancePlan {
  quorumSatisfied: boolean;
  migrations: { key: string; fromNode: string; toNode: string }[];
  activeQuorumSize: number;
}

export class DistributedCoordinator {
  private totalClusterNodes: number;

  constructor(totalClusterNodes: number = 5) {
    this.totalClusterNodes = totalClusterNodes;
  }

  /**
   * Evaluates if strict majority quorum is present and plans key movement.
   */
  public rebalanceCluster(
    activeNodes: string[],
    failedNodes: string[],
    keyspace: Map<string, string> // key -> currentNode
  ): RebalancePlan {
    // TODO: Verify quorum (> totalNodes / 2)
    // TODO: Calculate new node mappings using consistent hash distribution
    // TODO: Return structured rebalance plan
    throw new Error('Not implemented');
  }

  /**
   * Resolves a read across multiple replica responses enforcing monotonic linearizability.
   */
  public resolveReadQuorum(
    key: string,
    replicaResponses: { node: string; record: KeyRecord | null }[]
  ): KeyRecord {
    // TODO: Return newest committed record, discard uncommitted
    throw new Error('Not implemented');
  }
}`,
    testCases: [
      {
        id: 'tc_1',
        inputDesc: '3 active nodes out of 5 total nodes (Quorum Satisfied)',
        expectedOutputDesc: 'quorumSatisfied: true, migrations calculated, activeQuorumSize: 3',
        sampleInput: 'activeNodes: ["n1", "n2", "n3"], failedNodes: ["n4", "n5"]',
        sampleOutput: '{ quorumSatisfied: true, migrations: [...], activeQuorumSize: 3 }',
      },
      {
        id: 'tc_2',
        inputDesc: '2 active nodes out of 5 total nodes (Quorum Lost)',
        expectedOutputDesc: 'Throws QuorumUnavailableException or returns quorumSatisfied: false with 0 migrations',
        sampleInput: 'activeNodes: ["n1", "n2"], failedNodes: ["n3", "n4", "n5"]',
        sampleOutput: '{ quorumSatisfied: false, migrations: [], activeQuorumSize: 2 }',
      },
      {
        id: 'tc_3',
        inputDesc: 'Read resolution across 3 replicas with 1 uncommitted higher timestamp',
        expectedOutputDesc: 'Selects the highest version that has committed: true',
        sampleInput: 'Replicas: [{ver: 2, committed: true}, {ver: 3, committed: false}]',
        sampleOutput: '{ key: "foo", version: 2, committed: true }',
      }
    ],
    evaluationRubric: [
      {
        dimension: 'correctness',
        name: 'Consensus Correctness & Quorum Logic',
        description: 'Accurately detects quorum availability and prevents split-brain partition writes.',
        maxPoints: 35,
      },
      {
        dimension: 'architecture',
        name: 'System Design & Resiliency',
        description: 'Clean separation between routing, quorum checks, and failure recovery policies.',
        maxPoints: 25,
      },
      {
        dimension: 'implementation',
        name: 'Algorithmic Quality & Clean TypeScript',
        description: 'Efficient hashing or node mapping, robust types, and readable control flow.',
        maxPoints: 20,
      },
      {
        dimension: 'edge_cases',
        name: 'Edge Case & Fault Handling',
        description: 'Gracefully handles empty keyspaces, zero active nodes, and uncommitted log entries.',
        maxPoints: 10,
      },
      {
        dimension: 'communication',
        name: 'Architectural Rationale Clarity',
        description: 'Clear written rationale explaining safety invariants and fault assumptions.',
        maxPoints: 10,
      }
    ],
    createdAt: '2026-08-15',
  },
  {
    id: 'chal_frontend_virtual',
    roleCategory: 'Frontend Core',
    title: 'Virtualized Infinite List with Dynamic Heights & Memory Windowing',
    difficulty: 'Senior',
    durationMinutes: 40,
    language: 'typescript',
    scenario: 'A high-velocity dashboard renders 50,000 live log messages with variable heights (ranging from 32px single-line logs to 400px stack traces). Standard virtualization libraries cause scroll jumping when dynamic heights are measured after DOM insertion. Implement a virtualization engine with an anchored binary-search offset tree and buffer prefetching.',
    instructions: [
      '1. Calculate the visible item slice (startIndex, endIndex) based on scrollTop and viewportHeight.',
      '2. Cache estimated heights and update offsets dynamically when true DOM heights are measured.',
      '3. Maintain scroll anchor: when items above the viewport expand or contract, adjust scrollTop compensation so the user view never jumps.',
      '4. Keep compute complexity for visible range search at O(log N).'
    ],
    starterCode: `/**
 * Virtualized Dynamic Height Windowing
 */

export interface VirtualItem {
  index: number;
  offsetY: number;
  measuredHeight: number;
}

export class VirtualScroller {
  private itemCount: number;
  private defaultHeight: number;
  private heightCache: Map<number, number>;
  private offsetPrefixSums: number[];

  constructor(itemCount: number, defaultHeight: number = 40) {
    this.itemCount = itemCount;
    this.defaultHeight = defaultHeight;
    this.heightCache = new Map();
    this.offsetPrefixSums = new Array(itemCount).fill(0);
    this.recomputeOffsets();
  }

  public getVisibleRange(
    scrollTop: number,
    viewportHeight: number,
    overscan: number = 3
  ): { startIndex: number; endIndex: number; totalHeight: number } {
    // TODO: Binary search for startIndex where offset >= scrollTop
    // TODO: Binary search for endIndex where offset >= scrollTop + viewportHeight
    throw new Error('Not implemented');
  }

  public updateMeasuredHeight(index: number, newHeight: number): number {
    // TODO: Update height cache and return scroll adjustment delta if index < currentAnchor
    throw new Error('Not implemented');
  }

  private recomputeOffsets(): void {
    let running = 0;
    for (let i = 0; i < this.itemCount; i++) {
      this.offsetPrefixSums[i] = running;
      const h = this.heightCache.get(i) ?? this.defaultHeight;
      running += h;
    }
  }
}`,
    testCases: [
      {
        id: 'vt_1',
        inputDesc: '50,000 items with default 40px, scrollTop 400, viewportHeight 600',
        expectedOutputDesc: 'startIndex: 10, endIndex: 25, totalHeight: 2,000,000',
      },
      {
        id: 'vt_2',
        inputDesc: 'Height expansion of item 5 from 40px to 140px (+100px delta)',
        expectedOutputDesc: 'Offset updates propagate correctly to items 6..N without reallocating 50k objects',
      }
    ],
    evaluationRubric: [
      { dimension: 'correctness', name: 'Virtual Window Calculation', description: 'Accurate start and end index slice without missing rows.', maxPoints: 35 },
      { dimension: 'architecture', name: 'Offset Indexing & Binary Search', description: 'O(log N) search performance with prefix sums.', maxPoints: 25 },
      { dimension: 'implementation', name: 'Memory & Garbage Collection Awareness', description: 'Zero array re-allocations on frequent scroll events.', maxPoints: 20 },
      { dimension: 'edge_cases', name: 'Scroll Jump Prevention', description: 'Maintains stable anchor during dynamic async content measurements.', maxPoints: 10 },
      { dimension: 'communication', name: 'Design Rationale', description: 'Explanation of layout thrashing and DOM recycling strategies.', maxPoints: 10 },
    ],
    createdAt: '2026-09-01',
  },
  {
    id: 'chal_security_rbac',
    roleCategory: 'Architecture & Security',
    title: 'Zero-Trust Role-Based Access Engine with Row-Level Filtering',
    difficulty: 'Senior',
    durationMinutes: 35,
    language: 'typescript',
    scenario: 'Implement a fine-grained enterprise authorization engine that evaluates permissions based on Subject, Action, Resource, and Contextual Attributes (ABAC). The engine must enforce row-level tenant isolation, attribute conditions (e.g. maxExportLimit, ipSubnet, clearanceLevel), and audit all access evaluations.',
    instructions: [
      '1. Implement `evaluateAccess(subject, action, resource, context): AuthDecision`.',
      '2. Apply strict default-deny semantics: any missing permission or condition mismatch results in denial.',
      '3. Support wildcard tenant scopes while preventing privilege escalation across organizations.',
      '4. Generate an auditable immutable log entry for each evaluation.'
    ],
    starterCode: `/**
 * Zero-Trust ABAC / RBAC Policy Engine
 */

export interface Subject {
  userId: string;
  orgId: string;
  roles: string[];
  clearanceLevel: number;
}

export interface AuthContext {
  clientIp: string;
  requestTimeIso: string;
  targetTenantId: string;
}

export interface AuthDecision {
  allowed: boolean;
  reason: string;
  policyId?: string;
  auditRecordHash: string;
}

export class PolicyEngine {
  // TODO: Implement policy evaluation with default-deny semantics
  public evaluateAccess(
    subject: Subject,
    action: string,
    resource: string,
    context: AuthContext
  ): AuthDecision {
    throw new Error('Not implemented');
  }
}`,
    testCases: [
      {
        id: 'sec_1',
        inputDesc: 'Cross-tenant request where subject.orgId does not match context.targetTenantId',
        expectedOutputDesc: 'allowed: false, reason: "Cross-tenant access violation"',
      },
      {
        id: 'sec_2',
        inputDesc: 'Subject with "admin" role within matching tenant',
        expectedOutputDesc: 'allowed: true with verified auditRecordHash',
      }
    ],
    evaluationRubric: [
      { dimension: 'correctness', name: 'Default-Deny Authorization', description: 'Blocks any unauthorized action without false positives.', maxPoints: 35 },
      { dimension: 'architecture', name: 'Zero-Trust Tenant Boundary', description: 'Robust isolation of tenant records.', maxPoints: 25 },
      { dimension: 'implementation', name: 'Cryptographic Audit Hashing', description: 'Generates deterministic tamper-evident audit identifiers.', maxPoints: 20 },
      { dimension: 'edge_cases', name: 'Role Escalation Defense', description: 'Prevents bypasses using nested wildcard permissions.', maxPoints: 10 },
      { dimension: 'communication', name: 'Security Posture Documentation', description: 'Clear documentation of security model assumptions.', maxPoints: 10 },
    ],
    createdAt: '2026-09-10',
  }
];

export const SEED_SUBMISSIONS: AssessmentSubmission[] = [
  {
    id: 'sub_maya_1',
    challengeId: 'chal_dist_sharded',
    challengeTitle: 'Distributed Key-Value Store with Linearizable Rebalancing',
    candidateId: 'user_maya',
    candidateName: 'Maya Lin',
    candidateHandle: 'maya_lin',
    codeSolution: `export class DistributedCoordinator {
  private totalClusterNodes: number;

  constructor(totalClusterNodes: number = 5) {
    this.totalClusterNodes = totalClusterNodes;
  }

  public rebalanceCluster(activeNodes: string[], failedNodes: string[], keyspace: Map<string, string>): RebalancePlan {
    const quorumThreshold = Math.floor(this.totalClusterNodes / 2) + 1;
    if (activeNodes.length < quorumThreshold) {
      return {
        quorumSatisfied: false,
        migrations: [],
        activeQuorumSize: activeNodes.length
      };
    }

    const migrations: { key: string; fromNode: string; toNode: string }[] = [];
    const failedSet = new Set(failedNodes);

    keyspace.forEach((currentNode, key) => {
      if (failedSet.has(currentNode)) {
        // Deterministic hash assignment to active nodes
        const hash = this.hashString(key);
        const targetIndex = Math.abs(hash) % activeNodes.length;
        const targetNode = activeNodes[targetIndex];
        migrations.push({ key, fromNode: currentNode, toNode: targetNode });
      }
    });

    return {
      quorumSatisfied: true,
      migrations,
      activeQuorumSize: activeNodes.length
    };
  }

  public resolveReadQuorum(key: string, replicaResponses: { node: string; record: KeyRecord | null }[]): KeyRecord {
    let newestCommitted: KeyRecord | null = null;
    for (const item of replicaResponses) {
      if (!item.record || !item.record.committed) continue;
      if (!newestCommitted || item.record.version > newestCommitted.version) {
        newestCommitted = item.record;
      }
    }
    if (!newestCommitted) {
      throw new Error("No committed replica record found for key: " + key);
    }
    return newestCommitted;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}`,
    architecturalRationale: 'Ensures safety first: if activeNodes does not meet majority threshold (total/2 + 1), rebalancing halts immediately to avoid partition divergence. Key distribution uses consistent integer hashing. Reads strictly ignore uncommitted replicas to maintain linearizable read consistency.',
    timeSpentSeconds: 1420,
    submittedAt: '2026-09-14T15:30:00Z',
    status: 'human_verified',
    aiEvaluation: {
      overallScore: 94,
      dimensionScores: {
        correctness: 96,
        architecture: 94,
        implementation: 92,
        edge_cases: 92,
        communication: 96,
      },
      feedback: 'Exceptional submission demonstrating deep understanding of distributed consensus invariants. Strict quorum gating correctly halts split-brain propagation.',
      strengths: [
        'Strict majority quorum check (floor(N/2)+1) correctly enforced',
        'Uncommitted reads strictly filtered out during read quorum resolution',
        'Clean deterministic hashing without mutation of input collections'
      ],
      weaknesses: [
        'Could include a virtual node factor in consistent hashing to balance skew among remaining active nodes'
      ],
      potentialPlagiarismScore: 3,
      notes: 'No duplication or boilerplate anomalies detected.'
    },
    humanReview: {
      reviewerName: 'Dr. Marcus Vance',
      reviewerRole: 'ACM Systems Evaluator & Verification Fellow',
      verifiedScore: 95,
      dimensionScores: {
        correctness: 97,
        architecture: 95,
        implementation: 94,
        edge_cases: 92,
        communication: 97,
      },
      qualitativeFeedback: 'Verified production-grade implementation. Candidate clearly understands that partition tolerance without majority quorum compromises consistency. Endorsed with Highest Honors.',
      verifiedAt: '2026-09-15T09:12:00Z',
      decision: 'approved'
    },
    testCaseResults: [
      { testCaseId: 'tc_1', inputDesc: '3 active nodes out of 5 total nodes', passed: true, message: 'Quorum established, 18 keys migrated seamlessly.' },
      { testCaseId: 'tc_2', inputDesc: '2 active nodes out of 5 total nodes', passed: true, message: 'Quorum loss correctly identified, halted key migration.' },
      { testCaseId: 'tc_3', inputDesc: 'Read resolution across 3 replicas', passed: true, message: 'Uncommitted version 3 discarded; committed version 2 returned.' }
    ],
    integrityCheck: {
      isSuspicious: false,
      confidence: 97,
      flags: [],
      similarityNotes: 'Original human-written structure; zero overlap with public solutions.'
    }
  },
  {
    id: 'sub_alex_1',
    challengeId: 'chal_frontend_virtual',
    challengeTitle: 'Virtualized Infinite List with Dynamic Heights & Memory Windowing',
    candidateId: 'user_alex',
    candidateName: 'Alex Rivera',
    candidateHandle: 'alex_rivera',
    codeSolution: `export class VirtualScroller {
  private itemCount: number;
  private defaultHeight: number;
  private heightCache: Map<number, number> = new Map();
  private prefixSums: number[];

  constructor(itemCount: number, defaultHeight: number = 40) {
    this.itemCount = itemCount;
    this.defaultHeight = defaultHeight;
    this.prefixSums = new Array(itemCount + 1).fill(0);
    this.recompute();
  }

  public getVisibleRange(scrollTop: number, viewportHeight: number, overscan: number = 3) {
    const rawStart = this.binarySearch(scrollTop);
    const rawEnd = this.binarySearch(scrollTop + viewportHeight);
    const startIndex = Math.max(0, rawStart - overscan);
    const endIndex = Math.min(this.itemCount - 1, rawEnd + overscan);
    const totalHeight = this.prefixSums[this.itemCount];
    return { startIndex, endIndex, totalHeight };
  }

  public updateMeasuredHeight(index: number, newHeight: number): number {
    const oldHeight = this.heightCache.get(index) ?? this.defaultHeight;
    const delta = newHeight - oldHeight;
    if (delta !== 0) {
      this.heightCache.set(index, newHeight);
      for (let i = index + 1; i <= this.itemCount; i++) {
        this.prefixSums[i] += delta;
      }
    }
    return delta;
  }

  private binarySearch(targetOffset: number): number {
    let low = 0;
    let high = this.itemCount - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (this.prefixSums[mid] < targetOffset) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return Math.max(0, low - 1);
  }

  private recompute() {
    for (let i = 0; i < this.itemCount; i++) {
      const h = this.heightCache.get(i) ?? this.defaultHeight;
      this.prefixSums[i + 1] = this.prefixSums[i] + h;
    }
  }
}`,
    architecturalRationale: 'Employs prefix sum array with binary search (O(log N)) to look up visible item ranges at 60 FPS without layout thrashing. Height updates only patch trailing prefix sum offsets instead of recalculating from scratch.',
    timeSpentSeconds: 1680,
    submittedAt: '2026-10-02T11:20:00Z',
    status: 'human_verified',
    aiEvaluation: {
      overallScore: 89,
      dimensionScores: {
        correctness: 90,
        architecture: 92,
        implementation: 88,
        edge_cases: 85,
        communication: 90,
      },
      feedback: 'Very solid implementation with elegant binary search indexing and minimal garbage collection pressure.',
      strengths: ['O(log N) visible window lookup', 'Clear prefix sum caching'],
      weaknesses: ['Iterating index+1..N on every height update can degrade if all 50k items resize concurrently (could use Fenwick Tree / Binary Indexed Tree)'],
      potentialPlagiarismScore: 5,
      notes: 'Clean idiomatic TypeScript.'
    },
    humanReview: {
      reviewerName: 'Dr. Marcus Vance',
      reviewerRole: 'ACM Systems Evaluator & Verification Fellow',
      verifiedScore: 88,
      dimensionScores: {
        correctness: 89,
        architecture: 91,
        implementation: 86,
        edge_cases: 85,
        communication: 90,
      },
      qualitativeFeedback: 'Approved for production UI architecture. Excellent attention to scroll stability.',
      verifiedAt: '2026-10-02T16:45:00Z',
      decision: 'approved'
    },
    testCaseResults: [
      { testCaseId: 'vt_1', inputDesc: '50,000 items with default 40px', passed: true, message: 'Visible window matched exact pixel slice.' },
      { testCaseId: 'vt_2', inputDesc: 'Height expansion of item 5 (+100px)', passed: true, message: 'Offset updates properly synchronized.' }
    ],
    integrityCheck: {
      isSuspicious: false,
      confidence: 95,
      flags: [],
      similarityNotes: 'Clean, verified submission.'
    }
  }
];

export const SEED_ENDORSEMENTS: Endorsement[] = [
  {
    id: 'end_1',
    candidateId: 'user_maya',
    candidateName: 'Maya Lin',
    projectId: 'proj_chronos',
    projectTitle: 'ChronosDB: Raft Consensus Engine',
    skillName: 'Distributed Consensus (Raft/Paxos)',
    endorserName: 'Elena Rostova',
    endorserRole: 'VP of Engineering',
    endorserCompany: 'VectorScale Systems (former HashiCorp Staff)',
    relationship: 'Manager',
    verifiedSignature: 'sig_ed25519_9bf028ac10e34b9d09c31405e',
    comment: 'Maya was the primary author of our storage engine core. She solved our split-brain edge cases under live chaos injection testing and delivered rock-solid zero-data-loss failover.',
    createdAt: '2026-08-10T14:00:00Z',
    status: 'active',
  },
  {
    id: 'end_2',
    candidateId: 'user_maya',
    candidateName: 'Maya Lin',
    projectId: 'proj_chronos',
    projectTitle: 'ChronosDB: Raft Consensus Engine',
    skillName: 'Go & Rust Systems Programming',
    endorserName: 'Dr. Marcus Vance',
    endorserRole: 'Senior Systems Evaluator',
    endorserCompany: 'ACM Systems Verification Council',
    relationship: 'Senior Colleague',
    verifiedSignature: 'sig_ed25519_7ca103ef889921bc45d',
    comment: 'Verified candidate implementation during practical assessment and reviewed production pull requests. Code demonstrates exceptional safety discipline and algorithmic rigor.',
    createdAt: '2026-09-15T10:00:00Z',
    status: 'active',
  },
  {
    id: 'end_3',
    candidateId: 'user_alex',
    candidateName: 'Alex Rivera',
    projectId: 'proj_canvasflow',
    projectTitle: 'CanvasFlow: 60fps WebGL Graph Engine',
    skillName: 'Canvas & WebGL Engine Architecture',
    endorserName: 'Liam Tanaka',
    endorserRole: 'Head of Product Design & Tech',
    endorserCompany: 'Graphix Labs (ex-Figma)',
    relationship: 'Manager',
    verifiedSignature: 'sig_ed25519_10fae39b98c39201a',
    comment: 'Alex built the graphics architecture that powered our collaborative canvas. Unlocked seamless 60 FPS performance where our previous team hit brick walls with DOM virtualization.',
    createdAt: '2026-10-06T18:30:00Z',
    status: 'active',
  }
];

export const SEED_LEARNING_PLANS: Record<string, LearningPlan> = {
  user_jordan: {
    id: 'lp_jordan_1',
    candidateId: 'user_jordan',
    targetRole: 'Senior Full Stack & Systems Engineer',
    generatedAt: '2026-10-20T08:00:00Z',
    progressPercentage: 35,
    skillGaps: [
      {
        skillName: 'Distributed Systems & Partition Tolerance',
        currentLevel: 2,
        targetLevel: 4,
        priority: 'critical',
        reason: 'Target senior role requires verifiable understanding of quorum, split-brain recovery, and consensus invariants.',
      },
      {
        skillName: 'System Architecture & High-Throughput Caching',
        currentLevel: 3,
        targetLevel: 4,
        priority: 'critical',
        reason: 'Current project evidence demonstrates REST endpoints but lacks low-latency caching or replication evidence.',
      },
      {
        skillName: 'Automated Chaos Testing (Jepsen/Chaos Mesh)',
        currentLevel: 1,
        targetLevel: 3,
        priority: 'recommended',
        reason: 'Employers require verified test suites that prove resilience during network outages.',
      }
    ],
    milestones: [
      {
        id: 'ms_1',
        title: 'Master Consistent Hashing & Quorum Protocols',
        description: 'Implement a 3-node ring hash distributor that maintains keyspace integrity under node drop.',
        practiceTask: 'Take CareerTrip Practical Challenge: "Distributed Key-Value Store with Linearizable Rebalancing" and score >= 80.',
        status: 'in_progress',
        estimatedHours: 12,
      },
      {
        id: 'ms_2',
        title: 'Publish Benchmark Evidence in TaskPulse',
        description: 'Add automated latency benchmarks and commit differential evidence to the TaskPulse project evidence room.',
        practiceTask: 'Instrument SQLite/IndexedDB benchmark script measuring 10,000 offline mutations per second.',
        status: 'not_started',
        estimatedHours: 8,
      },
      {
        id: 'ms_3',
        title: 'Obtain Peer Endorsement from Open Source Maintainer',
        description: 'Submit an open pull request to an established distributed queue or database repo and request verified signoff.',
        practiceTask: 'Get verifiable cryptographic endorsement signature from upstream maintainer.',
        status: 'not_started',
        estimatedHours: 15,
      }
    ]
  }
};

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    timestamp: '2026-09-15T09:12:00Z',
    actor: 'Dr. Marcus Vance (Evaluator)',
    actorRole: 'reviewer',
    action: 'VERIFIED_SUBMISSION_EVALUATION',
    targetType: 'submission',
    targetId: 'sub_maya_1',
    details: 'Verified submission for Maya Lin with score 95/100. Certified tier upgraded to "Evaluator Certified".',
  },
  {
    id: 'log_2',
    timestamp: '2026-09-15T10:00:00Z',
    actor: 'Elena Rostova (VP Engineering)',
    actorRole: 'mentor',
    action: 'SIGNED_EMPLOYER_ENDORSEMENT',
    targetType: 'endorsement',
    targetId: 'end_1',
    details: 'Cryptographically signed endorsement for Maya Lin on ChronosDB with ed25519 signature.',
  },
  {
    id: 'log_3',
    timestamp: '2026-10-02T16:45:00Z',
    actor: 'Dr. Marcus Vance (Evaluator)',
    actorRole: 'reviewer',
    action: 'VERIFIED_SUBMISSION_EVALUATION',
    targetType: 'submission',
    targetId: 'sub_alex_1',
    details: 'Verified submission for Alex Rivera with score 88/100. Endorsed Frontend Architecture competence.',
  },
  {
    id: 'log_4',
    timestamp: '2026-10-22T11:00:00Z',
    actor: 'System Integrity Engine',
    actorRole: 'admin',
    action: 'INTEGRITY_SCAN_COMPLETED',
    targetType: 'submission',
    targetId: 'sub_all',
    details: 'Continuous plagiarism and duplication scan completed across 142 submissions. 1 item flagged for human review.',
  }
];

export const SEED_INTEGRITY_FINDINGS: IntegrityFinding[] = [
  {
    id: 'int_1',
    submissionId: 'sub_flagged_demo',
    candidateName: 'External Applicant #1042',
    challengeTitle: 'Zero-Trust Role-Based Access Engine',
    category: 'Code Duplication',
    evidence: '91% exact token similarity with public GitHub repository "fast-rbac-node" (commit 4b18c). Variable names were modified from policyRule to pRule, but algorithm AST matches exactly.',
    confidence: 88,
    severity: 'warning',
    recommendation: 'Request candidate live video demonstration or written architectural explanation of the evaluation algorithm before disqualification.',
    status: 'pending_review',
  },
  {
    id: 'int_2',
    submissionId: 'sub_flagged_demo_2',
    candidateName: 'External Applicant #0921',
    challengeTitle: 'Distributed Key-Value Store with Rebalancing',
    category: 'Suspicious AI Pattern',
    evidence: 'Presence of hallmark synthetic markdown artifacts ("// Here is the complete code to solve the challenge:") left commented inside the raw source file.',
    confidence: 78,
    severity: 'info',
    recommendation: 'Evaluate through live technical interview focusing on edge cases in lines 45-78.',
    status: 'pending_review',
  }
];
