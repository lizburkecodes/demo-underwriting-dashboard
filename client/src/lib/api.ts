/**
 * Typed API client for the underwriting dashboard backend.
 */
import axios, { AxiosResponse } from "axios";
import type { ScoreResult, ExampleBusiness, BusinessPayload } from "../types/score";

const BASE_URL = "http://localhost:4000/api";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const api = {
  /** Fetch the 3 seeded example businesses */
  getExamples: (): Promise<AxiosResponse<{ examples: ExampleBusiness[] }>> =>
    client.get("/businesses/examples"),

  /** Onboard a new business (in-memory) */
  addBusiness: (payload: BusinessPayload): Promise<AxiosResponse<{ id: string }>> =>
    client.post("/businesses/add", payload),

  /** Run underwriting evaluation and return a typed score result */
  evaluate: (payload: BusinessPayload): Promise<AxiosResponse<{ result: ScoreResult }>> =>
    client.post("/businesses/evaluate", payload),
};
