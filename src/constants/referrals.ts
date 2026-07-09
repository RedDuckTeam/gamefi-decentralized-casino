// import BasicStatus from '@/components/ui/svg/referrals/basic.svg';
import BronzeStatus from '@/components/ui/svg/referrals/bronze.svg';
import GoldStatus from '@/components/ui/svg/referrals/gold.svg';
import SilverStatus from '@/components/ui/svg/referrals/silver.svg';

export type ReferralsStatus = {
  id: number;
  name: string;
  image: string;
  conditions: string[];
  rewards: string[];
};

export const referralStatusConfig: ReferralsStatus[] = [
  {
    id: 2,
    name: 'Gold Status',
    image: GoldStatus,
    conditions: [
      'At least 30 active users using your referral codes per week and a combined weekly betting volume above $2.5 million:',
    ],
    rewards: [
      '10% discount for players',
      '15% rebates to referrer paid, 3% rebates to referrer paid in $esIBET (total 18%)',
    ],
  },
  {
    id: 1,
    name: 'Silver Status',
    image: SilverStatus,
    conditions: [
      'At least 15 active users using your referral codes per week and a combined weekly betting volume above $1 million\n',
    ],
    rewards: ['10% discount for players', '10% rebates to referrer'],
  },
  {
    id: 0,
    name: 'Bronze Status',
    image: BronzeStatus,
    conditions: ['Anyone'],
    rewards: ['5% discount for players', '10% rebates to referrer'],
  },
  // {
  //   id: 0,
  //   name: 'Basic',
  //   image: BasicStatus,
  //   conditions: [
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //   ],
  //   rewards: [
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //   ],
  // },
];
