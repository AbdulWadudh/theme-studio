import { defaultPresets, ThemeProvider, ThemeScript } from "@k79/theme-studio";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeScript />
		<ThemeProvider
			themes={defaultPresets}
			defaultTheme="dark-slate"
			studio={{
				enabled: true,
				position: "bottom-right",
			}}
		>
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);
