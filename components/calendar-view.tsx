"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/types";

interface CalendarViewProps {
	isLoading: boolean;
	onGenerate: () => void;
	posts: Post[];
}

export function CalendarView({
	isLoading,
	onGenerate,
	posts,
}: CalendarViewProps) {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<div className="w-full max-w-6xl mx-auto p-8 space-y-8">
			<Card className="border-4 border-black rounded-none">
				<CardHeader>
					<div className="flex justify-between items-start">
						<div>
							<CardTitle className="font-mono text-2xl">
								Content Calendar
							</CardTitle>

							<CardDescription>
								Weekly Reddit content strategy
							</CardDescription>
						</div>

						<Button
							className="bg-secondary text-secondary-foreground border-2 border-black rounded-none font-mono font-bold hover:bg-opacity-80"
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

								<p className="font-mono text-sm text-muted-foreground">
									Click Generate Calendar to create posts
								</p>
							</div>
						) : (
							posts.map((post, idx) => (
								<div
									className="border-4 border-black p-6 space-y-4"
									key={idx}
								>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<h3 className="font-mono font-bold text-lg">
												{post.title}
											</h3>

											<p className="font-mono text-sm text-muted-foreground">
												Posted by @
												{post.personaUsername} in r/
												{post.subredditId}
											</p>
										</div>

										<div className="bg-primary text-primary-foreground px-3 py-1 border-2 border-black font-mono font-bold">
											{post.authenticityScore}/10
										</div>
									</div>

									<p className="font-mono text-sm leading-relaxed">
										{post.body}
									</p>

									{post.comments &&
										post.comments.length > 0 && (
											<div className="border-2 border-black p-4 space-y-3 bg-muted">
												<p className="font-mono font-bold text-sm">
													Comments:
												</p>

												{post.comments.map(
													(comment, cidx) => (
														<div
															className="border-l-4 border-primary pl-3 space-y-1"
															key={cidx}
														>
															<p className="font-mono font-bold text-sm">
																@
																{
																	comment.personaUsername
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

									<div className="font-mono text-xs text-muted-foreground pt-2">
										Scheduled:{" "}
										{new Date(
											post.scheduledDate,
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
}
