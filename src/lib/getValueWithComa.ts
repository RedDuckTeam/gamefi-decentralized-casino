export const getValueWithComa = (numStr: string): string => {
  return numStr.split('.')[1]?.length > 2
    ? numStr
    : parseFloat(numStr).toFixed(2);
};
