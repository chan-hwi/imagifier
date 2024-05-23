import { DictionaryItem } from "@/stores/DictionaryStore";
import React from "react";

interface WordListItemProps {
	item: DictionaryItem;
}

function WordListItem({ item }: WordListItemProps) {
	return (
		<div className="flex justify-between p-8 rounded-lg border-2 bg-white">
			<div className="flex flex-col justify-between">
				<div className="flex flex-col gap-2">
					<span className="text-2xl font-semibold">{item.word}</span>
					<p className="text-sm font-semibold text-muted-foreground">
						{item.meanings.slice(0, 3).join(",")}
					</p>
				</div>
			</div>
			<img src={item.imageUrl} className="aspect-square w-80" />
		</div>
	);
}

export default WordListItem;
