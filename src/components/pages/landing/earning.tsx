import { BaseTooltip } from '@/components/ui/base-tooltip.tsx';
import { buttonVariants } from '@/components/ui/button/button-variants';

export const Earning = () => {
  return (
    <div className="relative">
      <img
        src="/images/pages/landing/earn.webp"
        alt="roulette-bg"
        className="absolute h-full w-full object-cover"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        fetchpriority="low"
      />
      <div className="relative z-10 flex flex-col px-4 py-4 text-[#F1F1F1] md:px-[80px] lg:py-[111px]">
        <div className="text-[32px] font-semibold">Unlock the Power of ILP</div>
        <div className="mt-[16px] max-w-[464px] text-[16px] font-normal">
          Harness the potential of ILP tokens for staking and passive earning.
          Stake your ILP and watch your crypto assets grow effortlessly, adding
          an extra layer of excitement to your gaming strategy.
        </div>
        <div className="mt-[40px] flex gap-[8px]">
          <BaseTooltip content={<p>COMING SOON</p>}>
            <div
              className={buttonVariants({
                size: 'lg',
                colors: 'secondary',
                className: 'min-w-full lg:min-w-[154px]',
              })}
            >
              Start Earning
            </div>
          </BaseTooltip>
        </div>
      </div>
    </div>
  );
};
