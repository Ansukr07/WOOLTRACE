import connectToDatabase from './_utils/db.js';
import User from './_models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();

    const { name, mobile, state, numberOfSheep, woolProduction, password } = req.body;

    if (!name || !mobile || !state || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this mobile number already exists' });
    }

    // Create new user (No password hashing for prototype simplicity)
    const newUser = await User.create({
      name,
      mobile,
      state,
      numberOfSheep: numberOfSheep || 0,
      woolProduction: woolProduction || 0,
      password,
    });

    res.status(201).json({
      message: 'Farmer account created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        mobile: newUser.mobile,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
