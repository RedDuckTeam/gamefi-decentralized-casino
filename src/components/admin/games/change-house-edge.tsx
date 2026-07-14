import { PercentGameSetting } from '@/components/admin/games/percent-game-setting.tsx';

export const ChangeHouseEdge = () => {
  return (
    <PercentGameSetting
      title="Change House Edge"
      readFunctionName="getHouseEdge"
      writeFunctionName="changeHouseEdge"
    />
  );
};
