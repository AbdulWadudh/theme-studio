"use client";

import "@orshot/colorshot/styles.css";
import { ColorField } from "@orshot/colorshot/react";

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

export function ColorPickerField({
	value,
	onChange,
	onChangeComplete,
	size = "md",
	title = "Choose color or gradient",
	className = "",
}: ColorPickerFieldProps) {
	const triggerSize = size === "sm" ? "w-5 h-5" : "w-7 h-7";

	return (
		<ColorField
			value={value || "#38BDF8"}
			onChange={onChange}
			onChangeComplete={onChangeComplete || onChange}
			modes={["solid", "linear", "radial", "conic"]}
			alpha={true}
			eyeDropper={true}
			swatchSearch={true}
			gradientPresets={true}
			className="!inline-flex !items-center !justify-center !p-0 !min-w-0 !border-0 !bg-transparent !shadow-none !h-auto cursor-pointer"
			swatches={[
				{ id: "gradients", label: "Gradients", colors: "default" },
				{ id: "brand", label: "Brand", colors: BRAND_PALETTE },
				{ id: "recent", label: "Recent", recent: true },
			]}
			renderTrigger={({ value: currVal }) => (
				<span
					className={`inline-block ${triggerSize} rounded-md border border-border/80 shrink-0 shadow-xs transition-transform hover:scale-105 ${className}`}
					style={{ background: currVal || value || "#38BDF8" }}
					title={title}
				/>
			)}
		/>
	);
}

export default ColorPickerField;
