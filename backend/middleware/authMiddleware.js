import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import jsonDb from '../config/jsonDb.js';

const JWT_SECRET = process.env.JWT_SECRET || 'flavornestsecret123';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (global.dbFallback) {
        const user = jsonDb.getById('users', decoded.id);
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        // Exclude password
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      } else {
        // MongoDB Mode
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
      }
    } catch (error) {
      console.error('JWT Token Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }

    return next();
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export default { protect, admin };
