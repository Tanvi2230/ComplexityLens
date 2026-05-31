// LoadingSteps.js — Shows step by step progress while analyzing
// Instead of just a spinner, users see exactly what's happening
// This is great UX — users know the app is working, not frozen

import React, { useState, useEffect } from 'react';

const STEPS = [
  { id: 1, label: 'Sending code to execution engine',  icon: '📤', duration: 2000  },
  { id: 2, label: 'Running at 7 different input sizes', icon: '⚙️', duration: 15000 },
  { id: 3, label: 'Measuring real milliseconds',        icon: '⏱️', duration: 3000  },
  { id: 4, label: 'Comparing to complexity curves',    icon: '📊', duration: 2000  },
  { id: 5, label: 'Getting AI explanation',            icon: '🤖', duration: 4000  },
  { id: 6, label: 'Saving to database',               icon: '💾', duration: 1000  },
];
// Each step has a duration (how long before next step activates)
// These are approximate — real timing depends on API speed

function LoadingSteps() {
  const [activeStep, setActiveStep] = useState(0);
  // activeStep → index of currently active step (0 to 5)

  useEffect(() => {
    // useEffect runs after component mounts
    // We advance through steps using cumulative timeouts

    let elapsed = 0;
    const timers = [];

    STEPS.forEach((step, index) => {
      const timer = setTimeout(() => {
        setActiveStep(index);
        // Activate this step after its cumulative delay
      }, elapsed);

      timers.push(timer);
      elapsed += step.duration;
      // Next step starts after this step's duration
    });

    return () => timers.forEach(clearTimeout);
    // Cleanup — cancel timers if component unmounts (user navigates away)
  }, []);

  return (
    <div className="loading-steps">
      <div className="loading-title">
        <div className="pulse-dot"></div>
        Analyzing your code...
      </div>

      <div className="steps-list">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`step-item ${
              index < activeStep ? 'completed' :
              index === activeStep ? 'active' : 'pending'
            }`}
            // completed → step is done (green checkmark)
            // active    → step currently running (spinner)
            // pending   → step not started yet (grey)
          >
            <div className="step-icon-wrapper">
              {index < activeStep ? (
                <span className="step-check">✓</span>
              ) : index === activeStep ? (
                <span className="step-spinner"></span>
              ) : (
                <span className="step-dot"></span>
              )}
            </div>

            <span className="step-icon">{step.icon}</span>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>

      <p className="loading-note">
        This takes 20-40 seconds — we actually run your code 7 times!
      </p>
    </div>
  );
}

export default LoadingSteps;
