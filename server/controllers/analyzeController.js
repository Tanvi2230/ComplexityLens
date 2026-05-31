// analyzeController.js — The main controller for code analysis
// A controller is the function that runs when a route is hit
// It coordinates all the services and sends back the final response

// ─── 1. IMPORTS ───────────────────────────────────────────────────────────────

const { runAtAllSizes, LANGUAGE_IDS } = require('../services/judge0Service');
// runAtAllSizes → runs user code at 7 input sizes, returns timing array

const { detectComplexity, detectSpaceComplexity } = require('../services/complexityService');
// detectComplexity → analyses timings and returns "O(n²)" etc.
// detectSpaceComplexity → analyses code pattern and returns space complexity

const { analyzeComplexityWithAI } = require('../services/geminiService');
// analyzeComplexityWithAI → sends code to Gemini, returns plain English explanation

const prisma = require('../services/prismaClient');
// prisma → our database connection to save and retrieve analyses

// ─── 2. ANALYZE CONTROLLER ────────────────────────────────────────────────────

const analyzeCode = async (req, res) => {
  // This function runs when React sends a POST request to /api/analyze
  // async → because we make multiple API calls that take time
  // req → the incoming request (contains the user's code)
  // res → the response we send back to React

  try {

    // ─── STEP 1: GET DATA FROM REQUEST ──────────────────────────────────────

    const { code, language } = req.body;
    // req.body contains the JSON data React sent us
    // We extract code (the user's pasted function) and language ("python"/"javascript")

    // ─── STEP 2: VALIDATE INPUT ─────────────────────────────────────────────

    if (!code || !language) {
      return res.status(400).json({
        error: 'Code and language are required'
      });
      // 400 = Bad Request — the user didn't send what we need
      // return stops the function here so we don't continue with missing data
    }

    if (!Object.keys(LANGUAGE_IDS).includes(language)) {
      return res.status(400).json({
        error: `Unsupported language. Must be one of: ${Object.keys(LANGUAGE_IDS).join(', ')}`
      });
    }

    console.log(`📊 Analyzing ${language} code...`);

    // ─── STEP 3: RUN CODE AND GET TIMINGS ───────────────────────────────────

    console.log('⏱️  Running code at multiple input sizes...');
    const timings = await runAtAllSizes(code, language);
    // timings → [{ n: 10, ms: 2 }, { n: 100, ms: 45 }, { n: 1000, ms: 890 }...]
    // await → wait for all 7 Judge0 runs to complete

    // ─── STEP 4: DETECT COMPLEXITY ──────────────────────────────────────────

    const complexity = detectComplexity(timings);
    // Compare timing curve to theoretical curves
    // Returns "O(n²)", "O(n log n)", "O(n)" etc.

    const spaceComplexity = detectSpaceComplexity(code);
    // Analyse code patterns to estimate space complexity
    // Returns "O(1)", "O(n)", "O(n²)" etc.

    console.log(`✅ Detected complexity: ${complexity}`);

    // ─── STEP 5: GET AI EXPLANATION ─────────────────────────────────────────

    console.log('🤖 Getting AI explanation from Gemini...');
    const aiExplanation = await analyzeComplexityWithAI(code, language, complexity);
    // Send code + detected complexity to Gemini
    // Returns a detailed plain English explanation

    // ─── STEP 6: SAVE TO DATABASE ───────────────────────────────────────────

    console.log('💾 Saving to database...');
    const savedAnalysis = await prisma.analysis.create({
      data: {
        code,
        language,
        complexity,
        spaceComplexity,
        timings,
        aiExplanation,
        userId: req.userId || null,
        // attach to logged-in user if token was provided
      }
    });
    // savedAnalysis → the newly created row, including the auto-generated id and createdAt

    // ─── STEP 7: SEND RESPONSE TO REACT ─────────────────────────────────────

    res.status(201).json({
      // 201 = Created — successfully created a new resource
      success: true,
      data: {
        id: savedAnalysis.id,
        code,
        language,
        complexity,
        spaceComplexity,
        timings,
        aiExplanation,
        createdAt: savedAnalysis.createdAt
      }
    });
    // This JSON object is what React receives and uses to:
    // → display the chart (timings)
    // → show the badge (complexity)
    // → show the explanation (aiExplanation)

  } catch (error) {
    // If ANYTHING goes wrong in any step above, we catch it here
    console.error('❌ Analysis error:', error.message);
    res.status(500).json({
      // 500 = Internal Server Error
      success: false,
      error: 'Analysis failed. Please try again.',
      details: error.message
    });
  }
};

// ─── 3. GET HISTORY CONTROLLER ────────────────────────────────────────────────

const getHistory = async (req, res) => {
  // This function runs when React requests the analysis history
  // Shows past analyses on the history page

  try {
    const analyses = await prisma.analysis.findMany({
      // .findMany() → get multiple rows from the Analysis table
      orderBy: {
        createdAt: 'desc'
        // Sort by newest first
      },
      take: 20,
      // Limit to 20 most recent analyses
      // We don't want to load thousands of records at once
      select: {
        // Select only the fields we need for the history list
        // We don't need the full code and aiExplanation in the list view
        id: true,
        language: true,
        complexity: true,
        spaceComplexity: true,
        createdAt: true,
        code: true
      }
    });

    res.status(200).json({
      success: true,
      data: analyses
    });

  } catch (error) {
    console.error('❌ History error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Could not fetch history'
    });
  }
};

// ─── 4. EXPORT ────────────────────────────────────────────────────────────────

module.exports = { analyzeCode, getHistory };
