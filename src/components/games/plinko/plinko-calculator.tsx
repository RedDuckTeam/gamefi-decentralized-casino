import { useMemo, useCallback, useState, useRef } from 'react';
import { formatUnits } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import BetButton from '@/components/bet-button';
import BetCalculator from '@/components/game-calculator/bet-input.tsx';
import { GameModeSelector } from '@/components/game-calculator/mode-selector.tsx';
import RecentWin from '@/components/game-calculator/recent-win';
import { RiskSelector } from '@/components/game-calculator/risk-selector.tsx';
import { RowsSelector } from '@/components/game-calculator/rows-selector.tsx';
import { usePlinkoCalculator } from '@/components/games/plinko/hooks/usePlinkoCalculator.ts';
import { TransactionInProgress } from '@/components/transaction-in-progress.tsx';
import { WinDialog } from '@/components/ui/win-dialog';
import { getContractAddresses } from '@/constants/contracts';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useGameStarted } from '@/hooks/useGameStarted';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';

export default function PlinkoCalculator() {
  const { address } = useAccount();
  const [dialogOpen, setDialogOpen] = useState(false);
  const startGame = useRef(true);
  const [winAmount, setWinAmount] = useState('0');
  const [recentTotalBet, setRecentTotalBet] = useState('0');

  const modalClose = useCallback(() => {
    startGame.current = true;
  }, []);

  const changeStartGame = useCallback((value: boolean) => {
    startGame.current = value;
  }, []);

  const {
    rows,
    setRows,
    mode,
    setMode,
    risk,
    setRisk,
    numOfBets,
    setNumOfBets,
    betAmount,
    setBetAmount,
    handleBet,
    gameData,
    gameIsRunning,
    maxBetCount,
    setGameIsRunning,
  } = usePlinkoCalculator({
    setWinAmount,
    setDialogOpen,
    setRecentTotalBet: (amount: string) => {
      setRecentTotalBet(amount);
    },
    shouldStartGame: startGame,
    changeStartGame,
  });
  const { activeToken } = useActiveToken();
  const chainId = useChainId();
  const { plinko: plinkoAddress } = getContractAddresses(chainId);
  const ongoingGame = useRefund(plinkoAddress, 'plinko');
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(plinkoAddress, address);

  const onRefund = useCallback(
    async (arg: bigint) => {
      await refund({
        args: [arg],
      });
      setGameIsRunning(false);
    },
    [refund, setGameIsRunning],
  );
  const { minAmount, maxAmount } = useBetAmounts(
    activeToken?.address,
    plinkoAddress,
    gameData,
  );
  const gameIsStarted = useGameStarted(plinkoAddress, address || `0x`);

  return (
    <div className="flex flex-col gap-6">
      <GameModeSelector mode={mode} setMode={setMode} />
      <RiskSelector risk={risk} setRisk={setRisk} />
      <RowsSelector rows={rows} setRows={setRows} />
      <BetCalculator
        mode={mode}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        numOfBets={numOfBets}
        setNumOfBets={setNumOfBets}
        minAmount={minAmount}
        maxAmount={maxAmount}
        maxBetCount={Number(maxBetCount || 100)}
      />
      <WinDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        amount={+winAmount}
        bet={+recentTotalBet}
        onClose={modalClose}
      />
      <RecentWin recentWin={+winAmount} />
      <BetButton
        className="-order-1 1.5xl:order-none"
        betAmount={betAmount}
        gameIsRunning={gameIsRunning}
        minAmount={minAmount}
        onBet={handleBet}
        refundNeeded={refundNeeded}
        onRefund={onRefund}
        ongoingGame={ongoingGame}
        disabled={
          gameIsRunning ||
          betAmount === '0' ||
          gameIsStarted ||
          !betAmount ||
          parseFloat(betAmount) < parseFloat(formatUnits(minAmount, 18))
        }
      />
      <TransactionInProgress
        gameAddress={plinkoAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
