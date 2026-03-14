/**
 * UnderwritingSummary
 *
 * Renders the plain-English underwriting narrative.
 */

const DECISION_STYLE = {
  APPROVE: "border-emerald-200 bg-emerald-50 text-emerald-800",
  REVIEW:  "border-amber-200  bg-amber-50  text-amber-800",
  DECLINE: "border-red-200    bg-red-50    text-red-800",
};

export default function UnderwritingSummary({ summary, decision }) {
  const style =
    DECISION_STYLE[decision] ||
    "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`rounded-lg border p-4 text-sm leading-relaxed ${style}`}>
      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest opacity-60">
        Underwriting Summary
      </p>
      <p>{summary}</p>
    </div>
  );
}
