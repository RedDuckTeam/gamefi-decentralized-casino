import {
  init,
  browserTracingIntegration,
  replayIntegration,
} from '@sentry/react';

export const initSentry = () => {
  if (import.meta.env.DEV) return;

  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (dsn) {
    init({
      dsn,
      integrations: [
        browserTracingIntegration(),
        replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: 1.0,
      tracePropagationTargets: ['localhost'],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      initialScope: {
        tags: {
          environment: 'production',
        },
      },
      autoSessionTracking: false,
    });
  }
};
