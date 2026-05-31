// authController.js — Handles Register, Login, Get Profile

const bcrypt = require('bcryptjs');
// bcrypt → hashes passwords so we NEVER store plain text passwords
// Example: "mypassword123" → "$2a$10$xyz..." (irreversible hash)

const jwt = require('jsonwebtoken');
// jwt → creates tokens that prove who the user is
// Token contains userId, signed with JWT_SECRET
// Frontend sends this token with every request

const prisma = require('../services/prismaClient');

// ─── REGISTER ─────────────────────────────────────────────────────────────────

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Extract user data from request body

    // ── Validate ──
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    // ── Check if email already exists ──
    const existingUser = await prisma.user.findUnique({
      where: { email }
      // findUnique → finds one record matching this condition
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // ── Hash the password ──
    const salt = await bcrypt.genSalt(10);
    // salt → random data added before hashing to prevent rainbow table attacks
    // 10 → cost factor (how many rounds of hashing — higher = slower = more secure)

    const hashedPassword = await bcrypt.hash(password, salt);
    // Converts "mypassword123" → "$2a$10$..." (safe to store)

    // ── Create user in database ──
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // NEVER store plain password — always the hash
      }
    });

    // ── Generate JWT token ──
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      // Payload → data we embed in the token
      process.env.JWT_SECRET,
      // Secret → used to sign/verify the token
      { expiresIn: '7d' }
      // Token expires in 7 days — user stays logged in for a week
    );

    res.status(201).json({
      success: true,
      token,
      // Send token to frontend — it will store this in localStorage
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
      // Never send the password back — not even the hash
    });

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    // ── Find user by email ──
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
      // Don't say "email not found" — security risk (tells attacker which emails exist)
    }

    // ── Verify password ──
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // bcrypt.compare hashes the input and compares with stored hash
    // Returns true if they match

    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // ── Generate JWT token ──
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

// ─── GET PROFILE ──────────────────────────────────────────────────────────────

const getProfile = async (req, res) => {
  // req.userId is set by the auth middleware after verifying JWT
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        _count: {
          select: {
            analyses: true,
            // Count how many analyses this user has done
            saved: true
            // Count how many they've saved
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Get most common complexity for this user
    const complexityCounts = await prisma.analysis.groupBy({
      by: ['complexity'],
      where: { userId: req.userId },
      _count: { complexity: true },
      orderBy: { _count: { complexity: 'desc' } },
      take: 1
    });

    // Get favourite language
    const languageCounts = await prisma.analysis.groupBy({
      by: ['language'],
      where: { userId: req.userId },
      _count: { language: true },
      orderBy: { _count: { language: 'desc' } },
      take: 1
    });

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        totalAnalyses: user._count.analyses,
        totalSaved: user._count.saved,
        topComplexity: complexityCounts[0]?.complexity || 'N/A',
        topLanguage: languageCounts[0]?.language || 'N/A',
      }
    });

  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(500).json({ success: false, error: 'Could not fetch profile' });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────

const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar })
        // Spread only fields that were provided
        // If name is undefined, don't update it
      }
    });

    res.status(200).json({
      success: true,
      data: { id: updated.id, name: updated.name, email: updated.email, avatar: updated.avatar }
    });

  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ success: false, error: 'Could not update profile' });
  }
};

module.exports = { register, login, getProfile, updateProfile };
