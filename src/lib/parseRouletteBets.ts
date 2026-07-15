import { type Address, type PublicClient } from 'viem';

import { ibetHelperAbi } from '@/abi/gmxHelperAbi';
import {
  blackNumbers,
  botNumbers,
  evenNumbers,
  midNumbers,
  oddNumbers,
  redNumbers,
  topNumbers,
} from '@/constants/roulette-numbers';
import { type FixedLengthArray } from '@/types/fixedLengthArray';
import { type ChipValue } from '@/types/roulette';

const chipValueMap: Record<ChipValue, number> = {
  '1': 1,
  '10': 10,
  '100': 100,
  '1k': 1000,
  '10k': 10000,
  '100k': 100000,
  '1m': 1000000,
  '10m': 10000000,
  '100m': 100000000,
};

export const chipValuePriceMap: Record<ChipValue, bigint> = {
  '1': 1000000000000000000n,
  '10': 10000000000000000000n,
  '100': 100000000000000000000n,
  '1k': 1000000000000000000000n,
  '10k': 10000000000000000000000n,
  '100k': 100000000000000000000000n,
  '1m': 1000000000000000000000000n,
  '10m': 10000000000000000000000000n,
  '100m': 100000000000000000000000000n,
};

function formatBetValue(value: number): string {
  const format = (num: number, unit: string) => {
    const rounded = Math.floor(num * 10) / 10;
    return rounded % 1 === 0
      ? `${rounded.toFixed(0)}${unit}`
      : `${rounded.toFixed(1)}${unit}`;
  };

  if (value < 1000) {
    return value.toString();
  } else if (value < 1000000) {
    return format(value / 1000, 'k');
  } else {
    return format(value / 1000000, 'm');
  }
}

export function formatTotalBet(chips: ChipValue[]): string {
  const total = chips.reduce((acc, chip) => acc + chipValueMap[chip], 0);
  return formatBetValue(total);
}

export const parseRouletteBets = async (
  bets: Map<string, ChipValue[]>,
  roundBet: bigint,
  activeToken: Address,
  gmxHelperAddress: Address,
  publicClient: PublicClient,
): Promise<FixedLengthArray<bigint, 37>> => {
  const result = Array.from({ length: 37 }).fill(0n) as FixedLengthArray<
    bigint,
    37
  >;

  const modifyRouletteBets = (values: ChipValue[], target: string[]) => {
    const total = values.reduce((res, v) => (res += chipValuePriceMap[v]), 0n);
    const divider = BigInt(target.length);
    const resultValue = total / divider;

    target.forEach((val) => {
      result[Number(val)] += resultValue;
    });
  };

  for (const [key, values] of bets) {
    if (key == 'red') {
      modifyRouletteBets(values, redNumbers);
      continue;
    }
    if (key == 'black') {
      modifyRouletteBets(values, blackNumbers);
      continue;
    }
    if (key == 'ctop') {
      modifyRouletteBets(values, topNumbers);
      continue;
    }
    if (key == 'cmid') {
      modifyRouletteBets(values, midNumbers);
      continue;
    }
    if (key == 'cbot') {
      modifyRouletteBets(values, botNumbers);
      continue;
    }
    if (key == 'even') {
      modifyRouletteBets(values, evenNumbers);
      continue;
    }
    if (key == 'odd') {
      modifyRouletteBets(values, oddNumbers);
      continue;
    }

    const matches = key.match(/(\d+)-(\d+)/);

    if (matches) {
      const start = parseInt(matches[1], 10);
      const end = parseInt(matches[2], 10);

      const range: string[] = [];
      for (let i = start; i <= end; i++) {
        range.push(String(i));
      }

      modifyRouletteBets(values, range);
      continue;
    }

    const parsedKeys = key.split('_').map((k) => k.slice(1));
    modifyRouletteBets(values, parsedKeys);
  }

  const predictedRoundBet = await publicClient.readContract({
    abi: ibetHelperAbi,
    address: gmxHelperAddress,
    functionName: 'getBuyOrSellAmount',
    args: [activeToken, roundBet, true],
  });

  const finalResults = (await Promise.all(
    result.map((val) =>
      publicClient.readContract({
        abi: ibetHelperAbi,
        address: gmxHelperAddress,
        functionName: 'getBuyOrSellAmount',
        args: [activeToken, val, true],
      }),
    ),
  )) as unknown as FixedLengthArray<bigint, 37>;

  const finalBetsSum = finalResults.reduce((prev, val) => (prev += val), 0n);

  const index = finalResults.reverse().findIndex((x) => x);
  finalResults[index] += predictedRoundBet - finalBetsSum;

  return finalResults.reverse() as unknown as FixedLengthArray<bigint, 37>;
};

export const getRoundBet = (bets: Map<string, ChipValue[]>): bigint => {
  const values = Array.from(bets.values());
  return values
    .flat()
    .reduce((res, curr) => (res += chipValuePriceMap[curr]), 0n);
};
