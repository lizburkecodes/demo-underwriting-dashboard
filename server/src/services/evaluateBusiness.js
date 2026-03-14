/**
 * Business evaluation orchestrator.
 *
 * Runs all scoring rules against a normalized business payload,
 * assembles per-category scores, and returns the full score
 * response object.
 *
 * NOTE: This is a transparent demo scoring model. It does not replicate
 * actual scoring methodology.
 */

const { SCORE_CATEGORIES } = require("./scoreCategories");
const { RULES_BY_CATEGORY } = require("./scoringRules");
const { to850, getRiskLevel, getScoreDecision } = require("../utils/scoreBands");

// Neutral starting score for each category before rule deltas are applied.
const CATEGORY_BASE = 60;

/**
 * Evaluate a normalized business payload and return the full score response.
 * @param {object} business - Normalized business object
 * @returns {object} Score response
 */
function evaluateBusiness(business) {
  const scoreDistribution = [];
  let weightedScoreSum = 0;

  for (const category of SCORE_CATEGORIES) {
    const rules = RULES_BY_CATEGORY[category.code] || [];
    const rawFactors = [];
    let rawDeltaSum = 0;

    for (const ruleFn of rules) {
      const result = ruleFn(business);
      if (!result) continue; // rule returned null — condition not triggered
      rawFactors.push(result);
      rawDeltaSum += result.delta;
    }

    // Clamp category score to [0, 100]
    const categoryScore100 = Math.max(0, Math.min(100, CATEGORY_BASE + rawDeltaSum));
    const categoryScore850 = to850(categoryScore100);
    const categoryContribution = (categoryScore100 * category.weight) / 100;
    weightedScoreSum += categoryContribution;

    // Attach score fields to each factor
    const scoredFactors = rawFactors.map((f) => ({
      code: f.code,
      label: f.label,
      value: f.value,
      score_100: f.delta,
      weighted_score_100: parseFloat(((f.delta * category.weight) / 100).toFixed(2)),
      score_850: Math.round(f.delta * 5.5),
      weighted_score_850: Math.round((f.delta * category.weight * 5.5) / 100),
      status: f.status,
      log: f.log,
    }));

    scoreDistribution.push({
      code: category.code,
      label: category.label,
      total_weightage: category.weight,
      score: categoryScore100,
      score_100: parseFloat(categoryContribution.toFixed(2)),
      score_850: categoryScore850,
      factors: scoredFactors,
    });
  }

  const finalScore100 = Math.max(0, Math.min(100, Math.round(weightedScoreSum)));
  const finalScore850 = to850(finalScore100);
  const riskLevel = getRiskLevel(finalScore100);
  const decision = getScoreDecision(finalScore100);

  // Surface top positive and negative factors across all categories
  const allFactors = scoreDistribution.flatMap((cat) => cat.factors);
  const topPositiveFactors = allFactors
    .filter((f) => f.status === "POSITIVE")
    .sort((a, b) => b.score_100 - a.score_100)
    .slice(0, 5);
  const topNegativeFactors = allFactors
    .filter((f) => f.status === "NEGATIVE")
    .sort((a, b) => a.score_100 - b.score_100)
    .slice(0, 5);

  const underwritingSummary = buildUnderwritingSummary(
    business,
    finalScore100,
    finalScore850,
    riskLevel,
    decision,
    topPositiveFactors,
    topNegativeFactors
  );

  return {
    business_id: business.id || null,
    business_name: business.name,
    version: "1.0.0-demo",
    evaluated_at: new Date().toISOString(),
    base_score: CATEGORY_BASE,
    weighted_score_100: finalScore100,
    weighted_score_850: finalScore850,
    risk_level: riskLevel,
    score_decision: decision,
    score_distribution: scoreDistribution,
    top_positive_factors: topPositiveFactors,
    top_negative_factors: topNegativeFactors,
    underwriting_summary: underwritingSummary,
  };
}

/**
 * Build a plain-English underwriting summary for the explainability panel.
 */
function buildUnderwritingSummary(
  biz,
  score100,
  score850,
  riskLevel,
  decision,
  positives,
  negatives
) {
  const riskText = { LOW: "low-risk", MEDIUM: "medium-risk", HIGH: "high-risk" }[riskLevel];
  const decisionText = { APPROVE: "Approved", REVIEW: "Flagged for Manual Review", DECLINE: "Declined" }[decision];

  let summary =
    `${biz.name} received a score of ${score100}/100 (${score850} on an 850-point scale), ` +
    `placing it in the ${riskText} category. The underwriting decision is: ${decisionText}. `;

  if (positives.length > 0) {
    const labels = positives.map((f) => f.label.toLowerCase()).join(", ");
    summary += `Key strengths include ${labels}. `;
  }

  if (negatives.length > 0) {
    const labels = negatives.map((f) => f.label.toLowerCase()).join(", ");
    summary += `Risk factors flagged: ${labels}. `;
  }

  if (decision === "APPROVE") {
    summary +=
      "This business presents a strong overall credit profile and meets the criteria for approval without further review.";
  } else if (decision === "REVIEW") {
    summary +=
      "This business shows a mixed risk profile. A manual underwriter review is recommended before proceeding with a final decision.";
  } else {
    summary +=
      "The combination of risk indicators identified suggests this business does not currently meet the minimum underwriting threshold for approval. Reconsideration may be possible with additional documentation.";
  }

  return summary;
}

module.exports = { evaluateBusiness };
