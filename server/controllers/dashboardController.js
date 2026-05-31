// dashboardController.js — Personal stats for the logged-in user

const prisma = require('../services/prismaClient');

const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Run all queries in parallel — much faster than one by one
    const [
      totalAnalyses,
      recentAnalyses,
      complexityCounts,
      languageCounts,
      savedCount
    ] = await Promise.all([

      // Total analyses by this user
      prisma.analysis.count({ where: { userId } }),

      // 5 most recent analyses
      prisma.analysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, language: true, complexity: true, createdAt: true, code: true }
      }),

      // Complexity breakdown
      prisma.analysis.groupBy({
        by: ['complexity'],
        where: { userId },
        _count: { complexity: true },
        orderBy: { _count: { complexity: 'desc' } }
      }),

      // Language breakdown
      prisma.analysis.groupBy({
        by: ['language'],
        where: { userId },
        _count: { language: true },
        orderBy: { _count: { language: 'desc' } }
      }),

      // How many saved
      prisma.savedAnalysis.count({ where: { userId } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalAnalyses,
        savedCount,
        recentAnalyses,
        complexityCounts,
        languageCounts,
        topComplexity: complexityCounts[0]?.complexity || 'N/A',
        topLanguage: languageCounts[0]?.language || 'N/A',
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ success: false, error: 'Could not fetch dashboard' });
  }
};

module.exports = { getDashboard };
