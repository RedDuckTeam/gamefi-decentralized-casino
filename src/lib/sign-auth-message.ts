import {
  type Account,
  type Chain,
  type Transport,
  type WalletClient,
} from 'viem';
import Web3Token from 'web3-token';

const ADMIN_MESSAGE =
  import.meta.env.VITE_PUBLIC_ADMIN_MESSAGE ?? 'crypto-casino';

export const signAuthMessage = async (
  walletClient: WalletClient<Transport, Chain | undefined, Account>,
) => {
  const token = await Web3Token.sign(
    async (msg: string) => await walletClient.signMessage({ message: msg }),
    {
      domain: ADMIN_MESSAGE.toString(),
    },
  );

  return token;
};
