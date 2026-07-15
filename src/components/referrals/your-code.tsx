import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export const YourCode = ({ myReferralCode }: { myReferralCode: string }) => {
  const handleCopyToClipboard = useCopyToClipboard();

  return (
    <>
      <div className="my-auto flex flex-col items-center gap-2 pb-4 pt-2">
        <p
          className="cursor-pointer truncate text-3xl font-semibold"
          onClick={() => handleCopyToClipboard(myReferralCode)}
        >
          {myReferralCode}
        </p>
        <p className="text-sm text-[#8C98A9]">Code generated, click to copy</p>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-1 gap-2">
          <span className="text-xs text-[#8C98A9]">Joined users:</span>
          <span className="text-xs font-semibold">1,100,000</span>
        </div>
        <div className="flex flex-1 gap-2">
          <span className="text-xs text-[#8C98A9]">Trades:</span>
          <span className="text-xs font-semibold">1,100,000</span>
        </div>
      </div>
    </>
  );
};
