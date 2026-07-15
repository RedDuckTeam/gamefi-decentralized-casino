import { type GameInfoConfig } from '@/components/game-layout/game-info';
import HeadSvg from '@/components/ui/svg/head.svg';
import TailSvg from '@/components/ui/svg/tail.svg';

export const coinflipInfoConfig: GameInfoConfig = {
  title: 'Coin flip',
  description: [
    'Choose Your Bet Amount: Select the amount you wish to bet by clicking on the corresponding value.',
    'Select your prediction: Choose whether you want to bet on "Heads" or "Tails" for the coin flip.',
    'Flip the coin: Click the "Place Bet" button to start the coin flip animation. Watch as the coin spins through the air.',
    'Determine the outcome: Once the coin lands, the outcome will be revealed. If the result matches your prediction, you win!\n',
    'Collect your winnings: If your prediction is correct, your winnings will be automatically added to your account balance.',
    'Enjoy Responsibly: Remember to gamble responsibly and set limits for yourself to ensure a fun and enjoyable gaming experience.\n',
  ],
  image: '/games/coinflip-instruction.webp',
  imageAlt: 'coinflip icon',
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

export enum CoinflipVariant {
  TAIL = 'Tail',
  HEADS = 'Heads',
}

export const coinflipConfig = [
  { id: 0, name: CoinflipVariant.HEADS, img: HeadSvg },
  { id: 1, name: CoinflipVariant.TAIL, img: TailSvg },
];

export const getCoinflipLoseState = (variant: CoinflipVariant) => {
  if (variant == CoinflipVariant.TAIL) return CoinflipVariant.HEADS;
  if (variant == CoinflipVariant.HEADS) return CoinflipVariant.TAIL;
};
