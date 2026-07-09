import { encodeAbiParameters } from 'viem';

import {
  ROULETTE_NUMBERS_SEQUENCE,
  botNumbers,
  midNumbers,
  topNumbers,
} from './roulette-numbers';

import { type GameInfoConfig } from '@/components/game-layout/game-info';
import { type GameOddAndPayout } from '@/components/odds-and-payouts';
import { type FixedLengthArray } from '@/types/fixedLengthArray';
import { type RouletteNumber, type ChipValue } from '@/types/roulette';

export interface IChip {
  fill: `#${string}`;
  label: ChipValue;
}

export const rouletteInfoConfig: GameInfoConfig = {
  title: 'Roulette',
  description: [
    'Choose Your Bet Amount: Select the amount you wish to bet by clicking on the corresponding value.',
    'Place your bets: Familiarize yourself with the different betting options available on the roulette table. You can bet chips on specific numbers, colors, odd or even numbers, or various combinations. You can also select 4 numbers at once with only one chip (with this scenario each slot will have 25% of the chip’s value).',
    'Spin the wheel: When you\'re ready, hit the "Place Bet" button to set the roulette wheel in motion.',
    'Wait for the outcome: Sit back and watch as the wheel spins and the ball determines the winning number. If the outcome matches your bet, you win according to the payout odds.',
    'Collect your winnings: If you win, your winnings will be automatically credited to your account. You can then choose to continue playing or cash out your winnings.',
    'Enjoy Responsibly: Remember to gamble responsibly and set limits for yourself to ensure a fun and enjoyable gaming experience.\n',
  ],
  image: '/games/roulette.webp',
  imageAlt: 'roulette-icon',
  imagePadding: true,
  howToPlaySteps: [
    {
      title: 'Setting up your wallet:',
      instructions: [
        'Connect your Ethereum wallet.',
        'Connect to the Arbitrum blockchain.',
        'Fund your wallet with USDT on the Arbitrum blockchain.',
      ],
    },
    {
      title: 'Approving USDT spending on the casino:',
      instructions: [
        'If it\'s your first time, you\'ll need to click the green "Approve" button.',
        'Confirm the approval transaction in your wallet.',
        'Wait a few moments for it to confirm.',
      ],
    },
  ],
};

export const mockRouletteOddsAndPayouts: GameOddAndPayout[] = Array.from(
  { length: 5 },
  (_, i) => ({
    id: i,
    bet: 'Straight up',
    number: i + 1,
    payout: '35 to 1',
    odd: '1 in 37',
  }),
);

function getRouletteColor(number: number): 'red' | 'black' | 'green' {
  if (number === 0) {
    return 'green';
  } else if ((1 <= number && number <= 10) || (19 <= number && number <= 28)) {
    return number % 2 === 0 ? 'black' : 'red';
  } else {
    return number % 2 === 0 ? 'red' : 'black';
  }
}

export const rouletteNumbersWithColors: RouletteNumber[] =
  ROULETTE_NUMBERS_SEQUENCE.map((number) => ({
    number,
    color: getRouletteColor(number),
  }));

export const chipsSequence: ChipValue[] = [
  '1',
  '10',
  '100',
  '1k',
  '10k',
  '100k',
  '1m',
  '10m',
  '100m',
];

export const numRows = [
  'c0 c0_c3 c3 c3_c6 c6 c6_c9 c9 c9_c12 c12 c12_c15 c15 c15_c18 c18 c18_c21 c21 c21_c24 c24 c24_c27 c27 c27_c30 c30 c30_c33 c33 c33_c36 c36 . ctop',
  'c0 c0_c2_c3 c2_c3 c2_c3_c5_c6 c5_c6 c5_c6_c8_c9 c8_c9 c8_c9_c11_c12 c11_c12 c11_c12_c14_c15 c14_c15 c14_c15_c17_c18 c17_c18 c17_c18_c20_c21 c20_c21 c20_c21_c23_c24 c23_c24 c23_c24_c26_c27 c26_c27 c26_c27_c29_c30 c29_c30 c29_c30_c32_c33 c32_c33 c32_c33_c35_c36 c35_c36 . .',
  'c0 c0_c2 c2 c2_c5 c5 c5_c8 c8 c8_c11 c11 c11_c14 c14 c14_c17 c17 c17_c20 c20 c20_c23 c23 c23_c26 c26 c26_c29 c29 c29_c32 c32 c32_c35 c35 . cmid',
  'c0 c0_c1_c2 c1_c2 c1_c2_c4_c5 c4_c5 c4_c5_c7_c8 c7_c8 c7_c8_c10_c11 c10_c11 c10_c11_c13_c14 c13_c14 c13_c14_c16_c17 c16_c17 c16_c17_c19_c20 c19_c20 c19_c20_c22_c23 c22_c23 c22_c23_c25_c26 c25_c26 c25_c26_c28_c29 c28_c29 c28_c29_c31_c32 c31_c32 c31_c32_c34_c35 c34_c35 . .',
  'c0 c0_c1 c1 c1_c4 c4 c4_c7 c7 c7_c10 c10 c10_c13 c13 c13_c16 c16 c16_c19 c19 c19_c22 c22 c22_c25 c25 c25_c28 c28 c28_c31 c31 c31_c34 c34 . cbot',
];

export const specialSlots = [
  { label: 'ctop', value: topNumbers },
  { label: 'cmid', value: midNumbers },
  { label: 'cbot', value: botNumbers },
];

export const rouletteChipsConfig: IChip[] = [
  {
    fill: '#FA315F',
    label: '1',
  },
  {
    fill: '#14BE7D',
    label: '10',
  },
  {
    fill: '#FFC239',
    label: '100',
  },
  {
    fill: '#9A6CF0',
    label: '1k',
  },
  {
    fill: '#4083F2',
    label: '10k',
  },
  {
    fill: '#01AE99',
    label: '100k',
  },
  {
    fill: '#FF39EB',
    label: '1m',
  },
  {
    fill: '#3A37E5',
    label: '10m',
  },
  {
    fill: '#F88430',
    label: '100m',
  },
];

export const rouletteBetAmountData = encodeAbiParameters(
  [
    { name: 'betsCount', type: 'uint256' },
    { name: 'userBetAmount', type: 'uint256' },
    { name: 'userBets', type: 'uint256[37]' },
  ],
  [
    BigInt(1),
    0n,
    Array.from({ length: 37 }, () => 0n) as FixedLengthArray<bigint, 37>,
  ],
);
