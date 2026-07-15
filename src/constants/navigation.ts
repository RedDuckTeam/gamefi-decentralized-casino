import Limbo from '@/components/ui/svg/limbo.svg';
import Plinco from '@/components/ui/svg/plinco.svg';
import Scissors from '@/components/ui/svg/scissors.svg';
import Slide from '@/components/ui/svg/slide.svg';

export type NavigationItem = {
  id: number;
  label: string;
  url: string;
  icon: string;
};

export const navigationItems: NavigationItem[] = [
  {
    id: 0,
    label: 'Roulette',
    url: '/roulette',
    icon: '/games/roulette.webp',
  },
  {
    id: 1,
    label: 'Wheel',
    url: '/wheel',
    icon: '/games/wheel.webp',
  },
  {
    id: 2,
    label: 'Dice',
    url: '/dice',
    icon: '/games/dice.webp',
  },
  {
    id: 3,
    label: 'Coin Flip',
    url: '/coinflip',
    icon: '/games/coinflip.webp',
  },
  {
    id: 4,
    label: 'Plinko',
    url: '/plinko',
    icon: Plinco,
  },
  {
    id: 5,
    label: 'Limbo',
    url: '/limbo',
    icon: Limbo,
  },
  {
    id: 6,
    label: 'Slide',
    url: '/slide',
    icon: Slide,
  },
  {
    id: 7,
    label: 'Rock Paper Scissors',
    url: '/rock-paper-scissors',
    icon: Scissors,
  },
  {
    id: 8,
    label: 'Blast-Off',
    url: '/blast-off',
    icon: '/games/blast-off.webp',
  },
  {
    id: 9,
    label: 'Classic Slots',
    url: '/slots',
    icon: '/games/slots.webp',
  },
];
