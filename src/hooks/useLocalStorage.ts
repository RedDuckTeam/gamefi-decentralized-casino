import React from 'react';

// Define a type for the callback function
type Callback = (e: StorageEvent) => void;

function dispatchStorageEvent(key: string, newValue: string | null): void {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
}

const setLocalStorageItem = (key: string, value: unknown): void => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string): void => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string): string | null => {
  return window.localStorage.getItem(key);
};

const useLocalStorageSubscribe = (callback: Callback): (() => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getLocalStorageServerSnapshot = (): never => {
  throw Error('useLocalStorage is a client-only hook');
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (newValue: T | ((prevState: T) => T)) => void] {
  const getSnapshot = (): string | null => getLocalStorageItem(key);

  const store = React.useSyncExternalStore<string | null>(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot,
  );

  const setState: (newValue: T | ((prevState: T) => T)) => void =
    React.useCallback(
      (v) => {
        try {
          const nextState: T =
            typeof v === 'function'
              ? (v as (prevState: T) => T)(JSON.parse(store ?? 'null') as T)
              : v;

          if (nextState === undefined || nextState === null) {
            removeLocalStorageItem(key);
          } else {
            setLocalStorageItem(key, nextState);
          }
        } catch (e) {
          console.warn(e);
        }
      },
      [key, store],
    );

  React.useEffect(() => {
    if (getLocalStorageItem(key) === null && initialValue !== undefined) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? JSON.parse(store) : initialValue, setState];
}
