/**
 * BusinessOnboardingForm
 *
 * A business intake form grouped into logical sections.
 * Controlled by the parent via `formData` / `onChange`.
 */
export default function BusinessOnboardingForm({ formData, onChange, onSubmit, isLoading }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange(name, type === "checkbox" ? checked : value);
  };

  // ── Shared input class ──────────────────────────────────────────────────────
  const input =
    "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition";

  const label = "block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1";

  return (
    <form onSubmit={onSubmit} className="space-y-6">

      {/* ── Business Identity ─────────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Business Identity
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={label}>Business Name *</label>
            <input name="name" value={formData.name} onChange={handleChange}
              className={input} placeholder="Acme Corp" required />
          </div>
          <div>
            <label className={label}>External ID</label>
            <input name="external_id" value={formData.external_id} onChange={handleChange}
              className={input} placeholder="biz-001" />
          </div>
          <div>
            <label className={label}>TIN / EIN</label>
            <input name="tin" value={formData.tin} onChange={handleChange}
              className={input} placeholder="12-3456789" />
          </div>
          <div className="col-span-2">
            <label className={label}>Official Website</label>
            <input name="official_website" value={formData.official_website} onChange={handleChange}
              className={input} placeholder="https://example.com" />
          </div>
          <div>
            <label className={label}>Industry</label>
            <input name="industry" value={formData.industry} onChange={handleChange}
              className={input} placeholder="e.g. consulting, retail" />
          </div>
          <div>
            <label className={label}>Year Founded</label>
            <input name="year_created" type="number" value={formData.year_created} onChange={handleChange}
              className={input} placeholder="2018" min="1800" max="2099" />
          </div>
        </div>
      </section>

      {/* ── Address ───────────────────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Address
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={label}>Street Address</label>
            <input name="address_line_1" value={formData.address_line_1} onChange={handleChange}
              className={input} placeholder="123 Main St" />
          </div>
          <div>
            <label className={label}>City</label>
            <input name="address_city" value={formData.address_city} onChange={handleChange}
              className={input} placeholder="Chicago" />
          </div>
          <div>
            <label className={label}>State</label>
            <input name="address_state" value={formData.address_state} onChange={handleChange}
              className={input} placeholder="IL" maxLength={2} />
          </div>
          <div>
            <label className={label}>Postal Code</label>
            <input name="address_postal_code" value={formData.address_postal_code} onChange={handleChange}
              className={input} placeholder="60601" />
          </div>
          <div>
            <label className={label}>Country</label>
            <input name="address_country" value={formData.address_country} onChange={handleChange}
              className={input} placeholder="US" />
          </div>
        </div>
      </section>

      {/* ── Financials ────────────────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Financial Data
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Annual Total Income</label>
            <input name="annual_total_income" type="number" value={formData.annual_total_income} onChange={handleChange}
              className={input} placeholder="500000" />
          </div>
          <div>
            <label className={label}>Annual Net Income</label>
            <input name="annual_net_income" type="number" value={formData.annual_net_income} onChange={handleChange}
              className={input} placeholder="80000" />
          </div>
          <div>
            <label className={label}>Total Wages</label>
            <input name="total_wages" type="number" value={formData.total_wages} onChange={handleChange}
              className={input} placeholder="200000" />
          </div>
          <div>
            <label className={label}>Total Assets</label>
            <input name="total_assets" type="number" value={formData.total_assets} onChange={handleChange}
              className={input} placeholder="900000" />
          </div>
          <div>
            <label className={label}>Total Liabilities</label>
            <input name="total_liabilities" type="number" value={formData.total_liabilities} onChange={handleChange}
              className={input} placeholder="400000" />
          </div>
          <div>
            <label className={label}>Total Equity</label>
            <input name="total_equity" type="number" value={formData.total_equity} onChange={handleChange}
              className={input} placeholder="500000" />
          </div>
        </div>
      </section>

      {/* ── Public Records ────────────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Public Records
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Lien / Judgment Count</label>
            <input name="lien_count" type="number" value={formData.lien_count} onChange={handleChange}
              className={input} placeholder="0" min="0" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                name="has_bankruptcy"
                type="checkbox"
                checked={formData.has_bankruptcy}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium">Bankruptcy on record</span>
            </label>
          </div>
        </div>
      </section>

      {/* ── Social & Online ───────────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Social & Online
        </h3>
        <div>
          <label className={label}>Social Review Score (0–5)</label>
          <input name="social_review_score" type="number" value={formData.social_review_score} onChange={handleChange}
            className={input} placeholder="4.2" min="0" max="5" step="0.1" />
        </div>
      </section>

      {/* ── Applicant ─────────────────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Applicant
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>First Name</label>
            <input name="applicant_first_name" value={formData.applicant_first_name} onChange={handleChange}
              className={input} placeholder="Jane" />
          </div>
          <div>
            <label className={label}>Last Name</label>
            <input name="applicant_last_name" value={formData.applicant_last_name} onChange={handleChange}
              className={input} placeholder="Doe" />
          </div>
          <div className="col-span-2">
            <label className={label}>Email</label>
            <input name="applicant_email" type="email" value={formData.applicant_email} onChange={handleChange}
              className={input} placeholder="jane@example.com" />
          </div>
        </div>
      </section>

      {/* ── Primary Owner ─────────────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Primary Owner
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>First Name</label>
            <input name="owner1_first_name" value={formData.owner1_first_name} onChange={handleChange}
              className={input} placeholder="Jane" />
          </div>
          <div>
            <label className={label}>Last Name</label>
            <input name="owner1_last_name" value={formData.owner1_last_name} onChange={handleChange}
              className={input} placeholder="Doe" />
          </div>
          <div>
            <label className={label}>Title</label>
            <input name="owner1_title" value={formData.owner1_title} onChange={handleChange}
              className={input} placeholder="CEO" />
          </div>
          <div>
            <label className={label}>Owner Type</label>
            <select name="owner1_owner_type" value={formData.owner1_owner_type} onChange={handleChange}
              className={input}>
              <option value="">Select...</option>
              <option value="individual">Individual</option>
              <option value="entity">Entity</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className={label}>Ownership % </label>
            <input name="owner1_ownership_percentage" type="number" value={formData.owner1_ownership_percentage} onChange={handleChange}
              className={input} placeholder="51" min="0" max="100" />
          </div>
        </div>
      </section>

      {/* ── Banking ───────────────────────────────────────── */}
      <section>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">
          Banking
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Bank Name</label>
            <input name="bank_name" value={formData.bank_name} onChange={handleChange}
              className={input} placeholder="First National Bank" />
          </div>
          <div>
            <label className={label}>Institution Name</label>
            <input name="institution_name" value={formData.institution_name} onChange={handleChange}
              className={input} placeholder="First National Bank" />
          </div>
          <div className="col-span-2">
            <label className={label}>Account Type</label>
            <select name="bank_account_type" value={formData.bank_account_type} onChange={handleChange}
              className={input}>
              <option value="">Select...</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Submit ────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transition"
      >
        {isLoading ? "Evaluating…" : "Run Underwriting Evaluation →"}
      </button>
    </form>
  );
}
