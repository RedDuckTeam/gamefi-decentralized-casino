import { type GameInfoConfig } from '@/components/game-layout/game-info';
import Paper from '@/components/ui/svg/paper.svg';
import Scissors from '@/components/ui/svg/scissors-game.svg';
import ScissorsSvg from '@/components/ui/svg/scissors.svg';

export const rockPaperScissorsInfoConfig: GameInfoConfig = {
  title: 'Rock Paper Scissors',
  description: [
    'Choose Your Bet Amount: Select the amount you wish to bet by clicking on the corresponding value.',
    'Select your move: Choose your move from the options provided: Rock, Paper, or Scissors. Click on the corresponding icon to make your selection.',
    "Game makes its move: After you've made your choice, click the “Place Bet” button and the game will randomly select its move (Rock, Paper, or Scissors).\n",
    "Determine the winner: The game will determine the winner based on the classic rules of Rock Paper Scissors: Rock beats Scissors, Scissors beats Paper, and Paper beats Rock. If both you and the game choose the same move, it's a draw.\n",
    "Collect your winnings: If your move beats the bot's move, you win! If you draw - you will lose and gain nothing. Your winnings will be automatically credited to your account balance. In case of a draw, your original bet will be refunded.",
    'Enjoy Responsibly: Remember to gamble responsibly and set limits for yourself to ensure a fun and enjoyable gaming experience.\n',
  ],
  image: ScissorsSvg,
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

export enum RockPaperScissorsVariant {
  ROCK = 'Rock',
  PAPER = 'Paper',
  SCISSORS = 'Scissors',
}

export const mapRockPaperScissorsVariant = (
  variant: RockPaperScissorsVariant,
): bigint => {
  switch (variant) {
    case RockPaperScissorsVariant.ROCK:
      return 1n;
    case RockPaperScissorsVariant.PAPER:
      return 2n;
    case RockPaperScissorsVariant.SCISSORS:
      return 3n;
  }
};

export const getRpsLoseState = (variant: RockPaperScissorsVariant) => {
  if (variant == RockPaperScissorsVariant.ROCK)
    return RockPaperScissorsVariant.PAPER;
  if (variant == RockPaperScissorsVariant.PAPER)
    return RockPaperScissorsVariant.SCISSORS;
  if (variant == RockPaperScissorsVariant.SCISSORS)
    return RockPaperScissorsVariant.ROCK;
};

export const getRpsWinState = (variant: RockPaperScissorsVariant) => {
  if (variant == RockPaperScissorsVariant.ROCK)
    return RockPaperScissorsVariant.SCISSORS;
  if (variant == RockPaperScissorsVariant.PAPER)
    return RockPaperScissorsVariant.ROCK;
  if (variant == RockPaperScissorsVariant.SCISSORS)
    return RockPaperScissorsVariant.PAPER;
};

export const rpsGameConfig = [
  { id: 0, name: RockPaperScissorsVariant.ROCK, img: '/game-assets/rock.webp' },
  { id: 1, name: RockPaperScissorsVariant.PAPER, img: Paper },
  { id: 2, name: RockPaperScissorsVariant.SCISSORS, img: Scissors },
];
