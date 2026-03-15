/**
 * Default form values for the Business Onboarding Form.
 * Typed as BusinessPayload to stay in sync with the API interface.
 */
import type { BusinessPayload } from "../types/score";

export const defaultFormValues: BusinessPayload = {
  external_id: "",
  name: "",
  tin: "",
  official_website: "",
  industry: "",
  year_created: "",
  address_line_1: "",
  address_city: "",
  address_state: "",
  address_postal_code: "",
  address_country: "US",
  annual_total_income: "",
  annual_net_income: "",
  total_wages: "",
  total_liabilities: "",
  total_assets: "",
  total_equity: "",
  social_review_score: "",
  has_bankruptcy: false,
  lien_count: "0",
  applicant_first_name: "",
  applicant_last_name: "",
  applicant_email: "",
  owner1_first_name: "",
  owner1_last_name: "",
  owner1_title: "",
  owner1_owner_type: "",
  owner1_ownership_percentage: "",
  bank_name: "",
  institution_name: "",
  bank_account_type: "",
};
