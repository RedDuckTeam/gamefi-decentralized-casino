import { useCookies } from 'react-cookie';
import { useWalletClient } from 'wagmi';

import { signAuthMessage } from '@/lib/sign-auth-message';

export const useTokenCookie = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const { data: walletClient } = useWalletClient();

  const setToken = (token: string) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 10 * 60 * 1000); // 10 minutes
    setCookie('token', token, {
      expires,
      path: '/',
      secure: true,
    });
  };

  const getOrCreateToken = async () => {
    const tokenFromCookies: string | undefined = cookies.token;

    if (tokenFromCookies) {
      return tokenFromCookies;
    }

    if (!walletClient) throw new Error('Wallet is not connected');

    const newToken = await signAuthMessage(walletClient);
    setToken(newToken);
    return newToken;
  };

  const deleteToken = () => {
    removeCookie('token', { path: '/', secure: true });
  };

  return { getOrCreateToken, deleteToken };
};
