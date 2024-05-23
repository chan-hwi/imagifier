import { WordSearchMeaning } from "@/lib/api/search";
import { create } from "zustand";

interface IWordStore {
	word: string;
	meanings: WordSearchMeaning[];
	actions: {
		setWord: (word: string) => void;
		setMeanings: (meanings: WordSearchMeaning[]) => void;
	};
}

export const useWordStore = create<IWordStore>((set) => ({
	word: "",
	meanings: [],
	actions: {
		setWord: (word) => set((state) => ({ word })),
		setMeanings: (meanings) => set((state) => ({ meanings })),
	},
}));

export const useWord = () => useWordStore((state) => state.word);
export const useMeanings = () => useWordStore((state) => state.meanings);
export const useWordActions = () => useWordStore((state) => state.actions);


