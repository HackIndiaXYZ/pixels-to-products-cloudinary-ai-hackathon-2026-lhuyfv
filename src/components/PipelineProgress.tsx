import React from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import type { StageState, StageStatus } from '../types/pipeline.js';

interface PipelineProgressProps {
  stages: StageState[];
  currentStageKey: string;
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({
  stages,
  currentStageKey,
}) => {
  const getStatusIcon = (status: StageStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-neutral-900 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'waiting':
      default:
        return <Clock className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusTextClass = (status: StageStatus) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-700 font-semibold';
      case 'processing':
        return 'text-neutral-900 font-semibold';
      case 'failed':
        return 'text-rose-700 font-semibold';
      case 'waiting':
      default:
        return 'text-neutral-400';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
            AI Media Processing Pipeline
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cloudinary ingestion, multimodal understanding, transformation synthesis, and delivery optimization.
          </p>
        </div>
      </div>

      {/* Stage Flow Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage, idx) => {
          const isCurrent = stage.key === currentStageKey;
          return (
            <div
              key={stage.key}
              className={`p-3.5 rounded-lg border transition-all ${
                stage.status === 'processing'
                  ? 'border-neutral-900 bg-neutral-50/80 shadow-xs ring-1 ring-neutral-900/10'
                  : stage.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : stage.status === 'failed'
                  ? 'border-rose-200 bg-rose-50/40'
                  : 'border-neutral-200 bg-white opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-neutral-400 font-semibold">
                  0{idx + 1}
                </span>
                {getStatusIcon(stage.status)}
              </div>

              <div className="text-xs font-bold tracking-tight text-neutral-900">
                {stage.key}
              </div>

              <div className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                {stage.label}
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between">
                <span className={`text-[10px] uppercase tracking-wider ${getStatusTextClass(stage.status)}`}>
                  {stage.status}
                </span>
                {stage.details && (
                  <span className="text-[10px] text-neutral-400 truncate max-w-[80px]" title={stage.details}>
                    {stage.details}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
