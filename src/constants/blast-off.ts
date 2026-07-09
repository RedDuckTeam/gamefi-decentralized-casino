import { type GameInfoConfig } from '@/components/game-layout/game-info';

export const blastOffInfoConfig: GameInfoConfig = {
  title: 'Blast-Off',
  description: [
    'Choose Your Bet Amount: Select the amount you wish to bet by clicking on the corresponding value.',
    "Set your launch power: Choose the power level for your rocket's launch. This determines the height your rocket should reach during the game.\n",
    'Launch your rocket: Click on the "Place Bet" button to start the game. Watch as your rocket blasts off into the sky.',
    'Watch the flight: As your rocket ascends, keep an eye on its trajectory. The goal is to reach the highest altitude possible.',
    'Collect your winnings: If the rocket crashes on your selected target or higher, you win the target value multiplied by your bet amount! Your winnings will be automatically credited to your account balance.',
    'Enjoy Responsibly: Remember to gamble responsibly and set limits for yourself to ensure a fun and enjoyable gaming experience.\n',
  ],
  image: '/games/blast-off.webp',
  imageAlt: 'blast-off-icon',
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

export const MIN_TARGET_COEFFICIENT = 1.1;
export const MAX_TARGET_COEFFICIENT = 100;
