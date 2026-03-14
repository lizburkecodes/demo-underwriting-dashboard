/**
 * App Business Underwriting Dashboard
 *
 * Three-panel layout:
 *   Left   — Business intake / onboarding form
 *   Center — Score card / decision result
 *   Right  — Explainability panel
 */
import { useState, useEffect } from "react";
import { api } from "./lib/api";
import { defaultFormValues } from "./data/formDefaults";

import BusinessOnboardingForm from "./components/BusinessOnboardingForm";
import ExampleBusinessButtons from "./components/ExampleBusinessButtons";
import ScoreCard from "./components/ScoreCard";
import ExplainabilityPanel from "./components/ExplainabilityPanel";

export default function App() {
  const [formData, setFormData]   = useState(defaultFormValues);
  const [examples, setExamples]   = useState([]);
  const [result, setResult]       = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  // Fetch seeded examples on mount
  useEffect(() => {
    api.getExamples()
      .then((res) => setExamples(res.data.examples))
      .catch(() => {/* silently ignore — server may not be up yet */});
  }, []);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoadExample = (payload) => {
    // Map payload fields to form state (stringify numbers for controlled inputs)
    const mapped = {};
    for (const [k, v] of Object.entries(defaultFormValues)) {
      mapped[k] = payload[k] !== undefined && payload[k] !== null
        ? payload[k]
        : v;
    }
    setFormData(mapped);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.evaluate(formData);
      setResult(res.data.result);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        "Failed to connect to the evaluation server. Is the backend running?"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <span className="text-white text-xs font-black">W</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">
              Underwriting Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Business Risk Evaluation Demo</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-200">
          Demo · No Auth · In-Memory
        </span>
      </header>

      {/* ── Main three-panel grid ────────────────────────────────────────── */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">

        {/* ── Left: Intake Form ──────────────────────────────────────────── */}
        <aside className="bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <ExampleBusinessButtons examples={examples} onLoad={handleLoadExample} />
            <BusinessOnboardingForm
              formData={formData}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </aside>

        {/* ── Center: Score Card ─────────────────────────────────────────── */}
        <section className="bg-white border-r border-slate-200 overflow-y-auto px-6 py-6 flex flex-col">
          {isLoading && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
              <p className="text-sm font-medium">Evaluating business…</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold mb-1">Evaluation Error</p>
              <p>{error}</p>
            </div>
          )}

          {!result && !isLoading && !error && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-700">No Evaluation Yet</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Fill in the form or load an example business, then click{" "}
                  <strong>Run Underwriting Evaluation</strong>.
                </p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <ScoreCard result={result} />
          )}
        </section>

        {/* ── Right: Explainability ──────────────────────────────────────── */}
        <section className="bg-white overflow-y-auto px-6 py-6 flex flex-col">
          {!result && !isLoading && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-700">Explainability Panel</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Score breakdown, factor analysis, and raw API response will appear here after evaluation.
                </p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <ExplainabilityPanel result={result} />
          )}
        </section>
      </main>
    </div>
  );
}

