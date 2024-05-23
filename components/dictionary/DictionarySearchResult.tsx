import { WordSearchMeaning } from "@/lib/api/search";
import DictionaryDef from "./DictionaryDef";

export const DictionarySearchResult = ({
	word,
	meanings,
}: {
	word: string;
	meanings: WordSearchMeaning[];
}) => {
	return (
		<div className="flex flex-col gap-6">
			<h3 className="text-xl font-semibold">{word}</h3>
			<div className="flex flex-col gap-4">
				{meanings.map((meaning) => (
					<DictionaryDef
						key={meaning.definitions.map((d) => d.definition).join(",")}
						meaning={meaning}
					/>
				))}
			</div>
		</div>
	);
};

export default DictionarySearchResult;
