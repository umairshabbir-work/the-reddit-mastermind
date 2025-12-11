import { genAI } from "@/lib/google-client";
import { generateId } from "@/lib/utils";
import { openAI } from "@/lib/openai-client";
import type {
	Comment,
	Company,
	ContentCalendar,
	Persona,
	Post,
} from "@/lib/types";

export const POST = async (req: Request) => {
	const { company, personas, weekStartDateISO } = (await req.json()) as {
		company: Company;
		personas: Persona[];
		weekStartDateISO: string;
	};
	if (!company || !personas)
		return Response.json(
			{ error: "Missing required data: company, personas." },
			{ status: 400 },
		);
	if (!company.keywords || company.keywords.length === 0)
		return Response.json(
			{ error: "At least one keyword is required." },
			{ status: 400 },
		);
	if (personas.length === 0)
		return Response.json(
			{ error: "At least one persona is required." },
			{ status: 400 },
		);

	try {
		const keywords = company.keywords;
		const postsPerWeek = company.postsPerWeek;

		let posts: Post[] = [];

		for (let i = 0; i < postsPerWeek; i++) {
			const persona =
				personas[Math.floor(Math.random() * personas.length)];
			const subreddit =
				company.subreddits[
					Math.floor(Math.random() * company.subreddits.length)
				];

			const prompt = `You are a Reddit user named ${persona.username} with this background: "${persona.info}". You are working for the company "${company.name}" and this is the company description: "${company.description.trim()}". Create an authentic Reddit post for the subreddit "${subreddit.name}" that naturally discusses the relevant keywords from: "${JSON.stringify(keywords)}". Format your response as JSON with this structure and do not use markdown: "{ body: "body goes here", keywordIds: [keyword ids being used in the body from the keywords array], title: "title goes here" }". Make it authentic, concise, not promotional and do not use em dashes or any other formatting.`;

			const genAiContent = await genAI(prompt);

			let parsedContent: {
				body: string;
				keywordIds: number[];
				title: string;
			};
			try {
				parsedContent = JSON.parse(genAiContent);
			} catch {
				parsedContent = {
					body: genAiContent,
					keywordIds: [],
					title: "Interesting discussion about ...",
				};
			}

			const post: Post = {
				body: parsedContent.body,
				comments: [],
				id: generateId(),
				keywordIds: parsedContent.keywordIds,
				personaId: persona.id,
				subredditId: subreddit.id,
				timestamp: new Date(
					new Date(weekStartDateISO).getTime() +
						i * 24 * 60 * 60 * 1000,
				),
				title: parsedContent.title,
			};

			posts.push(post);
		}

		for (const post of posts) {
			for (let i = 0; i < postsPerWeek; i++) {
				const persona = personas.filter((p) => p.id !== post.personaId)[
					Math.floor(Math.random() * personas.length - 1)
				];

				const prompt = `You are a Reddit user named ${persona.username} with this background: "${persona.info}". You are working for the company "${company.name}" and this is the company description: "${company.description.trim()}". Create an authentic Reddit comment for the post "${post.body}". Format your response as JSON with this structure and do not use markdown: "{ text: "comment goes here" }". Make it authentic, 2-3 sentences, concise, not promotional and do not use em dashes or any other formatting.`;

				const genAiContent = await genAI(prompt);

				let parsedContent: { text: string };
				try {
					parsedContent = JSON.parse(genAiContent);
				} catch {
					parsedContent = { text: genAiContent };
				}

				const comment: Comment = {
					id: generateId(),
					personaId: persona.id,
					postId: post.id,
					text: parsedContent.text,
					timestamp: new Date(
						new Date(weekStartDateISO).getTime() +
							i * 24 * 60 * 60 * 1000,
					),
				};

				posts.find((p) => p.id === post.id)?.comments.push(comment);
			}
		}

		return Response.json({
			companyId: company.id,
			id: generateId(),
			posts,
			timestamp: new Date(),
			weekStartDate: new Date(weekStartDateISO),
		} as ContentCalendar);
	} catch (error) {
		return Response.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
};
