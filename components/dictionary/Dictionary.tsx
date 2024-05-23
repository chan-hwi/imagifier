"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";
import { WordSearchResponseItem, searchWord, useSearchWord } from "@/lib/api/search";
import Loader from "../common/Loader";
import DictionarySearchResult from "./DictionarySearchResult";
import { useWord, useWordActions } from "@/stores/WordStore";

function Dictionary() {
	const word = useWord();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [data, setData] = useState<WordSearchResponseItem[]>([]);
	const [loading, setLoading] = useState(false);
	const { setWord, setMeanings } = useWordActions();

	const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!loading && e.key === "Enter") {
			handleSearch();
		}
	};
	const handleSearch = () => {
		if (loading) return;

		const input = inputRef.current?.value;
		if (!input) return;
		setLoading(true);

		setWord(input);
		searchWord(input).then((data) => {
			setData(data);
			setMeanings(data.length > 0 ? data[0].meanings : []);
			setLoading(false);
		});
	};

	const meanings = data.length > 0 ? data[0].meanings : null;

	return (
		<div className="flex flex-col gap-8">
			<header>
				<h1 className="text-2xl font-bold">Word Imagefier</h1>
				<h2 className="text-lg text-muted-foreground">단어를 검색해보세요</h2>
			</header>

			<div className="w-full flex gap-4">
				<Input
					type="text"
					ref={inputRef}
					onKeyDown={handleEnter}
					placeholder="단어를 입력하세요"
					disabled={loading}
				/>
				<Button size="icon" onClick={handleSearch}>
					<SearchIcon className="size-4" />
				</Button>
			</div>

			{loading ? (
				<div className="mx-auto my-8">
					<Loader />
				</div>
			) : meanings ? (
				<DictionarySearchResult word={word} meanings={meanings} />
			) : (
				word && (
					<div className="mx-auto text-center text-muted-foreground">
						해당 단어에 대한 의미를 사전에서 검색할 수 없습니다
					</div>
				)
			)}
		</div>
	);
}

export default Dictionary;
