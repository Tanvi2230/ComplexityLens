const express = require('express');
const router = express.Router();
const { saveAnalysis, unsaveAnalysis, getSaved } = require('../controllers/savedController');
const { protect } = require('../middleware/authMiddleware');

// All saved routes require login
router.use(protect);
// router.use(protect) applies protect middleware to ALL routes below

router.post('/', saveAnalysis);
// POST /api/saved → save an analysis

router.get('/', getSaved);
// GET /api/saved → get all saved analyses

router.delete('/:analysisId', unsaveAnalysis);
// DELETE /api/saved/:analysisId → unsave an analysis

module.exports = router;
