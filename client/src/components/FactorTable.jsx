/**
 * FactorTable
 *
 * Renders all scoring factors grouped by category.
 * Each row shows the factor label, value, score delta, and a status icon.
 */

const STATUS_STYLES = {
  POSITIVE: "text-emerald-600 bg-emerald-50",
  NEGATIVE: "text-red-600 bg-red-50",
  NEUTRAL:  "text-slate-500 bg-slate-50",
};

const STATUS_ICONS = {
  POSITIVE: "↑",
  NEGATIVE: "↓",
  NEUTRAL:  "–",
};

const CATEGORY_ACCENT = {
  PUBLIC_RECORDS:       "border-indigo-300 bg-indigo-50 text-indigo-700",
  BUSINESS_OPERATIONS:  "border-sky-300    bg-sky-50    text-sky-700",
  COMPANY_PROFILE:      "border-violet-300 bg-violet-50 text-violet-700",
  FINANCIAL_TRENDS:     "border-emerald-300 bg-emerald-50 text-emerald-700",
  PERFORMANCE_MEASURES: "border-amber-300  bg-amber-50  text-amber-700",
};

function FactorRow({ factor }) {
  const statusStyle = STATUS_STYLES[factor.status] || STATUS_STYLES.NEUTRAL;
  const icon = STATUS_ICONS[factor.status] || "–";
  const scoreSign = factor.score_100 > 0 ? "+" : "";

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
      <td className="py-2 pl-3 pr-2">
        <span
          className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold ${statusStyle}`}
        >
          {icon}
        </span>
      </td>
      <td className="py-2 pr-3">
        <p className="text-xs font-semibold text-slate-700">{factor.label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{factor.value}</p>
      </td>
      <td className="py-2 pr-3 text-right">
        <span className={`text-xs font-bold ${factor.score_100 > 0 ? "text-emerald-600" : factor.score_100 < 0 ? "text-red-600" : "text-slate-400"}`}>
          {scoreSign}{factor.score_100}
        </span>
      </td>
    </tr>
  );
}

export default function FactorTable({ scoreDistribution }) {
  if (!scoreDistribution || scoreDistribution.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Factor Detail
      </p>
      {scoreDistribution.map((cat) => (
        <div key={cat.code} className="overflow-hidden rounded-lg border border-slate-200">
          {/* Category header */}
          <div className={`flex items-center justify-between border-b px-3 py-2 ${CATEGORY_ACCENT[cat.code] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
            <span className="text-xs font-bold uppercase tracking-wide">
              {cat.label}
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="opacity-70">{cat.total_weightage}% weight</span>
              <span className="font-bold">{cat.score}/100</span>
            </div>
          </div>

          {/* Factors */}
          {cat.factors && cat.factors.length > 0 ? (
            <table className="w-full text-left">
              <tbody>
                {cat.factors.map((f) => (
                  <FactorRow key={f.code} factor={f} />
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-3 py-2 text-xs text-slate-400">No factors evaluated.</p>
          )}
        </div>
      ))}
    </div>
  );
}
