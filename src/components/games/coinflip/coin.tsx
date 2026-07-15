import './coin.css';
import { CoinflipVariant, coinflipConfig } from '@/constants/coinflip';

type Props = { result: CoinflipVariant | null; betId: number };

export const Coin = ({ result, betId }: Props) => {
  const headsImage = coinflipConfig.find(
    (i) => i.name == CoinflipVariant.HEADS,
  )?.img;
  const tailsImage = coinflipConfig.find(
    (i) => i.name == CoinflipVariant.TAIL,
  )?.img;

  return (
    <div className="h-[133px] w-full ">
      {result && (
        <div
          key={betId}
          className="coin"
          style={{
            animation: `${
              result === CoinflipVariant.HEADS
                ? 'spin-heads 3s forwards'
                : 'spin-tails 3s forwards'
            }`,
          }}
        >
          <div className="heads">
            <img className="w-32" src={headsImage} alt="" />
          </div>
          <div className="tails">
            <img className="w-32" src={tailsImage} alt="" />
          </div>
        </div>
      )}
    </div>
  );
};
