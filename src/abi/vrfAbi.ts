export const vrfAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_ac',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_vrfCoordinator',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'subscriptionId',
        type: 'uint64',
      },
      {
        internalType: 'bytes32',
        name: '_vrfKeyHash',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'have',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'want',
        type: 'address',
      },
    ],
    name: 'OnlyCoordinatorCanFulfill',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    name: 'RequestFulfilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'numWords',
        type: 'uint32',
      },
    ],
    name: 'RequestSent',
    type: 'event',
  },
  {
    inputs: [],
    name: 'REQUEST_CONFIRMATIONS',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VRF_CALLBACK_GAS_LIMIT',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
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
        internalType: 'uint64',
        name: 'newSubId',
        type: 'uint64',
      },
    ],
    name: 'changeSubId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_requestId',
        type: 'uint256',
      },
    ],
    name: 'getRequestStatus',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'requestId',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'fulfilled',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'exists',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'callbackAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'blockNumber',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'user',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'finalAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'betAmount',
            type: 'uint256',
          },
          {
            internalType: 'bytes4',
            name: 'callbackFuncSelector',
            type: 'bytes4',
          },
          {
            internalType: 'bytes',
            name: 'callbackData',
            type: 'bytes',
          },
        ],
        internalType: 'struct RequestStatus',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'randomWords',
        type: 'uint256[]',
      },
    ],
    name: 'rawFulfillRandomWords',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'numWords',
        type: 'uint32',
      },
      {
        internalType: 'address',
        name: 'callbackAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'finalAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'betAmount',
        type: 'uint256',
      },
      {
        internalType: 'bytes4',
        name: 'callbackFuncSelector',
        type: 'bytes4',
      },
      {
        internalType: 'bytes',
        name: 'callbackData',
        type: 'bytes',
      },
    ],
    name: 'requestRandomWords',
    outputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vrfKeyHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'vrfRequests',
    outputs: [
      {
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'fulfilled',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'exists',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'callbackAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'finalAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'betAmount',
        type: 'uint256',
      },
      {
        internalType: 'bytes4',
        name: 'callbackFuncSelector',
        type: 'bytes4',
      },
      {
        internalType: 'bytes',
        name: 'callbackData',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
