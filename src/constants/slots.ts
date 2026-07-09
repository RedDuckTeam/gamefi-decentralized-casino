import { type GameInfoConfig } from '@/components/game-layout/game-info';

import SlotsImage from '/games/slots.webp';
import LotusSvg from '/images/pages/slots/variants/lotus.svg';
import SushiSvg from '/images/pages/slots/variants/sushi.svg';
import RamenSvg from '/images/pages/slots/variants/ramen.svg';
import SakuraSvg from '/images/pages/slots/variants/sakura.svg';
import CatSvg from '/images/pages/slots/variants/cat.svg';
import FishSvg from '/images/pages/slots/variants/fish.svg';

export const slotsInfoConfig: GameInfoConfig = {
  title: 'Classic Slots',
  description: [
    'Set your bet: Decide on the amount you want to bet per spin. Use the controls provided to adjust the coin denomination and the number of coins or paylines you wish to bet on.',
    'Spin the reels: Once your bet is set, click on the "Place Bet" button to start the reels spinning. Alternatively, you may have an "Auto Spin" option to set a certain number of spins to play automatically.\n',
    "Watch for winning combinations: As the reels come to a stop, symbols will align across the paylines. If you land a winning combination according to the game's paytable, you win! You can find detailed rules of the paytable by clicking on the symbol in the form of a document in the top right corner of the game.",
    'Claim your winnings: Any winnings you earn from a spin will be automatically credited to your account balance.',
    'Enjoy Responsibly: Remember to gamble responsibly and set limits for yourself to ensure a fun and enjoyable gaming experience.\n',
  ],
  image: SlotsImage,
  imageAlt: 'slots-icon',
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

export type SlotsRarity = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export const slotsVariants = new Map();
slotsVariants.set(1, LotusSvg);
slotsVariants.set(2, SushiSvg);
slotsVariants.set(3, RamenSvg);
slotsVariants.set(4, SakuraSvg);
slotsVariants.set(5, CatSvg);
slotsVariants.set(6, FishSvg);

export const raritySlotsMap = {
  A: 6,
  B: 5,
  C: 4,
  D: 3,
  E: 2,
  F: 1,
};

type SlotsInstruction = {
  image: string;
  alt: string;
  combinations: {
    3: string;
    4: string;
    5: string;
  };
};

export const slotsInstructionConfig: SlotsInstruction[] = [
  {
    image: LotusSvg,
    alt: 'lotus-image',
    combinations: {
      '3': '1.5x',
      '4': '2x',
      '5': '3x',
    },
  },
  {
    image: SushiSvg,
    alt: 'sushi-image',
    combinations: {
      '3': '2x',
      '4': '5x',
      '5': '10x',
    },
  },
  {
    image: RamenSvg,
    alt: 'ramen-image',
    combinations: {
      '3': '5x',
      '4': '20x',
      '5': '25x',
    },
  },
  {
    image: SakuraSvg,
    alt: 'sakura-image',
    combinations: {
      '3': '25x',
      '4': '50x',
      '5': '125x',
    },
  },
  {
    image: CatSvg,
    alt: 'cat-image',
    combinations: {
      '3': '50x',
      '4': '125x',
      '5': '250x',
    },
  },
  {
    image: FishSvg,
    alt: 'fish-image',
    combinations: {
      '3': '100x',
      '4': '250x',
      '5': '500x',
    },
  },
];

export const winningSlotsCombinations: [
  number,
  number,
  number,
  number,
  number,
][][] = [
  [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1],
  ],
];
