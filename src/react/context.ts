import { createContext } from "react";
import type { BaseTokens, ThemeContextValue } from "../core/types";

export const ThemeContext = createContext<ThemeContextValue<BaseTokens> | null>(
	null,
);
