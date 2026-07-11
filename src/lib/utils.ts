import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const addressRegex = /^0x[a-fA-F0-9]{40}$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWithComma(num: number) {
  const parts = num.toString().split('.');

  const integerPartWithCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (parts.length > 1) {
    const decimalPlaces = Math.min(parts[1].length, 4);
    const formattedNumber = parseFloat(num.toFixed(decimalPlaces)).toString();

    const formattedParts = formattedNumber.split('.');
    const formattedIntegerPartWithCommas = formattedParts[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ',',
    );

    return formattedParts.length > 1
      ? `${formattedIntegerPartWithCommas}.${formattedParts[1]}`
      : formattedIntegerPartWithCommas;
  } else {
    return integerPartWithCommas;
  }
}

export function getMockedRandomNums(firstNum: bigint): bigint[] {
  const firstNumPercentages = firstNum * 10000n;
  const secondNumPercentages =
    firstNumPercentages - (firstNumPercentages * 1000n) / 10000n;

  return [firstNum, secondNumPercentages];
}

export function copyArrayNTimes<T>(arr: T[], num: number): T[] {
  return Array.from({ length: num }, () => [...arr]).flat();
}

export function formatNumberWithLeadingZeros(number: number) {
  const strNumber = String(number);
  const diff = 4 - strNumber.length;
  return diff > 0 ? '0'.repeat(diff) + strNumber : strNumber;
}

export interface IBet {
  id: bigint;
  user: `0x${string}`;
  index: bigint;
  betAmount: bigint;
  fee: bigint;
  requestId: bigint;
  result: boolean;
  amountPaid: bigint;
  token: `0x${string}`;
  blockNumber: bigint;
}
