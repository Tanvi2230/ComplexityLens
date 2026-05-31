// savedController.js — Save, unsave, and list saved analyses

const prisma = require('../services/prismaClient');

// ─── SAVE AN ANALYSIS ─────────────────────────────────────────────────────────

const saveAnalysis = async (req, res) => {
  try {
    const { analysisId, note } = req.body;
    // analysisId → which analysis to save
    // note → optional personal note

    // Check if already saved
    const existing = await prisma.savedAnalysis.findUnique({
      where: {
        userId_analysisId: {
          userId: req.userId,
          analysisId
        }
        // @@unique([userId, analysisId]) in schema → we can query by this combination
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'Already saved' });
    }

    const saved = await prisma.savedAnalysis.create({
      data: {
        userId: req.userId,
        analysisId,
        note: note || null
      }
    });

    res.status(201).json({ success: true, data: saved });

  } catch (error) {
    console.error('Save error:', error.message);
    res.status(500).json({ success: false, error: 'Could not save analysis' });
  }
};

// ─── UNSAVE AN ANALYSIS ───────────────────────────────────────────────────────

const unsaveAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params;
    // analysisId comes from the URL: DELETE /api/saved/:analysisId

    await prisma.savedAnalysis.delete({
      where: {
        userId_analysisId: {
          userId: req.userId,
          analysisId
        }
      }
    });

    res.status(200).json({ success: true, message: 'Removed from saved' });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Could not unsave' });
  }
};

// ─── GET ALL SAVED ANALYSES ───────────────────────────────────────────────────

const getSaved = async (req, res) => {
  try {
    const saved = await prisma.savedAnalysis.findMany({
      where: { userId: req.userId },
      include: {
        analysis: true
        // include → fetch the related Analysis data too
        // Without this, we'd only get the SavedAnalysis row (just IDs)
        // With this, we get the full analysis: code, complexity, timings, etc.
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: saved });

  } catch (error) {
    console.error('Get saved error:', error.message);
    res.status(500).json({ success: false, error: 'Could not fetch saved analyses' });
  }
};

module.exports = { saveAnalysis, unsaveAnalysis, getSaved };
