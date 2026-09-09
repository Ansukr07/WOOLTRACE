import dbConnect from './_utils/db.js';
import User from './_models/User.js';
import WoolBatch from './_models/WoolBatch.js';
import BiddingListing from './_models/BiddingListing.js';
import Bid from './_models/Bid.js';
import Order from './_models/Order.js';
import InspectionRequest from './_models/InspectionRequest.js';
import QualityCertificate from './_models/QualityCertificate.js';
import ProcessingRequest from './_models/ProcessingRequest.js';
import ProcessingRecord from './_models/ProcessingRecord.js';
import TransportRequest from './_models/TransportRequest.js';
import Shipment from './_models/Shipment.js';
import Vehicle from './_models/Vehicle.js';

const now = Date.now();
const upsert = async (Model, key, value) => Model.findOneAndUpdate({ [key]: value[key] }, value, { upsert: true, new: true, setDefaultsOnInsert: true });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Use POST to seed demo data' });
  if (process.env.DEMO_SEED_ENABLED === 'false') return res.status(403).json({ success: false, message: 'Demo seeding is disabled' });
  try {
    await dbConnect();
    const users = [
      ['Rajesh Gowda', 'farmer@khetsetu.in', 'FARMER'],
      ['Shree Foods Pvt. Ltd.', 'buyer@khetsetu.in', 'SELLER'],
      ['K. Somanna', 'storage@khetsetu.in', 'WAREHOUSE'],
      ['Dr. Anita Desai', 'quality@khetsetu.in', 'QUALITY_INSPECTOR'],
      ['Rapid Farm Logistics', 'logistics@khetsetu.in', 'TRANSPORT']
    ];
    for (const [name, email, role] of users) await upsert(User, 'email', { name, email, role, password: 'demo123', state: 'Karnataka', preferredLanguage: 'en' });

    await upsert(WoolBatch, 'batchId', { batchId: 'WT-DEMO-2026-001', farmerId: 'FARMER-01', farmerName: 'Rajesh Gowda', quantity: 850, originalQuantity: 850, availableQuantity: 850, woolType: 'Medium Crossbred Wool', origin: 'Mandya, Karnataka', status: 'At Farm', currentStage: 'FARM', currentStatus: 'Harvested at Farm', currentLocation: 'Mandya, Karnataka', qualityGrade: 'A', certificateStatus: 'Certified', certificateId: 'WTC-QA-DEMO-001' });
    await upsert(WoolBatch, 'batchId', { batchId: 'WT-DEMO-2026-002', farmerId: 'FARMER-01', farmerName: 'Rajesh Gowda', quantity: 620, originalQuantity: 620, availableQuantity: 620, woolType: 'Fine Merino', origin: 'Mysuru, Karnataka', status: 'In Transit', currentStage: 'TRANSPORT', currentStatus: 'In Transit to Warehouse', currentLocation: 'Tumakuru, Karnataka', qualityGrade: 'Pending QA', certificateStatus: 'Uninspected' });

    await upsert(BiddingListing, 'listingId', { listingId: 'LIST-DEMO-001', batchId: 'WT-DEMO-2026-001', farmerId: 'FARMER-01', startingPrice: 58, minimumIncrement: 2, startTime: new Date(now - 86400000), endTime: new Date(now + 604800000), status: 'ACTIVE' });
    await upsert(Bid, 'bidId', { bidId: 'BID-DEMO-001', listingId: 'LIST-DEMO-001', batchId: 'WT-DEMO-2026-001', farmerId: 'FARMER-01', bidderId: 'BUYER-01', bidderName: 'Shree Foods Pvt. Ltd.', pricePerKg: 64, quantity: 500, totalAmount: 32000, status: 'HIGHEST' });
    await upsert(Order, 'orderId', { orderId: 'ORD-DEMO-001', bidId: 'BID-DEMO-001', batchId: 'WT-DEMO-2026-001', farmerId: 'FARMER-01', buyerId: 'BUYER-01', quantity: 500, pricePerKg: 64, totalAmount: 32000, paymentStatus: 'IN_ESCROW', transportStatus: 'IN_TRANSIT' });

    await upsert(InspectionRequest, 'requestId', { requestId: 'QA-DEMO-001', batchId: 'WT-DEMO-2026-002', farmerId: 'FARMER-01', farmerName: 'Rajesh Gowda', location: 'Mysuru, Karnataka', quantity: 620, woolType: 'Fine Merino', preferredDate: new Date(now + 172800000), status: 'ASSIGNED', inspectorId: 'QA-01', message: 'Please verify moisture and staple length at warehouse intake.' });
    await upsert(QualityCertificate, 'certificateId', { certificateId: 'WTC-QA-DEMO-001', batchId: 'WT-DEMO-2026-001', requestId: 'QA-DEMO-CERT-001', farmerName: 'Rajesh Gowda', origin: 'Mandya, Karnataka', quantity: 850, woolType: 'Medium Crossbred Wool', grade: 'A', overallScore: 88, cleanliness: 91, moisture: 12, fiberDiameter: 24.5, stapleLength: 78, inspectorId: 'QA-01', inspectorName: 'Dr. Anita Desai', status: 'VALID', verificationUrl: 'http://localhost:5173/verify/WTC-QA-DEMO-001' });

    await upsert(ProcessingRequest, 'requestId', { requestId: 'PROC-DEMO-001', batchId: 'WT-DEMO-2026-001', farmerId: 'FARMER-01', farmerName: 'Rajesh Gowda', processingUnitId: 'PROC-01', processingUnitName: 'Mysuru Fibre Works', requestedOperations: ['Sorting', 'Washing', 'Carding'], quantity: 400, woolType: 'Medium Crossbred Wool', grade: 'A', qualityScore: 88, origin: 'Mandya, Karnataka', priority: 'HIGH', status: 'REQUESTED' });
    await upsert(ProcessingRecord, 'recordId', { recordId: 'PROC-REC-DEMO-001', batchId: 'WT-DEMO-2026-001', processingRequestId: 'PROC-DEMO-001', processingUnitId: 'PROC-01', processingUnitName: 'Mysuru Fibre Works', operatorId: 'OP-01', operatorName: 'Mysuru Fibre Works', operation: 'Sorting', inputQuantity: 400, outputQuantity: 392, wasteQuantity: 8, status: 'COMPLETED', startTime: new Date(now - 86400000), completionTime: new Date(now - 43200000), equipment: 'Optical sorting line', notes: 'Demo completed batch.' });

    await upsert(TransportRequest, 'requestId', { requestId: 'TR-DEMO-001', orderId: 'ORD-DEMO-001', batchId: 'WT-DEMO-2026-001', requestedBy: 'FARMER-01', pickupLocation: 'Mandya, Karnataka', destination: 'Mysuru, Karnataka', quantity: 500, woolType: 'Medium Crossbred Wool', estimatedDistance: 45, estimatedFee: 1800, status: 'AVAILABLE' });
    await upsert(Vehicle, 'vehicleNumber', { transporterId: 'demo', vehicleNumber: 'KA-09-DEMO-01', registrationNumber: 'KA09DEMO01', vehicleType: 'Covered truck', capacity: 1200, status: 'AVAILABLE', insuranceExpiry: new Date(now + 31536000000) });
    await upsert(Shipment, 'shipmentId', { shipmentId: 'SHP-DEMO-001', transportRequestId: 'TR-DEMO-001', orderId: 'ORD-DEMO-001', batchId: 'WT-DEMO-2026-001', transporterId: 'demo', vehicleId: 'KA-09-DEMO-01', status: 'IN_TRANSIT', currentLocation: 'Tumakuru, Karnataka', estimatedArrival: new Date(now + 86400000), transportFee: 1800 });

    return res.status(200).json({ success: true, message: 'Demo data seeded idempotently', seeded: { users: users.length, batches: 2, listings: 1, bids: 1, orders: 1, inspections: 1, certificates: 1, processingRequests: 1, processingRecords: 1, transportRequests: 1, vehicles: 1, shipments: 1 } });
  } catch (error) {
    console.error('Demo seed error:', error);
    return res.status(500).json({ success: false, message: 'Demo seed failed', error: error.message });
  }
}
