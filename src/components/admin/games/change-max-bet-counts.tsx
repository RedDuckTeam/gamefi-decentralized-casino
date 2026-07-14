import { NumericGameSetting } from '@/components/admin/games/numeric-game-setting.tsx';
import { useGames } from '@/hooks/admin/useGames.ts';

export const ChangeMaxBetCounts = () => {
  const { changeMaxBetCounts } = useGames();

  return (
    <NumericGameSetting
      title="Change Max Bet Counts"
      readFunctionName="getMaxBetCount"
      onSubmit={(value) => changeMaxBetCounts({ args: [value] })}
    />
  );
};
