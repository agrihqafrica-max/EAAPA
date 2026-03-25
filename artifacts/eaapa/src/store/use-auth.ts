import { create } from 'zustand';

interface AuthState {
  isVerified: boolean;
  accessToken: string | null;
  verify: (token: string) => void;
  logout: () => void;
}

export const useMarketAuth = create<AuthState>((set) => ({
  isVerified: false,
  accessToken: null,
  verify: (token) => set({ isVerified: true, accessToken: token }),
  logout: () => set({ isVerified: false, accessToken: null }),
}));
