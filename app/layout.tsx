import "./globals.css";
import {
	DM_Sans as Font_DM_Sans,
	Source_Serif_4 as Font_Source_Serif_4,
	Space_Mono as Font_Space_Mono,
} from "next/font/google";
import type { Metadata } from "next";

const _dmSans = Font_DM_Sans({
	subsets: ["latin"],
	weight: [
		"100",
		"1000",
		"200",
		"300",
		"400",
		"500",
		"600",
		"700",
		"800",
		"900",
	],
});
const _sourceSerif_4 = Font_Source_Serif_4({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});
const _spaceMono = Font_Space_Mono({
	subsets: ["latin"],
	weight: ["400", "700"],
});

export const metadata: Metadata = {
	description: "Reddit content planner and scheduler.",
	icons: {
		apple: "/logo.svg",
		icon: [
			{ media: "(prefers-color-scheme: dark)", url: "/logo.svg" },
			{ media: "(prefers-color-scheme: light)", url: "/logo.svg" },
			{ type: "image/svg+xml", url: "/logo.svg" },
		],
	},
	title: "The Reddit Mastermind",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`font-sans antialiased`}>{children}</body>
		</html>
	);
}
