"use client";

import { CalendarView } from "@/components/calendar-view";
import { SettingsDashboard } from "@/components/settings-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestingInterface } from "@/components/testing-interface";
import { useState } from "react";
import type { Post } from "@/lib/types";

export default function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const [posts, setPosts] = useState<Post[]>([]);

	const handleGenerateCalendar = async () => {
		setIsLoading(true);

		try {
			const weekStartDate = new Date();
			weekStartDate.setDate(
				weekStartDate.getDate() - weekStartDate.getDay() + 1,
			);

			const response = await fetch("/api/generate-calendar", {
				body: JSON.stringify({
					companyId: "slideforge-test",
					weekStartDate: weekStartDate.toISOString(),
				}),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});

			if (response.ok) {
				const data = await response.json();
				setPosts(data.posts);
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="min-h-screen bg-background">
			<Tabs className="w-full" defaultValue="settings">
				<div className="border-b-4 border-black bg-muted sticky top-0 z-50">
					<div className="max-w-6xl mx-auto px-8">
						<TabsList className="border-b-4 border-black bg-transparent rounded-none grid w-full grid-cols-3 justify-start">
							<TabsTrigger
								className="rounded-none border-r-4 border-black font-mono font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								value="settings"
							>
								Settings
							</TabsTrigger>

							<TabsTrigger
								className="rounded-none border-r-4 border-black font-mono font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								value="calendar"
							>
								Calendar
							</TabsTrigger>

							<TabsTrigger
								className="rounded-none font-mono font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								value="testing"
							>
								Testing
							</TabsTrigger>
						</TabsList>
					</div>
				</div>

				<TabsContent value="settings">
					<SettingsDashboard />
				</TabsContent>

				<TabsContent value="calendar">
					<CalendarView
						isLoading={isLoading}
						onGenerate={handleGenerateCalendar}
						posts={posts}
					/>
				</TabsContent>

				<TabsContent value="testing">
					<TestingInterface />
				</TabsContent>
			</Tabs>
		</main>
	);
}
