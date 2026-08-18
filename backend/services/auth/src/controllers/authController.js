import { getAuth } from 'firebase-admin/auth';
import { app } from '../config/firebase.js';
import User from '../models/userModel.js';
import redis from '../../../../shared/redis/redis.js';

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
    }
    const sessionId = crypto.randomUUID();
    const key = `session:${sessionId}`;

    await redis.set(
      key,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
      'EX',
      7 * 24 * 60 * 60
    );
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login Error',
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    await redis.del(`session-${sessionId}`);

    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('session', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successful.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Logout Error',
      error: error.message,
    });
  }
};
