import connectToDatabase from './_utils/db.js';
import User from './_models/User.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();

    const { name, email, mobile, state, numberOfSheep, woolProduction, password, role, preferredLanguage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Drop the mobile_1 index if it exists to fix local DB duplicate null errors
    try {
      await User.collection.dropIndex('mobile_1');
    } catch (e) {
      // Ignore if index doesn't exist
    }

    const payload = {
      name,
      email,
      password,
      role: role || 'FARMER',
      preferredLanguage: preferredLanguage || 'en',
    };

    if (mobile) payload.mobile = mobile;
    if (state) payload.state = state;
    if (numberOfSheep) payload.numberOfSheep = numberOfSheep;
    if (woolProduction) payload.woolProduction = woolProduction;

    const newUser = await User.create(payload);

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        preferredLanguage: newUser.preferredLanguage || 'en'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
