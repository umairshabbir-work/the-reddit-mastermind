import { GoogleGenAI } from "@google/genai";
import { removeMarkdown } from "@excalidraw/markdown-to-text";

const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

export const genAI = async (prompt: string) => {
	const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_KEY });
	const model = MODELS[Math.floor(Math.random() * MODELS.length)];

	console.log(model);

	const response = await ai.models.generateContent({
		contents: prompt,
		model: model,
	});

	return removeMarkdown(response.text as string);
};
