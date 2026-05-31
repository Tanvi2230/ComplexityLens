// authMiddleware.js — Verifies JWT token on protected routes
// This runs BEFORE the controller on any protected route
// Like a security guard — checks ID before letting you in

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // next → function that passes control to the next middleware/controller
  // If we call next(), the request continues to the controller
  // If we call res.json(), we stop here and send a response

  try {
    // ── Get token from Authorization header ──
    const authHeader = req.headers.authorization;
    // Frontend sends: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Please login.'
      });
      // 401 = Unauthorized
    }

    const token = authHeader.split(' ')[1];
    // "Bearer eyJhbGci..." → split by space → ["Bearer", "eyJhbGci..."] → take index 1

    // ── Verify the token ──
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // jwt.verify decodes the token and checks:
    //   1. Was it signed with our JWT_SECRET? (not tampered with)
    //   2. Has it expired?
    // If both pass, returns the payload { userId, email }
    // If fails, throws an error → caught below

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    // Attach userId to the request object
    // Now any controller that runs after this can access req.userId

    next();
    // Pass control to the actual controller

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ success: false, error: 'Invalid token. Please login.' });
  }
};

// Optional middleware — attaches user if token exists but doesn't block if not
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
    }
  } catch (e) {
    // If token is invalid, just continue without setting userId
  }
  next();
  // Always continues — doesn't block unauthenticated requests
};

module.exports = { protect, optionalAuth };
