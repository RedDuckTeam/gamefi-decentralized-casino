type Props = {
  isWin: boolean;
  isLose: boolean;
  currentRate: number;
};

export const Rate = ({ isLose, isWin, currentRate }: Props) => {
  return (
    <div
      className={`absolute left-1/2 top-28 -translate-x-1/2 rounded-[26px] ${
        !isWin && !isLose && 'bg-gradient-to-b'
      } from-[#C37640] to-[#ECBC53] px-4 py-2 text-center text-text ${
        isWin && !isLose && '!bg-success'
      } ${isLose && '!bg-danger'} `}
    >
      <h6 className="text-[32px] font-semibold leading-none">
        {currentRate.toFixed(2)}x
      </h6>
      <p className="text-[14px] uppercase leading-[24px]">
        {isLose ? 'Crashed' : 'Current rate'}
      </p>
    </div>
  );
};
