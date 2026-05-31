// geminiService.js — Handles AI explanations using Groq (free, fast)
// Groq runs Llama AI models for free with no restrictions
// We kept the filename as geminiService.js so no other files need to change

const Groq = require('groq-sdk');
// Groq SDK — connects us to Groq's free AI API

// ─── INITIALIZE GROQ ──────────────────────────────────────────────────────────

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
  // Reads GROQ_API_KEY from our .env file
});

// ─── MAIN FUNCTION ────────────────────────────────────────────────────────────

const analyzeComplexityWithAI = async (code, language, complexity) => {
  // Same function name as before — analyzeController doesn't need to change
  // Parameters:
  //   code       → the user's pasted code
  //   language   → "python" or "javascript"
  //   complexity → detected complexity e.g. "O(n²)"

  // ─── BUILD THE PROMPT ───────────────────────────────────────────────────────

  const prompt = `You are an expert computer science teacher explaining algorithm complexity to a student.

Analyze this ${language} code:

\`\`\`${language}
${code}
\`\`\`

The detected time complexity is: ${complexity}

Please provide:
1. A clear line-by-line explanation of WHY this code has ${complexity} complexity
2. What the space complexity is and why
3. A simple real-world analogy to help understand this complexity
4. One tip to potentially optimize this code

Keep the explanation beginner-friendly but technically accurate.
Use simple language. Be concise but thorough.`;

  // ─── CALL GROQ API ──────────────────────────────────────────────────────────

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
          // We send the prompt as a user message
          // Groq uses the same chat format as OpenAI
        }
      ],
      model: 'llama-3.3-70b-versatile',
      // Llama 3.3 70B — Meta's best open source model
      // Very good at code explanation, completely free on Groq
      // "70b" means 70 billion parameters — very capable

      temperature: 0.7,
      // Controls creativity vs accuracy
      // 0 = very precise/repetitive, 1 = very creative
      // 0.7 is a good balance for explanations

      max_tokens: 1024
      // Maximum length of response
      // 1024 tokens ≈ 750 words — enough for a good explanation
    });

    return response.choices[0].message.content;
    // choices[0] → the first (and only) response
    // message.content → the actual text explanation

  } catch (error) {
    console.error('Groq API error:', error.message);
    return 'AI explanation unavailable at the moment. Please try again.';
    // Fallback message if API fails
    // The rest of the analysis still works even without AI explanation
  }
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────

module.exports = { analyzeComplexityWithAI };
// Same export name — analyzeController.js doesn't need any changes
