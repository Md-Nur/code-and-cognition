"use client";

interface ProgressBarProps {
  milestones: { status: string }[];
  showLabel?: boolean;
}

function getProgressColor(pct: number): string {
  if (pct < 40) return "bg-rose-500";
  if (pct < 80) return "bg-amber-400";
  return "bg-emerald-500";
}

function getProgressTextColor(pct: number): string {
  if (pct < 40) return "text-rose-400";
  if (pct < 80) return "text-amber-400";
  return "text-emerald-400";
}

export default function ProgressBar({
  milestones,
  showLabel = true,
}: ProgressBarProps) {
  const total = milestones.length;
  const completed = milestones.filter((m) => m.status === "COMPLETED").length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const barColor = getProgressColor(pct);
  const textColor = getProgressTextColor(pct);

  return (
    <div className="space-y-2 w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-gray-400">
            {completed} / {total} milestones completed
          </span>
          <span className={`font-bold text-base ${textColor}`}>{pct}%</span>
        </div>
      )}
      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden ${barColor}`}
          style={{ width: `${pct}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-white/20 w-full h-full -skew-x-12 translate-x-12 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
