"use client";

import "@orshot/colorshot/styles.css";
import { ColorField } from "@orshot/colorshot/react";
import React, { Component, type ErrorInfo, type ReactNode, useEffect } from "react";

export interface ColorPickerFieldProps {
	value: string;
	onChange: (value: string) => void;
	onChangeComplete?: (value: string) => void;
	size?: "sm" | "md";
	title?: string;
	className?: string;
}

const BRAND_PALETTE = [
	"#38BDF8",
	"#818CF8",
	"#34D399",
	"#F43F5E",
	"#F59E0B",
	"#A855F7",
	"#EC4899",
	"#06B6D4",
	"#10B981",
	"#3B82F6",
	"#6366F1",
	"#FFFFFF",
	"#0B0F17",
];

const COLORSHOT_RESET_STYLE = `
button[data-colorshot-field],
[data-colorshot-field],
[data-colorshot-field]:not([data-theme="light"]),
[data-colorshot-field][data-theme="dark"],
[data-colorshot-field][data-theme="light"] {
	background: transparent !important;
	background-color: transparent !important;
	border: none !important;
	padding: 0 !important;
	margin: 0 !important;
	height: auto !important;
	min-height: 0 !important;
	width: auto !important;
	min-width: 0 !important;
	box-shadow: none !important;
	outline: none !important;
	display: inline-flex !important;
	align-items: center !important;
	justify-content: center !important;
	cursor: pointer !important;
}

[data-colorshot-field]:hover,
[data-colorshot-field]:focus,
[data-colorshot-field]:focus-visible,
[data-colorshot-field][data-state="open"] {
	background: transparent !important;
	background-color: transparent !important;
	border: none !important;
	outline: none !important;
	box-shadow: none !important;
}

[data-colorshot-field] [data-part="field-text"],
[data-colorshot-field] [data-part="field-alpha"],
[data-colorshot-field] [data-part="field-swatch"] {
	display: none !important;
}

body [data-colorshot-popover],
[data-colorshot-popover] {
	z-index: 999999 !important;
}
`;

class SafeColorPickerBoundary extends Component<
	{ children: ReactNode; fallback: ReactNode },
	{ hasError: boolean }
> {
	state = { hasError: false };
	static getDerivedStateFromError() {
		return { hasError: true };
	}
	componentDidCatch(_error: Error, _info: ErrorInfo) {}
	render() {
		if (this.state.hasError) return this.props.fallback;
		return this.props.children;
	}
}

export function ColorPickerField({
	value,
	onChange,
	onChangeComplete,
	size = "md",
	title = "Choose color or gradient",
	className = "",
}: ColorPickerFieldProps) {
	useEffect(() => {
		if (typeof document === "undefined") return;
		const id = "k79-theme-studio-colorshot-reset";
		if (!document.getElementById(id)) {
			const style = document.createElement("style");
			style.id = id;
			style.textContent = COLORSHOT_RESET_STYLE;
			document.head.appendChild(style);
		}
	}, []);

	const triggerSize = size === "sm" ? "w-5 h-5" : "w-7 h-7";
	const pxSize = size === "sm" ? "20px" : "28px";

	const fallbackInput = (
		<label
			className={`inline-block ${triggerSize} rounded-md border border-border/80 shrink-0 shadow-xs transition-transform hover:scale-105 cursor-pointer relative ${className}`}
			style={{
				width: pxSize,
				height: pxSize,
				borderRadius: "6px",
				background: value || "#38BDF8",
				display: "inline-block",
				flexShrink: 0,
				boxSizing: "border-box",
			}}
			title={title}
		>
			<input
				type="color"
				value={
					value && value.startsWith("#") && value.length === 7
						? value
						: "#38BDF8"
				}
				onChange={(e) => {
					onChange(e.target.value);
					if (onChangeComplete) onChangeComplete(e.target.value);
				}}
				style={{
					opacity: 0,
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					cursor: "pointer",
				}}
			/>
		</label>
	);

	return (
		<SafeColorPickerBoundary fallback={fallbackInput}>
			<ColorField
				value={value || "#38BDF8"}
				onChange={onChange}
				onChangeComplete={onChangeComplete || onChange}
				modes={["solid", "linear", "radial", "conic"]}
				alpha={true}
				eyeDropper={true}
				swatchSearch={true}
				gradientPresets={true}
				data-no-tactile="true"
				className="!inline-flex !items-center !justify-center !p-0 !min-w-0 !border-0 !bg-transparent !shadow-none !h-auto cursor-pointer"
				style={{
					background: "transparent",
					backgroundColor: "transparent",
					border: "none",
					padding: 0,
					margin: 0,
					height: "auto",
					minHeight: 0,
					minWidth: 0,
					boxShadow: "none",
					outline: "none",
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "pointer",
				}}
				swatches={[
					{ id: "gradients", label: "Gradients", colors: "default" },
					{ id: "brand", label: "Brand", colors: BRAND_PALETTE },
					{ id: "recent", label: "Recent", recent: true },
				]}
				renderTrigger={({ value: currVal }) => (
					<span
						className={`inline-block ${triggerSize} rounded-md border border-border/80 shrink-0 shadow-xs transition-transform hover:scale-105 ${className}`}
						style={{
							width: pxSize,
							height: pxSize,
							borderRadius: "6px",
							background: currVal || value || "#38BDF8",
							display: "inline-block",
							flexShrink: 0,
							boxSizing: "border-box",
						}}
						title={title}
					/>
				)}
			/>
		</SafeColorPickerBoundary>
	);
}

export default ColorPickerField;
