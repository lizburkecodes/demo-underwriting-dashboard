/**
 * ExplainabilityPanel
 *
 * Right-side panel with tabbed views:
 *   1. Summary — score distribution chart + factor table + underwriting summary
 *   2. Raw JSON — full API response for developer inspection
 */
import { useState } from "react";
import ScoreDistributionChart from "./ScoreDistributionChart";
import FactorTable from "./FactorTable";
import UnderwritingSummary from "./UnderwritingSummary";
import RawApiResponseTab from "./RawApiResponseTab";

const TABS = [
  { id: "summary",  label: "Summary" },
  { id: "factors",  label: "Factors" },
  { id: "raw",      label: "Raw JSON" },
];

export default function ExplainabilityPanel({ result }) {
  const [activeTab, setActiveTab] = useState("summary");

  if (!result) return null;

  const {
    score_distribution,
    top_positive_factors,
    top_negative_factors,
    underwriting_summary,
    score_decision,
  } = result;

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto flex-1 space-y-6 pr-1">
        {/* ── Summary Tab ── */}
        {activeTab === "summary" && (
          <>
            <UnderwritingSummary
              summary={underwriting_summary}
              decision={score_decision}
            />
            <ScoreDistributionChart scoreDistribution={score_distribution} />

            {/* Top positive / negative highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  Top Strengths
                </p>
                <ul className="space-y-1">
                  {top_positive_factors.slice(0, 4).map((f) => (
                    <li key={f.code} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="mt-0.5 text-emerald-500 font-bold">↑</span>
                      <span>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-500">
                  Top Risk Factors
                </p>
                <ul className="space-y-1">
                  {top_negative_factors.slice(0, 4).map((f) => (
                    <li key={f.code} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="mt-0.5 text-red-500 font-bold">↓</span>
                      <span>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {/* ── Factors Tab ── */}
        {activeTab === "factors" && (
          <FactorTable scoreDistribution={score_distribution} />
        )}

        {/* ── Raw JSON Tab ── */}
        {activeTab === "raw" && (
          <RawApiResponseTab data={result} />
        )}
      </div>
    </div>
  );
}
