import connectToDatabase from './_utils/db.js';
import User from './_models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();

    const { name, email, mobile, state, numberOfSheep, woolProduction, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Create new user (No password hashing for prototype simplicity)
    const newUser = await User.create({
      name,
      email,
      mobile: mobile || '',
      state: state || '',
      numberOfSheep: numberOfSheep || 0,
      woolProduction: woolProduction || 0,
      password,
      role: role || 'FARMER',
    });

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
