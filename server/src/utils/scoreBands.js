/**
 * Score band utilities.
 * Converts a 0–100 score to a 300–850 scale, risk level, and underwriting decision.
 */

const SCORE_850_MIN = 300;
const SCORE_850_RANGE = 550; // 850 - 300

/**
 * Map a 0–100 score to the 300–850 scale.
 * @param {number} score100
 * @returns {number}
 */
function to850(score100) {
  const clamped = Math.max(0, Math.min(100, score100));
  return Math.round(SCORE_850_MIN + (clamped / 100) * SCORE_850_RANGE);
}

/**
 * Derive risk level from a 0–100 score.
 * @param {number} score100
 * @returns {"LOW"|"MEDIUM"|"HIGH"}
 */
function getRiskLevel(score100) {
  if (score100 >= 80) return "LOW";
  if (score100 >= 60) return "MEDIUM";
  return "HIGH";
}

/**
 * Derive underwriting decision from a 0–100 score.
 * @param {number} score100
 * @returns {"APPROVE"|"REVIEW"|"DECLINE"}
 */
function getScoreDecision(score100) {
  if (score100 >= 80) return "APPROVE";
  if (score100 >= 60) return "REVIEW";
  return "DECLINE";
}

module.exports = { to850, getRiskLevel, getScoreDecision };
