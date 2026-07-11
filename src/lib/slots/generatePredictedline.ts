import { getRandomExcluding } from '../getRandomExcluding';

import { raritySlotsMap, slotsVariants } from '@/constants/slots';
import { type SlotsCombination } from '@/constants/slots-chances';

function getTargetValueForRarity(rarity: string): number {
  if (!Object.keys(raritySlotsMap).includes(rarity)) {
    throw new Error('Invalid combination rarity!');
  }
  return raritySlotsMap[rarity as keyof typeof raritySlotsMap];
}

function calculateStartPosition(length: number): number {
  const maxStartPosition = 5 - length;
  return Math.floor(Math.random() * (maxStartPosition + 1));
}

export const generatePredictedLine = (comb: SlotsCombination): number[] => {
  const defaultArray = Array.from({ length: 5 }, () => -999);
  const [rarity, lengthStr] = comb.split('');
  const length = parseInt(lengthStr, 10);

  const targetValue = getTargetValueForRarity(rarity);
  const arrayTargetValue = -targetValue;

  if (length === 5) {
    return defaultArray.fill(arrayTargetValue);
  }

  const startPosition = calculateStartPosition(length);
  for (let i = startPosition; i < startPosition + length; i++) {
    defaultArray[i] = arrayTargetValue;
  }

  return defaultArray.map((el) =>
    el === -999 ? getRandomExcluding(slotsVariants.size, targetValue) : el,
  );
};
