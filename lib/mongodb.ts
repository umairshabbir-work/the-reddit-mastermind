import { MongoClient, type Db } from "mongodb";

const uri =
	process.env.MONGODB_URI ||
	"mongodb://localhost:27017/the-reddit-mastermind";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export const connectToDatabase = async () => {
	if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };

	const client = new MongoClient(uri);

	await client.connect();

	const db = client.db("the-reddit-mastermind");

	cachedClient = client;
	cachedDb = db;

	return { client, db };
};

export const getDb = async () => {
	const { db } = await connectToDatabase();

	return db;
};
