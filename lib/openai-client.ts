import { removeMarkdown } from "@excalidraw/markdown-to-text";
import OpenAI from "openai";

const MODELS = ["gpt-4o-mini"];

export const openAI = async (prompt: string) => {
	const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });
	const model = MODELS[Math.floor(Math.random() * MODELS.length)];

	console.log(model);

	const response = await client.responses.create({
		input: prompt,
		model: model,
	});

	return removeMarkdown(response.text as string);
};
