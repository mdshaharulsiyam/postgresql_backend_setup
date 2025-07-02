import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import auth_service from './auth_service';

require('dotenv').config();

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const user = await auth_service.registerUser({ name, email, password, image });
    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await auth_service.validateUser(email, password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
};
