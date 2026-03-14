/**
 * Score category definitions.
 * Categories mirror the underwriting score_distribution structure.
 * Weights must sum to 100.
 */

const SCORE_CATEGORIES = [
  {
    code: "PUBLIC_RECORDS",
    label: "Public Records",
    weight: 20,
  },
  {
    code: "BUSINESS_OPERATIONS",
    label: "Business Operations",
    weight: 20,
  },
  {
    code: "COMPANY_PROFILE",
    label: "Company Profile",
    weight: 20,
  },
  {
    code: "FINANCIAL_TRENDS",
    label: "Financial Trends",
    weight: 25,
  },
  {
    code: "PERFORMANCE_MEASURES",
    label: "Performance Measures",
    weight: 15,
  },
];

module.exports = { SCORE_CATEGORIES };
