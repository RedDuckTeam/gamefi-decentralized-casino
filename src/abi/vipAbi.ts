export const vipAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_ac',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ac',
    outputs: [
      {
        internalType: 'contract CasinoAccessControl',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'game',
        type: 'address',
      },
      {
        internalType: 'enum VipRank',
        name: 'rank',
        type: 'uint8',
      },
    ],
    name: 'getRankFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserRank',
    outputs: [
      {
        internalType: 'enum VipRank',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'game',
        type: 'address',
      },
      {
        internalType: 'enum VipRank',
        name: 'rank',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    name: 'setRankFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'enum VipRank',
        name: 'rank',
        type: 'uint8',
      },
    ],
    name: 'setUserRank',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
