import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  ActivatedCode,
  CreateCode,
  EnterCode,
  Timer,
} from '@/components/referrals';
import { BaseTooltip } from '@/components/ui/base-tooltip.tsx';
import InfoCircle from '@/components/ui/svg/info-circle.svg';
import { referralStatusConfig } from '@/constants/referrals';
import { useGetReferralCode } from '@/hooks/useGetReferralCode';
import { useLocalStorage } from '@/hooks/useLocalStorage.ts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

type ReferralTab = 'traders' | 'affiliates';

export const ReferralsPage = () => {
  const { code, userCodes, codeStats, referrerTier } = useGetReferralCode();
  const [referralTab, setReferralTab] = useState<ReferralTab>('traders');
  const [, setRefData] = useLocalStorage<string>(`ref`, '');
  const [params] = useSearchParams();

  useEffect(() => {
    if (params.has('ref')) {
      const ref = params.get('ref') as string;

      setRefData(ref);
    }
  }, [params, setRefData]);

  const isSmall = useMediaQuery('(max-width: 640px)');

  return (
    <>
      {isSmall ? (
        <img
          src="/images/pages/referrals/bg-xs.webp"
          className="absolute -z-10 h-full object-cover opacity-70"
          alt="bg"
        />
      ) : (
        <img
          src="/images/pages/referrals/bg.webp"
          className="absolute -z-10 h-full object-cover opacity-70"
          alt="bg"
        />
      )}

      <div className="absolute -z-[9] h-full w-full bg-black opacity-30" />
      <div className="relative z-0 grid h-full w-full grid-cols-1 gap-12 px-[16px] py-[47px] text-[#F1F1F1] lg:p-16 lg:pb-8">
        <div className="flex min-h-[340px] flex-col justify-between gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="text-3xl font-semibold">Referrals</h2>
            <p className="text-ellipsis text-base">
              Create your own affiliate code or use the code of your friend to
              share exclusive bonuses and fun.
            </p>
            <p className="text-ellipsis text-base">
              Invite friends and earn rewards! Refer others to our casino and
              enjoy exclusive bonuses in the form of reduced commissions and
              more, both for players and the ones who invited them, as our way
              of saying thanks for spreading the fun.
            </p>
            {referralTab === 'traders' && (
              <div className="mt-4">
                <Timer />
                <p className="mt-8 text-sm font-medium text-[#8c98a9] lg:mt-4">
                  After the timer ends, the rewards earned during the week will
                  be distributed
                </p>
              </div>
            )}
          </div>
          <div className="flex h-fit flex-1 lg:justify-end">
            <div className="flex w-full flex-col gap-6 rounded-[17px] bg-[#070513] p-4 lg:w-[90%] lg:px-8 lg:py-6">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <h4 className="text-lg font-bold">Referral</h4>
                  <BaseTooltip
                    content={
                      <p>
                        Get fee discounts and earn rebates through the IBET
                        referral program.
                        <br />
                        For more information, please read the referral program
                        details.
                      </p>
                    }
                  >
                    <img src={InfoCircle} alt="" />
                  </BaseTooltip>
                </div>
                <div className="flex gap-2">
                  <button
                    className={cn(
                      'rounded-[12px] bg-[#272B3F] px-3 py-1 text-sm transition-colors',
                      referralTab === 'traders' ? 'bg-[#9747FF]' : '',
                    )}
                    onClick={() => setReferralTab('traders')}
                  >
                    Traders
                  </button>
                  <button
                    className={cn(
                      'rounded-[12px] bg-[#272B3F] px-3 py-1 text-sm transition-colors',
                      referralTab === 'affiliates' ? 'bg-[#9747FF]' : '',
                    )}
                    onClick={() => setReferralTab('affiliates')}
                  >
                    Affiliates
                  </button>
                </div>
              </div>
              {referralTab === 'traders' && code && (
                <ActivatedCode activatedCode={code} />
              )}
              {referralTab === 'traders' && !code && <EnterCode />}
              {referralTab === 'affiliates' && (
                <CreateCode userCodes={userCodes} codeStats={codeStats} />
                // <CreateCode
                //   userCodes={[
                //     {
                //       code: 'test',
                //       id: '1234',
                //       owner: 'test',
                //     },
                //   ]}
                //   codeStats={[
                //     {
                //       referralCode: 'test',
                //       trades: '1500',
                //       registeredReferralsCount: '2500',
                //     },
                //   ]}
                // />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <h3 className="text-2xl">Terms and conditions of rewards</h3>
          <div className="flex flex-col gap-6">
            {referralStatusConfig.map(
              ({ id, name, image, conditions, rewards }) => (
                <div
                  key={id}
                  className={cn(
                    'flex flex-col gap-4 rounded-[24px] p-6 lg:flex-row lg:gap-0',
                    referrerTier === BigInt(id)
                      ? 'bg-[#FFFFFF1A] bg-opacity-10'
                      : '',
                  )}
                >
                  <div className="relative flex gap-4 lg:w-1/3">
                    <img className="h-8 w-8" src={image} alt={name} />
                    <span className="text-lg">{name}</span>
                    {referrerTier === BigInt(id) && (
                      <div className="absolute -top-9 left-4 rounded-[16px] bg-[#9747FF] px-2 py-[2px] text-xs font-medium">
                        Current Status
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-base">Conditions</p>
                    <ul className="w-11/12 list-disc pl-4 text-sm text-[#A9A8B2]">
                      {conditions.map((condition, i) => (
                        <li key={i}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-base">Rewards</p>
                    <ul className="w-11/12 list-disc pl-4 text-sm text-[#A9A8B2]">
                      {rewards.map((reward, i) => (
                        <li key={i}>{reward}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
};
