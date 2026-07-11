import { slotsVariants } from '@/constants/slots';

export const getInitialSlots = (): number[][] => {
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 4 }, () =>
      Math.floor(1 + Math.random() * slotsVariants.size),
    ),
  );
};
