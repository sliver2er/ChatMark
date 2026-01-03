import { create } from "zustand";
import { LLMProviderStrategy } from "@/shared/llm/types";

interface ProviderStore {
  provider: LLMProviderStrategy | null;
  setProvider: (provider: LLMProviderStrategy) => void;
}

export const useProviderStore = create<ProviderStore>((set) => ({
  provider: null,
  setProvider: (provider) => set({ provider }),
}));
