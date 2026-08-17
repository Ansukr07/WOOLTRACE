import dbConnect from './_utils/db.js';
import BiddingListing from './_models/BiddingListing.js';
import Bid from './_models/Bid.js';
import Order from './_models/Order.js';
import WoolBatch from './_models/WoolBatch.js';
import QualityCertificate from './_models/QualityCertificate.js';

// ── POST /api/bidding/accept ──────────────────────────────────────────────
async function handleAccept(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    await dbConnect();
    const { bidId, farmerId } = req.body;
    const bid = await Bid.findOne({ bidId, farmerId });
    if (!bid) return res.status(404).json({ message: 'Bid not found or unauthorized' });
    const listing = await BiddingListing.findOne({ listingId: bid.listingId });
    if (!listing || listing.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Listing is not active' });
    }
    bid.status = 'ACCEPTED';
    await bid.save();
    await Bid.updateMany({ listingId: bid.listingId, bidId: { $ne: bidId } }, { status: 'REJECTED' });
    listing.status = 'CLOSED';
    await listing.save();
    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
    const order = await Order.create({
      orderId, bidId: bid.bidId, batchId: bid.batchId,
      farmerId: bid.farmerId, buyerId: bid.bidderId,
      quantity: bid.quantity, pricePerKg: bid.pricePerKg,
      totalAmount: bid.totalAmount, paymentStatus: 'PENDING', transportStatus: 'NOT_STARTED'
    });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ── POST /api/bidding/bid ─────────────────────────────────────────────────
async function handleBid(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    await dbConnect();
    const { listingId, bidderId, bidderName, pricePerKg } = req.body;
    const listing = await BiddingListing.findOne({ listingId, status: 'ACTIVE' });
    if (!listing || new Date() > listing.endTime) {
      return res.status(400).json({ message: 'Listing is no longer active' });
    }
    if (listing.farmerId === bidderId) {
      return res.status(400).json({ message: 'Farmer cannot bid on their own batch' });
    }
    const highestBid = await Bid.findOne({ listingId }).sort({ pricePerKg: -1 });
    const minRequired = highestBid ? highestBid.pricePerKg + listing.minimumIncrement : listing.startingPrice;
    if (pricePerKg < minRequired) {
      return res.status(400).json({ message: `Bid must be at least ₹${minRequired}` });
    }
    const batch = await WoolBatch.findOne({ batchId: listing.batchId });
    const totalAmount = pricePerKg * batch.quantity;
    const bidId = `BID-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newBid = await Bid.create({
      bidId, listingId, batchId: listing.batchId, farmerId: listing.farmerId,
      bidderId, bidderName, pricePerKg, quantity: batch.quantity, totalAmount, status: 'HIGHEST'
    });
    if (highestBid) { highestBid.status = 'OUTBID'; await highestBid.save(); }
    res.status(201).json({ success: true, bid: newBid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ── POST /api/bidding/list (create listing) ───────────────────────────────
async function handleCreateListing(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    await dbConnect();
    const { batchId, farmerId, startingPrice, minimumIncrement, durationHours } = req.body;
    const batch = await WoolBatch.findOne({ batchId, farmerId });
    if (!batch) return res.status(404).json({ message: 'Batch not found or unauthorized' });
    const existingListing = await BiddingListing.findOne({ batchId, status: 'ACTIVE' });
    if (existingListing) return res.status(400).json({ message: 'Batch is already listed for bidding' });
    const count = await BiddingListing.countDocuments();
    const listingId = `LIST-${String(count + 1).padStart(5, '0')}`;
    const endTime = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    const listing = await BiddingListing.create({ listingId, batchId, farmerId, startingPrice, minimumIncrement, endTime });
    res.status(201).json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ── GET /api/bidding/listings (get listings) ──────────────────────────────
async function handleGetListings(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    await dbConnect();
    const { id, farmerId } = req.query;
    if (id) {
      const listing = await BiddingListing.findOne({ listingId: id });
      if (!listing) return res.status(404).json({ message: 'Listing not found' });
      const batch = await WoolBatch.findOne({ batchId: listing.batchId });
      const certificate = await QualityCertificate.findOne({ batchId: listing.batchId });
      const bids = await Bid.find({ listingId: id }).sort({ pricePerKg: -1 });
      return res.status(200).json({ success: true, listing, batch, certificate, bids });
    }
    let query = { status: 'ACTIVE', endTime: { $gt: new Date() } };
    if (farmerId) query.farmerId = farmerId;
    const listings = await BiddingListing.find(query).sort({ endTime: 1 });
    const detailedListings = await Promise.all(listings.map(async (l) => {
      const batch = await WoolBatch.findOne({ batchId: l.batchId });
      const certificate = await QualityCertificate.findOne({ batchId: l.batchId });
      const highestBid = await Bid.findOne({ listingId: l.listingId }).sort({ pricePerKg: -1 });
      const bidsCount = await Bid.countDocuments({ listingId: l.listingId });
      return { ...l.toObject(), batch, certificate, highestBid: highestBid ? highestBid.pricePerKg : null, bidsCount };
    }));
    res.status(200).json({ success: true, data: detailedListings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ── Main dispatcher ───────────────────────────────────────────────────────
export default async function handler(req, res) {
  const url = req.url || '';
  if (url.includes('/accept')) return handleAccept(req, res);
  if (url.includes('/bid'))    return handleBid(req, res);
  if (url.includes('/list') && req.method === 'POST') return handleCreateListing(req, res);
  if (url.includes('/listings') || req.method === 'GET') return handleGetListings(req, res);
  return res.status(404).json({ message: 'Not found' });
}
