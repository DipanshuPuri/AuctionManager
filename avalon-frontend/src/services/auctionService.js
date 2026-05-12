import API from './api';

// ---------------------------------------------------------------------------
// Auction Service – Avalon Frontend
// ---------------------------------------------------------------------------
// All auction-related API calls.
// ---------------------------------------------------------------------------

/**
 * Create a new auction with optional image upload.
 * @param {FormData} formData – multipart form data
 * @returns {Promise}
 */
export const createAuction = async (formData) => {
  const res = await API.post('/auctions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

/**
 * Get paginated list of auctions.
 * @param {number} page
 * @param {number} limit
 * @param {string} status – optional filter (active, closed, upcoming)
 * @returns {Promise}
 */
export const getAuctions = async (page = 1, limit = 10, status = '') => {
  const params = { page, limit };
  if (status) params.status = status;
  const res = await API.get('/auctions', { params });
  return res.data;
};

/**
 * Get a single auction by ID.
 * @param {number} id
 * @returns {Promise}
 */
export const getAuctionById = async (id) => {
  const res = await API.get(`/auctions/${id}`);
  return res.data;
};

/**
 * Update an auction.
 * @param {number} id
 * @param {FormData} formData
 * @returns {Promise}
 */
export const updateAuction = async (id, formData) => {
  const res = await API.put(`/auctions/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

/**
 * Delete an auction.
 * @param {number} id
 * @returns {Promise}
 */
export const deleteAuction = async (id) => {
  const res = await API.delete(`/auctions/${id}`);
  return res.data;
};

/**
 * Place a bid on an auction.
 * @param {{ auction_id: number, amount: number }} data
 * @returns {Promise}
 */
export const placeBid = async (data) => {
  const res = await API.post('/bids', data);
  return res.data;
};

/**
 * Get all bids for an auction.
 * @param {number} auctionId
 * @returns {Promise}
 */
export const getBidsByAuction = async (auctionId) => {
  const res = await API.get(`/bids/auction/${auctionId}`);
  return res.data;
};

/**
 * Close an auction (seller only).
 * @param {number} id
 * @returns {Promise}
 */
export const closeAuction = async (id) => {
  const res = await API.post(`/auctions/${id}/close`);
  return res.data;
};
