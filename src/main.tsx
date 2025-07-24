import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize Sentry (if needed)
// import * as Sentry from "@sentry/react";
// 
// Sentry.init({
//   dsn: "YOUR_DSN_HERE",
//   integrations: [
//     // Remove any replay integration references
//     // Sentry.replayIntegration(), // <-- This should be removed
//   ],
//   // Remove replay-related configurations
//   // replaysSessionSampleRate: 0.1,
//   // replaysOnErrorSampleRate: 1.0,
// });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
