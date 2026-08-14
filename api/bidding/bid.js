import dbConnect from '../_utils/db.js';
import BiddingListing from '../_models/BiddingListing.js';
import Bid from '../_models/Bid.js';
import WoolBatch from '../_models/WoolBatch.js';

export default async function handler(req, res) {
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

    const bidId = `BID-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const newBid = await Bid.create({
      bidId,
      listingId,
      batchId: listing.batchId,
      farmerId: listing.farmerId,
      bidderId,
      bidderName,
      pricePerKg,
      quantity: batch.quantity,
      totalAmount,
      status: 'HIGHEST'
    });

    if (highestBid) {
      highestBid.status = 'OUTBID';
      await highestBid.save();
    }

    res.status(201).json({ success: true, bid: newBid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
