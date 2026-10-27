import React, { useState } from 'react';
import { User, SkillItem, LearningPlan, LearningMilestone } from '../types';
import {
  GraduationCap,
  Sparkles,
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Compass
} from 'lucide-react';

interface SkillDevelopmentEngineProps {
  currentUser: User;
  skills: SkillItem[];
  learningPlan: LearningPlan | null;
  onUpdateMilestoneStatus: (milestoneId: string, status: LearningMilestone['status']) => void;
  onRegeneratePlan: (targetRole: string) => Promise<void>;
  onNavigateToAssessments: () => void;
}

export const SkillDevelopmentEngine: React.FC<SkillDevelopmentEngineProps> = ({
  currentUser,
  skills,
  learningPlan,
  onUpdateMilestoneStatus,
  onRegeneratePlan,
  onNavigateToAssessments,
}) => {
  const [selectedTargetRole, setSelectedTargetRole] = useState(currentUser.targetRole || 'Principal Systems Architect');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      await onRegeneratePlan(selectedTargetRole);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const completedCount = learningPlan?.milestones.filter((m) => m.status === 'completed').length || 0;
  const totalMilestones = learningPlan?.milestones.length || 0;
  const progressPct = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Skill Development Engine</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/30 font-semibold">
              EVIDENCE-DRIVEN GAP ANALYSIS
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-1">
            Pinpoints exact deficits between your verified portfolio evidence and target role requirements, with measurable practice milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTargetRole}
            onChange={(e) => setSelectedTargetRole(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="Principal Systems Architect">Principal Systems Architect</option>
            <option value="Staff Frontend Architect">Staff Frontend Architect</option>
            <option value="Senior ML Systems Engineer">Senior ML Systems Engineer</option>
            <option value="Senior Full Stack & Systems Engineer">Senior Full Stack & Systems Engineer</option>
          </select>

          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Analyzing Gaps...' : 'Analyze with Gemini'}</span>
          </button>
        </div>
      </div>

      {/* Progress Overview Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Current Target Trajectory
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <Target className="w-5 h-5 text-indigo-400" />
              {selectedTargetRole}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-zinc-400 font-mono">Curriculum Milestone Completion</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {progressPct}% <span className="text-xs text-zinc-500 font-normal">({completedCount}/{totalMilestones} Milestones)</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skill Gaps Identified (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Identified Skill Deficits ({learningPlan?.skillGaps.length || 0})
              </h3>
              <span className="text-[11px] text-zinc-500 font-mono">Benchmark Audit</span>
            </div>

            {!learningPlan || learningPlan.skillGaps.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No active skill gaps identified.</p>
            ) : (
              <div className="space-y-3">
                {learningPlan.skillGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-950/70 border border-zinc-800 rounded-lg p-3.5 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-zinc-200">{gap.skillName}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          gap.priority === 'critical'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : gap.priority === 'recommended'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {gap.priority}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {gap.reason}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-850">
                      <span>Current Level: {gap.currentLevel}/5</span>
                      <span>Target Level: {gap.targetLevel}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actionable Milestones & Practice Tasks (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Actionable Practice Milestones ({totalMilestones})
              </h3>
              <button
                onClick={onNavigateToAssessments}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Go to Assessment Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {!learningPlan || learningPlan.milestones.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">
                Click "Analyze with Gemini" to generate tailored practice tasks for your profile.
              </p>
            ) : (
              <div className="space-y-3">
                {learningPlan.milestones.map((m) => {
                  const isDone = m.status === 'completed';
                  const isInProg = m.status === 'in_progress';

                  return (
                    <div
                      key={m.id}
                      className={`p-4 rounded-xl border transition-all space-y-3 text-xs ${
                        isDone
                          ? 'bg-emerald-950/15 border-emerald-500/30'
                          : isInProg
                          ? 'bg-zinc-950 border-indigo-500/40 ring-1 ring-indigo-500/20'
                          : 'bg-zinc-950 border-zinc-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() =>
                              onUpdateMilestoneStatus(
                                m.id,
                                isDone ? 'in_progress' : 'completed'
                              )
                            }
                            className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
                          />
                          <div>
                            <h4
                              className={`font-semibold text-sm ${
                                isDone ? 'text-zinc-400 line-through' : 'text-zinc-100'
                              }`}
                            >
                              {m.title}
                            </h4>
                            <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                              {m.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {m.estimatedHours} hrs
                        </span>
                      </div>

                      {/* Practice Task Box */}
                      <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800/80 space-y-1">
                        <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                          Target Verification Task:
                        </span>
                        <p className="text-zinc-300 text-[11px] font-medium leading-relaxed">
                          {m.practiceTask}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-zinc-500 capitalize">
                          Status: <strong className="text-zinc-300">{m.status.replace('_', ' ')}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          {m.status !== 'completed' && (
                            <button
                              onClick={() => onUpdateMilestoneStatus(m.id, 'completed')}
                              className="px-2 py-0.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded border border-emerald-500/30 text-[10px] font-medium transition-colors"
                            >
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
