"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { Company, Persona, Subreddit } from "@/lib/types";

export function SettingsDashboard() {
	const [company, setCompany] = useState<Partial<Company>>({
		description: "AI-powered presentation tool",
		keywords: ["best ai presentation maker"],
		name: "SlideForge",
		postsPerWeek: 3,
		website: "slideforge.ai",
	});

	const [personas, setPersonas] = useState<Persona[]>([
		{
			background:
				"I am Riley Hart, the head of operations at a SaaS startup...",
			bio: "Operations expert",
			username: "riley_ops",
		},
		{
			background: "I am Jordan Brooks, an independent consultant...",
			bio: "Consulting pro",
			username: "jordan_consults",
		},
	]);

	const [subreddits, setSubreddits] = useState<Subreddit[]>([
		{ name: "r/Canva", maxPostsPerWeek: 1 },
		{ name: "r/ClaudeAI", maxPostsPerWeek: 1 },
		{ name: "r/PowerPoint", maxPostsPerWeek: 1 },
	]);

	const handleCompanyChange = (field: string, value: any) => {
		setCompany((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddPersona = () => {
		setPersonas([
			...personas,
			{
				background: "Tell your story...",
				bio: "New persona",
				username: `persona_${personas.length}`,
			},
		]);
	};

	const handleAddSubreddit = () => {
		setSubreddits([
			...subreddits,
			{ name: "r/NewSubreddit", maxPostsPerWeek: 1 },
		]);
	};

	return (
		<div className="w-full max-w-6xl mx-auto p-8 space-y-8">
			<div className="border-4 border-black p-8">
				<h1 className="font-mono text-4xl font-bold mb-2">
					REDDIT MASTERMIND
				</h1>

				<p className="text-lg font-mono">
					Strategic Content Calendar Generator
				</p>
			</div>

			<Tabs defaultValue="company" className="w-full">
				<TabsList className="grid w-full grid-cols-3 border-2 border-black">
					<TabsTrigger value="company">Company</TabsTrigger>

					<TabsTrigger value="personas">Personas</TabsTrigger>

					<TabsTrigger value="subreddits">Subreddits</TabsTrigger>
				</TabsList>

				<TabsContent value="company">
					<Card className="border-4 border-black rounded-none">
						<CardHeader>
							<CardTitle className="font-mono text-2xl">
								Company Configuration
							</CardTitle>

							<CardDescription>
								Setup your brand details and posting strategy
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							<div>
								<label className="block font-mono font-bold mb-2">
									Company Name
								</label>

								<Input
									className="border-2 border-black rounded-none font-mono"
									onChange={(e) =>
										handleCompanyChange(
											"name",
											e.target.value,
										)
									}
									value={company.name || ""}
								/>
							</div>

							<div>
								<label className="block font-mono font-bold mb-2">
									Website
								</label>

								<Input
									className="border-2 border-black rounded-none font-mono"
									onChange={(e) =>
										handleCompanyChange(
											"website",
											e.target.value,
										)
									}
									value={company.website || ""}
								/>
							</div>

							<div>
								<label className="block font-mono font-bold mb-2">
									Description
								</label>

								<textarea
									className="w-full border-2 border-black rounded-none p-3 font-mono"
									onChange={(e) =>
										handleCompanyChange(
											"description",
											e.target.value,
										)
									}
									rows={4}
									value={company.description || ""}
								/>
							</div>

							<div>
								<label className="block font-mono font-bold mb-2">
									Keywords (comma-separated)
								</label>

								<Input
									className="border-2 border-black rounded-none font-mono"
									onChange={(e) =>
										handleCompanyChange(
											"keywords",
											e.target.value
												.split(",")
												.map((k) => k.trim()),
										)
									}
									value={company.keywords?.join(", ") || ""}
								/>
							</div>

							<div>
								<label className="block font-mono font-bold mb-2">
									Posts Per Week
								</label>

								<Input
									className="border-2 border-black rounded-none font-mono"
									max="10"
									min="1"
									onChange={(e) =>
										handleCompanyChange(
											"postsPerWeek",
											Number.parseInt(e.target.value),
										)
									}
									type="number"
									value={company.postsPerWeek || 3}
								/>
							</div>

							<Button className="w-full bg-primary text-primary-foreground border-2 border-black rounded-none font-mono font-bold h-12 text-lg hover:bg-opacity-80">
								Save Company
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="personas">
					<Card className="border-4 border-black rounded-none">
						<CardHeader>
							<CardTitle className="font-mono text-2xl">
								Reddit Personas
							</CardTitle>

							<CardDescription>
								Define authentic personas for community
								engagement
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							{personas.map((persona, idx) => (
								<div
									className="border-2 border-black p-4 space-y-4"
									key={idx}
								>
									<div>
										<label className="block font-mono font-bold mb-2">
											Username
										</label>

										<Input
											className="border-2 border-black rounded-none font-mono"
											readOnly
											value={persona.username}
										/>
									</div>

									<div>
										<label className="block font-mono font-bold mb-2">
											Bio
										</label>

										<Input
											className="border-2 border-black rounded-none font-mono"
											readOnly
											value={persona.bio}
										/>
									</div>

									<div>
										<label className="block font-mono font-bold mb-2">
											Background
										</label>

										<textarea
											className="w-full border-2 border-black rounded-none p-3 font-mono text-sm"
											readOnly
											rows={3}
											value={persona.background}
										/>
									</div>
								</div>
							))}

							<Button
								className="w-full border-4 border-black rounded-none font-mono font-bold h-12 bg-transparent"
								onClick={handleAddPersona}
								variant="outline"
							>
								+ Add Persona
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="subreddits">
					<Card className="border-4 border-black rounded-none">
						<CardHeader>
							<CardTitle className="font-mono text-2xl">
								Target Subreddits
							</CardTitle>

							<CardDescription>
								Configure subreddit posting strategy
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							{subreddits.map((subreddit, idx) => (
								<div
									className="border-2 border-black p-4 space-y-4"
									key={idx}
								>
									<div>
										<label className="block font-mono font-bold mb-2">
											Subreddit
										</label>

										<Input
											className="border-2 border-black rounded-none font-mono"
											value={subreddit.name}
										/>
									</div>

									<div>
										<label className="block font-mono font-bold mb-2">
											Max Posts/Week
										</label>

										<Input
											className="border-2 border-black rounded-none font-mono"
											max="5"
											min="1"
											type="number"
											value={subreddit.maxPostsPerWeek}
										/>
									</div>
								</div>
							))}

							<Button
								className="w-full border-4 border-black rounded-none font-mono font-bold h-12 bg-transparent"
								onClick={handleAddSubreddit}
								variant="outline"
							>
								+ Add Subreddit
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
