import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jsonDb from '../config/jsonDb.js';

const JWT_SECRET = process.env.JWT_SECRET || 'flavornestsecret123';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const emailNormalized = email.toLowerCase().trim();

    if (global.dbFallback) {
      const users = jsonDb.get('users');
      const userExists = users.find(u => u.email === emailNormalized);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password manually for fallback json database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = jsonDb.create('users', {
        name,
        email: emailNormalized,
        password: hashedPassword,
        role: 'user',
        phone: req.body.phone || '',
        address: req.body.address || ''
      });

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone || '',
        address: newUser.address || '',
        token: generateToken(newUser._id)
      });
    }

    // MongoDB Mode
    const userExists = await User.findOne({ email: emailNormalized });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: emailNormalized,
      password,
      role: 'user',
      phone: req.body.phone || '',
      address: req.body.address || ''
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const emailNormalized = email.toLowerCase().trim();

    if (global.dbFallback) {
      const users = jsonDb.get('users');
      const user = users.find(u => u.email === emailNormalized);

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || '',
          address: user.address || '',
          token: generateToken(user._id)
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // MongoDB Mode
    const user = await User.findOne({ email: emailNormalized });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // req.user is populated by protect middleware
    if (req.user) {
      res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone || '',
        address: req.user.address || ''
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, password, phone, address } = req.body;
    
    if (global.dbFallback) {
      const updateData = {};
      if (name) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }
      
      const updatedUser = jsonDb.update('users', req.user._id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone || '',
        address: updatedUser.address || ''
      });
    }

    // MongoDB Mode
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (password) user.password = password; // mongoose pre-save hook will hash this

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone || '',
      address: updatedUser.address || ''
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default { registerUser, loginUser, getUserProfile, updateUserProfile };

