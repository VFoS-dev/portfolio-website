const jwt = require('jsonwebtoken');
const { User } = require('../_helper/db');
const { env } = require('../_helper/env');

const JWT_SECRET = env('JWT_SECRET', 'your-secret-key-change-in-production');
const JWT_EXPIRES_IN = env('JWT_EXPIRES_IN', '24h');

async function login({ username, password }) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return { status: 401, message: 'Invalid username or password' };
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return { status: 401, message: 'Invalid username or password' };
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      status: 200,
      data: {
        token,
        user: user.toJSON(),
      },
    };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

async function changePassword({ userId, currentPassword, newPassword }) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return { status: 401, message: 'Current password is incorrect' };
    }

    user.password = newPassword;
    await user.save();

    return { status: 200, message: 'Password changed successfully' };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

async function verifyToken({ token }) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return { status: 401, message: 'User not found' };
    }
    return {
      status: 200,
      data: {
        user: user.toJSON(),
      },
    };
  } catch (error) {
    return { status: 401, message: 'Invalid or expired token' };
  }
}

module.exports = {
  login,
  changePassword,
  verifyToken,
};

