import React from 'react';
import { CheckCircle2, XCircle, ArrowUpRight, HelpCircle } from 'lucide-react';
import type { ReadinessScore as ReadinessScoreType } from '../types/pipeline.js';

interface ReadinessScoreProps {
  readiness: ReadinessScoreType;
}

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({ readiness }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            Media Readiness
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Transparent compliance verification across multi-destination publishing criteria.
          </p>
        </div>

        {/* Large Score Display */}
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className={`text-4xl font-extrabold font-mono tabular-nums ${getScoreColor(readiness.overallScore)}`}>
              {readiness.overallScore}%
            </span>
          </div>
          <span className="text-[11px] font-medium text-neutral-500">Readiness Score</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ${getScoreBg(readiness.overallScore)}`}
          style={{ width: `${readiness.overallScore}%` }}
        />
      </div>

      {/* Individual Checks (5 standard checks) */}
      <div className="mt-6 divide-y divide-neutral-100">
        {readiness.checks.map((check) => (
          <div key={check.id} className="py-3 flex items-start justify-between gap-4">
            <div className="flex items-start gap-2.5">
              {check.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-xs font-semibold text-neutral-900 flex items-center gap-2">
                  <span>{check.label}</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  {check.details}
                </div>
              </div>
            </div>

            <div className="text-xs font-mono font-semibold text-neutral-700 tabular-nums shrink-0">
              +{check.score} pts
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Recommendations */}
      {readiness.recommendations.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Readiness Actions
          </div>
          <ul className="space-y-1.5">
            {readiness.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-neutral-600 flex items-start gap-1.5">
                <span className="text-neutral-400 font-bold select-none">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
