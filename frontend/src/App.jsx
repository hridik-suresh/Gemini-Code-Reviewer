import React, { useState } from "react";
import axios from "axios";
import Editor from "react-simple-code-editor";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sun, Moon, Sparkles, Loader2, Code2 } from "lucide-react";

// Prism Languages for the Editor
import prism from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // Default prism theme

import { useTheme } from "./hooks/useTheme";
import { useTypewriter } from "./hooks/useTypewriter";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [code, setCode] = useState(`function sum(a, b) {\n  return a + b;\n}`);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Typewriter effect for AI response
  const animatedReview = useTypewriter(reviewText);

  async function handleReview() {
    setLoading(true);
    setReviewText(""); // Clear old review
    try {
      const response = await axios.post(`${API_URL}/ai/get-review`, {
        code,
      });
      setReviewText(response.data);
    } catch (err) {
      setReviewText(
        "### ❌ Error\nFailed to reach the server. Make sure your backend is running."
      );
    }
    setLoading(false);
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm z-10">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Code2 size={24} />
          <h1 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
            AI Reviewer
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Section: Code Editor */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#2d2d2d] relative overflow-hidden">
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleReview}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Sparkles size={18} />
              )}
              Review Code
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 custom-editor">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 14,
                minHeight: "100%",
                color: "#ccc",
              }}
            />
          </div>
        </div>

        {/* Right Section: AI Review */}
        <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 overflow-auto p-8 border-l dark:border-gray-800">
          {loading && !animatedReview ? (
            <div className="flex items-center gap-3 text-gray-500 italic animate-pulse">
              <Loader2 className="animate-spin" /> Gathering feedback...
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={theme === "dark" ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-gray-100 dark:bg-gray-800 px-1 rounded"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {animatedReview ||
                  "### Instructions\nPaste your code on the left and click **Review Code** to get AI feedback."}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
