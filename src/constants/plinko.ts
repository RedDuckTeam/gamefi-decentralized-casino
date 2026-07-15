import { type GameInfoConfig } from '@/components/game-layout/game-info';

export enum SliderVariant {
  OVER = 'over',
  UNDER = 'under',
}

export const plinkoInfoConfig: GameInfoConfig = {
  title: 'Plinko',
  description: [
    'Choose Your Bet Amount: Select the amount you wish to bet by clicking on the corresponding value.',
    'Adjust risk and number of rows: Plinko offers the option to adjust multipliers for increased potential winnings. Review the multiplier options and select your preferred level of risk. Higher difficulty levels and number of rows may offer higher potential rewards but also come with increased risk.\n',
    'Release the ball: Once your bet, risk and number of rows are placed, release the ball at the top of the Plinko board. Watch as it bounces and navigates through the pegs before landing in one of the prize slots at the bottom.',
    "Collect your winnings: Depending on where the ball lands, you'll win a corresponding prize. Your winnings will be automatically credited to your account balance.\n",
    'Enjoy Responsibly: Remember to gamble responsibly and set limits for yourself to ensure a fun and enjoyable gaming experience.\n',
  ],
  image: '/games/dice-instruction.webp',
  imageAlt: 'dice-icon',
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
