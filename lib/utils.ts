import type {
	Comment,
	Company,
	ContentCalendar,
	keyword,
	Persona,
	Post,
	Subreddit,
} from "./types";

export const STORAGE_KEYS = {
	COMPANY: "the-reddit-mastermind:company",
	CONTENT_CALENDAR: "the-reddit-mastermind:content-calendar",
	PERSONAS: "the-reddit-mastermind:personas",
};

export const setCompany = (company: Company) =>
	localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
export const setContentCalendar = (contentCalendar: ContentCalendar) =>
	localStorage.setItem(
		STORAGE_KEYS.CONTENT_CALENDAR,
		JSON.stringify(contentCalendar),
	);
export const setPersonas = (personas: Persona[]) =>
	localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(personas));

export const getCompany = () =>
	JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPANY) || "{}") as Company;
export const getContentCalendar = () =>
	JSON.parse(
		localStorage.getItem(STORAGE_KEYS.CONTENT_CALENDAR) || "{}",
	) as ContentCalendar;
export const getPersonas = () =>
	JSON.parse(
		localStorage.getItem(STORAGE_KEYS.PERSONAS) || "[]",
	) as Persona[];

export const getKeywords = () => {
	const company = getCompany();
	return company.keywords || ([] as keyword[]);
};
export const getPosts = () => {
	const contentCalendar = getContentCalendar();
	return contentCalendar.posts || ([] as Post[]);
};
export const getSubreddits = () => {
	const company = getCompany();
	return company.subreddits || ([] as Subreddit[]);
};

export const getComments = () => {
	const posts = getPosts();
	return posts.flatMap((post) => post.comments) || ([] as Comment[]);
};

export const getCommentById = (id: number) => {
	const comments = getComments();
	return comments.find((comment) => comment.id === id) || ({} as Comment);
};
export const getCommentsByPostId = (postId: number) => {
	const comments = getComments();
	return (
		comments.filter((comment) => comment.postId === postId) ||
		([] as Comment[])
	);
};
export const getKeywordById = (id: number) => {
	const keywords = getKeywords();
	return keywords.find((keyword) => keyword.id === id) || ({} as keyword);
};
export const getPersonaById = (id: number) => {
	const personas = getPersonas();
	return personas.find((persona) => persona.id === id) || ({} as Persona);
};
export const getPostById = (id: number) => {
	const posts = getPosts();
	return posts.find((post) => post.id === id) || ({} as Post);
};
export const getSubredditById = (id: number) => {
	const subreddits = getSubreddits();
	return (
		subreddits.find((subreddit) => subreddit.id === id) || ({} as Subreddit)
	);
};

export const generateId = () => crypto.getRandomValues(new Uint32Array(1))[0];
