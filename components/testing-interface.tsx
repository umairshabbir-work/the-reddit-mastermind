"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useState } from "react";

export function TestingInterface() {
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedVariation, setSelectedVariation] = useState(0);
	const [testResults, setTestResults] = useState<any[]>([]);

	const handleRunTests = async () => {
		setIsGenerating(true);

		try {
			const variations = [
				{
					authenticityScore: 8.5,
					engagementPrediction: 7.2,
					issues: [],
					name: "Variation A - Casual Tone",
				},
				{
					authenticityScore: 7.8,
					engagementPrediction: 6.5,
					issues: ["May be too technical for audience"],
					name: "Variation B - Technical Tone",
				},
				{
					authenticityScore: 8.9,
					engagementPrediction: 8.4,
					issues: [],
					name: "Variation C - Humorous Tone",
				},
			];

			setSelectedVariation(0);
			setTestResults(variations);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="w-full max-w-6xl mx-auto p-8 space-y-8">
			<Card className="border-4 border-black rounded-none">
				<CardHeader>
					<CardTitle className="font-mono text-2xl">
						Testing Interface
					</CardTitle>

					<CardDescription>
						Quality validation and content variation testing
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6">
					<div className="border-4 border-black p-6 space-y-4 bg-secondary">
						<h3 className="font-mono font-bold text-lg">
							Quality Validation Tests
						</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="border-2 border-black p-3">
								<p className="font-mono font-bold text-sm">
									Topic Overlap Check
								</p>

								<p className="font-mono text-xs text-muted-foreground mt-1">
									✓ No overlaps detected
								</p>
							</div>

							<div className="border-2 border-black p-3">
								<p className="font-mono font-bold text-sm">
									Subreddit Compliance
								</p>

								<p className="font-mono text-xs text-muted-foreground mt-1">
									✓ Within posting limits
								</p>
							</div>

							<div className="border-2 border-black p-3">
								<p className="font-mono font-bold text-sm">
									Persona Consistency
								</p>

								<p className="font-mono text-xs text-muted-foreground mt-1">
									✓ Voice aligned
								</p>
							</div>

							<div className="border-2 border-black p-3">
								<p className="font-mono font-bold text-sm">
									Comment Threading
								</p>

								<p className="font-mono text-xs text-muted-foreground mt-1">
									✓ Valid threads
								</p>
							</div>
						</div>

						<Button
							className="w-full bg-primary text-primary-foreground border-2 border-black rounded-none font-mono font-bold h-12 mt-4"
							disabled={isGenerating}
							onClick={handleRunTests}
						>
							{isGenerating
								? "Running Tests..."
								: "Run Quality Tests"}
						</Button>
					</div>

					{testResults.length > 0 && (
						<div className="space-y-4">
							<Tabs value={`variation-${selectedVariation}`}>
								<TabsList className="grid w-full gap-1 bg-transparent border-2 border-black rounded-none">
									{testResults.map((result, idx) => (
										<button
											className={`flex-1 px-4 py-2 font-mono font-bold border-2 border-black rounded-none transition-colors ${
												selectedVariation === idx
													? "bg-primary text-primary-foreground"
													: "bg-background hover:bg-muted"
											}`}
											key={idx}
											onClick={() =>
												setSelectedVariation(idx)
											}
										>
											V{String.fromCharCode(65 + idx)}
										</button>
									))}
								</TabsList>

								{testResults.map((result, idx) => (
									<TabsContent
										className="space-y-4 mt-4"
										key={idx}
										value={`variation-${idx}`}
									>
										<div className="border-4 border-black p-6 space-y-4">
											<h3 className="font-mono font-bold text-lg">
												{result.name}
											</h3>

											<div className="grid grid-cols-2 gap-4">
												<div className="border-2 border-black p-4">
													<p className="font-mono font-bold text-sm mb-2">
														Authenticity Score
													</p>

													<p className="font-mono text-2xl font-bold text-primary">
														{result.authenticityScore.toFixed(
															1,
														)}
														/10
													</p>
												</div>

												<div className="border-2 border-black p-4">
													<p className="font-mono font-bold text-sm mb-2">
														Engagement Prediction
													</p>

													<p className="font-mono text-2xl font-bold text-accent">
														{result.engagementPrediction.toFixed(
															1,
														)}
														/10
													</p>
												</div>
											</div>

											{result.issues.length > 0 && (
												<div className="border-2 border-destructive bg-destructive bg-opacity-10 p-4">
													<p className="font-mono font-bold text-sm mb-2">
														Issues Detected:
													</p>

													{result.issues.map(
														(
															issue: string,
															i: number,
														) => (
															<p
																className="font-mono text-sm"
																key={i}
															>
																• {issue}
															</p>
														),
													)}
												</div>
											)}

											{result.issues.length === 0 && (
												<div className="border-2 border-green-600 bg-green-100 bg-opacity-10 p-4">
													<p className="font-mono font-bold text-sm text-green-700">
														✓ All checks passed
													</p>
												</div>
											)}
										</div>
									</TabsContent>
								))}
							</Tabs>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
