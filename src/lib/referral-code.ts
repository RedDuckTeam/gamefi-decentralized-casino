import { type Hex, fromHex, stringToHex, zeroHash } from 'viem';

export const encodeReferralCode = (code: string) => {
  const final = code.replace(/[^\w_]/g, ''); // replace everything other than numbers, string  and underscor to ''
  if (final.length > 20) {
    return zeroHash;
  }
  return stringToHex(final, { size: 32 });
};

export const decodeReferralCode = (hexCode: string) => {
  if (!hexCode || hexCode === zeroHash) return '';
  try {
    return fromHex(hexCode as Hex, { to: 'string', size: 32 });
  } catch {
    let code = '';
    hexCode = hexCode.substring(2);
    for (let i = 0; i < 32; i++) {
      code += String.fromCharCode(
        parseInt(hexCode.substring(i * 2, i * 2 + 2), 16),
      );
    }
    return code.trim();
  }
};
