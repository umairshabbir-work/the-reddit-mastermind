"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPersonaById, getSubredditById } from "@/lib/utils";
import type { Post } from "@/lib/types";

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
							posts.map((post, i) => (
								<div
									className="space-y-4 border-4 border-black p-6"
									key={i}
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h3 className="font-mono text-lg font-bold">
												{post.title}
											</h3>

											<p className="text-muted-foreground font-mono text-sm">
												Posted by @
												{
													getPersonaById(
														post.personaId,
													).username
												}{" "}
												in r/
												{
													getSubredditById(
														post.subredditId,
													).name
												}
											</p>
										</div>
									</div>

									<p className="font-mono text-sm leading-relaxed">
										{post.body}
									</p>

									{post.comments &&
										post.comments.length > 0 && (
											<div className="bg-muted space-y-3 border-2 border-black p-4">
												<p className="font-mono text-sm font-bold">
													Comments:
												</p>

												{post.comments.map(
													(comment, cidx) => (
														<div
															className="border-primary space-y-1 border-l-4 pl-3"
															key={cidx}
														>
															<p className="font-mono text-sm font-bold">
																@
																{
																	getPersonaById(
																		comment.personaId,
																	).username
																}
															</p>

															<p className="font-mono text-sm">
																{comment.text}
															</p>
														</div>
													),
												)}
											</div>
										)}

									<div className="text-muted-foreground pt-2 font-mono text-xs">
										Scheduled:{" "}
										{new Date(
											post.timestamp,
										).toLocaleDateString()}
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
