import seedResources from '../learning-resources.json' with { type: 'json' };
import connectToDatabase from './_utils/db.js';
import LearningResource from './_models/LearningResource.js';

const RESOURCE_TYPES = ['video', 'pdf', 'article', 'website', 'training'];
let fallbackResources = seedResources.map((resource) => ({
  ...normalizeSeedShape(resource),
}));

function normalizeSeedShape(resource) {
  const source = resource.source || resource.sourceOrganization || '';
  const url = resource.url || resource.sourceUrl || '';
  const thumbnail = resource.thumbnail || resource.thumbnailUrl || '';

  return {
    ...resource,
    source,
    url,
    thumbnail,
    sourceOrganization: source,
    sourceUrl: url,
    thumbnailUrl: thumbnail,
    uploadedBy: resource.uploadedBy || 'seed',
    createdAt: resource.createdAt || null,
    views: Number(resource.views || 0),
    active: resource.active !== false,
  };
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeResource(resource) {
  const source = resource.source || resource.sourceOrganization || '';
  const url = resource.url || resource.sourceUrl || '';
  const thumbnail = resource.thumbnail || resource.thumbnailUrl || '';

  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    category: resource.category,
    region: resource.region,
    type: resource.type,
    language: resource.language,
    source,
    url,
    thumbnail,
    sourceOrganization: source,
    sourceUrl: url,
    thumbnailUrl: thumbnail,
    uploadedBy: resource.uploadedBy || 'seed',
    createdAt: resource.createdAt || resource.created_at || null,
    views: Number(resource.views || 0),
    active: resource.active !== false,
    isOfficial: resource.isOfficial !== false,
  };
}

function prepareSeedResource(resource) {
  const normalized = normalizeResource(resource);
  return {
    ...normalized,
    createdAt: undefined,
  };
}

function sendJson(res, statusCode, payload) {
  return res.status(statusCode).json(payload || { success: false, message: 'Empty response prevented' });
}

function filterResources(list, query = {}) {
  const search = String(query.search || '').trim().toLowerCase();
  return list.filter((resource) => {
    const normalized = normalizeResource(resource);
    const matchesSearch = !search || [
      normalized.title,
      normalized.description,
      normalized.source,
      normalized.category,
      normalized.region,
      normalized.type,
    ].some((value) => String(value || '').toLowerCase().includes(search));

    const matchesCategory = !query.category || query.category === 'All' || normalized.category === query.category;
    const matchesRegion = !query.region || query.region === 'All' || normalized.region === query.region;
    const matchesType = !query.type || query.type === 'All' || normalized.type === query.type;
    const matchesActive = query.active === undefined || String(normalized.active) === String(query.active);

    return matchesSearch && matchesCategory && matchesRegion && matchesType && matchesActive;
  });
}

function getPayload(body = {}) {
  const source = body.source || body.sourceOrganization || '';
  const url = body.url || body.sourceUrl || '';
  const thumbnail = body.thumbnail || body.thumbnailUrl || '';
  const id = body.id || slugify(body.title);

  return {
    id,
    title: body.title,
    description: body.description,
    category: body.category,
    region: body.region,
    type: body.type,
    language: body.language,
    source,
    url,
    thumbnail,
    sourceOrganization: source,
    sourceUrl: url,
    thumbnailUrl: thumbnail,
    uploadedBy: body.uploadedBy || 'educator',
    views: Number(body.views || 0),
    active: body.active !== false,
    isOfficial: true,
  };
}

function validatePayload(payload) {
  const missing = ['id', 'title', 'description', 'category', 'region', 'type', 'language', 'source', 'url']
    .filter((field) => !payload[field]);

  if (missing.length) return `Missing required fields: ${missing.join(', ')}`;
  if (!RESOURCE_TYPES.includes(payload.type)) return 'Invalid resource type';
  return null;
}

function listFallbackResources(query = {}) {
  return filterResources(fallbackResources.map(normalizeResource), query);
}

function createFallbackResource(body) {
  const payload = getPayload(body);
  const validationError = validatePayload(payload);
  if (validationError) {
    return { statusCode: 400, body: { success: false, message: validationError } };
  }

  if (fallbackResources.some((resource) => resource.id === payload.id)) {
    payload.id = `${payload.id}-${Date.now().toString(36)}`;
  }

  const resource = normalizeResource({
    ...payload,
    createdAt: new Date().toISOString(),
  });
  fallbackResources = [resource, ...fallbackResources];
  return { statusCode: 201, body: { success: true, data: resource, fallback: true } };
}

function updateFallbackResource(id, body) {
  if (!id) return { statusCode: 400, body: { success: false, message: 'Missing resource id' } };

  if (body?.action === 'view') {
    const resource = fallbackResources.find((item) => item.id === id && item.active !== false);
    if (!resource) return { statusCode: 404, body: { success: false, message: 'Resource not found' } };
    resource.views = Number(resource.views || 0) + 1;
    return { statusCode: 200, body: { success: true, data: normalizeResource(resource), fallback: true } };
  }

  const payload = getPayload({ ...body, id });
  const validationError = validatePayload(payload);
  if (validationError) return { statusCode: 400, body: { success: false, message: validationError } };

  const index = fallbackResources.findIndex((resource) => resource.id === id);
  if (index === -1) return { statusCode: 404, body: { success: false, message: 'Resource not found' } };
  fallbackResources[index] = normalizeResource({
    ...fallbackResources[index],
    ...payload,
    createdAt: fallbackResources[index].createdAt || new Date().toISOString(),
  });
  return { statusCode: 200, body: { success: true, data: fallbackResources[index], fallback: true } };
}

function deleteFallbackResource(id) {
  if (!id) return { statusCode: 400, body: { success: false, message: 'Missing resource id' } };
  fallbackResources = fallbackResources.filter((resource) => resource.id !== id);
  return { statusCode: 200, body: { success: true, fallback: true } };
}

function handleFallback(req) {
  const query = req.query || {};
  const body = req.body || {};

  if (req.method === 'GET') {
    return { statusCode: 200, body: { success: true, data: listFallbackResources(query), fallback: true } };
  }

  if (req.method === 'POST') {
    return createFallbackResource(body);
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    return updateFallbackResource(query.id || body.id, body);
  }

  if (req.method === 'DELETE') {
    return deleteFallbackResource(query.id || body.id);
  }

  return { statusCode: 405, body: { success: false, message: 'Method not allowed' } };
}

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const existingCount = await LearningResource.countDocuments();

    if (existingCount === 0) {
      await LearningResource.insertMany(seedResources.map(prepareSeedResource), { ordered: false });
    }

    if (req.method === 'GET') {
      const resources = await LearningResource.find({}).sort({ createdAt: -1, region: 1, title: 1 }).lean();
      return sendJson(res, 200, { success: true, data: filterResources(resources.map(normalizeResource), req.query) });
    }

    if (req.method === 'POST') {
      const payload = getPayload(req.body);
      const validationError = validatePayload(payload);
      if (validationError) return sendJson(res, 400, { success: false, message: validationError });

      const existing = await LearningResource.findOne({ id: payload.id });
      if (existing) {
        payload.id = `${payload.id}-${Date.now().toString(36)}`;
      }

      const resource = await LearningResource.create(payload);
      return sendJson(res, 201, { success: true, data: normalizeResource(resource.toObject()) });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const id = req.query.id || req.body?.id;
      if (!id) return sendJson(res, 400, { success: false, message: 'Missing resource id' });

      if (req.body?.action === 'view') {
        const resource = await LearningResource.findOneAndUpdate(
          { id, active: { $ne: false } },
          { $inc: { views: 1 } },
          { new: true }
        ).lean();
        if (!resource) return sendJson(res, 404, { success: false, message: 'Resource not found' });
        return sendJson(res, 200, { success: true, data: normalizeResource(resource) });
      }

      const payload = getPayload({ ...req.body, id });
      const validationError = validatePayload(payload);
      if (validationError) return sendJson(res, 400, { success: false, message: validationError });

      const resource = await LearningResource.findOneAndUpdate({ id }, payload, { new: true, runValidators: true }).lean();
      if (!resource) return sendJson(res, 404, { success: false, message: 'Resource not found' });
      return sendJson(res, 200, { success: true, data: normalizeResource(resource) });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id || req.body?.id;
      if (!id) return sendJson(res, 400, { success: false, message: 'Missing resource id' });
      await LearningResource.deleteOne({ id });
      return sendJson(res, 200, { success: true });
    }

    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  } catch (error) {
    try {
      const fallback = handleFallback(req);
      const body = fallback.statusCode >= 500
        ? { success: false, message: error.message || 'Unable to process learning resource request' }
        : { ...fallback.body, warning: error.message };
      return sendJson(res, fallback.statusCode, body);
    } catch (fallbackError) {
      return sendJson(res, 500, {
        success: false,
        message: fallbackError.message || error.message || 'Unable to process learning resource request',
      });
    }
  }
}
