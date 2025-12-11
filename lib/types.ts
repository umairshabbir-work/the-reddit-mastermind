export interface Comment {
	_id?: string;
	authenticityScore: number;
	parentCommentId?: string;
	personaUsername: string;
	postId: string;
	text: string;
}

export interface Company {
	_id?: string;
	createdAt: Date;
	description: string;
	keywords: string[];
	name: string;
	personaIds: string[];
	postsPerWeek: number;
	subredditIds: string[];
	updatedAt: Date;
	website: string;
}

export interface ContentCalendar {
	_id?: string;
	companyId: string;
	generatedAt: Date;
	posts: Post[];
	weekStartDate: Date;
}

export interface Persona {
	_id?: string;
	background: string;
	bio: string;
	username: string;
}

export interface Post {
	_id?: string;
	authenticityScore: number;
	body: string;
	comments: Comment[];
	companyId: string;
	personaUsername: string;
	scheduledDate: Date;
	subredditId: string;
	title: string;
}

export interface Subreddit {
	_id?: string;
	maxPostsPerWeek: number;
	name: string;
}
