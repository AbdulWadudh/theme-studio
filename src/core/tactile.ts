/**
 * Neobrutalist tactile physics CSS rules
 * Provides 2px hover displacement and 4px active press click physics.
 * Excludes segmented tab switchers, drawer controls, and elements marked data-no-tactile.
 */
export const TACTILE_CSS_RULES = `
/* Tactile Neobrutalism on-hover and active physics */
.tactile-always-active,
[data-tactile="true"] .tactile-item,
[data-tactile="true"] button:not(:disabled):not([data-no-tactile]):not([data-no-tactile] *):not([data-segmented] *):not([role="tab"]):not([role="tablist"] *):not(.no-tactile):not(.theme-studio-drawer *):not([data-studio-drawer] *):not([data-colorshot-field]),
[data-tactile="true"] [role="button"]:not([data-no-tactile]):not([data-no-tactile] *):not([data-segmented] *):not([role="tab"]):not([role="tablist"] *):not(.no-tactile):not(.theme-studio-drawer *):not([data-studio-drawer] *):not([data-colorshot-field]) {
	box-shadow: 4px 4px 0px 0px #000000 !important;
	border-color: #000000 !important;
	border-width: 2px !important;
	transition:
		transform 120ms cubic-bezier(0.16, 1, 0.3, 1),
		box-shadow 120ms cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.tactile-always-active:hover,
[data-tactile="true"] .tactile-item:hover,
[data-tactile="true"] button:not(:disabled):not([data-no-tactile]):not([data-no-tactile] *):not([data-segmented] *):not([role="tab"]):not([role="tablist"] *):not(.no-tactile):not(.theme-studio-drawer *):not([data-studio-drawer] *):not([data-colorshot-field]):hover,
[data-tactile="true"] [role="button"]:not([data-no-tactile]):not([data-no-tactile] *):not([data-segmented] *):not([role="tab"]):not(.no-tactile):not(.theme-studio-drawer *):not([data-studio-drawer] *):not([data-colorshot-field]):hover {
	transform: translate(2px, 2px) !important;
	box-shadow: 2px 2px 0px 0px #000000 !important;
}

.tactile-always-active:active,
[data-tactile="true"] .tactile-item:active,
[data-tactile="true"] button:not(:disabled):not([data-no-tactile]):not([data-no-tactile] *):not([data-segmented] *):not([role="tab"]):not([role="tablist"] *):not(.no-tactile):not(.theme-studio-drawer *):not([data-studio-drawer] *):not([data-colorshot-field]):active,
[data-tactile="true"] [role="button"]:not([data-no-tactile]):not([data-no-tactile] *):not([data-segmented] *):not([role="tab"]):not(.no-tactile):not(.theme-studio-drawer *):not([data-studio-drawer] *):not([data-colorshot-field]):active {
	transform: translate(4px, 4px) !important;
	box-shadow: 0px 0px 0px 0px #000000 !important;
}

/* Explicit exemption for segmented tabs, drawer internals, and protected controls */
[data-no-tactile],
[data-no-tactile] *,
[data-segmented],
[data-segmented] *,
.no-tactile,
.theme-studio-drawer button {
	box-shadow: none !important;
	transform: none !important;
}
`;

export function generateTactileCss(): string {
	return TACTILE_CSS_RULES;
}
