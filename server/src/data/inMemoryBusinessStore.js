/**
 * Simple in-memory business store.
 * Businesses added via POST /api/businesses/add are stored here for the session.
 */

const businesses = new Map();
let idCounter = 1;

/**
 * Add a normalized business payload to the store.
 * @param {object} payload - Normalized business object
 * @returns {object} Stored record with generated id
 */
function addBusiness(payload) {
  const id = `biz-${String(idCounter++).padStart(4, "0")}`;
  const record = { ...payload, id, created_at: new Date().toISOString() };
  businesses.set(id, record);
  return record;
}

/**
 * Retrieve a business by its id.
 * @param {string} id
 * @returns {object|null}
 */
function getBusinessById(id) {
  return businesses.get(id) || null;
}

/**
 * Retrieve all stored businesses.
 * @returns {object[]}
 */
function getAllBusinesses() {
  return Array.from(businesses.values());
}

module.exports = { addBusiness, getBusinessById, getAllBusinesses };
