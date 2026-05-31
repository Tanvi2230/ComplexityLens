// statsController.js — Returns app-wide statistics for the Leaderboard page

const prisma = require('../services/prismaClient');

const getStats = async (req, res) => {
  try {
    // Total number of analyses ever done
    const totalAnalyses = await prisma.analysis.count();

    // Count how many times each complexity appears
    const complexityCounts = await prisma.analysis.groupBy({
      by: ['complexity'],
      _count: { complexity: true },
      orderBy: { _count: { complexity: 'desc' } },
    });
    // groupBy → like SQL GROUP BY
    // _count  → count rows in each group

    // Count by language
    const languageCounts = await prisma.analysis.groupBy({
      by: ['language'],
      _count: { language: true },
      orderBy: { _count: { language: 'desc' } },
    });

    // Most recent 5 analyses
    const recentAnalyses = await prisma.analysis.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        language: true,
        complexity: true,
        createdAt: true,
        code: true,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalAnalyses,
        complexityCounts,
        languageCounts,
        recentAnalyses,
      },
    });

  } catch (error) {
    console.error('Stats error:', error.message);
    res.status(500).json({ success: false, error: 'Could not fetch stats' });
  }
};

module.exports = { getStats };
