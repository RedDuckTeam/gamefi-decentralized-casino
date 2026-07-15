import { type RpsGameState } from '@/pages/rock-paper-scissors';

export function predictRPSResult(bet: bigint, winAmount: bigint): RpsGameState {
  if (winAmount === 0n) {
    return 'lose';
  }

  const distanceToDraw =
    winAmount - bet > 0 ? winAmount - bet : bet - winAmount;
  const distanceToWin =
    winAmount - bet * 2n > 0 ? winAmount - bet * 2n : bet * 2n - winAmount;

  if (distanceToDraw < distanceToWin) {
    return 'draw';
  } else {
    return 'win';
  }
}
