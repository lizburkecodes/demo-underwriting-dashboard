/**
 * ScoreCard
 *
 * The main score display widget. Shows the 100-point and 850-point scores,
 * risk level badge, decision pill, business name, and evaluation timestamp.
 */
import DecisionBadge from "./DecisionBadge";

const RISK_RING = {
  LOW:    "ring-emerald-400",
  MEDIUM: "ring-amber-400",
  HIGH:   "ring-red-400",
};

const RISK_TEXT = {
  LOW:    "text-emerald-600",
  MEDIUM: "text-amber-600",
  HIGH:   "text-red-600",
};

const RISK_BG = {
  LOW:    "bg-emerald-50",
  MEDIUM: "bg-amber-50",
  HIGH:   "bg-red-50",
};

export default function ScoreCard({ result }) {
  const {
    business_name,
    weighted_score_100,
    weighted_score_850,
    risk_level,
    score_decision,
    evaluated_at,
    version,
  } = result;

  const ringColor  = RISK_RING[risk_level]  || "ring-slate-300";
  const textColor  = RISK_TEXT[risk_level]  || "text-slate-700";
  const bgColor    = RISK_BG[risk_level]    || "bg-slate-50";

  const evaluatedDate = evaluated_at
    ? new Date(evaluated_at).toLocaleString()
    : null;

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      {/* Business name */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Business
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-800">{business_name}</h2>
      </div>

      {/* Score ring */}
      <div
        className={`flex h-40 w-40 flex-col items-center justify-center rounded-full ring-4 ${ringColor} ${bgColor} shadow-md`}
      >
        <span className={`text-5xl font-black ${textColor}`}>{weighted_score_100}</span>
        <span className="text-xs font-semibold text-slate-400">out of 100</span>
      </div>

      {/* 850-scale score */}
      <div className="text-center">
        <p className="text-xs text-slate-400">850-Point Scale</p>
        <p className={`text-3xl font-extrabold ${textColor}`}>{weighted_score_850}</p>
      </div>

      {/* Risk level + Decision */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${bgColor} ${textColor} ring-1 ${ringColor}`}
        >
          {risk_level} RISK
        </span>
        <DecisionBadge decision={score_decision} />
      </div>

      {/* Meta */}
      <div className="text-center text-xs text-slate-400 space-y-0.5">
        {evaluatedDate && <p>Evaluated: {evaluatedDate}</p>}
        <p>Model version: {version}</p>
      </div>
    </div>
  );
}
