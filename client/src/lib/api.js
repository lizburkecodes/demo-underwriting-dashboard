/**
 * API client for the underwriting dashboard backend.
 */
import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const api = {
  /** Fetch the 3 seeded example businesses */
  getExamples: () => client.get("/businesses/examples"),

  /** Onboard a new business (in-memory) */
  addBusiness: (payload) => client.post("/businesses/add", payload),

  /** Run underwriting evaluation on a payload or by business_id */
  evaluate: (payloadOrId) => client.post("/businesses/evaluate", payloadOrId),
};
