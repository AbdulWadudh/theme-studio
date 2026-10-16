import { extractFontFamily, toFontsourceSlug } from "../core/fonts";
import { TACTILE_CSS_RULES } from "../core/tactile";
import { tokensToCssString } from "../core/tokens";
import type { BaseTokens } from "../core/types";
import type { SsrThemeState } from "./cookie";

export function ZenithThemeStyle<T extends BaseTokens = BaseTokens>({
	themeState,
	nonce,
}: {
	themeState: SsrThemeState<T>;
	nonce?: string;
}) {
	const tokenRules = tokensToCssString(themeState.activeTokens);
	const css = `:root,html,html.light,html.dark,[data-theme]{${tokenRules}}html,body{background-color:var(--canvas);color:var(--text-primary);font-family:var(--font-body,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif);}${TACTILE_CSS_RULES}`;

	const fontUrls: string[] = [];
	const headingFamily = extractFontFamily(themeState.activeTokens.fontHeading);
	const bodyFamily = extractFontFamily(themeState.activeTokens.fontBody);

	if (headingFamily) {
		const slug = toFontsourceSlug(headingFamily);
		fontUrls.push(
			`https://cdn.jsdelivr.net/fontsource/css/${slug}@latest/index.css`,
		);
	}
	if (bodyFamily && bodyFamily !== headingFamily) {
		const slug = toFontsourceSlug(bodyFamily);
		fontUrls.push(
			`https://cdn.jsdelivr.net/fontsource/css/${slug}@latest/index.css`,
		);
	}

	return (
		<>
			{fontUrls.length > 0 && (
				<link
					rel="preconnect"
					href="https://cdn.jsdelivr.net"
					crossOrigin="anonymous"
				/>
			)}
			{fontUrls.map((url) => (
				<link key={url} rel="stylesheet" href={url} nonce={nonce} />
			))}
			<style
				id="k79-theme-server"
				nonce={nonce}
				dangerouslySetInnerHTML={{ __html: css }}
			/>
		</>
	);
}
