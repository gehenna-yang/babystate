import { create } from 'zustand';

interface BabyStore {
    currentBaby: any | null;
    setCurrentBaby: (baby: any) => void;
}
  
export const useBabyStore = create<BabyStore>((set) => ({
    currentBaby: null,
    setCurrentBaby: (baby) => set({ currentBaby: baby }),
}));