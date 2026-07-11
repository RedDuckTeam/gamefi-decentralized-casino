import { useState, useLayoutEffect } from 'react';

export const useIsPortrait = () => {
  const [size, setSize] = useState([0, 0]);
  const [isPortrait, setPortrait] = useState(
    !window.matchMedia('(orientation:landscape)').matches,
  );
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
      setPortrait(!window.matchMedia('(orientation:landscape)').matches);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return { size, isPortrait };
};
