export const plinkoGameConfigPinLines = {
  16: {
    pinGap: 16,
    pinSize: 2.5,
    marginTop: 47,
    ballSize: 3,
  },

  14: {
    pinGap: 18.2,
    pinSize: 3,
    marginTop: 49.5,
    ballSize: 3.5,
  },

  12: {
    pinGap: 20.9,
    pinSize: 3.5,
    marginTop: 56,
    ballSize: 4,
  },

  10: {
    pinGap: 24.5,
    pinSize: 4,
    marginTop: 65.5,
    ballSize: 4.5,
  },

  8: {
    pinGap: 30,
    pinSize: 4.5,
    marginTop: 75,
    ballSize: 5,
  },
};

export type TPinLines = keyof typeof plinkoGameConfigPinLines;

export const plinkoConfig = {
  size: {
    minViewWidth: 0,
    minViewHeight: 0,
    maxViewWidth: 400,
    maxViewHeight: 300,
    width: 700,
    height: 500,
    worldWidth: 400,
  },
  map: {
    startPins: 3,
  },
  collision: {
    defaultCategory: 1,
    blueCategory: 2,
  },
};
