"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getKeywordById, getPersonaById, getSubredditById } from "@/lib/utils";
import type { Comment, Post } from "@/lib/types";

interface CalendarViewProps {
	isLoading: boolean;
	onGenerate: () => void;
	posts: Post[];
}

export const CalendarView = ({
	isLoading,
	onGenerate,
	posts,
}: CalendarViewProps) => {
	const getParentComments = (post: Post) =>
		post.comments
			.filter((c) => !c.parentCommentId)
			.sort(
				(a, b) =>
					new Date(a.timestamp).getTime() -
					new Date(b.timestamp).getTime(),
			) || ([] as Comment[]);

	const getThreadComments = (parentCommentId: number, post: Post) =>
		post.comments
			.filter((c) => c.parentCommentId === parentCommentId)
			.sort(
				(a, b) =>
					new Date(a.timestamp).getTime() -
					new Date(b.timestamp).getTime(),
			) || ([] as Comment[]);

	return (
		<div className="mx-auto w-full max-w-6xl space-y-8 p-8">
			<Card className="rounded-none border-4 border-black">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="font-mono text-2xl">
								Content Calendar
							</CardTitle>

							<CardDescription>
								Weekly Reddit content strategy
							</CardDescription>
						</div>

						<Button
							className="bg-secondary text-secondary-foreground hover:bg-opacity-80 rounded-none border-2 border-black font-mono font-bold"
							disabled={isLoading}
							onClick={onGenerate}
						>
							{isLoading
								? "Generating..."
								: "⚡ Generate Calendar"}
						</Button>
					</div>
				</CardHeader>

				<CardContent>
					<div className="grid grid-cols-1 gap-6">
						{posts.length === 0 ? (
							<div className="border-4 border-black p-8 text-center">
								<p className="font-mono text-lg font-bold">
									No content generated yet
								</p>

								<p className="text-muted-foreground font-mono text-sm">
									Click Generate Calendar to create posts
								</p>
							</div>
						) : (
							posts.map((post) => (
								<div
									className="space-y-4 border-4 border-black p-6"
									key={post.id}
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3 className="font-mono text-lg font-bold">
												{post.title}
											</h3>

											<p className="text-muted-foreground font-mono text-sm">
												To be posted by @
												{
													getPersonaById(
														post.personaId,
													).username
												}{" "}
												in{" "}
												{
													getSubredditById(
														post.subredditId,
													).name
												}
											</p>

											{post.keywordIds &&
												post.keywordIds.length > 0 && (
													<div className="mt-2 flex flex-wrap gap-2">
														{post.keywordIds.map(
															(kw) => {
																const keyword =
																	getKeywordById(
																		kw,
																	);

																return (
																	keyword.text && (
																		<span
																			className="bg-secondary text-secondary-foreground border-2 border-black px-2 py-1 font-mono text-xs font-bold"
																			key={
																				keyword.id
																			}
																		>
																			{
																				keyword.text
																			}
																		</span>
																	)
																);
															},
														)}
													</div>
												)}
										</div>
									</div>

									<p className="font-mono text-sm leading-relaxed">
										{post.body}
									</p>

									{post.comments &&
										post.comments.length > 0 && (
											<div className="bg-muted space-y-3 border-2 border-black p-4">
												{getParentComments(post).map(
													(c) => {
														const threadComments =
															getThreadComments(
																c.id,
																post,
															);

														return (
															<div
																className="border-primary space-y-2 border-l-4 pl-3"
																key={c.id}
															>
																<div className="space-y-1">
																	<p className="font-mono text-sm font-bold">
																		@
																		{
																			getPersonaById(
																				c.personaId,
																			)
																				.username
																		}
																	</p>

																	<p className="font-mono text-sm">
																		{c.text}
																	</p>

																	<p className="text-muted-foreground font-mono text-xs">
																		{new Date(
																			c.timestamp,
																		).toLocaleString()}
																	</p>
																</div>

																{threadComments.length >
																	0 && (
																	<div className="ml-4 space-y-2 border-l-2 border-gray-400 pl-3">
																		{threadComments.map(
																			(
																				reply,
																			) => (
																				<div
																					className="space-y-1"
																					key={
																						reply.id
																					}
																				>
																					<p className="text-muted-foreground font-mono text-xs font-bold">
																						@
																						{
																							getPersonaById(
																								reply.personaId,
																							)
																								.username
																						}
																					</p>

																					<p className="font-mono text-xs">
																						{
																							reply.text
																						}
																					</p>

																					<p className="text-muted-foreground font-mono text-xs">
																						{new Date(
																							reply.timestamp,
																						).toLocaleString()}
																					</p>
																				</div>
																			),
																		)}
																	</div>
																)}
															</div>
														);
													},
												)}
											</div>
										)}

									<div className="text-muted-foreground pt-2 font-mono text-xs">
										{new Date(
											post.timestamp,
										).toLocaleString()}
									</div>
								</div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
