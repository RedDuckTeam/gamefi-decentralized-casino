import { type GameInfoConfig } from '@/components/game-layout/game-info';
import BananaSvg from '@/components/ui/svg/banana.svg';
import CandySvg from '@/components/ui/svg/candy.svg';
import ChocolateSvg from '@/components/ui/svg/chocolate.svg';
import DonutsSvg from '@/components/ui/svg/donuts.svg';
import SegmentBanana from '@/components/ui/svg/wheel-segment-banana.svg';
import SegmentCandy from '@/components/ui/svg/wheel-segment-candy.svg';
import SegmentChoko from '@/components/ui/svg/wheel-segment-choco.svg';
import SegmentDonut from '@/components/ui/svg/wheel-segment-donut.svg';

export const wheelInfoConfig: GameInfoConfig = {
  title: 'Wheel',
  description: [
    'Choose Your Bet Amount: Select the amount you wish to bet by clicking on the corresponding value.',
    'Adjust difficulty: Before spinning the wheel, adjust the difficulty level to tailor the risk according to your preference. Review the symbols on the wheel and their corresponding payout odds. Higher difficulty levels may offer higher potential rewards but also come with increased risk.',
    'Spin the wheel: Click the “Place Bet” button to set the wheel in motion. Watch as the wheel spins, and anticipation builds to see where it lands.\n',
    'Await the result: As the wheel comes to a stop, the indicator will point to one of the symbols and you win according to the corresponding payout odds.\n',
    'Claim your winnings: Your winnings will be automatically added to your account balance. You can then choose to continue playing or cash out your winnings.\n',
    'Enjoy Responsibly: Remember to gamble responsibly and set limits for yourself to ensure a fun and enjoyable gaming experience.\n',
  ],
  image: '/games/wheel.webp',
  imageAlt: 'wheel-icon',
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

export enum WheelRisk {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum WheelVariant {
  CANDY = 'candy',
  DONUT = 'donut',
  CHOCO = 'choco',
  BANANA = 'banana',
}

export const wheelOddsAndPayouts: Record<WheelRisk, Record<string, number>> = {
  [WheelRisk.LOW]: {
    [WheelVariant.CANDY]: 0.5,
    [WheelVariant.DONUT]: 1.2,
    [WheelVariant.CHOCO]: 1.6,
  },
  [WheelRisk.MEDIUM]: {
    [WheelVariant.CANDY]: 0.5,
    [WheelVariant.DONUT]: 1.5,
    [WheelVariant.CHOCO]: 2,
    [WheelVariant.BANANA]: 3,
  },
  [WheelRisk.HIGH]: {
    [WheelVariant.CANDY]: 0.1,
    [WheelVariant.BANANA]: 10,
  },
};

export const wheelVariants = {
  [WheelVariant.CANDY]: {
    id: 0,
    img: CandySvg,
    bgColor: '#F355DF',
    textColor: '#F1F1F1',
  },
  [WheelVariant.DONUT]: {
    id: 1,
    img: DonutsSvg,
    bgColor: '#161928',
    textColor: '#F1F1F1',
  },
  [WheelVariant.CHOCO]: {
    id: 2,
    img: ChocolateSvg,
    bgColor: '#FFF73E',
    textColor: '#272B3F',
  },
  [WheelVariant.BANANA]: {
    id: 3,
    img: BananaSvg,
    bgColor: '#33d774',
    textColor: '#3c4260',
  },
};

export const wheelImageMap = {
  [WheelVariant.CANDY]: SegmentCandy,
  [WheelVariant.CHOCO]: SegmentChoko,
  [WheelVariant.DONUT]: SegmentDonut,
  [WheelVariant.BANANA]: SegmentBanana,
};

export const wheelData: Record<WheelRisk, WheelVariant[]> = {
  [WheelRisk.LOW]: [
    WheelVariant.CANDY,
    WheelVariant.DONUT,
    WheelVariant.CANDY,
    WheelVariant.CHOCO,
    WheelVariant.CANDY,
    WheelVariant.DONUT,
    WheelVariant.CANDY,
    WheelVariant.CHOCO,
    WheelVariant.CANDY,
    WheelVariant.DONUT,
    WheelVariant.CANDY,
    WheelVariant.CHOCO,
    WheelVariant.CANDY,
    WheelVariant.DONUT,
    WheelVariant.CANDY,
    WheelVariant.CHOCO,
    WheelVariant.CANDY,
    WheelVariant.DONUT,
  ],
  [WheelRisk.MEDIUM]: [
    WheelVariant.CANDY,
    WheelVariant.BANANA,
    WheelVariant.CANDY,
    WheelVariant.CHOCO,
    WheelVariant.CANDY,
    WheelVariant.DONUT,
    WheelVariant.CANDY,
    WheelVariant.DONUT,
    WheelVariant.CHOCO,
    WheelVariant.DONUT,
    WheelVariant.CANDY,
    WheelVariant.CHOCO,
    WheelVariant.BANANA,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CHOCO,
    WheelVariant.DONUT,
    WheelVariant.CHOCO,
  ],
  [WheelRisk.HIGH]: [
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.BANANA,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.BANANA,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
    WheelVariant.CANDY,
  ],
};
