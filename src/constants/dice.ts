import { type GameInfoConfig } from '@/components/game-layout/game-info';

export enum SliderVariant {
  OVER = 'over',
  UNDER = 'under',
}

export const diceInfoConfig: GameInfoConfig = {
  title: 'Dice',
  description: [
    'Choose Your Bet Amount: Select the amount you wish to bet by clicking on the corresponding value.',
    'Select your range: Choose your desired range for the dice roll. The range spans from 0.00 to 100.00. You can select the range you believe the dice roll will fall within. Keep in mind that the smaller the range you select, the higher the risk and potential profit.\n',
    'Choose your prediction: Decide whether you want to "Roll Over" or "Roll Under" your selected range. If you choose "Roll Over," you\'re betting that the dice roll will be higher than your chosen range. If you select "Roll Under," you\'re betting that the dice roll will be lower than your chosen range.\n',
    'Place your bet: After selecting your bet size, range and prediction, click on the "Place Bet" button to initiate the dice roll. Watch as the dice roll is simulated. If the outcome matches your prediction, you win!\n',
    'Claim your winnings: If you win, your winnings will be automatically added to your account balance. You can then decide whether to continue playing or cash out your winnings.\n',
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
