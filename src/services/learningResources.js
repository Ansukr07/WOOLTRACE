import resources from '../../learning-resources.json';

export const RESOURCE_CATEGORIES = [
  'Sheep Farming',
  'Wool Production',
  'Wool Shearing',
  'Wool Sorting',
  'Wool Grading',
  'Sheep Breeding',
  'Fodder & Nutrition',
  'Veterinary Care',
  'Wool Processing',
  'Government Schemes',
  'Market Knowledge',
];

export const RESOURCE_REGIONS = [
  'All India',
  'Rajasthan',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Uttarakhand',
];

export const RESOURCE_TYPES = ['video', 'pdf', 'article', 'website', 'training'];

export function normalizeLearningResource(resource) {
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
    createdAt: resource.createdAt || null,
    views: Number(resource.views || 0),
    active: resource.active !== false,
    isOfficial: resource.isOfficial !== false,
  };
}

export const learningResources = resources.map(normalizeLearningResource);

async function readJsonResponse(response, fallbackMessage) {
  const text = await response.text();
  if (!text) {
    throw new Error(fallbackMessage);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(fallbackMessage);
  }
}

export function filterLearningResources(list, { query = '', category = 'All', region = 'All', type = 'All' } = {}) {
  const search = query.trim().toLowerCase();

  return list.filter((resource) => {
    const normalized = normalizeLearningResource(resource);
    const matchesSearch = !search || [
      normalized.title,
      normalized.description,
      normalized.source,
      normalized.category,
      normalized.region,
      normalized.type,
    ].some((value) => String(value || '').toLowerCase().includes(search));

    const matchesCategory = category === 'All' || normalized.category === category;
    const matchesRegion = region === 'All' || normalized.region === region;
    const matchesType = type === 'All' || normalized.type === type;

    return matchesSearch && matchesCategory && matchesRegion && matchesType;
  });
}

export async function fetchLearningResources({ active } = {}) {
  const params = new URLSearchParams();
  if (active !== undefined) params.set('active', String(active));

  try {
    const response = await fetch(`/api/learning-resources${params.toString() ? `?${params}` : ''}`);
    const data = await readJsonResponse(response, 'Unable to load learning resources');
    if (!response.ok) throw new Error(data.message || 'Unable to load learning resources');
    if (!data.success) throw new Error(data.message || 'Unable to load learning resources');
    return (data.data || []).map(normalizeLearningResource);
  } catch (error) {
    console.warn('Using bundled learning resources fallback:', error);
    return active === false ? [] : learningResources;
  }
}

export async function createLearningResource(resource) {
  const response = await fetch('/api/learning-resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resource),
  });
  const data = await readJsonResponse(response, 'Unable to publish resource');
  if (!response.ok || !data.success) throw new Error(data.message || 'Unable to publish resource');
  return normalizeLearningResource(data.data);
}

export async function updateLearningResource(resource) {
  const response = await fetch(`/api/learning-resources?id=${encodeURIComponent(resource.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resource),
  });
  const data = await readJsonResponse(response, 'Unable to update resource');
  if (!response.ok || !data.success) throw new Error(data.message || 'Unable to update resource');
  return normalizeLearningResource(data.data);
}

export async function deleteLearningResource(id) {
  const response = await fetch(`/api/learning-resources?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  const data = await readJsonResponse(response, 'Unable to delete resource');
  if (!response.ok || !data.success) throw new Error(data.message || 'Unable to delete resource');
  return true;
}

export async function incrementLearningResourceViews(id) {
  const response = await fetch(`/api/learning-resources?id=${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, action: 'view' }),
  });
  const data = await readJsonResponse(response, 'Unable to update views');
  if (!response.ok || !data.success) throw new Error(data.message || 'Unable to update views');
  return normalizeLearningResource(data.data);
}

export function getRecommendedLearningResources(farmerState, list = learningResources) {
  const state = String(farmerState || '').trim();
  const recommendedRegions = state ? new Set(['All India', state]) : new Set(['All India']);
  return list.filter((resource) => recommendedRegions.has(resource.region) && resource.active !== false);
}
