import { useCallback, useMemo, useState } from 'react';

/**
 * Keeps rounds that are still being animated out of the ratings table.
 *
 * When a round finishes on-chain its results appear in the ratings feed
 * immediately, ahead of the game animation. Marking the round as pending
 * hides its rows until the animation reveals them one by one.
 */
export const usePendingRoundRatings = <T extends { requestId: string }>(
  ratings: T[] | null | undefined,
) => {
  const [pendingRoundId, setPendingRoundId] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  const visibleRatings = useMemo(() => {
    if (!ratings) return null;
    if (!pendingRoundId) return ratings;

    const result = [...ratings];

    for (let i = 0; i < pendingCount; i++) {
      const index = result.findIndex((x) => x.requestId === pendingRoundId);
      if (index !== -1) {
        result.splice(index, 1);
      }
    }

    return result;
  }, [pendingCount, pendingRoundId, ratings]);

  const markRoundPending = useCallback((roundId: string, count: number) => {
    setPendingRoundId(roundId);
    setPendingCount(count);
  }, []);

  const revealNextRow = useCallback(
    () => setPendingCount((prev) => prev - 1),
    [],
  );

  const clearPendingRound = useCallback(() => setPendingRoundId(null), []);

  return {
    visibleRatings,
    markRoundPending,
    revealNextRow,
    clearPendingRound,
  };
};
