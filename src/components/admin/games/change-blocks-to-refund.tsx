import { NumericGameSetting } from '@/components/admin/games/numeric-game-setting.tsx';
import { useGames } from '@/hooks/admin/useGames.ts';

export const ChangeBlocksToRefund = () => {
  const { changeBlocksToRefund } = useGames();

  return (
    <NumericGameSetting
      title="Change Blocks To Refund"
      readFunctionName="getBlocksToRefund"
      onSubmit={(value) => changeBlocksToRefund({ args: [value] })}
    />
  );
};
