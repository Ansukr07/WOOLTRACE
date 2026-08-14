import connectToDatabase from './_utils/db.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    res.status(200).json({ status: 'ok', message: 'Connected to MongoDB', db: 'cluster0.zryy5ke' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to connect to database', error: error.message });
  }
}
