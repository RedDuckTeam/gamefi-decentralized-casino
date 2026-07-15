import {
  slotsChancesAndPayouts,
  type SlotsChancesAndPayouts,
} from '@/constants/slots-chances';

export function findSlot(target: number): SlotsChancesAndPayouts | null {
  for (let i = 1; i < slotsChancesAndPayouts.length; i++) {
    if (
      target > slotsChancesAndPayouts[i - 1].chance &&
      target <= slotsChancesAndPayouts[i].chance
    ) {
      return slotsChancesAndPayouts[i];
    }
  }
  return null;
}
