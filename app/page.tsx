"use client";

import { CalendarView } from "@/components/calendar-view";
import {
	getCompany,
	getPersonas,
	getPosts,
	setContentCalendar,
} from "@/lib/utils";
import { SettingsDashboard } from "@/components/settings-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import type { ContentCalendar, Post } from "@/lib/types";

const Home = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [posts, setPosts] = useState<Post[]>([]);

	const handleGenerateCalendar = async () => {
		setIsLoading(true);

		const company = getCompany();
		const personas = getPersonas();
		if (!company || !personas) {
			alert(
				"Please configure company and personas in the Profile tab first.",
			);
			setIsLoading(false);
			return;
		}

		try {
			if (!company.id || personas.length === 0) {
				alert(
					"Please ensure company and at least one persona are configured.",
				);
				setIsLoading(false);
				return;
			}

			const weekStartDate = new Date();
			weekStartDate.setDate(weekStartDate.getDate() + 1);
			weekStartDate.setHours(0, 0, 0, 0);

			const response = await fetch("/api/generate-calendar", {
				body: JSON.stringify({
					company,
					personas,
					weekStartDateISO: weekStartDate.toISOString(),
				}),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});

			if (response.ok) {
				const data = (await response.json()) as ContentCalendar;
				setContentCalendar(data);
				setPosts(data.posts);
				alert("Content calendar generated successfully.");
			} else {
				const errorData = await response.json();
				alert(errorData.error);
			}
		} catch (error) {
			alert((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const posts = getPosts();
		if (posts.length > 0) setPosts(posts);
	}, []);

	return (
		<main className="bg-background min-h-screen">
			<Tabs className="w-full" defaultValue="profile">
				<div className="bg-muted sticky top-0 z-50 border-b-4 border-black">
					<div className="mx-auto max-w-6xl px-8">
						<TabsList className="grid w-full grid-cols-3 justify-start rounded-none border-b-4 border-black bg-transparent">
							<TabsTrigger
								className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none border-r-4 border-black font-mono font-bold"
								value="profile"
							>
								Profile
							</TabsTrigger>

							<TabsTrigger
								className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none border-r-4 border-black font-mono font-bold"
								value="calendar"
							>
								Calendar
							</TabsTrigger>
						</TabsList>
					</div>
				</div>

				<TabsContent value="profile">
					<SettingsDashboard />
				</TabsContent>

				<TabsContent value="calendar">
					<CalendarView
						isLoading={isLoading}
						onGenerate={handleGenerateCalendar}
						posts={posts.sort(
							(a, b) =>
								new Date(a.timestamp).getTime() -
								new Date(b.timestamp).getTime(),
						)}
					/>
				</TabsContent>
			</Tabs>
		</main>
	);
};

export default Home;
