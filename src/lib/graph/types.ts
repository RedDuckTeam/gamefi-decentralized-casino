export type GameEnd = {
  amountPaid: string;
  blockNumber: string;
  blockTimestamp: string;
  id: string;
  randomNumber: string;
  requestId: string;
  result: boolean;
  secondRandomNumber: string;
  transactionHash: string;
  user: string;
  userBet: string;
};

export type GameStart = {
  betAmount: string;
  blockNumber: string;
  blockTimestamp: string;
  fee: string;
  id: string;
  requestId: string;
  transactionHash: string;
  user: string;
};

export type Refund = {
  blockNumber: string;
  blockTimestamp: string;
  id: string;
  requestId: string;
  user: string;
  transactionHash: string;
};

export type SlotsClaim = {
  id: string;
  user: string;
  amount: string;
  requestId: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type UserCode = {
  owner: string;
  code: string;
  id: string;
};

export type CodeStats = {
  trades: string;
  registeredReferralsCount: string;
  referralCode: string;
};

export type AllowedToken = {
  id: string;
  isAllowed: boolean;
  tokenAddress: string;
};
