import connectToDatabase from '../../api/_utils/db.js';
import User from '../../api/_models/User.js';

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

    let user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    });

    const inferDemoRole = (email) => {
      if (email.includes('seller') || email.includes('buyer')) return 'SELLER';
      if (email.includes('inspector') || email.includes('quality')) return 'QUALITY_INSPECTOR';
      if (email.includes('warehouse') || email.includes('storage')) return 'WAREHOUSE';
      if (email.includes('transport') || email.includes('logistics')) return 'TRANSPORT';
      if (email.includes('processing') || email.includes('processor')) return 'SELLER';
      if (email.includes('educator') || email.includes('teacher')) return 'EDUCATOR';
      return 'FARMER';
    };

    // Demo profiles are provisioned on demand for each KhetSetu workspace.
    const isDemoProfile = identifier.endsWith('@khetsetu.in');
    const demoRole = inferDemoRole(identifier);
    if (!user && isDemoProfile) {
      user = await User.create({
        name: identifier.split('@')[0].toUpperCase(),
        email: identifier,
        password: password,
        role: demoRole
      });
    }

    // Correct locally seeded demo accounts from older role names.
    if (user && isDemoProfile && user.role !== demoRole) {
      user.role = demoRole;
      await user.save();
    }

    if (!user) {
      return res.status(401).json({ message: 'Account not found. Please register first.' });
    }

    if (user.password !== password) {
      if (isDemoProfile) {
        // bypass
      } else {
        return res.status(401).json({ message: 'Incorrect password.' });
      }
    }

    const role = user.role === 'PROCESSING_UNIT' ? 'SELLER' : user.role;
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role,
        state: user.state,
        preferredLanguage: user.preferredLanguage || 'en'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
