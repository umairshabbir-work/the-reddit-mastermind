import { generateContent } from "@/lib/blackbox-client";
import { generateId } from "@/lib/utils";
import type { Company, ContentCalendar, Persona, Post } from "@/lib/types";

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
		const posts: Post[] = [];
		const postsPerWeek = company.postsPerWeek || 3;

		for (let i = 0; i < postsPerWeek; i++) {
			const keyword = company.keywords[i % company.keywords.length];
			const persona = personas[i % personas.length];
			const subreddit = company.subreddits[i % company.subreddits.length];

			const prompt = `You are a Reddit user named ${
				persona.username
			} with this background: "${persona.info}".
			
			Create an authentic Reddit post for ${
				subreddit.name
			} that naturally discusses ${keyword.text}.

			Format your response as JSON with this structure:

			{ body: "post content", title: "post title" }
			
			Make it authentic, not promotional.`;

			const generated = await generateContent("gpt-4o-mini", prompt);

			let parsedContent;
			try {
				parsedContent = JSON.parse(generated);
			} catch {
				parsedContent = {
					body: generated,
					title: `Interesting discussion about ${keyword.text}`,
				};
			}

			const post: Post = {
				body: parsedContent.body,
				comments: [],
				id: generateId(),
				keywordIds: [keyword.id],
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

		return Response.json({
			companyId: company.id,
			id: generateId(),
			posts,
			timestamp: new Date(),
			weekStartDate: new Date(weekStartDateISO),
		} as ContentCalendar);
	} catch (error) {
		return Response.json(
			{ error: "Failed to generate calendar." },
			{ status: 500 },
		);
	}
};
