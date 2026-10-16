"use client";

import type React from "react";
import type { ThemeStudioConfig } from "../core/types";
import { SwatchIcon } from "./icons";
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
				width: "48px",
				height: "48px",
				borderRadius: "50%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "var(--card)",
				borderColor: "var(--border)",
				borderWidth: "1px",
				borderStyle: "solid",
				color: "var(--primary)",
				boxShadow:
					"0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
				cursor: "pointer",
				backdropFilter: "blur(12px)",
				WebkitBackdropFilter: "blur(12px)",
				transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
			}}
			className={config?.className}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = "scale(1.08) translateY(-2px)";
				e.currentTarget.style.boxShadow =
					"0 14px 28px -4px rgba(0, 0, 0, 0.5), 0 10px 12px -5px rgba(0, 0, 0, 0.4)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = "scale(1) translateY(0px)";
				e.currentTarget.style.boxShadow =
					"0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)";
			}}
		>
			<SwatchIcon width={22} height={22} style={{ color: "var(--primary)" }} />
		</button>
	);
}
