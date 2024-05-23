import { WordSearchMeaning } from "@/lib/api/search";

const DefMap = {
	noun: "명사",
	verb: "동사",
	adjective: "형용사",
	adverb: "부사",
	preposition: "전치사",
	pronoun: "대명사",
	conjunction: "접속사",
	interjection: "감탄사",
};

export const DictionaryDef = ({ meaning }: { meaning: WordSearchMeaning }) => {
	const label = DefMap[meaning.partOfSpeech as keyof typeof DefMap];
	if (!label) return null;

	return (
		<div className="flex flex-col gap-2">
			<h3 className="font-bold">{label}</h3>
			<ol className="list-disc ml-4">
				{meaning.definitions.map((def) => (
					<li key={def.definition}>{def.definition}</li>
				))}
			</ol>
		</div>
	);
};

export default DictionaryDef;
