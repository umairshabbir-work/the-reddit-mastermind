import { generateContent } from "@/lib/blackbox-client";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { Post } from "@/lib/types";

export async function POST(req: Request) {
	try {
		const { companyId, weekStartDate } = await req.json();
		const db = await getDb();

		const company = await db
			.collection("companies")
			.findOne({ _id: new ObjectId(companyId) });
		if (!company)
			return Response.json(
				{ error: "Company not found." },
				{ status: 404 },
			);

		const personas = await db
			.collection("personas")
			.find({
				_id: {
					$in: company.personaIds.map(
						(id: string) => new ObjectId(id),
					),
				},
			})
			.toArray();

		const subreddits = await db
			.collection("subreddits")
			.find({
				_id: {
					$in: company.subredditIds.map(
						(id: string) => new ObjectId(id),
					),
				},
			})
			.toArray();

		const posts: Post[] = [];
		const postsPerWeek = company.postsPerWeek || 3;

		for (let i = 0; i < postsPerWeek; i++) {
			const persona = personas[i % personas.length];
			const subreddit = subreddits[i % subreddits.length];

			const prompt = `You are a Reddit user named ${
				persona.username
			} with this background: "${persona.background}". 
      
      Create an authentic Reddit post for r/${
			subreddit.name
		} that naturally discusses ${
				company.keywords[i % company.keywords.length]
			}.
      
      Format your response as JSON with this structure:
      {
        "title": "post title",
        "body": "post content",
        "comments": [
          {"username": "persona1", "text": "comment text"},
          {"username": "persona2", "text": "reply text"}
        ]
      }
      
      Make it authentic, not promotional. Add 3-4 comments from different personas responding naturally.`;

			const generated = await generateContent("", prompt);

			let parsedContent;
			try {
				parsedContent = JSON.parse(generated);
			} catch {
				parsedContent = {
					body: generated,
					comments: [],
					title: `Interesting discussion about ${
						company.keywords[i % company.keywords.length]
					}`,
				};
			}

			const post: Post = {
				authenticityScore: Math.floor(Math.random() * 3) + 7,
				body: parsedContent.body,
				comments:
					parsedContent.comments?.map((c: any, idx: number) => ({
						personaUsername:
							c.username ||
							personas[idx % personas.length].username,
						text: c.text,
						authenticityScore: Math.floor(Math.random() * 3) + 7,
					})) || [],
				companyId,
				personaUsername: persona.username,
				scheduledDate: new Date(
					new Date(weekStartDate).getTime() + i * 24 * 60 * 60 * 1000,
				),
				subredditId: subreddit._id.toString(),
				title: parsedContent.title,
			};

			posts.push(post);
		}

		const calendar = await db.collection("calendars").insertOne({
			companyId,
			generatedAt: new Date(),
			posts,
			weekStartDate: new Date(weekStartDate),
		});

		return Response.json({
			_id: calendar.insertedId,
			companyId,
			generatedAt: new Date(),
			posts,
			weekStartDate,
		});
	} catch (error) {
		return Response.json(
			{ error: "Failed to generate calendar." },
			{ status: 500 },
		);
	}
}
