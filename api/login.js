import connectToDatabase from './_utils/db.js';
import User from './_models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();

    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Missing identifier or password' });
    }

    // In a real app, hash password and check. For SIH prototype, basic check:
    const user = await User.findOne({
      $or: [{ mobile: identifier }, { name: identifier }]
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Basic token mock (or omit token and just return user info)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        state: user.state
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
