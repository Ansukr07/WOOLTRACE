import dbConnect from '../_utils/db.js';
import BiddingListing from '../_models/BiddingListing.js';
import Bid from '../_models/Bid.js';
import Order from '../_models/Order.js';

export default async function handler(req, res) {
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

    // Accept this bid
    bid.status = 'ACCEPTED';
    await bid.save();

    // Reject other active bids for this listing
    await Bid.updateMany(
      { listingId: bid.listingId, bidId: { $ne: bidId } },
      { status: 'REJECTED' }
    );

    // Close the listing
    listing.status = 'CLOSED';
    await listing.save();

    // Create Order
    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
    const order = await Order.create({
      orderId,
      bidId: bid.bidId,
      batchId: bid.batchId,
      farmerId: bid.farmerId,
      buyerId: bid.bidderId,
      quantity: bid.quantity,
      pricePerKg: bid.pricePerKg,
      totalAmount: bid.totalAmount,
      paymentStatus: 'PENDING',
      transportStatus: 'NOT_STARTED'
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
