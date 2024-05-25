"use server";

import { openai } from "./openai";
import { IChatMessage, TIACBody, TaskResult } from "./types";

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

export const genTIACVideo = async (prompt: string) => {
	try {
		const res = await fetch("https://api.novita.ai/v3/async/txt2video", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.NOVITA_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model_name: "darkSushiMixMix_225D_64380.safetensors",
				height: 512,
				width: 512,
				steps: 20,
				seed: -1,
				prompts: [
					{
						frames: 32,
						prompt,
					},
				],
				extra: {
					response_video_type: "gif",
				},
				negative_prompt:
					"nsfw,ng_deepnegative_v1_75t, badhandv4, (worst quality:2),(low quality:2), (normal quality:2), lowres,((monochrome)), ((grayscale)),watermark",
			}),
		});

		const { task_id } = await res.json();
		return task_id;
	} catch (e) {
		console.error(e);
		return null;
	}
};

export const getTIACVideoStatus = async (task_id: string) => {
	try {
		const res = await fetch(
			`https://api.novita.ai/v3/async/task-result?task_id=${task_id}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.NOVITA_API_KEY}`,
				},
			}
		);
		return (await res.json()) as TaskResult;
	} catch (e) {
		console.error(e);
		return null;
	}
};
