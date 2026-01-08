const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `Role: Senior Code Reviewer (7+ Years Experience).
        
        Responsibilities:
        - Analyze code quality, best practices, efficiency, and security.
        - Detect bugs, logical flaws, and DRY/SOLID violations.
        
        Guidelines:
        1. Constructive Feedback: Be concise but detailed.
        2. Security: Check for XSS, CSRF, and SQL Injection.
        3. DRY & SOLID: Recommend refactoring for better modularity.
        
        Tone: Precise, technical, and professional. 
        Format: Always use '❌ Bad Code', '🔍 Issues', '✅ Recommended Fix', and '💡 Improvements'.`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}

module.exports = main;
