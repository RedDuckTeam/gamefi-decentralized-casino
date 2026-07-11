import {
  WheelVariant,
  wheelOddsAndPayouts,
  WheelRisk,
} from '@/constants/wheel';

export const guessWheelWinner = (
  bet: number,
  win: number,
  risk: WheelRisk,
): WheelVariant => {
  const multiplier = win / bet;
  const oddsAndPayouts = wheelOddsAndPayouts[risk];

  if (win < bet) {
    const lowestPayoutEntry = Object.entries(oddsAndPayouts).reduce(
      (acc, currentEntry) => (acc[1] < currentEntry[1] ? acc : currentEntry),
      ['', Infinity],
    );

    return lowestPayoutEntry[0] as WheelVariant;
  }

  let closestVariant: WheelVariant = WheelVariant.CANDY;
  let closestDifference = Infinity;

  Object.entries(oddsAndPayouts).forEach(([variant, payout]) => {
    const difference = Math.abs(payout - multiplier);
    if (difference < closestDifference) {
      closestDifference = difference;
      closestVariant = variant as WheelVariant;
    }
  });

  if (risk === WheelRisk.HIGH && win / bet < 0.1) {
    return WheelVariant.CANDY;
  }

  return closestVariant;
};
