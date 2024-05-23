"use server";

import { openai } from "./openai";

interface TIACBody {
	word: string;
	definition: string;
}

interface IChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

export const genTIACDescription = async ({ word, definition }: TIACBody) => {
	const messages: IChatMessage[] = [
		{
			role: "user",
			content: `Tell me relevant physical object of the concept "${word}" whose definition is "${definition}". Summarize the result in one sentence.
    `,
		},
	];
	const res = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages,
	});

	const chatRes = res.choices?.[0].message?.content;
	if (!chatRes) return null;

	messages.push({
		role: "assistant",
		content: chatRes,
	});
	messages.push({
		role: "user",
		content: `Good Example for the image prompt:

        - full body photo of a horse in a space suit
        - A Charming Hedge Maze Dotted By Rose Bushes And Intricately Designed Lampposts, Digital Art, Trending On Artstation
        - A Grey Kitten Standing On A Pizza In Outer Space. The Kitten Is Eating A Piece Of Pizza. Pizza Slices Flying With Angel Wings In Background, Dark Cyan Galaxy And Stars In Background, 4K Photoshopped Image, Look At That Detail.
        - A Portrait Of A Dog In A Library, Sigma 85Mm F/1.4
        - An Oil Painting Of A Young Boy With Long Blonde Hair Sleeping In Bed With A Checkered Comforter
        - A Male American High School Student Reading A Newspaper, In Chinese Watercolor, Award-Winning Painting
        - A 3D Render Of A Teapot In The Shape Of A King With Red Hair, Realistic, Artstation, Cg
        - Jackson Pollock, Air Jordan sneakers, digital art, product photography.
        
        make me prompt to draw image of concept "${word}" whose definition is "${definition}" based on physical object of "${word}":
        ${chatRes}
        
        Summarize the result in short sentences.
        `,
	});

	const finalRes = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages,
	});

	return finalRes.choices?.[0].message?.content;
};

export const genTIACImage = async (prompt: string) => {
	const res = await openai.images.generate({
		model: "dall-e-2",
		prompt,
		quality: "hd",
		n: 1,
	});
	return res.data?.[0].url;
};

export const genTranslatedMeanings = async (word: string) => {
	const res = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [
			{
				role: "user",
				content: `Provide the several well-known meanings of the English word "${word}" in Korean. Provide no more than 5 meanings. Print comma-separated meanings only.`,
			},
		],
	});
	return res.choices?.[0].message?.content;
};
