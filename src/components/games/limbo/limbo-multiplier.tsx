export interface LimboMultiplierProps {
  isWin: boolean;
  isLose: boolean;
  liveMultiplier: string;
}

export default function LimboMultiplier({
  isLose,
  liveMultiplier,
  isWin,
}: LimboMultiplierProps) {
  return (
    <h2
      className={`mb-5 text-[44px] font-semibold text-text md:mb-20 md:text-[88px] ${
        isWin ? '!text-success' : ''
      } ${isLose ? '!text-danger' : ''} `}
    >
      {liveMultiplier}x
    </h2>
  );
}
