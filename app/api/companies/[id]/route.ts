import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const db = await getDb();

		const company = await db
			.collection("companies")
			.findOne({ _id: new ObjectId(id) });
		if (!company) {
			return Response.json(
				{ error: "Company not found." },
				{ status: 404 },
			);
		}

		return Response.json(company);
	} catch (error) {
		return Response.json(
			{ error: "Failed to fetch company." },
			{ status: 500 },
		);
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await req.json();
		const db = await getDb();

		const result = await db
			.collection("companies")
			.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { ...body, updatedAt: new Date() } },
			);
		if (result.matchedCount === 0) {
			return Response.json(
				{ error: "Company not found." },
				{ status: 404 },
			);
		}

		return Response.json({ success: true });
	} catch (error) {
		return Response.json(
			{ error: "Failed to update company." },
			{ status: 500 },
		);
	}
}
