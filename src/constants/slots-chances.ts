export enum SlotsCombination {
  A5 = 'A5',
  A4 = 'A4',
  A3 = 'A3',
  B5 = 'B5',
  B4 = 'B4',
  B3 = 'B3',
  C5 = 'C5',
  C4 = 'C4',
  C3 = 'C3',
  D5 = 'D5',
  D4 = 'D4',
  D3 = 'D3',
  E5 = 'E5',
  E4 = 'E4',
  E3 = 'E3',
  F5 = 'F5',
  F4 = 'F4',
  F3 = 'F3',
}

export type SlotsChancesAndPayouts = {
  chance: number;
  combination: SlotsCombination;
  payout: number;
};

export const slotsChancesAndPayouts: SlotsChancesAndPayouts[] = [
  {
    chance: 1,
    combination: SlotsCombination.A5,
    payout: 500,
  },

  {
    chance: 6,
    combination: SlotsCombination.A4,
    payout: 250,
  },

  {
    chance: 16,
    combination: SlotsCombination.B5,
    payout: 250,
  },

  {
    chance: 31,
    combination: SlotsCombination.B4,
    payout: 125,
  },
  {
    chance: 51,
    combination: SlotsCombination.C5,
    payout: 125,
  },

  {
    chance: 71,
    combination: SlotsCombination.A3,
    payout: 100,
  },

  {
    chance: 91,
    combination: SlotsCombination.B3,
    payout: 50,
  },

  {
    chance: 121,
    combination: SlotsCombination.C4,
    payout: 50,
  },

  {
    chance: 161,
    combination: SlotsCombination.C3,
    payout: 25,
  },

  {
    chance: 261,
    combination: SlotsCombination.D5,
    payout: 25,
  },

  {
    chance: 461,
    combination: SlotsCombination.D4,
    payout: 20,
  },

  {
    chance: 761,
    combination: SlotsCombination.D3,
    payout: 5,
  },

  {
    chance: 1361,
    combination: SlotsCombination.E5,
    payout: 10,
  },

  {
    chance: 3361,
    combination: SlotsCombination.E4,
    payout: 5,
  },

  {
    chance: 9361,
    combination: SlotsCombination.F5,
    payout: 3,
  },

  {
    chance: 15361,
    combination: SlotsCombination.E3,
    payout: 2,
  },

  {
    chance: 21361,
    combination: SlotsCombination.F4,
    payout: 2,
  },

  {
    chance: 31361,
    combination: SlotsCombination.F3,
    payout: 1.5,
  },
];
