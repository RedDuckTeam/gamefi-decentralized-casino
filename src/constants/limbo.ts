import { type GameInfoConfig } from '@/components/game-layout/game-info';

export const limboInfoConfig: GameInfoConfig = {
  title: 'Limbo',
  description: [
    'Choose Your Bet Amount: Select the amount you wish to bet by clicking on the corresponding value.',
    'Set your range: Choose the range for your zombie runner. Your prediction will determine the distance the zombie must necessarily cover during the run for your forecast to be correct.',
    'Start the race: Click on the "Place Bet" button to start the game. Watch the running zombie as it dashes across the landscape.',
    'Watch him run: As the running zombie sprints, keep track of its path. The goal is to reach the highest distance possible.',
    'Collect your winnings: If the running zombie falls on your selected multiplier or higher, you win the target value multiplied by your bet amount! Your winnings will be automatically credited to your account balance.',
    'Enjoy Responsibly: Remember to gamble responsibly and set limits for yourself to ensure a fun and enjoyable gaming experience.\n',
  ],
  image: '/games/limbo-instruction.webp',
  imageAlt: 'limbo-icon',
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
