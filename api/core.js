import health from '../server/handlers/health.js';
import crop50 from '../server/handlers/crop50.js';
import khetsetu from '../server/handlers/khetsetu.js';
import learningResources from '../server/handlers/learning-resources.js';
import login from '../server/handlers/login.js';
import register from '../server/handlers/register.js';
import marketRecords from '../server/handlers/market-records.js';
import payments from '../server/handlers/payments.js';
import seedDemo from '../server/handlers/seed-demo.js';
import { handleCors } from './_utils/http.js';

const handlers = { health, crop50, khetsetu, 'learning-resources': learningResources, login, register, 'market-records': marketRecords, payments, 'seed-demo': seedDemo };

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  const route = String(req.query?.handler || '');
  const selected = handlers[route];
  if (!selected) return res.status(404).json({ message: 'API endpoint not found' });
  return selected(req, res);
}
