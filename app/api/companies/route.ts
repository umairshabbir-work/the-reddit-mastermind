import { getDb } from "@/lib/mongodb";
import type { Company } from "@/lib/types";

export async function GET() {
	try {
		const db = await getDb();

		const companies = await db.collection("companies").find({}).toArray();

		return Response.json(companies);
	} catch (error) {
		return Response.json(
			{ error: "Failed to fetch companies." },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	try {
		const db = await getDb();
		const body: Company = await req.json();

		const result = await db.collection("companies").insertOne({
			...body,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return Response.json({ _id: result.insertedId, ...body });
	} catch (error) {
		return Response.json(
			{ error: "Failed to create company." },
			{ status: 500 },
		);
	}
}
