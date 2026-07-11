import { avoidCombinations } from './avoidCombinations';

import { slotsVariants } from '@/constants/slots';

export const generateRandomLine = (
  shouldAvoidCombinations: boolean = false,
): number[] => {
  const slotsLength = slotsVariants.size;
  const generateRandomNumber = () =>
    Math.floor(1 + Math.random() * slotsLength);

  const array = new Array(5).fill(null).map(generateRandomNumber);

  return shouldAvoidCombinations ? avoidCombinations(array) : array;
};
