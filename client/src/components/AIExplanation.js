// AIExplanation.js — Displays the AI-generated explanation from Gemini
// Shows the plain English explanation of why the code has its complexity

import React from 'react';

function AIExplanation({ explanation }) {
  // Props:
  //   explanation → the text string returned by Gemini API

  return (
    <div className="ai-explanation">

      <div className="ai-header">
        <span className="ai-icon">🤖</span>
        <h3>AI Explanation</h3>
        <span className="ai-badge">Powered by Gemini</span>
        {/* Shows users this is AI-generated — transparency is good UX */}
      </div>

      <div className="ai-content">
        {explanation.split('\n').map((line, index) => {
          // Split explanation by newlines and render each line separately
          // This preserves the formatting Gemini returns
          // .map() loops through each line and returns JSX for it

          if (line.trim() === '') {
            return <br key={index} />;
            // Empty lines become line breaks
          }

          if (line.startsWith('##') || line.startsWith('#')) {
            return (
              <h4 key={index} className="ai-heading">
                {line.replace(/^#+\s/, '')}
                {/* Remove the # symbols from markdown headings */}
              </h4>
            );
          }

          if (line.match(/^\d+\./)) {
            return (
              <p key={index} className="ai-numbered">
                {line}
                {/* Numbered list items get their own style */}
              </p>
            );
          }

          return (
            <p key={index} className="ai-paragraph">
              {line}
              {/* Regular text lines */}
            </p>
          );

          // key={index} → React needs a unique key for each item in a list
          // It uses this to track which items changed and update efficiently
        })}
      </div>

    </div>
  );
}

export default AIExplanation;
