import seedResources from '../learning-resources.json' with { type: 'json' };
import connectToDatabase from './_utils/db.js';
import LearningResource from './_models/LearningResource.js';

function filterResources(list, query) {
  const search = String(query.search || '').trim().toLowerCase();
  return list.filter((resource) => {
    const matchesSearch = !search || [
      resource.title,
      resource.description,
      resource.sourceOrganization,
      resource.category,
      resource.region,
      resource.type,
    ].some((value) => String(value || '').toLowerCase().includes(search));

    const matchesCategory = !query.category || query.category === 'All' || resource.category === query.category;
    const matchesRegion = !query.region || query.region === 'All' || resource.region === query.region;
    const matchesType = !query.type || query.type === 'All' || resource.type === query.type;

    return matchesSearch && matchesCategory && matchesRegion && matchesType;
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const existingCount = await LearningResource.countDocuments();

    if (existingCount === 0) {
      await LearningResource.insertMany(seedResources, { ordered: false });
    }

    const resources = await LearningResource.find({}).sort({ region: 1, title: 1 }).lean();
    return res.status(200).json({ success: true, data: filterResources(resources, req.query) });
  } catch (error) {
    return res.status(200).json({
      success: true,
      data: filterResources(seedResources, req.query),
      warning: error.message,
    });
  }
}
