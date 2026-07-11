export function getRandomExcluding(arg: number, exclude: number): number {
  if (exclude > arg || exclude < 1) {
    throw new Error('Exclude value is out of bounds');
  }

  let randomNum = Math.floor(1 + Math.random() * arg);

  while (randomNum === exclude) {
    randomNum = Math.floor(1 + Math.random() * arg);
  }

  return randomNum;
}
