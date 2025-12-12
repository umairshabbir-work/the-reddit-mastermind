import { genAI } from "@/lib/google-client";
import {
	generateId,
	getDaysOffset,
	getHoursOffset,
	getMinutesOffset,
	getSecondsOffset,
} from "@/lib/utils";
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

			const prompt = `You are a Reddit user "${persona.username}" (${persona.info}). You are working for "${company.name}" (${company.description.trim()}). Create an authentic Reddit post for the subreddit "${subreddit.name}" that naturally discusses some of the keywords from: "${JSON.stringify(keywords)}". Format your response as JSON with this structure and do not use markdown: "{ "body": "...", "keywordIds": [...], "title": "..." }". Make it authentic, max 5-7 sentences, concise, not promotional and do not use em dashes or any other formatting.`;

			const genAiContent = await openAI(prompt);

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
					title: "...",
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
						getDaysOffset() * 24 * 60 * 60 * 1000 +
						getHoursOffset() * 60 * 60 * 1000 +
						getMinutesOffset() * 60 * 1000 +
						getSecondsOffset() * 1000,
				),
				title: parsedContent.title,
			};

			posts.push(post);
		}

		const parentComments = Math.ceil(postsPerWeek * 0.6);
		const threadComments = postsPerWeek - parentComments;

		for (let i = 0; i < parentComments; i++) {
			const post = posts[Math.floor(Math.random() * posts.length)];
			const availablePersonas = personas.filter(
				(p) => p.id !== post.personaId,
			);
			if (availablePersonas.length === 0) continue;

			const persona =
				availablePersonas[
					Math.floor(Math.random() * availablePersonas.length)
				];

			const prompt = `You are a Reddit user "${persona.username}" (${persona.info}). You are working for "${company.name}" (${company.description.trim()}). Create an authentic Reddit comment for the post "${post.body}". Format your response as JSON with this structure and do not use markdown: "{ "text": "..." }". Make it authentic, max 2-3 sentences, concise, not promotional and do not use em dashes or any other formatting.`;

			const genAiContent = await openAI(prompt);

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
					new Date(post.timestamp).getTime() +
						getHoursOffset() * 60 * 60 * 1000 +
						getMinutesOffset() * 60 * 1000 +
						getSecondsOffset() * 1000,
				),
			};

			posts.find((p) => p.id === post.id)?.comments.push(comment);
		}

		for (let i = 0; i < threadComments; i++) {
			const postsWithComments = posts.filter(
				(p) => p.comments.length > 0,
			);
			if (postsWithComments.length === 0) break;

			const post =
				postsWithComments[
					Math.floor(Math.random() * postsWithComments.length)
				];
			const parentComment =
				post.comments[Math.floor(Math.random() * post.comments.length)];
			const availablePersonas = personas.filter(
				(p) => p.id !== parentComment.personaId,
			);
			if (availablePersonas.length === 0) continue;

			const persona =
				availablePersonas[
					Math.floor(Math.random() * availablePersonas.length)
				];

			const prompt = `You are a Reddit user "${persona.username}" (${persona.info}). You are working for "${company.name}" (${company.description.trim()}). Create an authentic Reddit reply comment to this comment: "${parentComment.text}". Format your response as JSON with this structure and do not use markdown: "{ "text": "..." }". Make it authentic, max 1 sentence, concise, not promotional and do not use em dashes or any other formatting.`;

			const genAiContent = await openAI(prompt);

			let parsedContent: { text: string };
			try {
				parsedContent = JSON.parse(genAiContent);
			} catch {
				parsedContent = { text: genAiContent };
			}

			const comment: Comment = {
				id: generateId(),
				parentCommentId: parentComment.id,
				personaId: persona.id,
				postId: post.id,
				text: parsedContent.text,
				timestamp: new Date(
					new Date(parentComment.timestamp).getTime() +
						getHoursOffset() * 60 * 60 * 1000 +
						getMinutesOffset() * 60 * 1000 +
						getSecondsOffset() * 1000,
				),
			};

			posts.find((p) => p.id === post.id)?.comments.push(comment);
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
