/**
 * DecisionBadge
 *
 * Colored pill badge for the underwriting decision.
 * APPROVE → green, REVIEW → amber, DECLINE → red
 */

const STYLES = {
  APPROVE: "bg-emerald-100 text-emerald-700 ring-emerald-300",
  REVIEW:  "bg-amber-100  text-amber-700  ring-amber-300",
  DECLINE: "bg-red-100    text-red-700    ring-red-300",
};

const ICONS = {
  APPROVE: "✓",
  REVIEW:  "⚠",
  DECLINE: "✕",
};

export default function DecisionBadge({ decision }) {
  if (!decision) return null;
  const style = STYLES[decision] || "bg-slate-100 text-slate-600 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ring-1 ${style}`}
    >
      <span>{ICONS[decision]}</span>
      {decision}
    </span>
  );
}
