/**
 * Normalize and validate an incoming business payload.
 * Returns a clean, typed object with consistent field names.
 * Throws an error if critical required fields are missing.
 */

function normalizeBusinessPayload(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid payload: expected a JSON object.");
  }

  if (!raw.name || typeof raw.name !== "string" || raw.name.trim() === "") {
    throw new Error("Validation error: 'name' is required.");
  }

  return {
    external_id: raw.external_id || null,
    name: raw.name.trim(),
    tin: raw.tin || null,
    official_website: raw.official_website ? raw.official_website.trim() : null,
    industry: raw.industry ? raw.industry.toLowerCase().trim() : null,
    year_created: raw.year_created != null ? parseInt(raw.year_created, 10) : null,

    // Address
    address_line_1: raw.address_line_1 || null,
    address_city: raw.address_city || null,
    address_state: raw.address_state || null,
    address_postal_code: raw.address_postal_code || null,
    address_country: raw.address_country || "US",

    // Financials (parse to float to handle string inputs from forms)
    annual_total_income:
      raw.annual_total_income != null && raw.annual_total_income !== ""
        ? parseFloat(raw.annual_total_income)
        : null,
    annual_net_income:
      raw.annual_net_income != null && raw.annual_net_income !== ""
        ? parseFloat(raw.annual_net_income)
        : null,
    total_wages:
      raw.total_wages != null && raw.total_wages !== ""
        ? parseFloat(raw.total_wages)
        : null,
    total_liabilities:
      raw.total_liabilities != null && raw.total_liabilities !== ""
        ? parseFloat(raw.total_liabilities)
        : null,
    total_assets:
      raw.total_assets != null && raw.total_assets !== ""
        ? parseFloat(raw.total_assets)
        : null,
    total_equity:
      raw.total_equity != null && raw.total_equity !== ""
        ? parseFloat(raw.total_equity)
        : null,

    // Social
    social_review_score:
      raw.social_review_score != null && raw.social_review_score !== ""
        ? parseFloat(raw.social_review_score)
        : null,

    // Public records flags (additional fields for demo scoring)
    has_bankruptcy:
      raw.has_bankruptcy === true ||
      raw.has_bankruptcy === "true" ||
      raw.has_bankruptcy === 1,
    lien_count:
      raw.lien_count != null && raw.lien_count !== ""
        ? parseInt(raw.lien_count, 10)
        : 0,

    // Applicant
    applicant_first_name: raw.applicant_first_name || null,
    applicant_last_name: raw.applicant_last_name || null,
    applicant_email: raw.applicant_email || null,

    // Primary owner
    owner1_first_name: raw.owner1_first_name || null,
    owner1_last_name: raw.owner1_last_name || null,
    owner1_title: raw.owner1_title || null,
    owner1_owner_type: raw.owner1_owner_type || null,
    owner1_ownership_percentage:
      raw.owner1_ownership_percentage != null && raw.owner1_ownership_percentage !== ""
        ? parseFloat(raw.owner1_ownership_percentage)
        : null,

    // Banking
    bank_name: raw.bank_name || null,
    institution_name: raw.institution_name || null,
    bank_account_type: raw.bank_account_type || null,
  };
}

module.exports = { normalizeBusinessPayload };
