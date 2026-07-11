import { type Address } from 'viem';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IAdminState {
  activeAddress: Address;
  setActiveAddress: (address: Address) => void;
}

export const useAdminStore = create<IAdminState>()(
  persist(
    (set) => ({
      activeAddress: '0x',
      setActiveAddress: (address) => set(() => ({ activeAddress: address })),
    }),
    {
      name: 'admin-storage',
    },
  ),
);
