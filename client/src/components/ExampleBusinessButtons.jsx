/**
 * ExampleBusinessButtons
 *
 * Renders one button per seeded example business.
 * Clicking a button loads that business's payload into the form.
 */

const RISK_STYLES = {
  LOW:    "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  MEDIUM: "border-amber-300  bg-amber-50  text-amber-700  hover:bg-amber-100",
  HIGH:   "border-red-300    bg-red-50    text-red-700    hover:bg-red-100",
};

export default function ExampleBusinessButtons({ examples, onLoad }) {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Load Example
      </p>
      <div className="flex flex-col gap-2">
        {examples.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => onLoad(ex.payload)}
            className={`rounded-md border px-3 py-2 text-left text-xs font-medium transition ${
              RISK_STYLES[ex.riskHint] || "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="font-semibold">{ex.label}</span>
            <span className="ml-2 font-normal opacity-75">— {ex.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
