import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isOpen: false,
  setOpen: (isOpen: boolean) => set(() => ({ isOpen: isOpen })),
}));
