import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export interface DictionaryItem extends DictionaryItemBody {
	id: string;
}

export interface DictionaryItemBody {
	word: string;
	meanings: string[];
	imageUrl: string;
	prompt: string;
}

interface IDictionaryStore {
	items: DictionaryItem[];
	actions: {
		addItem: (item: DictionaryItemBody) => void;
		removeItem: (id: string) => void;
		setItems: (items: DictionaryItemBody[]) => void;
	};
}

const DictionaryStore = (
	set: (cb: (state: IDictionaryStore) => any) => void
): IDictionaryStore => ({
	items: [],
	actions: {
		addItem: (item) =>
			set((state) => ({ items: [...state.items, { ...item, id: uuidv4() }] })),
		removeItem: (id) =>
			set((state) => ({
				items: state.items.filter((item) => item.id !== id),
			})),
		setItems: (items) =>
			set(() => ({
				items: items.map((item) => ({ ...item, id: uuidv4() })),
			})),
	},
});

export const useDictionaryStore = create(
	persist(DictionaryStore, {
		name: "dictionary",
		partialize({ actions, ...rest }) {
			return rest;
		},
	})
);

const useStore = <T, F>(
	store: (callback: (state: T) => unknown) => unknown,
	callback: (state: T) => F
) => {
	const result = store(callback) as F;
	const [data, setData] = useState<F>();

	useEffect(() => {
		setData(result);
	}, [result]);

	return data;
};

export const useDictionaryItems = () =>
	useStore(useDictionaryStore, (state) => state.items);
export const useDictionaryActions = () =>
	useStore(useDictionaryStore, (state) => state.actions);
