import {
  type Account,
  type Chain,
  type Transport,
  type WalletClient,
} from 'viem';
import Web3Token from 'web3-token';

// Bound into the signed message and verified by the backend, so it must match
// the value the backend expects.
const AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN ?? 'crypto-casino';

export const signAuthMessage = async (
  walletClient: WalletClient<Transport, Chain | undefined, Account>,
) => {
  const token = await Web3Token.sign(
    async (msg: string) => await walletClient.signMessage({ message: msg }),
    {
      domain: AUTH_DOMAIN,
    },
  );

  return token;
};
