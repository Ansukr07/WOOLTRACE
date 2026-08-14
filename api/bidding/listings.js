import dbConnect from '../_utils/db.js';
import BiddingListing from '../_models/BiddingListing.js';
import WoolBatch from '../_models/WoolBatch.js';
import Bid from '../_models/Bid.js';
import QualityCertificate from '../_models/QualityCertificate.js';

export default async function handler(req, res) {
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
    if (farmerId) query.farmerId = farmerId; // For farmer to see their own listings

    const listings = await BiddingListing.find(query).sort({ endTime: 1 });
    
    const detailedListings = await Promise.all(listings.map(async (l) => {
      const batch = await WoolBatch.findOne({ batchId: l.batchId });
      const certificate = await QualityCertificate.findOne({ batchId: l.batchId });
      const highestBid = await Bid.findOne({ listingId: l.listingId }).sort({ pricePerKg: -1 });
      const bidsCount = await Bid.countDocuments({ listingId: l.listingId });
      
      return {
        ...l.toObject(),
        batch,
        certificate,
        highestBid: highestBid ? highestBid.pricePerKg : null,
        bidsCount
      };
    }));

    res.status(200).json({ success: true, data: detailedListings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
