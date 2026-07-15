import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App.tsx';

import './index.css';
import { initSentry } from '@/lib/sentry/init-sentry.ts';

initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
