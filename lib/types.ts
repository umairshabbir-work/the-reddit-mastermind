export interface Comment {
	id: number;
	parentCommentId?: number;
	personaId: number;
	postId: number;
	text: string;
	timestamp: Date;
}

export interface Company {
	description: string;
	id: number;
	keywords: keyword[];
	name: string;
	postsPerWeek: number;
	subreddits: Subreddit[];
	website: string;
}

export interface ContentCalendar {
	companyId: number;
	id: number;
	posts: Post[];
	timestamp: Date;
	weekStartDate: Date;
}

export interface keyword {
	id: number;
	text: string;
}

export interface Persona {
	id: number;
	info: string;
	username: string;
}

export interface Post {
	body: string;
	comments: Comment[];
	id: number;
	keywordIds: number[];
	personaId: number;
	subredditId: number;
	timestamp: Date;
	title: string;
}

export interface Subreddit {
	id: number;
	name: string;
}
