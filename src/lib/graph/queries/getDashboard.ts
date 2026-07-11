import { gql } from '@apollo/client';
import { type Address } from 'viem';

interface GameHistory {
  id: string;
  requestId: string;
  user: Address;
  bet: number;
  win: number;
  asset: string;
  name: string;
  date: number;
  decimals: number;
}

interface GameProfit {
  id: string;
  userAddress: string;
  tokenDecimals: number;
  tokenSymbol: string;
  sumOfWins: number;
  tokenAddress: string;
}

interface GameSummary {
  id: string;
  user: Address;
  name: string;
  counter: number;
}

export interface IDashboard {
  gameSummaries: GameSummary[];
  gameProfits: GameProfit[];
  gameHistories: GameHistory[];
}

export interface IHistory {
  gameHistories: GameHistory[];
}

export const getHistory = () => {
  return gql`
    query GameSummary($user: Bytes, $name: String) {
      gameHistories(
        first: 100
        where: { user: $user, name: $name }
        orderBy: date
        orderDirection: desc
      ) {
        id
        user
        bet
        win
        asset
        name
        date
        decimals
        requestId
      }
    }
  `;
};

export const getDashboard = () => {
  return gql`
    query GameSummary($user: Bytes) {
      gameSummaries(first: 1000, where: { user: $user }) {
        id
        user
        name
        counter
      }

      gameProfits(first: 100, where: { userAddress: $user }) {
        id
        userAddress
        tokenDecimals
        tokenSymbol
        tokenAddress
        sumOfWins
      }

      gameHistories(
        first: 100
        where: { user: $user }
        orderBy: date
        orderDirection: desc
      ) {
        id
        user
        bet
        win
        asset
        name
        date
        decimals
      }
    }
  `;
};
