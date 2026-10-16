import { useContext } from "react";
import type { BaseTokens, ThemeContextValue } from "../core/types";
import { ThemeContext } from "./context";

export function useTheme<
	T extends BaseTokens = BaseTokens,
>(): ThemeContextValue<T> {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error(
			"[zenith-theme] useTheme must be used within a <ThemeProvider />",
		);
	}
	return context as unknown as ThemeContextValue<T>;
}

export function useThemeTokens<T extends BaseTokens = BaseTokens>(): T {
	const { tokens } = useTheme<T>();
	return tokens;
}
