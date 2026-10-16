import { ThemeProvider, ThemeScript } from "@k79/theme-studio";
import {
	defaultPresets,
	getSsrThemeState,
	parseThemeCookie,
	ZenithThemeStyle,
} from "@k79/theme-studio/server";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Next.js + @k79/theme-studio Showcase",
	description:
		"Enterprise zero-flash theme engine with floating Theme Studio launcher",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const rawCookie = cookieStore.get("k79_theme_state")?.value;

	// 1. Resolve SSR theme state safely on the server
	const cookiePayload = parseThemeCookie(rawCookie);
	const ssrState = getSsrThemeState(cookiePayload, defaultPresets);

	return (
		<html
			lang="en"
			className={ssrState.resolvedMode}
			data-tactile={
				ssrState.activeTokens.tactile === "true" ? "true" : undefined
			}
			suppressHydrationWarning
		>
			<head>
				{/* 2. Zero-flash CSS Custom Properties injection */}
				<ZenithThemeStyle themeState={ssrState} />
				{/* 3. Pre-hydration client script */}
				<ThemeScript />
			</head>
			<body>
				{/* 4. ThemeProvider with built-in floating studio launcher */}
				<ThemeProvider
					themes={defaultPresets}
					studio={{
						enabled: true,
						position: "bottom-right",
						offset: { x: 24, y: 24 },
					}}
					initialState={{
						themeId: ssrState.themeId,
						mode: ssrState.mode,
						resolvedMode: ssrState.resolvedMode,
						delta: ssrState.delta,
					}}
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
