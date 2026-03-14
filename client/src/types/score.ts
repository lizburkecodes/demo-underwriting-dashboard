/**
 * TypeScript interfaces for the underwriting score API response.
 * These mirror the shape returned by POST /api/businesses/evaluate.
 */

export interface ScoreFactor {
  code: string;
  label: string;
  value: string;
  score_100: number;
  weighted_score_100: number;
  score_850: number;
  weighted_score_850: number;
  status: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  log: string;
}

export interface ScoreCategory {
  code: string;
  label: string;
  total_weightage: number;
  score: number;
  score_100: number;
  score_850: number;
  factors: ScoreFactor[];
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ScoreDecision = "APPROVE" | "REVIEW" | "DECLINE";

export interface ScoreResult {
  business_id: string | null;
  business_name: string;
  version: string;
  evaluated_at: string;
  base_score: number;
  weighted_score_100: number;
  weighted_score_850: number;
  risk_level: RiskLevel;
  score_decision: ScoreDecision;
  score_distribution: ScoreCategory[];
  top_positive_factors: ScoreFactor[];
  top_negative_factors: ScoreFactor[];
  underwriting_summary: string;
}

/** Shape of a single example business from GET /api/businesses/examples */
export interface ExampleBusiness {
  id: string;
  label: string;
  riskHint: RiskLevel;
  description: string;
  payload: BusinessPayload;
}

/** The intake form / API request payload shape */
export interface BusinessPayload {
  external_id?: string;
  name: string;
  tin?: string;
  official_website?: string;
  industry?: string;
  year_created?: number | string;
  address_line_1?: string;
  address_city?: string;
  address_state?: string;
  address_postal_code?: string;
  address_country?: string;
  annual_total_income?: number | string;
  annual_net_income?: number | string;
  total_wages?: number | string;
  total_liabilities?: number | string;
  total_assets?: number | string;
  total_equity?: number | string;
  social_review_score?: number | string;
  has_bankruptcy?: boolean;
  lien_count?: number | string;
  applicant_first_name?: string;
  applicant_last_name?: string;
  applicant_email?: string;
  owner1_first_name?: string;
  owner1_last_name?: string;
  owner1_title?: string;
  owner1_owner_type?: string;
  owner1_ownership_percentage?: number | string;
  bank_name?: string;
  institution_name?: string;
  bank_account_type?: string;
}
