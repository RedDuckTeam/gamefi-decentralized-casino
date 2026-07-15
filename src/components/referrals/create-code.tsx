import { useAppKit } from '@reown/appkit/react';
import { type ChangeEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { Button } from '../ui/button';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useRegisterReferralCode } from '@/hooks/useRegisterReferralCode';
import { type CodeStats, type UserCode } from '@/lib/graph/types';
import { decodeReferralCode } from '@/lib/referral-code';

export const CreateCode = ({
  userCodes,
  codeStats,
}: {
  userCodes: UserCode[];
  codeStats: CodeStats[];
}) => {
  const [referralCode, setReferralCode] = useState('');
  const { generateReferralCode } = useRegisterReferralCode();
  const [searchParams] = useSearchParams();
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  const handleReferralInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReferralCode(e.target.value);
  };
  const generateLink = (code: string) => {
    searchParams.delete('ref');
    searchParams.append('ref', code);

    return window.location.origin + '/referrals?' + searchParams.toString();
  };

  const handleReferralCodeCreate = async () => {
    generateReferralCode(referralCode).then(() => setReferralCode(''));
  };
  const handleCopyToClipboard = useCopyToClipboard();

  return (
    <>
      {userCodes.length !== 0 ? (
        <>
          {userCodes.map((u) => {
            const codeStat = codeStats.find((c) => c.referralCode === u.code);

            return (
              <div
                className="flex flex-row items-center justify-between"
                key={u.id}
              >
                <p className="w-1/3 truncate text-xs md:text-sm">
                  Code: {decodeReferralCode(u.code)}
                </p>
                <div className="flex w-1/3 items-center gap-4">
                  <p className="flex text-xs text-[#8C98A9]">
                    Joined users: {codeStat?.registeredReferralsCount ?? 0}
                  </p>
                  <p className="text-xs text-[#8C98A9]">
                    Trades: {codeStat?.trades ?? 0}
                  </p>
                </div>
                <p
                  className="cursor-pointer text-xs font-semibold text-[#8C98A9] md:text-sm"
                  onClick={() => {
                    const code = decodeReferralCode(u.code);
                    handleCopyToClipboard(generateLink(code));
                  }}
                >
                  Copy link
                </p>
              </div>
            );
          })}
        </>
      ) : (
        <p className="text-sm text-[#8C98A9]">
          It seems you're without a referral code at the moment. Create one now
          to kickstart your rebate earnings!
        </p>
      )}
      <>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[#8C98A9]">Enter referral code</p>
          <input
            type="text"
            placeholder="XXXXXX"
            value={referralCode}
            onChange={handleReferralInputChange}
            className="rounded-[34px] bg-[#161928] px-4 py-2"
            disabled={!isConnected}
          />
        </div>
        {isConnected ? (
          <Button onClick={handleReferralCodeCreate}>Create code</Button>
        ) : (
          <Button onClick={() => open({ view: 'Connect' })}>
            Connect Wallet
          </Button>
        )}
      </>
    </>
  );
};
