"use client";

import { useDictionaryItems } from "@/stores/DictionaryStore";
import WordListItem from "./WordListItem";
import { Button } from "../ui/button";
import { ListFilterIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Input } from "../ui/input";

function WordList() {
	const words = useDictionaryItems() ?? [];
	const [filterKeyword, setFilterKeyword] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [showFilters, setShowFilters] = useState(false);

	const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleSearch = () => {
		const input = searchInputRef.current?.value ?? "";
		setFilterKeyword(input);
	};

	const filteredWords = words.filter((item) =>
		item.word.includes(filterKeyword)
	);

	const total = filteredWords.length;

	return (
		<div className="flex flex-col">
			<div className="flex justify-between mb-2">
				<h1 className="text-2xl font-semibold">내 단어장</h1>
				<Button
					variant="outline"
					onClick={() => setShowFilters((show) => !show)}
				>
					<ListFilterIcon className="size-4 mr-2" />
					<span>검색 옵션</span>
				</Button>
			</div>
			<motion.div
				className="gap-4 overflow-y-hidden"
				initial={false}
				animate={{ height: showFilters ? "auto" : 0 }}
			>
				<div className="flex flex-col gap-4 py-4 px-2">
					<Input
						placeholder="검색어를 입력해주세요"
						ref={searchInputRef}
						onKeyDown={handleEnter}
					/>
					<Button className="self-end" onClick={handleSearch}>
						검색
					</Button>
				</div>
			</motion.div>
			{total > 0 ? (
				<div className="flex flex-col gap-4 mt-2">
					{filteredWords.map((word) => (
						<WordListItem key={word.id} item={word} />
					))}
				</div>
			) : (
				<div className="text-muted-foreground text-center font-semibold my-8">
					단어가 없습니다
				</div>
			)}
		</div>
	);
}

export default WordList;
