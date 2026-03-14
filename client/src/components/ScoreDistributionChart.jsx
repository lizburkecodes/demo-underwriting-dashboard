/**
 * ScoreDistributionChart
 *
 * Horizontal bar chart showing each category's contribution to the final score.
 * Built with Recharts.
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CATEGORY_COLORS = {
  PUBLIC_RECORDS:      "#6366f1", // indigo
  BUSINESS_OPERATIONS: "#0ea5e9", // sky
  COMPANY_PROFILE:     "#8b5cf6", // violet
  FINANCIAL_TRENDS:    "#10b981", // emerald
  PERFORMANCE_MEASURES:"#f59e0b", // amber
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 shadow-md text-xs">
      <p className="font-semibold text-slate-700 mb-1">{d.label}</p>
      <p>Category score: <strong>{d.score}/100</strong></p>
      <p>Contribution: <strong>{d.score_100} pts</strong></p>
      <p>Weight: <strong>{d.total_weightage}%</strong></p>
    </div>
  );
};

export default function ScoreDistributionChart({ scoreDistribution }) {
  if (!scoreDistribution || scoreDistribution.length === 0) return null;

  const data = scoreDistribution.map((cat) => ({
    name: cat.code
      .split("_")
      .map((w) => w[0] + w.slice(1).toLowerCase())
      .join(" "),
    label: cat.label,
    score: cat.score,
    score_100: cat.score_100,
    total_weightage: cat.total_weightage,
    code: cat.code,
  }));

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Category Score Distribution
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            width={120}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {data.map((entry) => (
              <Cell
                key={entry.code}
                fill={CATEGORY_COLORS[entry.code] || "#6366f1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
