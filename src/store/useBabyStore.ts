import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Baby {
  id: string;
  nickname: string;
  birth: string;
  memo?: string;
}

interface BabyState {
  currentBaby: Baby | null;
  setCurrentBaby: (baby: Baby | null) => void;
}

export const useBabyStore = create<BabyState>()(
  persist(
    (set) => ({
      currentBaby: null,
      setCurrentBaby: (baby) => set({ currentBaby: baby }),
    }),
    { name: 'baby-storage' } // 새로고침해도 선택된 아기 유지
  )
);