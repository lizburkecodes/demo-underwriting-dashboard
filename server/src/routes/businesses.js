/**
 * Business routes
 *
 * POST /api/businesses/add       — Onboard a new business (in-memory)
 * GET  /api/businesses/examples  — Return 3 seeded example businesses
 * POST /api/businesses/evaluate  — Run underwriting evaluation
 */

const express = require("express");
const router = express.Router();

const { normalizeBusinessPayload } = require("../utils/normalizeBusinessPayload");
const { addBusiness, getBusinessById } = require("../data/inMemoryBusinessStore");
const { evaluateBusiness } = require("../services/evaluateBusiness");
const exampleBusinesses = require("../data/exampleBusinesses");

// ─── GET /api/businesses/examples ────────────────────────────────────────────
router.get("/examples", (_req, res) => {
  const examples = exampleBusinesses.map(({ id, label, riskHint, description, payload }) => ({
    id,
    label,
    riskHint,
    description,
    payload,
  }));
  res.json({ examples });
});

// ─── POST /api/businesses/add ─────────────────────────────────────────────────
router.post("/add", (req, res) => {
  try {
    const normalized = normalizeBusinessPayload(req.body);
    const record = addBusiness(normalized);
    res.status(201).json({ business: record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── POST /api/businesses/evaluate ───────────────────────────────────────────
// Accepts either:
//   (a) a full business payload, or
//   (b) { business_id } to evaluate a previously added business
router.post("/evaluate", (req, res) => {
  try {
    let businessData;

    if (req.body.business_id) {
      // Look up a stored business by id
      const stored = getBusinessById(req.body.business_id);
      if (!stored) {
        return res
          .status(404)
          .json({ error: `Business with id '${req.body.business_id}' not found.` });
      }
      businessData = stored;
    } else {
      // Normalize the raw payload directly
      businessData = normalizeBusinessPayload(req.body);
    }

    const result = evaluateBusiness(businessData);
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
