import { PercentGameSetting } from '@/components/admin/games/percent-game-setting.tsx';

export const ChangeBetFeePercents = () => {
  return (
    <PercentGameSetting
      title="Change Bet Fee Percents"
      readFunctionName="getBetFeePercents"
      writeFunctionName="changeBetFeePercents"
    />
  );
};
