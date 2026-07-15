import { type GameInfoConfig } from '@/components/game-layout/game-info';
import SlideSvg from '@/components/ui/svg/slide.svg';

export const slideInfoConfig: GameInfoConfig = {
  title: 'Slide',
  description: [
    'Choose Your Bet Amount: Select the amount you wish to bet by clicking on the corresponding value.',
    'Select your payout multiplier: Review the available payout multipliers displayed on the screen. Each multiplier represents a different level of risk and potential reward.',
    'Place your target: Select your desired target value. Higher targets may offer higher potential rewards but also come with increased risk.\n',
    'Release the slider: Once your bets and target are placed, release the slider to start the game. Watch as it moves along the track, aiming to land on the desired multiplier.\n',
    'Collect your winnings: If the slider stops on your selected multiplier or higher, you win the target value multiplied by your bet amount! Your winnings will be automatically added to your account balance.\n',
    'Enjoy Responsibly: Remember to gamble responsibly and set limits for yourself to ensure a fun and enjoyable gaming experience.\n',
  ],
  image: SlideSvg,
  imageAlt: 'rock-paper-scissors-icon',
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

export const MIN_TARGET_COEFFICIENT = 1.1;
export const MAX_TARGET_COEFFICIENT = 100;
