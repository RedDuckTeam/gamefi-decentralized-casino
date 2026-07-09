import { type Address } from 'viem';

import { ChainId } from './supported-chains';

import { type GameName } from '@/lib/graph/queries/types';

type AddressMap = {
  accessControl: Address;
  vip: Address;
  casinoToken: Address;
  casinoVrf: Address;
  vrfCoordinatorMock?: Address;
  referralStorage: Address;
  ibetHelper: Address;
  roulette: Address;
  wheel: Address;
  limbo: Address;
  rps: Address;
  dice: Address;
  slide: Address;
  blastOff: Address;
  plinko: Address;
  slots: Address;
  coinflip: Address;
};

const chainIdToAddresses: Record<ChainId, AddressMap> = {
  [ChainId.LOCALHOST]: {
    accessControl: '0x',
    vip: '0x0Dd5b04db28824a3B32e2d25dE1A0c62C3866AA1',
    casinoToken: '0x18e52641464bE01C739C2F622Ae2f90bE779c9ea',
    casinoVrf: '0x',
    vrfCoordinatorMock: '0x9677A19a21b72D8aE94bc164d5957AD7D92Bee94',
    ibetHelper: '0x99566E35448CC94c7bc42663D505F2268084c15D',
    roulette: '0xc18eE48800B7299476502F4738680B07a20ed694',
    wheel: '0xED92bbD9B9A68d0fD211892C107cdfd4959Be9D5',
    limbo: '0xa9a5c29aa8daD9edaD33dB489AFa92eC3085Fb97',
    rps: '0xeC8cc763102d978d3B0D9f9444698fc35819d78f',
    dice: '0x38a0762117A512Ed956800DCCa48176D9E045926',
    slide: '0x0D18cF716dFb3Ea9D6f9Bf9638838785BeC534c0',
    blastOff: '0x2661D2E242f64C4aa3db5CAea9e58FCd89309cfA',
    plinko: '0x6A1e6f4dA5091e82eaF878be30190D0C040599c8',
    slots: '0x09d659FE9e05E9Bf726b9CfC24aac69Ab1f2FFa2',
    coinflip: '0xE9a660130F29cf04BF8d7F5359A74d2460F7D013',
    referralStorage: '0x',
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    accessControl: '0x6Db27BF0f8C02c72C3B251C9497A2750a5Dd7Be1',
    vip: '0xDA8DC3278109D5DB10F0884597e2015be24BaA95',
    casinoToken: '0xC6Db455e338A922B83AfbBCd52Cc2325edDEd0A5',
    casinoVrf: '0x248D00206f8dBd66D7424524E885C5f4EAe59884',
    ibetHelper: '0x7c92329fB2002EcD83A35570Ba376B54C5c804bA',
    roulette: '0x3cb91374490d35a33202C064213c5Da1b7A223E4',
    wheel: '0x62ec3Ad02045233119323250Cd35bbEeABE5049b',
    limbo: '0xc4Ee05Ba2097Cb421Bc9093F1b88E3102f19567c',
    rps: '0x5Db17FAC99E4cA9C019E695A31811752E99e64E6',
    dice: '0xa81ECa77239a4fD5c51e61170EEfa5910cdDc7EB',
    slide: '0x8B2EDaF62C4EFdA2349F2E274783B52dbe40f4f3',
    blastOff: '0x0848106B58417cc1cB01DC2d1f4bA30AC7fBA894',
    plinko: '0x224371fE15423Fa4c1eB5d28eE845793b51362dd',
    slots: '0x12fA7F08765317FEBB13C8Ba0557Df954658C1B2',
    coinflip: '0x1Eb27737e543Bb7b52f8A65506092A6B84c93b0C',
    referralStorage: '0x1Ca6506CfE6AdA7962aB159Cc91D967C17b32988',
  },
  [ChainId.ARBITRUM]: {
    accessControl: '0x',
    vip: '0x',
    casinoToken: '0x',
    casinoVrf: '0x',
    ibetHelper: '0x',
    roulette: '0x',
    wheel: '0x',
    limbo: '0x',
    rps: '0x',
    dice: '0x',
    slide: '0x',
    blastOff: '0x',
    plinko: '0x',
    slots: '0x',
    coinflip: '0x',
    referralStorage: '0x',
  },
};

export const getContractAddresses = (chainId: number) => {
  if (Object.values(ChainId).includes(chainId)) {
    return chainIdToAddresses[chainId as ChainId];
  }

  return chainIdToAddresses[ChainId.ARBITRUM];
};

interface IGames {
  id: GameName;
  name: string;
  address: Address;
}

export const getGames = (chainId: ChainId): Array<IGames> => [
  {
    id: 'roulette',
    name: 'Roulette',
    address: getContractAddresses(chainId).roulette,
  },
  {
    id: 'wheel',
    name: 'Wheel',
    address: getContractAddresses(chainId).wheel,
  },
  {
    id: 'dice',
    name: 'Dice',
    address: getContractAddresses(chainId).dice,
  },
  {
    id: 'coinFlip',
    name: 'Coin Flip',
    address: getContractAddresses(chainId).coinflip,
  },
  {
    id: 'plinko',
    name: 'Plinko',
    address: getContractAddresses(chainId).plinko,
  },
  {
    id: 'limbo',
    name: 'Limbo',
    address: getContractAddresses(chainId).limbo,
  },
  {
    id: 'slide',
    name: 'Slide',
    address: getContractAddresses(chainId).slide,
  },
  {
    id: 'rockPaperScissors',
    name: 'Rock Paper Scissors',
    address: getContractAddresses(chainId).rps,
  },
  {
    id: 'blastOff',
    name: 'Blast-Off',
    address: getContractAddresses(chainId).blastOff,
  },
  {
    id: 'slots',
    name: 'Classic Slots',
    address: getContractAddresses(chainId).slots,
  },
];
