import { generatePredictedLine } from './generatePredictedline';
import { generateRandomLine } from './generateRandomLine';
import { transposeArrays } from './transposeArrays';

import { type SlotsCombination } from '@/constants/slots-chances';

export const generateSlotsMatrix = ({
  prev,
  combination,
  length = 60,
}: {
  prev: number[][];
  combination: SlotsCombination | undefined;
  length?: number;
}): number[][] => {
  const scrollLines = Array.from({ length }, generateRandomLine);
  let resultLines: number[][] = [];

  if (combination) {
    const winningRowIndex = Math.floor(Math.random() * 4);
    const randomLines = Array.from({ length: 3 }, () =>
      generateRandomLine(true),
    );
    const winningLine = generatePredictedLine(combination);

    for (let i = 0; i < 4; i++) {
      if (i === winningRowIndex) {
        resultLines.push(winningLine);
      } else {
        resultLines.push(randomLines.pop() || []);
      }
    }
  } else {
    resultLines = Array.from({ length: 4 }, () => generateRandomLine(true));
  }

  const newMatrix = transposeArrays(scrollLines.concat(resultLines));

  return prev.map((row, i) => row.concat(newMatrix[i]));
};
