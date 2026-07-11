export function generateSlideArray(
  size: number,
  lastFourthValue?: number,
): number[] {
  const result: number[] = [];

  for (let i = 0; i < size; i++) {
    const randomNumber =
      Math.round(Math.pow(Math.random(), 4) * 99 * 100) / 100 + 1;
    const parsedValue = parseFloat(randomNumber.toFixed(2));
    result.push(parsedValue);
  }

  if (lastFourthValue !== undefined && result.length >= 4) {
    result[result.length - 4] = lastFourthValue;
  }

  return result;
}
