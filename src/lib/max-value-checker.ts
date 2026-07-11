const padFraction = (fraction: string | undefined, length: number) =>
  fraction ? fraction.padEnd(length, '0') : '0'.repeat(length);

export const maxValueChecker = (currentValue: string, maxValue: string) => {
  const [currentIntegerPart, currentFraction] = currentValue.split('.');
  const [maxIntegerPart, maxFraction] = maxValue.split('.');

  if (+maxIntegerPart < +currentIntegerPart) return maxValue;

  const maxFloatingLength = Math.max(
    currentFraction?.length || 0,
    maxFraction?.length || 0,
  );

  const currentFractionalPart = padFraction(currentFraction, maxFloatingLength);
  const maxFractionalPart = padFraction(maxFraction, maxFloatingLength);

  if (
    +maxIntegerPart <= +currentIntegerPart &&
    BigInt(maxFractionalPart) <= BigInt(currentFractionalPart)
  ) {
    return maxValue;
  }

  return currentValue;
};
