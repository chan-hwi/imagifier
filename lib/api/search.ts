import { useFetch } from "../fetcher";

const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

export interface WordSearchLicense {
	name: string;
	url: string;
}

export interface WordSearchPhonetic {
	text: string;
	audio: string;
	sourceUrl: string;
	license: WordSearchLicense;
}

export interface WordSearchDefinition {
	definition: string;
	synonyms: string[];
	antonyms: string[];
	example?: string;
}

export interface WordSearchMeaning {
	partOfSpeech: string;
	definitions: WordSearchDefinition[];
	synonyms: string[];
	antonyms: string[];
}

export interface WordSearchResponseItem {
	word: string;
	phonetic: string;
	phonetics: WordSearchPhonetic[];
	meanings: WordSearchMeaning[];
	license: WordSearchLicense;
	sourceUrls: string[];
}

export const searchWord = async (word: string) => {
	const response = await fetch(`${baseUrl}${word}`);
	const data = await response.json();
	return data as WordSearchResponseItem[];
};

export const useSearchWord = (word: string) => {
	return {
		...useFetch(searchWord, word),
		...(!word ? { loading: false } : {}),
	};
};
