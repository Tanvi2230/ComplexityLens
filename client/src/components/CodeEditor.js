// CodeEditor.js — The code editor where users paste their function
// Uses Monaco Editor — the same editor that powers VS Code
// This gives users syntax highlighting, proper indentation, line numbers

import React from 'react';
import Editor from '@monaco-editor/react';
// Editor is the Monaco editor component

function CodeEditor({ code, language, onChange }) {
  // This component receives 3 props from its parent (HomePage):
  //   code     → the current code in the editor (controlled by parent)
  //   language → "python" or "javascript" (for syntax highlighting)
  //   onChange → function to call when user types something

  // What are props?
  // Props are like arguments you pass to a function
  // Parent passes data DOWN to child via props
  // Child cannot modify props directly — it calls onChange to tell parent

  return (
    <div className="editor-container">
      <Editor
        height="350px"
        // Height of the editor box

        language={language}
        // Tells Monaco which language to use for syntax highlighting
        // "python" → Python colors, "javascript" → JS colors

        value={code}
        // The current code content
        // Monaco shows whatever is in this variable

        onChange={onChange}
        // Called every time user types
        // Passes new code value up to parent (HomePage)

        theme="vs-dark"
        // Dark theme — same as VS Code dark mode

        options={{
          fontSize: 14,
          // Font size inside the editor

          minimap: { enabled: false },
          // Disable the tiny code map on the right side
          // Looks cleaner for our use case

          scrollBeyondLastLine: false,
          // Don't add empty space after the last line

          wordWrap: 'on',
          // Wrap long lines instead of horizontal scrolling

          automaticLayout: true,
          // Auto-resize editor when container size changes

          padding: { top: 16 }
          // Small padding at the top for breathing room
        }}
      />
    </div>
  );
}

export default CodeEditor;
