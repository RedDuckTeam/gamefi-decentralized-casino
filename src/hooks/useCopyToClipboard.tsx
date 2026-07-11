import { useCallback } from 'react';

import { useToast } from './useToast';

export const useCopyToClipboard = () => {
  const { toast } = useToast();
  const handleCopyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast({ description: 'Copied to clipboard!' });
        })
        .catch((err) => {
          console.error('Failed to copy!', err);
        });
    },
    [toast],
  );

  return handleCopyToClipboard;
};
