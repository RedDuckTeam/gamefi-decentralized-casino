import { BaseTooltip } from '@/components/ui/base-tooltip.tsx';
import { buttonVariants } from '@/components/ui/button/button-variants';
import alchemy from '@/components/ui/svg/alchemy.svg';
import arbitrum from '@/components/ui/svg/arbitrum.svg';
import chainlink from '@/components/ui/svg/chainlink.svg';

export const OurPartners = () => {
  return (
    <div className="flex flex-col gap-8 bg-[url('/images/pages/landing/our-partners.webp')] bg-cover bg-center p-4 md:p-[80px] lg:gap-[80px]">
      <div className="flex flex-col gap-[24px]">
        <div className="text-[32px] font-semibold">Built on</div>
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <img src={arbitrum} alt="arbitrum" />
          <img className="h-[44px]" src={alchemy} alt="alchemy" />
          <img src={chainlink} alt="chainlink" />
          <img
            className="h-[44px]"
            src="/images/pages/landing/uniswap.webp"
            alt="uniswap"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 items-center justify-center gap-[24px] rounded-[40px] border-[1px] border-[#ffffff1a] p-6 lg:grid-cols-[3fr_4fr] lg:p-[40px]">
        <img
          className="mx-auto"
          width={384}
          height={299}
          src="/images/pages/landing/money.webp"
          alt="money"
        />
        <div className="flex flex-col items-center lg:items-baseline">
          <div className="text-[24px] font-semibold lg:text-[32px]">
            Dive into our Documentation
          </div>
          <div className="mt-[16px] max-w-[464px] text-[16px] font-normal">
            Ready to delve deeper into the world of Onchain Arcade? Discover all
            the intricate details of our platform, from game rules to
            tokenomics, in our comprehensive documentation. Unlock the secrets
            to maximizing your gaming experience and rewards.
          </div>
          <div className="mt-[40px] flex gap-[8px]">
            <BaseTooltip content={<p>COMING SOON</p>}>
              <div
                className={buttonVariants({
                  size: 'lg',
                  colors: 'secondary',
                  className: 'min-w-[154px]',
                })}
              >
                Explore Doc
              </div>
            </BaseTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
