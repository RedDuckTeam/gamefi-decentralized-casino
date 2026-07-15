import { useAppKit } from '@reown/appkit/react';
import { type ChangeEvent, useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';

import { Button } from '../ui/button';

import { useActivateCode } from '@/hooks/useActivateCode';
import { useLocalStorage } from '@/hooks/useLocalStorage.ts';
import { useToast } from '@/hooks/useToast';
import { encodeReferralCode } from '@/lib/referral-code';

export const EnterCode = () => {
  const [refData, setRefData] = useLocalStorage<string>('ref', '');
  const [referralCode, setReferralCode] = useState(refData);
  const { activateCode } = useActivateCode();
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const { open } = useAppKit();

  useEffect(() => {
    setReferralCode(refData);
  }, [refData]);

  const handleReferralInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReferralCode(e.target.value);
  };

  const handleReferralCodeEnter = useCallback(async () => {
    const encodedReferralCode = encodeReferralCode(referralCode);

    const res = await activateCode(encodedReferralCode);

    if (res) {
      toast({ description: 'Code is activated successfully!' });
    } else {
      toast({
        description: 'Something went wrong.',
        variant: 'destructive',
      });
    }
  }, [activateCode, referralCode, toast]);

  return (
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
        <Button
          onClick={async () => {
            await handleReferralCodeEnter();
            setRefData('');
          }}
        >
          Enter referral code
        </Button>
      ) : (
        <Button onClick={() => open({ view: 'Connect' })}>
          Connect Wallet
        </Button>
      )}
    </>
  );
};
