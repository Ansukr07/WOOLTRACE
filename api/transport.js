import connectToDatabase from './_utils/db.js';
import TransportRequest from './_models/TransportRequest.js';
import Shipment from './_models/Shipment.js';
import Vehicle from './_models/Vehicle.js';
import Order from './_models/Order.js';
import WoolBatch from './_models/WoolBatch.js';

export default async function handler(req, res) {
  const url = req.url || '';
  const method = req.method;

  try {
    await connectToDatabase();

    // GET /api/transport/dashboard
    if (url.includes('/dashboard')) {
      if (method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
      const { transporterId } = req.query;

      const activeShipments = await Shipment.countDocuments({ transporterId, status: { $in: ['ACCEPTED', 'VEHICLE_ASSIGNED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED'] } });
      const availableRequests = await TransportRequest.countDocuments({ status: 'AVAILABLE' });
      const completedDeliveries = await Shipment.countDocuments({ transporterId, status: 'DELIVERED' });
      
      const shipments = await Shipment.find({ transporterId });
      const totalEarnings = shipments.filter(s => s.status === 'DELIVERED').reduce((sum, s) => sum + (s.transportFee || 0), 0);
      const pendingEarnings = shipments.filter(s => ['ACCEPTED', 'VEHICLE_ASSIGNED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED'].includes(s.status)).reduce((sum, s) => sum + (s.transportFee || 0), 0);

      return res.status(200).json({
        activeShipments,
        availableRequests,
        completedDeliveries,
        totalEarnings,
        pendingEarnings
      });
    }

    // GET /api/transport/requests (All available or filtered)
    if (url.includes('/requests') && !url.includes('/accept')) {
      if (method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
      const { status } = req.query;
      const query = status ? { status } : {};
      const requests = await TransportRequest.find(query).sort({ createdAt: -1 });
      return res.status(200).json(requests);
    }

    // POST /api/transport/requests/:id/accept
    if (url.includes('/requests') && url.includes('/accept')) {
      if (method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      
      const parts = url.split('/');
      const acceptIndex = parts.indexOf('accept');
      const id = parts[acceptIndex - 1]; // request ID

      const { transporterId, vehicleId } = req.body;

      if (!transporterId) return res.status(400).json({ message: 'Missing transporterId' });

      const request = await TransportRequest.findById(id);
      if (!request) return res.status(404).json({ message: 'Transport Request not found' });
      if (request.status !== 'AVAILABLE') return res.status(400).json({ message: 'Request is no longer available' });

      // Update Request
      request.status = 'ACCEPTED';
      await request.save();

      // Create Shipment
      const shipment = await Shipment.create({
        shipmentId: `SHP-${Date.now()}`,
        transportRequestId: request._id,
        orderId: request.orderId,
        batchId: request.batchId,
        transporterId,
        vehicleId,
        status: 'ACCEPTED',
        transportFee: request.estimatedFee || 5000
      });

      return res.status(200).json(shipment);
    }

    // GET /api/transport/shipments
    if (url.includes('/shipments') && !url.includes('/status')) {
      if (method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
      const { transporterId } = req.query;
      if (!transporterId) return res.status(400).json({ message: 'Missing transporterId' });
      
      const shipments = await Shipment.find({ transporterId }).sort({ createdAt: -1 });
      return res.status(200).json(shipments);
    }

    // POST /api/transport/shipments/:id/status
    if (url.includes('/shipments') && url.includes('/status')) {
      if (method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      
      const parts = url.split('/');
      const statusIndex = parts.indexOf('status');
      const id = parts[statusIndex - 1];

      const { status, location, timestamp, notes, proofOfDelivery } = req.body;

      const shipment = await Shipment.findById(id);
      if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

      shipment.status = status;
      shipment.updatedAt = Date.now();
      
      if (location) shipment.currentLocation = location;
      if (status === 'PICKED_UP') shipment.pickupTime = timestamp || Date.now();
      if (status === 'DELIVERED') {
        shipment.deliveryTime = timestamp || Date.now();
        if (proofOfDelivery) shipment.proofOfDelivery = proofOfDelivery;
        
        // Update Order if exists
        if (shipment.orderId) {
          const order = await Order.findOne({ orderId: shipment.orderId });
          if (order) {
            order.transportStatus = 'DELIVERED';
            await order.save();
          }
        }
      }

      await shipment.save();

      // Update WoolBatch Timeline Traceability
      if (shipment.batchId) {
        const batch = await WoolBatch.findOne({ batchId: shipment.batchId });
        if (batch) {
          if (!batch.timeline) batch.timeline = [];
          batch.timeline.push({
            stage: 'TRANSPORT',
            description: `Shipment status updated to ${status.replace('_', ' ')}`,
            date: new Date(),
            actor: shipment.transporterId || 'Transport Partner'
          });
          await batch.save();
        }
      }

      return res.status(200).json(shipment);
    }

    // GET & POST /api/transport/vehicles
    if (url.includes('/vehicles')) {
      if (method === 'GET') {
        const { transporterId } = req.query;
        if (!transporterId) return res.status(400).json({ message: 'Missing transporterId' });
        const vehicles = await Vehicle.find({ transporterId });
        return res.status(200).json(vehicles);
      }
      
      if (method === 'POST') {
        const vehicle = await Vehicle.create(req.body);
        return res.status(201).json(vehicle);
      }
    }

    // Seed mock data helper for prototyping
    if (url.includes('/seed')) {
      if (method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
      
      // Prevent duplicate seeds
      const count = await TransportRequest.countDocuments();
      if (count === 0) {
        await TransportRequest.insertMany([
          {
            requestId: 'TR-2026-00124',
            orderId: 'ORD-12345',
            batchId: 'WT-KA-2026-00124',
            requestedBy: 'FARMER-001',
            pickupLocation: 'Mysuru, Karnataka',
            destination: 'Bengaluru, Karnataka',
            quantity: 428,
            woolType: 'Fine Merino',
            estimatedDistance: 150,
            estimatedFee: 4500,
            status: 'AVAILABLE'
          },
          {
            requestId: 'TR-2026-00125',
            orderId: 'ORD-12346',
            batchId: 'WT-RJ-2026-00125',
            requestedBy: 'SELLER-002',
            pickupLocation: 'Bikaner, Rajasthan',
            destination: 'Ludhiana, Punjab',
            quantity: 1200,
            woolType: 'Chokla',
            estimatedDistance: 450,
            estimatedFee: 12000,
            status: 'AVAILABLE'
          }
        ]);
      }
      return res.status(200).json({ message: 'Seed complete' });
    }

    return res.status(404).json({ message: 'Endpoint not found' });
  } catch (error) {
    console.error('Transport API error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
