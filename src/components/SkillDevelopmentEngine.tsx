import React, { useState } from 'react';
import { User, SkillItem, LearningPlan, LearningMilestone } from '../types';

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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Specification Strip */}
      <div className="bg-[#000000] border border-[#272727]">
        <div className="px-6 py-2 border-b border-[#272727] bg-[#0A0A0C] flex flex-wrap items-center justify-between font-mono text-[10px] text-[#767676]">
          <div className="flex items-center gap-3">
            <span className="text-[#F1F2F2]">CURRICULUM SPEC // 05.0</span>
            <span>/</span>
            <span>GAP AUDIT ENGINE: GEMINI 2.5-FLASH</span>
          </div>
          <div className="flex items-center gap-3">
            <span>DEFICIT CRITERIA: BENCHMARK-ALIGNED</span>
            <span>/</span>
            <span className="text-[#F56B2A]">ACTIVE CANDIDATE: @{currentUser.handle.toUpperCase()}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-light text-[#F1F2F2] tracking-tight">
              Skill Development Engine
            </h1>
            <p className="text-sm text-[#767676] font-mono">
              Evidence-linked gap analysis identifying concrete deficits between candidate claims and benchmark targets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTargetRole}
              onChange={(e) => setSelectedTargetRole(e.target.value)}
              className="bg-[#08080A] border border-[#272727] px-3 py-2 text-xs font-mono text-[#F1F2F2] focus:outline-none focus:border-[#F56B2A]"
            >
              <option value="Principal Systems Architect">Principal Systems Architect</option>
              <option value="Staff Frontend Architect">Staff Frontend Architect</option>
              <option value="Senior ML Systems Engineer">Senior ML Systems Engineer</option>
              <option value="Senior Full Stack & Systems Engineer">Senior Full Stack & Systems Engineer</option>
            </select>

            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-[#F56B2A] hover:bg-[#ff7b3d] text-black font-mono text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 disabled:opacity-50"
            >
              {isGenerating ? '[ANALYZING...]' : '[ANALYZE GAPS (GEMINI)]'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Overview Strip */}
      <div className="bg-[#000000] border border-[#272727] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#767676] uppercase tracking-wider block">
              TARGET BENCHMARK TRAJECTORY
            </span>
            <h2 className="text-base font-bold text-[#F1F2F2] mt-0.5">
              {selectedTargetRole}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#767676] uppercase tracking-wider block">
              CURRICULUM COMPLETION INDEX
            </span>
            <div className="text-xl font-bold text-[#F56B2A]">
              {progressPct}.0% <span className="text-xs text-[#767676]">[{completedCount}/{totalMilestones} COMPLETED]</span>
            </div>
          </div>
        </div>

        {/* Sharp 2px rectangular industrial progress meter */}
        <div className="w-full bg-[#1A1A1A] h-1.5 border border-[#272727]">
          <div
            className="h-full bg-[#F56B2A] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Identified Deficits (Left) & Milestones (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Deficit Specification (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#000000] border border-[#272727]">
            <div className="px-5 py-3 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between font-mono text-xs">
              <h3 className="font-semibold text-[#F1F2F2] uppercase tracking-wider">
                05.1 // IDENTIFIED DEFICITS ({learningPlan?.skillGaps.length || 0})
              </h3>
              <span className="text-[10px] text-[#767676]">BENCHMARK AUDIT</span>
            </div>

            <div className="p-5 space-y-3">
              {!learningPlan || learningPlan.skillGaps.length === 0 ? (
                <div className="p-6 text-center font-mono text-xs text-[#767676] border border-[#272727]">
                  NO ACTIVE DEFICITS RECORDED
                </div>
              ) : (
                learningPlan.skillGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 border border-[#202020] bg-[#08080A] space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-[#F1F2F2]">{gap.skillName}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 border uppercase ${
                          gap.priority === 'critical'
                            ? 'border-[#F56B2A] text-[#F56B2A]'
                            : gap.priority === 'recommended'
                            ? 'border-[#F1F2F2] text-[#F1F2F2]'
                            : 'border-[#404040] text-[#767676]'
                        }`}
                      >
                        {gap.priority}
                      </span>
                    </div>

                    <p className="text-[#D0D1D2] font-sans text-xs leading-relaxed">
                      {gap.reason}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#767676] pt-1.5 border-t border-[#1C1C1F]">
                      <span>CURRENT: LVL {gap.currentLevel}/5</span>
                      <span>TARGET: LVL {gap.targetLevel}/5</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Actionable Milestones (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#000000] border border-[#272727]">
            <div className="px-5 py-3 border-b border-[#272727] bg-[#0A0A0C] flex items-center justify-between font-mono text-xs">
              <h3 className="font-semibold text-[#F1F2F2] uppercase tracking-wider">
                05.2 // ACTIONABLE PRACTICE MILESTONES ({totalMilestones})
              </h3>
              <button
                onClick={onNavigateToAssessments}
                className="text-[11px] text-[#F56B2A] hover:underline uppercase"
              >
                [OPEN ASSESSMENT LAB →]
              </button>
            </div>

            <div className="p-5 space-y-3 font-mono text-xs">
              {!learningPlan || learningPlan.milestones.length === 0 ? (
                <div className="p-8 text-center text-[#767676] border border-[#272727]">
                  TRIGGER "ANALYZE GAPS" TO SYNTHESIZE MILESTONES
                </div>
              ) : (
                learningPlan.milestones.map((m, idx) => {
                  const isDone = m.status === 'completed';

                  return (
                    <div
                      key={m.id}
                      className={`p-4 border transition-colors space-y-3 ${
                        isDone
                          ? 'border-[#272727] bg-[#060608] opacity-75'
                          : 'border-[#202020] bg-[#08080A]'
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
                            className="mt-1 accent-[#F56B2A] cursor-pointer"
                          />
                          <div>
                            <span className="text-[10px] text-[#767676] uppercase block">
                              MILESTONE 0{idx + 1}
                            </span>
                            <h4 className={`font-bold text-sm ${isDone ? 'line-through text-[#767676]' : 'text-[#F1F2F2]'}`}>
                              {m.title}
                            </h4>
                            <p className="text-[#A0A2A4] font-sans text-xs mt-1 leading-relaxed">
                              {m.description}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] text-[#767676] shrink-0">
                          {m.estimatedHours} HRS
                        </span>
                      </div>

                      {/* Technical Verification Task Box */}
                      <div className="p-3 bg-[#000000] border border-[#1A1A1D] space-y-1">
                        <span className="text-[9px] text-[#F56B2A] uppercase tracking-wider block">
                          VERIFICATION DELIVERABLE:
                        </span>
                        <p className="text-[#D0D1D2] font-sans text-xs">
                          {m.practiceTask}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#767676] pt-1">
                        <span className="uppercase">
                          STATUS: <strong className="text-[#F1F2F2]">{m.status.replace('_', ' ')}</strong>
                        </span>

                        {m.status !== 'completed' && (
                          <button
                            onClick={() => onUpdateMilestoneStatus(m.id, 'completed')}
                            className="px-2.5 py-1 bg-[#0F0E12] hover:bg-[#F1F2F2] hover:text-[#000000] text-[#F1F2F2] border border-[#272727] uppercase text-[10px] transition-colors"
                          >
                            [MARK COMPLETE]
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
