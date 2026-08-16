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

export const learningResources = resources;

export function filterLearningResources(list, { query = '', category = 'All', region = 'All', type = 'All' } = {}) {
  const search = query.trim().toLowerCase();

  return list.filter((resource) => {
    const matchesSearch = !search || [
      resource.title,
      resource.description,
      resource.sourceOrganization,
      resource.category,
      resource.region,
      resource.type,
    ].some((value) => String(value || '').toLowerCase().includes(search));

    const matchesCategory = category === 'All' || resource.category === category;
    const matchesRegion = region === 'All' || resource.region === region;
    const matchesType = type === 'All' || resource.type === type;

    return matchesSearch && matchesCategory && matchesRegion && matchesType;
  });
}

export function getRecommendedLearningResources(farmerState) {
  const state = String(farmerState || '').trim();
  const recommendedRegions = state ? new Set(['All India', state]) : new Set(['All India']);
  return learningResources.filter((resource) => recommendedRegions.has(resource.region));
}
