const express = require('express');
const router  = express.Router();

const { analyzeCode, getHistory } = require('../controllers/analyzeController');
const { getStats }                = require('../controllers/statsController');
const { optionalAuth }            = require('../middleware/authMiddleware');

router.post('/analyze',  optionalAuth, analyzeCode);
// optionalAuth → attaches userId if token exists, but doesn't block if no token
// This way both logged-in and guest users can analyze code

router.get('/history',   getHistory);
router.get('/stats',     getStats);

module.exports = router;
