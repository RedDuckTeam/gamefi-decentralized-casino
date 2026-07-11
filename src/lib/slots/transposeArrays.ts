export function transposeArrays<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0 || arrays[0].length === 0) {
    return [];
  }

  const numRows = arrays.length;
  const numCols = arrays[0].length;

  const result: T[][] = new Array(numCols)
    .fill(0)
    .map(() => new Array(numRows));

  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      result[i][j] = arrays[j][i];
    }
  }

  return result;
}
