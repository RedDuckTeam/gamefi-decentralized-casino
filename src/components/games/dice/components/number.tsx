import { type FC } from 'react';

// const MIN_DEG = 180;
const MAX_DEG = 504;
const DEG_INC = 36;

const ZERO_NUM_DEG = 360;

const showNumbers = [
  ZERO_NUM_DEG - DEG_INC * 2,
  ZERO_NUM_DEG - DEG_INC,
  ZERO_NUM_DEG,
  ZERO_NUM_DEG + DEG_INC,
  ZERO_NUM_DEG + DEG_INC * 2,
];

export interface INumber {
  number: number;
}
export const Number: FC<INumber> = ({ number = 0 }) => {
  if (number < 0 && number > 9) return null;

  const currentDeg =
    4 >= number
      ? ZERO_NUM_DEG - DEG_INC * number
      : ZERO_NUM_DEG + DEG_INC * (10 - number);

  return (
    <div
      className="relative w-fit overflow-hidden rounded-[18px] border-[6px] border-[#272B3F] bg-[#272B3F] p-1 px-[10px] text-[30px] font-semibold sm:px-[15px] sm:text-[80px] "
      style={{
        boxShadow:
          '11px 10px 14.1px 0px rgba(7, 5, 19, 0.34) inset, -4px -4px 16.3px 0px rgba(105, 69, 169, 0.34) inset',
      }}
    >
      {[...Array(10)].map((_, index) => {
        const baseDeg = index * DEG_INC;
        const deg =
          currentDeg + baseDeg > MAX_DEG
            ? 180 + Math.abs(MAX_DEG + DEG_INC - (baseDeg + currentDeg))
            : baseDeg + currentDeg;
        return (
          <div
            key={index}
            style={{
              opacity: showNumbers.includes(deg) ? 1 : 0,
              position: 'absolute',
              transform: `rotateX(${deg}deg) translateZ(130px)`,
              transition: 'all 0.3s ease-out, opacity 0.1s ease-out',
            }}
          >
            {index}
          </div>
        );
      })}
      <div className="opacity-0">0</div>
    </div>
  );
};
