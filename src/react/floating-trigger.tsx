"use client";

import { PaintBoardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";
import type { ThemeStudioConfig } from "../core/types";
import { useTheme } from "./use-theme";

interface FloatingStudioTriggerProps {
	config?: ThemeStudioConfig;
}

export function FloatingStudioTrigger({ config }: FloatingStudioTriggerProps) {
	const { openStudio, isStudioOpen } = useTheme();

	if (config?.enabled === false) return null;

	if (config?.renderTrigger) {
		return (
			<>{config.renderTrigger({ open: openStudio, isOpen: isStudioOpen })}</>
		);
	}

	const position = config?.position || "bottom-right";
	const zIndex = config?.zIndex ?? 9999;
	const offsetX = config?.offset?.x ?? 24;
	const offsetY = config?.offset?.y ?? 24;

	const stylePosition: React.CSSProperties = {
		position: "fixed",
		zIndex,
		bottom: position.startsWith("bottom") ? offsetY : undefined,
		top: position.startsWith("top") ? offsetY : undefined,
		right: position.endsWith("right") ? offsetX : undefined,
		left: position.endsWith("left") ? offsetX : undefined,
	};

	return (
		<button
			type="button"
			onClick={openStudio}
			aria-label={config?.triggerAriaLabel || "Open Theme Studio"}
			title="Theme Studio"
			style={{
				...stylePosition,
				width: "44px",
				height: "44px",
				borderRadius: "50%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "var(--surface, #111827)",
				borderColor: "var(--border, #1E293B)",
				borderWidth: "1px",
				borderStyle: "solid",
				color: "var(--primary, #38BDF8)",
				boxShadow:
					"0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
				cursor: "pointer",
				backdropFilter: "blur(12px)",
				WebkitBackdropFilter: "blur(12px)",
				transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
			}}
			className={`group ${config?.className || ""}`}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = "scale(1.1) translateY(-2px)";
				e.currentTarget.style.boxShadow =
					"0 14px 28px -4px rgba(0, 0, 0, 0.5), 0 10px 12px -5px rgba(0, 0, 0, 0.4)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = "scale(1) translateY(0px)";
				e.currentTarget.style.boxShadow =
					"0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)";
			}}
		>
			<HugeiconsIcon
				icon={PaintBoardIcon}
				size={20}
				className="text-primary transition-transform group-hover:rotate-12"
			/>
		</button>
	);
}
