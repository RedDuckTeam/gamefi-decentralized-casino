import { slotsVariants } from '@/constants/slots';

export function avoidCombinations(arr: number[]): number[] {
  const generateDifferentNumber = (exclude: number[]): number => {
    let candidate;
    do {
      candidate = Math.floor(1 + Math.random() * slotsVariants.size);
    } while (exclude.includes(candidate));
    return candidate;
  };

  const processArray = (inputArr: number[]): number[] => {
    for (let i = 0; i < inputArr.length; i++) {
      let count = 1;
      for (
        let j = i + 1;
        j < inputArr.length && inputArr[i] === inputArr[j];
        j++, count++
      ) {
        /* empty */
      }
      if (count >= 3) {
        const positionsToReplace = [i + 1];
        if (count > 3) {
          positionsToReplace.push(i + count - 2);
        }
        positionsToReplace.forEach((position) => {
          inputArr[position] = generateDifferentNumber([
            inputArr[position - 1],
            inputArr[position],
            inputArr[position + 1],
          ]);
        });
        i += count - 1;
      }
    }
    return inputArr;
  };

  const processedArray = processArray(arr);
  const recheckedArray = processArray(processedArray);

  return recheckedArray;
}
