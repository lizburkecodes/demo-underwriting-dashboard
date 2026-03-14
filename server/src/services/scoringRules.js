/**
 * Scoring rules engine.
 *
 * Each rule function accepts a normalized business payload and returns a factor
 * descriptor object. Rules that don't apply return null and are skipped.
 *
 * NOTE: This is a transparent demo model. The scoring structure and field names
 * are illustrative and do not replicate any proprietary scoring methodology.
 */

const HIGH_RISK_INDUSTRIES = ["construction", "trucking", "cannabis", "crypto", "firearms"];
const CURRENT_YEAR = new Date().getFullYear();

/**
 * Helper: build a raw factor descriptor.
 * `delta` is the point change applied to the category score (can be negative).
 */
function factor(code, label, value, delta, status, log) {
  return { code, label, value, delta, status, log };
}

// ─── PUBLIC_RECORDS ──────────────────────────────────────────────────────────

function rule_PR_BANKRUPTCY(biz) {
  if (biz.has_bankruptcy) {
    return factor(
      "PR_BANKRUPTCY",
      "Bankruptcy History",
      "Bankruptcy on record",
      -15,
      "NEGATIVE",
      "A bankruptcy record was detected. This is a significant negative indicator for credit quality and repayment capacity."
    );
  }
  return factor(
    "PR_BANKRUPTCY",
    "Bankruptcy History",
    "No bankruptcy on record",
    20,
    "POSITIVE",
    "No bankruptcy history detected. Clean record is a strong positive signal for the business's credit profile."
  );
}

function rule_PR_LIENS(biz) {
  const count = biz.lien_count || 0;
  if (count > 0) {
    return factor(
      "PR_LIENS",
      "Liens & Judgments",
      `${count} lien(s) on record`,
      -12,
      "NEGATIVE",
      `${count} outstanding lien(s) or judgment(s) detected. This indicates potential unresolved financial or legal obligations.`
    );
  }
  return factor(
    "PR_LIENS",
    "Liens & Judgments",
    "No liens or judgments",
    16,
    "POSITIVE",
    "No liens or judgments found. The business has a clean public record with no outstanding legal encumbrances."
  );
}

// ─── BUSINESS_OPERATIONS ─────────────────────────────────────────────────────

function rule_BO_BUSINESS_AGE(biz) {
  if (!biz.year_created) {
    return factor(
      "BO_BUSINESS_AGE",
      "Business Age",
      "Year founded unknown",
      -4,
      "NEGATIVE",
      "Year of business formation was not provided. Unable to assess operating maturity."
    );
  }
  const age = CURRENT_YEAR - biz.year_created;
  if (age >= 20) {
    return factor(
      "BO_BUSINESS_AGE",
      "Business Age",
      `${age} years in operation`,
      20,
      "POSITIVE",
      `The business has been operating for ${age} years. Exceptional operating tenure — a premier indicator of stability and creditworthiness.`
    );
  }
  if (age > 5) {
    return factor(
      "BO_BUSINESS_AGE",
      "Business Age",
      `${age} years in operation`,
      12,
      "POSITIVE",
      `The business has been operating for ${age} years, demonstrating strong operating maturity and long-term stability.`
    );
  }
  if (age >= 2) {
    return factor(
      "BO_BUSINESS_AGE",
      "Business Age",
      `${age} years in operation`,
      4,
      "NEUTRAL",
      `The business has been operating for ${age} years. Early-to-mid-stage maturity — moderate positive signal.`
    );
  }
  return factor(
    "BO_BUSINESS_AGE",
    "Business Age",
    `${age} year(s) in operation`,
    -10,
    "NEGATIVE",
    `The business is less than 2 years old (${age} year(s)). Early-stage businesses carry significantly higher operational risk.`
  );
}

function rule_BO_WAGE_STABILITY(biz) {
  const wages = biz.total_wages;
  if (wages == null) {
    return factor(
      "BO_WAGE_STABILITY",
      "Wage Stability",
      "Total wages not reported",
      -2,
      "NEGATIVE",
      "Total wages were not provided. Unable to assess workforce stability or payroll consistency."
    );
  }
  if (wages > 50000) {
    return factor(
      "BO_WAGE_STABILITY",
      "Wage Stability",
      `$${wages.toLocaleString()} in total wages`,
      8,
      "POSITIVE",
      "Significant wage payments indicate an active workforce and strong operational stability."
    );
  }
  if (wages > 0) {
    return factor(
      "BO_WAGE_STABILITY",
      "Wage Stability",
      `$${wages.toLocaleString()} in total wages`,
      4,
      "NEUTRAL",
      "Modest wage payments. Business appears to have some workforce activity but limited payroll scale."
    );
  }
  return factor(
    "BO_WAGE_STABILITY",
    "Wage Stability",
    "No wages reported",
    -4,
    "NEGATIVE",
    "No wages reported. May indicate a sole proprietor or a business without a stable payroll."
  );
}

// ─── COMPANY_PROFILE ─────────────────────────────────────────────────────────

function rule_CP_WEBSITE_PRESENCE(biz) {
  if (biz.official_website && biz.official_website.trim() !== "") {
    return factor(
      "CP_WEBSITE_PRESENCE",
      "Website Presence",
      biz.official_website,
      4,
      "POSITIVE",
      "Business has an official website, indicating digital legitimacy and a verified public-facing presence."
    );
  }
  return factor(
    "CP_WEBSITE_PRESENCE",
    "Website Presence",
    "No website provided",
    -6,
    "NEGATIVE",
    "No official website was provided. This reduces confidence in the business's public profile and digital footprint."
  );
}

function rule_CP_INDUSTRY_RISK(biz) {
  const industry = (biz.industry || "").toLowerCase();
  if (HIGH_RISK_INDUSTRIES.includes(industry)) {
    return factor(
      "CP_INDUSTRY_RISK",
      "Industry Risk",
      `${biz.industry} (High-Risk)`,
      -7,
      "NEGATIVE",
      `The business operates in the ${biz.industry} industry, which is classified as high-risk due to elevated default rates, regulatory complexity, or market volatility.`
    );
  }
  return factor(
    "CP_INDUSTRY_RISK",
    "Industry Risk",
    biz.industry || "Standard",
    0,
    "NEUTRAL",
    "Industry does not fall into a high-risk classification. No industry-level risk adjustment applied."
  );
}

function rule_CP_OWNERSHIP_COMPLETENESS(biz) {
  const pct = biz.owner1_ownership_percentage;
  if (pct != null && pct >= 25) {
    return factor(
      "CP_OWNERSHIP_COMPLETENESS",
      "Ownership Completeness",
      `${pct}% ownership declared`,
      4,
      "POSITIVE",
      "Primary ownership information is complete with a declared stake of 25% or greater. Supports accountability and identity verification."
    );
  }
  return factor(
    "CP_OWNERSHIP_COMPLETENESS",
    "Ownership Completeness",
    pct != null ? `${pct}% ownership declared` : "Ownership percentage not provided",
    0,
    "NEUTRAL",
    "Ownership percentage was not provided or falls below the 25% threshold. Ownership structure is incomplete."
  );
}

function rule_CP_APPLICANT_COMPLETENESS(biz) {
  const hasApplicant =
    biz.applicant_first_name && biz.applicant_last_name && biz.applicant_email;
  const hasOwner = biz.owner1_first_name && biz.owner1_last_name;
  if (hasApplicant && hasOwner) {
    return factor(
      "CP_APPLICANT_COMPLETENESS",
      "Applicant & Owner Profile",
      "Complete applicant and owner info",
      6,
      "POSITIVE",
      "Full applicant and primary owner information provided. Supports identity verification, accountability, and KYB completeness."
    );
  }
  if (hasApplicant || hasOwner) {
    return factor(
      "CP_APPLICANT_COMPLETENESS",
      "Applicant & Owner Profile",
      "Partial applicant or owner info",
      2,
      "NEUTRAL",
      "Partial applicant or owner information provided. Complete profiles are preferred for thorough risk assessment."
    );
  }
  return factor(
    "CP_APPLICANT_COMPLETENESS",
    "Applicant & Owner Profile",
    "Applicant and owner info missing",
    -2,
    "NEGATIVE",
    "Both applicant and owner information are incomplete. This limits the ability to verify business identity and ownership."
  );
}

// ─── FINANCIAL_TRENDS ────────────────────────────────────────────────────────

function rule_FT_TOTAL_INCOME(biz) {
  const income = biz.annual_total_income;
  if (income == null) {
    return factor(
      "FT_TOTAL_INCOME",
      "Annual Total Income",
      "Not reported",
      -5,
      "NEGATIVE",
      "Annual total income was not provided. Financial visibility is significantly limited without revenue data."
    );
  }
  if (income > 1000000) {
    return factor(
      "FT_TOTAL_INCOME",
      "Annual Total Income",
      `$${income.toLocaleString()}`,
      12,
      "POSITIVE",
      `Annual total income of $${income.toLocaleString()} exceeds $1M — a strong revenue indicator supporting debt serviceability.`
    );
  }
  if (income > 500000) {
    return factor(
      "FT_TOTAL_INCOME",
      "Annual Total Income",
      `$${income.toLocaleString()}`,
      10,
      "POSITIVE",
      `Annual total income of $${income.toLocaleString()} exceeds $500K — solid revenue base for underwriting consideration.`
    );
  }
  if (income > 100000) {
    return factor(
      "FT_TOTAL_INCOME",
      "Annual Total Income",
      `$${income.toLocaleString()}`,
      5,
      "NEUTRAL",
      `Annual total income of $${income.toLocaleString()} is modest. Acceptable for early-stage businesses, but limited capacity for larger obligations.`
    );
  }
  return factor(
    "FT_TOTAL_INCOME",
    "Annual Total Income",
    `$${income.toLocaleString()}`,
    -3,
    "NEGATIVE",
    `Annual total income of $${income.toLocaleString()} is below $100K. Revenue may be insufficient to support debt obligations.`
  );
}

function rule_FT_NET_INCOME(biz) {
  const net = biz.annual_net_income;
  if (net == null) {
    return factor(
      "FT_NET_INCOME",
      "Annual Net Income",
      "Not reported",
      0,
      "NEUTRAL",
      "Annual net income was not provided. Profitability assessment skipped."
    );
  }
  if (net > 0) {
    return factor(
      "FT_NET_INCOME",
      "Annual Net Income",
      `$${net.toLocaleString()}`,
      8,
      "POSITIVE",
      `The business is profitable with a net income of $${net.toLocaleString()}. Positive cash flow significantly reduces default risk.`
    );
  }
  if (net === 0) {
    return factor(
      "FT_NET_INCOME",
      "Annual Net Income",
      "$0 (break-even)",
      0,
      "NEUTRAL",
      "Business is breaking even. No declared profit, but also no operating loss."
    );
  }
  return factor(
    "FT_NET_INCOME",
    "Annual Net Income",
    `-$${Math.abs(net).toLocaleString()} (loss)`,
    -5,
    "NEGATIVE",
    `The business reported a net loss of $${Math.abs(net).toLocaleString()}. Operating losses increase the risk of default.`
  );
}

function rule_FT_ASSET_LIABILITY_RATIO(biz) {
  const assets = biz.total_assets;
  const liabilities = biz.total_liabilities;
  if (assets == null || liabilities == null) {
    return factor(
      "FT_ASSET_LIABILITY_RATIO",
      "Assets vs. Liabilities",
      "Not reported",
      0,
      "NEUTRAL",
      "Asset or liability data was not provided. Balance sheet assessment skipped."
    );
  }
  if (assets > liabilities) {
    const ratio = (assets / Math.max(liabilities, 1)).toFixed(2);
    return factor(
      "FT_ASSET_LIABILITY_RATIO",
      "Assets vs. Liabilities",
      `$${assets.toLocaleString()} assets / $${liabilities.toLocaleString()} liabilities (${ratio}x)`,
      8,
      "POSITIVE",
      `Total assets exceed liabilities by a ratio of ${ratio}x. A positive net asset position is a strong balance sheet indicator.`
    );
  }
  if (assets === liabilities) {
    return factor(
      "FT_ASSET_LIABILITY_RATIO",
      "Assets vs. Liabilities",
      `$${assets.toLocaleString()} assets = $${liabilities.toLocaleString()} liabilities`,
      0,
      "NEUTRAL",
      "Assets equal liabilities. The business has a neutral net asset position."
    );
  }
  return factor(
    "FT_ASSET_LIABILITY_RATIO",
    "Assets vs. Liabilities",
    `$${assets.toLocaleString()} assets / $${liabilities.toLocaleString()} liabilities`,
    -10,
    "NEGATIVE",
    "Total liabilities exceed total assets. Negative net asset position is a significant credit risk flag."
  );
}

function rule_FT_UNUSUAL_INCOME(biz) {
  const income = biz.annual_total_income;
  const yearCreated = biz.year_created;
  if (!income || !yearCreated) return null; // not enough data to evaluate

  const age = CURRENT_YEAR - yearCreated;
  if (income > 5000000 && age < 3) {
    return factor(
      "FT_UNUSUAL_INCOME",
      "Income vs. Business Age",
      `$${income.toLocaleString()} revenue, ${age} year(s) old`,
      -10,
      "NEGATIVE",
      `Revenue of $${income.toLocaleString()} is unusually high for a business only ${age} year(s) old. This anomaly may warrant additional verification.`
    );
  }
  return null; // Rule not triggered — no factor emitted
}

// ─── PERFORMANCE_MEASURES ────────────────────────────────────────────────────

function rule_PM_REVIEW_SCORE(biz) {
  const score = biz.social_review_score;
  if (score == null) {
    return factor(
      "PM_REVIEW_SCORE",
      "Social Review Score",
      "Not available",
      0,
      "NEUTRAL",
      "Social review score was not provided. Online reputation assessment skipped."
    );
  }
  if (score === 5.0) {
    return factor(
      "PM_REVIEW_SCORE",
      "Social Review Score",
      `${score} / 5.0`,
      15,
      "POSITIVE",
      `Perfect review score of ${score}/5.0. Outstanding and consistent public reputation across all channels.`
    );
  }
  if (score > 4.5) {
    return factor(
      "PM_REVIEW_SCORE",
      "Social Review Score",
      `${score} / 5.0`,
      10,
      "POSITIVE",
      `Exceptional review score of ${score}/5.0. Strong public reputation and customer satisfaction signal.`
    );
  }
  if (score > 4.2) {
    return factor(
      "PM_REVIEW_SCORE",
      "Social Review Score",
      `${score} / 5.0`,
      8,
      "POSITIVE",
      `Good review score of ${score}/5.0. Business has a solid and consistent online reputation.`
    );
  }
  if (score >= 3.5) {
    return factor(
      "PM_REVIEW_SCORE",
      "Social Review Score",
      `${score} / 5.0`,
      3,
      "NEUTRAL",
      `Average review score of ${score}/5.0. Room for improvement, but not a significant negative signal.`
    );
  }
  return factor(
    "PM_REVIEW_SCORE",
    "Social Review Score",
    `${score} / 5.0`,
    -8,
    "NEGATIVE",
    `Below-average review score of ${score}/5.0. Weak public reputation may indicate customer dissatisfaction or service quality issues.`
  );
}

function rule_PM_EQUITY(biz) {
  const equity = biz.total_equity;
  if (equity == null) {
    return factor(
      "PM_EQUITY",
      "Total Equity",
      "Not reported",
      0,
      "NEUTRAL",
      "Total equity was not provided. Owner equity assessment skipped."
    );
  }
  if (equity > 0) {
    return factor(
      "PM_EQUITY",
      "Total Equity",
      `$${equity.toLocaleString()}`,
      5,
      "POSITIVE",
      `Positive equity of $${equity.toLocaleString()} indicates the business owns more than it owes — a healthy ownership position.`
    );
  }
  return factor(
    "PM_EQUITY",
    "Total Equity",
    `-$${Math.abs(equity).toLocaleString()} (negative equity)`,
    -3,
    "NEGATIVE",
    `Negative equity of -$${Math.abs(equity).toLocaleString()} indicates the business owes more than it owns. This is a balance sheet risk flag.`
  );
}

function rule_FT_NET_MARGIN(biz) {
  const income = biz.annual_total_income;
  const net = biz.annual_net_income;
  if (!income || !net || income <= 0) return null;

  const margin = net / income;
  if (margin >= 0.40) {
    return factor(
      "FT_NET_MARGIN",
      "Net Profit Margin",
      `${(margin * 100).toFixed(1)}% net margin`,
      10,
      "POSITIVE",
      `Net profit margin of ${(margin * 100).toFixed(1)}% is exceptional. High margins indicate strong pricing power and operational efficiency.`
    );
  }
  if (margin >= 0.20) {
    return factor(
      "FT_NET_MARGIN",
      "Net Profit Margin",
      `${(margin * 100).toFixed(1)}% net margin`,
      5,
      "POSITIVE",
      `Net profit margin of ${(margin * 100).toFixed(1)}% is healthy. Business is retaining a solid portion of revenue as profit.`
    );
  }
  return null; // Below 20% — no adjustment
}

function rule_CP_PROFILE_COMPLETENESS(biz) {
  const hasWebsite = biz.official_website && biz.official_website.trim() !== "";
  const hasApplicant = biz.applicant_first_name && biz.applicant_last_name && biz.applicant_email;
  const hasOwner = biz.owner1_first_name && biz.owner1_last_name && biz.owner1_ownership_percentage >= 25;
  if (hasWebsite && hasApplicant && hasOwner) {
    return factor(
      "CP_PROFILE_COMPLETENESS",
      "Full Profile Completeness",
      "Website, applicant, and owner all verified",
      16,
      "POSITIVE",
      "Business profile is fully complete: website, applicant identity, and ownership are all on record. Maximum confidence in business identity."
    );
  }
  return null;
}

function rule_PM_EQUITY_RATIO(biz) {
  const equity = biz.total_equity;
  const assets = biz.total_assets;
  if (equity == null || assets == null || assets <= 0) return null;

  const ratio = equity / assets;
  if (ratio >= 0.75) {
    return factor(
      "PM_EQUITY_RATIO",
      "Equity-to-Asset Ratio",
      `${(ratio * 100).toFixed(1)}% equity ratio`,
      10,
      "POSITIVE",
      `Equity represents ${(ratio * 100).toFixed(1)}% of total assets. An exceptionally strong ownership position with minimal leverage.`
    );
  }
  if (ratio >= 0.40) {
    return factor(
      "PM_EQUITY_RATIO",
      "Equity-to-Asset Ratio",
      `${(ratio * 100).toFixed(1)}% equity ratio`,
      5,
      "POSITIVE",
      `Equity represents ${(ratio * 100).toFixed(1)}% of total assets. Healthy ownership position indicating moderate leverage.`
    );
  }
  return null;
}

// ─── Rule registry ────────────────────────────────────────────────────────────

const RULES_BY_CATEGORY = {
  PUBLIC_RECORDS: [rule_PR_BANKRUPTCY, rule_PR_LIENS],
  BUSINESS_OPERATIONS: [rule_BO_BUSINESS_AGE, rule_BO_WAGE_STABILITY],
  COMPANY_PROFILE: [
    rule_CP_WEBSITE_PRESENCE,
    rule_CP_INDUSTRY_RISK,
    rule_CP_OWNERSHIP_COMPLETENESS,
    rule_CP_APPLICANT_COMPLETENESS,
    rule_CP_PROFILE_COMPLETENESS,
  ],
  FINANCIAL_TRENDS: [
    rule_FT_TOTAL_INCOME,
    rule_FT_NET_INCOME,
    rule_FT_ASSET_LIABILITY_RATIO,
    rule_FT_UNUSUAL_INCOME,
    rule_FT_NET_MARGIN,
  ],
  PERFORMANCE_MEASURES: [rule_PM_REVIEW_SCORE, rule_PM_EQUITY, rule_PM_EQUITY_RATIO],
};

module.exports = { RULES_BY_CATEGORY };
