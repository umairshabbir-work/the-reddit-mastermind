"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	generateId,
	getCompany,
	getPersonas,
	setCompany,
	setPersonas,
} from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import type { Company, keyword, Persona, Subreddit } from "@/lib/types";

export const SettingsDashboard = () => {
	const [companyDetail, setCompanyDetail] = useState<Company>({
		description: "",
		id: generateId(),
		keywords: [],
		name: "",
		postsPerWeek: 3,
		subreddits: [],
		website: "",
	});
	const [personasDetail, setPersonasDetail] = useState<Persona[]>([]);

	const handleAddPersona = () =>
		setPersonasDetail([
			...personasDetail,
			{ id: generateId(), info: "", username: "" },
		]);

	const handleCompanyChange = (
		field: keyof Company,
		value: keyword[] | number | string | Subreddit[],
	) => setCompanyDetail((prev) => ({ ...prev, [field]: value }));

	const handleDeletePersona = (index: number) =>
		setPersonasDetail((prev) => prev.filter((_, i) => i !== index));

	const handleUpdatePersona = (
		field: keyof Persona,
		index: number,
		value: string,
	) =>
		setPersonasDetail((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [field]: value };
			return updated;
		});

	useEffect(() => {
		const company = getCompany();
		if (company.id) setCompanyDetail(company);

		const personas = getPersonas();
		if (personas.length > 0) setPersonasDetail(personas);
	}, []);

	useEffect(() => {
		if (companyDetail.id) setCompany(companyDetail);
		else
			setCompany({
				description: "",
				id: generateId(),
				keywords: [],
				name: "",
				postsPerWeek: 3,
				subreddits: [],
				website: "",
			});
	}, [companyDetail]);

	useEffect(() => {
		if (personasDetail.length > 0) setPersonas(personasDetail);
	}, [personasDetail]);

	return (
		<div className="mx-auto w-full max-w-6xl space-y-8 p-8">
			<div className="border-4 border-black p-8">
				<h1 className="mb-2 font-mono text-4xl font-bold">
					REDDIT MASTERMIND
				</h1>

				<p className="font-mono text-lg">
					Configure your company and personas to generate a content
					calendar
				</p>
			</div>

			<Tabs defaultValue="company" className="w-full">
				<TabsList className="grid w-full grid-cols-3 border-2 border-black">
					<TabsTrigger value="company">Company</TabsTrigger>

					<TabsTrigger value="personas">Personas</TabsTrigger>
				</TabsList>

				<TabsContent value="company">
					<Card className="rounded-none border-4 border-black">
						<CardHeader>
							<CardTitle className="font-mono text-2xl">
								Company Details
							</CardTitle>

							<CardDescription>
								Configure your company details to generate a
								content calendar
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							<div>
								<label className="mb-2 block font-mono font-bold">
									Company Name
								</label>

								<Input
									className="rounded-none border-2 border-black font-mono"
									onChange={(e) =>
										handleCompanyChange(
											"name",
											e.target.value,
										)
									}
									value={companyDetail.name || ""}
								/>
							</div>

							<div>
								<label className="mb-2 block font-mono font-bold">
									Website
								</label>

								<Input
									className="rounded-none border-2 border-black font-mono"
									onChange={(e) =>
										handleCompanyChange(
											"website",
											e.target.value,
										)
									}
									value={companyDetail.website || ""}
								/>
							</div>

							<div>
								<label className="mb-2 block font-mono font-bold">
									Description
								</label>

								<textarea
									className="w-full rounded-none border-2 border-black p-3 font-mono"
									onChange={(e) =>
										handleCompanyChange(
											"description",
											e.target.value,
										)
									}
									rows={4}
									value={companyDetail.description || ""}
								/>
							</div>

							<div>
								<label className="mb-2 block font-mono font-bold">
									Keywords (comma-separated)
								</label>

								<Input
									className="rounded-none border-2 border-black font-mono"
									onChange={(e) =>
										handleCompanyChange(
											"keywords",
											e.target.value
												.split(",")
												.map(
													(k) =>
														({
															id: generateId(),
															text: k.trim(),
														}) as keyword,
												)
												.filter(
													(k) => k.text.length > 0,
												),
										)
									}
									value={
										companyDetail.keywords
											?.map((k) => k.text)
											.join(", ") || ""
									}
								/>
							</div>

							<div>
								<label className="mb-2 block font-mono font-bold">
									Subreddits (comma-separated)
								</label>

								<Input
									className="rounded-none border-2 border-black font-mono"
									onChange={(e) =>
										handleCompanyChange(
											"subreddits",
											e.target.value
												.split(",")
												.map(
													(sr) =>
														({
															id: generateId(),
															name: sr.trim(),
														}) as Subreddit,
												)
												.filter(Boolean),
										)
									}
									value={
										companyDetail.subreddits
											?.map((sr) => sr.name)
											.join(", ") || ""
									}
								/>
							</div>

							<div>
								<label className="mb-2 block font-mono font-bold">
									Posts Per Week
								</label>

								<Input
									className="rounded-none border-2 border-black font-mono"
									max="10"
									min="1"
									onChange={(e) =>
										handleCompanyChange(
											"postsPerWeek",
											e.target.valueAsNumber,
										)
									}
									type="number"
									value={companyDetail.postsPerWeek || 3}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="personas">
					<Card className="rounded-none border-4 border-black">
						<CardHeader>
							<CardTitle className="font-mono text-2xl">
								Reddit Personas
							</CardTitle>

							<CardDescription>
								Configure your personas to generate a content
								calendar
							</CardDescription>
						</CardHeader>

						<CardContent className="space-y-6">
							{personasDetail.map((persona, i) => (
								<div
									className="space-y-4 border-2 border-black p-4"
									key={i}
								>
									<div className="flex items-start justify-between">
										<div className="flex-1 space-y-4">
											<div>
												<label className="mb-2 block font-mono font-bold">
													Username
												</label>

												<Input
													className="rounded-none border-2 border-black font-mono"
													onChange={(e) =>
														handleUpdatePersona(
															"username",
															i,
															e.target.value,
														)
													}
													value={persona.username}
												/>
											</div>

											<div>
												<label className="mb-2 block font-mono font-bold">
													Background
												</label>

												<textarea
													className="w-full rounded-none border-2 border-black p-3 font-mono text-sm"
													onChange={(e) =>
														handleUpdatePersona(
															"info",
															i,
															e.target.value,
														)
													}
													rows={3}
													value={persona.info}
												/>
											</div>
										</div>

										<Button
											className="ml-4 rounded-none border-2 border-black bg-red-500 font-mono font-bold text-white hover:bg-red-600"
											onClick={() =>
												handleDeletePersona(i)
											}
											variant="destructive"
										>
											Delete
										</Button>
									</div>
								</div>
							))}

							<Button
								className="h-12 w-full rounded-none border-4 border-black bg-transparent font-mono font-bold"
								onClick={handleAddPersona}
								variant="outline"
							>
								+ Add Persona
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};
