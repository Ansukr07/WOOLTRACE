const toBatchId = (record = {}) => record.batchId || record.id;

const asList = (value) => Array.isArray(value) ? value : [];

const firstPresent = (...values) => values.find(value => value !== undefined && value !== null && value !== '');

const parseDateMs = (value) => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatDateTime = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' +
    parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const normalizeId = (value) => String(value || '').trim();

const linksBatch = (record = {}, batchId, linkedLotIds = new Set()) => {
  const normalizedBatchId = normalizeId(batchId);
  if (!normalizedBatchId) return false;
  if (normalizeId(record.batchId) === normalizedBatchId) return true;
  if (asList(record.batchIds).map(normalizeId).includes(normalizedBatchId)) return true;
  const lotId = normalizeId(record.lotId || record.listingId);
  return lotId && linkedLotIds.has(lotId);
};

const isWoolBatch = (batch = {}) => (
  batch.cropId === 'WOOL' ||
  /wool|fleece/i.test(`${batch.cropName || ''} ${batch.woolType || ''} ${batch.variety || ''}`)
);

const publicActor = (stage) => {
  if (stage === 'QUALITY') return 'Quality Partner';
  if (stage === 'MARKET') return 'KhetSetu Market';
  if (stage === 'TRANSPORT') return 'Logistics Partner';
  if (stage === 'WAREHOUSE') return 'Storage Partner';
  if (stage === 'PROCESSING') return 'Processing Partner';
  if (stage === 'DELIVERED') return 'KhetSetu Network';
  return 'Registered Producer';
};

const makeEvent = ({
  id,
  source,
  stage,
  title,
  timestamp,
  location,
  status,
  actor,
  description,
  metadata,
  publicView
}) => ({
  id,
  source,
  stage,
  title,
  timestamp: formatDateTime(timestamp),
  sortTime: parseDateMs(timestamp),
  location: location || 'Recorded location unavailable',
  status,
  actor: publicView ? publicActor(stage) : (actor || 'WoolTrace System'),
  description,
  metadata
});

const eventMatchesExisting = (events, needle) => {
  const text = `${needle || ''}`.toLowerCase();
  if (!text) return false;
  return events.some(event => `${event.title || ''} ${event.description || ''}`.toLowerCase().includes(text));
};

const dedupeAndSort = (events) => {
  const seen = new Set();
  return events
    .filter(Boolean)
    .filter(event => {
      const key = `${event.source || event.stage}:${event.id || event.title}:${event.timestamp || event.sortTime}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (a.sortTime || 0) - (b.sortTime || 0));
};

export const getCurrentStageFromEvents = (events = []) => {
  const sorted = dedupeAndSort(events);
  return sorted[sorted.length - 1]?.stage || 'FARM';
};

const statusRank = (status) => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'CERTIFICATE_ISSUED' || normalized === 'COMPLETED' || normalized === 'APPROVED') return 4;
  if (normalized === 'ASSIGNED' || normalized === 'IN_PROGRESS') return 3;
  if (normalized === 'PENDING_BATCH_REVIEW' || normalized === 'PENDING_ASSIGNMENT' || normalized === 'PENDING') return 2;
  return 1;
};

const requestTime = (request = {}) => parseDateMs(firstPresent(request.updatedAt, request.createdAt, request.preferredDate));

const selectMeaningfulQaRequests = (requests = [], certificates = []) => {
  const certRequestIds = new Set(
    asList(certificates).map(cert => normalizeId(cert.requestId)).filter(Boolean)
  );
  const matching = asList(requests);
  const certificateLinked = matching.filter(request => (
    certRequestIds.has(normalizeId(request.requestId)) || certRequestIds.has(normalizeId(request.id))
  ));

  if (certificateLinked.length) return certificateLinked;

  const completed = matching.filter(request => (
    String(request.status || '').toUpperCase() === 'CERTIFICATE_ISSUED' ||
    String(request.status || '').toUpperCase() === 'COMPLETED'
  ));
  if (completed.length) {
    return completed.sort((a, b) => requestTime(b) - requestTime(a));
  }

  const latest = matching
    .slice()
    .sort((a, b) => statusRank(b.status) - statusRank(a.status) || requestTime(b) - requestTime(a))[0];
  return latest ? [latest] : [];
};

export const buildWoolProvenanceEvents = ({
  batch,
  certificates = [],
  qaRequests = [],
  woolLots = [],
  listings = [],
  orders = [],
  transportJobs = [],
  warehouseBookings = [],
  processingRequests = [],
  processingRecords = [],
  marketOffers = [],
  marketTransactions = [],
  transactions = [],
  publicView = false
}) => {
  if (!batch || !isWoolBatch(batch)) return asList(batch?.events);

  const batchId = toBatchId(batch);
  const existingEvents = asList(batch.events).map(event => ({
    ...event,
    source: event.source || 'batch-event',
    actor: publicView ? publicActor(event.stage) : event.actor,
    sortTime: parseDateMs(event.timestamp || event.createdAt)
  }));

  const events = [...existingEvents];

  if (!existingEvents.length && (batch.createdAt || batch.shearingDate)) {
    events.push(makeEvent({
      id: `batch-created-${batchId}`,
      source: 'batch',
      stage: 'FARM',
      title: batch.shearingDate ? 'Shearing & Batch Registered' : 'Production Batch Created',
      timestamp: firstPresent(batch.shearingDate, batch.createdAt),
      location: firstPresent(batch.origin, batch.currentLocation),
      status: batch.currentStatus || batch.status || 'Recorded',
      actor: `${batch.farmerName || 'Farmer'} (Producer)`,
      description: `Batch ${batchId} recorded with ${batch.quantity || batch.originalQuantity || 'stored'} KG of ${batch.woolType || batch.variety || 'wool'}.`,
      publicView
    }));
  }

  const matchingCertificates = asList(certificates).filter(cert => (
    normalizeId(cert.batchId) === normalizeId(batchId) ||
    normalizeId(cert.certificateId || cert.id) === normalizeId(batch.certificateId)
  ));

  const matchingRequests = selectMeaningfulQaRequests(
    asList(qaRequests).filter(request => normalizeId(request.batchId) === normalizeId(batchId)),
    matchingCertificates
  );
  matchingRequests.forEach(request => {
    events.push(makeEvent({
      id: request.requestId || request.id,
      source: 'qa-request',
      stage: 'QUALITY',
      title: request.status === 'ASSIGNED' ? 'Quality Inspection Assigned' : 'Quality Inspection Requested',
      timestamp: firstPresent(request.createdAt, request.preferredDate, request.updatedAt),
      location: firstPresent(request.location, batch.origin, batch.currentLocation),
      status: request.status || 'PENDING',
      actor: firstPresent(request.inspectorName, request.farmerName, batch.farmerName),
      description: publicView
        ? `Quality inspection request ${request.requestId || request.id || ''} recorded for this batch.`
        : `Inspection request ${request.requestId || request.id || ''} recorded for ${request.quantity || batch.quantity || ''} KG ${request.woolType || batch.woolType || 'wool'}.`,
      metadata: { requestId: request.requestId || request.id },
      publicView
    }));
  });

  matchingCertificates.forEach(cert => {
    if (eventMatchesExisting(existingEvents, cert.certificateId || cert.id)) return;
    events.push(makeEvent({
      id: cert.certificateId || cert.id,
      source: 'certificate',
      stage: 'QUALITY',
      title: 'Quality Certified',
      timestamp: firstPresent(cert.issuedAt, cert.createdAt, cert.updatedAt),
      location: firstPresent(cert.location, cert.origin, batch.origin),
      status: cert.status || 'Approved',
      actor: cert.inspectorName || 'Quality Inspector',
      description: `Certificate ${cert.certificateId || cert.id} issued${cert.grade ? ` with Grade ${cert.grade}` : ''}${cert.overallScore ? ` and score ${cert.overallScore}/100` : ''}.`,
      metadata: { certificateId: cert.certificateId || cert.id },
      publicView
    }));
  });

  const allLots = [...asList(woolLots), ...asList(listings)];
  const linkedLots = allLots.filter(lot => linksBatch(lot, batchId));
  const linkedLotIds = new Set(linkedLots.map(lot => normalizeId(lot.id)).filter(Boolean));

  linkedLots.forEach(lot => {
    if (eventMatchesExisting(existingEvents, lot.lotNumber || lot.id)) return;
    events.push(makeEvent({
      id: lot.lotNumber || lot.id,
      source: 'sell-lot',
      stage: 'MARKET',
      title: 'Sell Lot Created',
      timestamp: firstPresent(lot.createdAt, lot.availableFrom, lot.updatedAt),
      location: firstPresent(lot.currentLocation, lot.storageLocation, lot.origin, batch.currentLocation),
      status: lot.status || 'AVAILABLE',
      actor: firstPresent(lot.sellerName, batch.farmerName),
      description: publicView
        ? `Sell lot ${lot.lotNumber || lot.id} linked to this batch.`
        : `Sell lot ${lot.lotNumber || lot.id} created for ${lot.totalQuantity || lot.quantity || ''} ${lot.unit || 'KG'}.`,
      metadata: { lotId: lot.id, lotNumber: lot.lotNumber },
      publicView
    }));
  });

  asList(marketOffers).filter(offer => linksBatch(offer, batchId, linkedLotIds)).forEach(offer => {
    asList(offer.history).forEach((entry, index) => {
      events.push(makeEvent({
        id: `${offer.id || offer.offerNumber}-${entry.action || index}`,
        source: 'market-offer',
        stage: 'MARKET',
        title: (entry.action || 'Offer Activity').replaceAll('_', ' '),
        timestamp: entry.timestamp || offer.createdAt,
        location: offer.location,
        status: offer.status,
        actor: entry.by || offer.buyerName,
        description: publicView
          ? `Offer activity recorded for linked lot ${offer.lotNumber || offer.lotId}.`
          : `${entry.note || 'Offer activity recorded.'}${entry.pricePerKg ? ` Price: Rs ${entry.pricePerKg}/KG.` : ''}`,
        metadata: { offerId: offer.id || offer.offerNumber },
        publicView
      }));
    });
  });

  [...asList(marketTransactions), ...asList(orders), ...asList(transactions)]
    .filter(record => linksBatch(record, batchId, linkedLotIds))
    .forEach(record => {
      events.push(makeEvent({
        id: record.transactionNumber || record.id,
        source: 'transaction',
        stage: record.status === 'Delivered' || record.deliveryStatus === 'DELIVERED' ? 'DELIVERED' : 'MARKET',
        title: record.deliveryStatus === 'DELIVERED' ? 'Transaction Delivered' : 'Buyer Transaction Recorded',
        timestamp: firstPresent(record.transactionDate, record.createdAt, record.completionDate),
        location: record.currentLocation,
        status: firstPresent(record.deliveryStatus, record.paymentStatus, record.status),
        actor: firstPresent(record.buyerName, record.sellerName),
        description: publicView
          ? `A buyer transaction is recorded for linked lot ${record.lotNumber || record.lotId || record.orderId || ''}.`
          : `Transaction ${record.transactionNumber || record.id} recorded${record.quantityKg || record.quantity ? ` for ${record.quantityKg || record.quantity} KG` : ''}${record.netRealizationPerKg ? ` with net realization Rs ${record.netRealizationPerKg}/KG` : ''}.`,
        metadata: { transactionId: record.transactionNumber || record.id },
        publicView
      }));
    });

  asList(transportJobs).filter(job => linksBatch(job, batchId, linkedLotIds)).forEach(job => {
    events.push(makeEvent({
      id: job.id,
      source: 'transport',
      stage: job.status === 'Delivered' ? 'DELIVERED' : 'TRANSPORT',
      title: job.status === 'Delivered' ? 'Logistics Delivered' : 'Logistics Movement Recorded',
      timestamp: firstPresent(job.deliveredAt, job.createdAt),
      location: firstPresent(job.dropoff, job.pickup),
      status: job.status,
      actor: job.transporterName,
      description: publicView
        ? `Logistics status ${job.status || 'recorded'} for this batch.`
        : `Transport ${job.id} from ${job.pickup || 'origin'} to ${job.dropoff || 'destination'}.`,
      metadata: { transportId: job.id, orderId: job.orderId },
      publicView
    }));
  });

  asList(warehouseBookings).filter(booking => linksBatch(booking, batchId, linkedLotIds)).forEach(booking => {
    if (eventMatchesExisting(existingEvents, booking.bookingId || booking.id)) return;
    events.push(makeEvent({
      id: booking.bookingId || booking.id,
      source: 'warehouse-booking',
      stage: 'WAREHOUSE',
      title: 'Warehouse Storage Recorded',
      timestamp: firstPresent(booking.checkInDate, booking.createdAt, booking.startDate),
      location: booking.warehouseName,
      status: firstPresent(booking.checkInStatus, booking.status),
      actor: booking.warehouseName,
      description: publicView
        ? `Storage record ${booking.bookingId || booking.id} is linked to this batch.`
        : `Storage booking ${booking.bookingId || booking.id} recorded for ${booking.quantity || ''} KG.`,
      metadata: { bookingId: booking.bookingId || booking.id },
      publicView
    }));
  });

  asList(processingRequests).filter(request => linksBatch(request, batchId, linkedLotIds)).forEach(request => {
    events.push(makeEvent({
      id: request.id,
      source: 'processing-request',
      stage: 'PROCESSING',
      title: 'Processing Request Recorded',
      timestamp: firstPresent(request.createdAt, request.updatedAt),
      location: request.processingUnitName,
      status: request.status,
      actor: request.processingUnitName,
      description: publicView
        ? `Processing request ${request.id} is linked to this batch.`
        : `Requested operations: ${asList(request.requestedOperations).join(', ') || 'processing'}.`,
      metadata: { processingRequestId: request.id },
      publicView
    }));
  });

  asList(processingRecords).filter(record => linksBatch(record, batchId, linkedLotIds)).forEach(record => {
    events.push(makeEvent({
      id: record.id,
      source: 'processing-record',
      stage: 'PROCESSING',
      title: 'Processing Operation Recorded',
      timestamp: firstPresent(record.completionTime, record.startTime, record.createdAt),
      location: record.operatorName,
      status: record.status,
      actor: record.operatorName,
      description: publicView
        ? `Processing operation ${record.operation || ''} recorded for this batch.`
        : `${record.operation || 'Processing'} ${record.status || 'recorded'}${record.outputQuantity ? `. Output: ${record.outputQuantity} KG.` : ''}`,
      metadata: { processingRecordId: record.id },
      publicView
    }));
  });

  return dedupeAndSort(events);
};
