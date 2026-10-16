import fs from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";

const cwd = process.cwd();
const BACKUP_DIR = path.join(cwd, ".theme-studio", "backup");
const MANIFEST_PATH = path.join(BACKUP_DIR, "manifest.json");

export interface BackupManifest {
	createdAt: string;
	files: Record<string, string>;
}

function toPosixPath(filePath: string): string {
	return filePath.split(path.sep).join("/");
}

export function backupFile(targetFilePath: string): void {
	if (!fs.existsSync(targetFilePath)) return;
	fs.mkdirSync(BACKUP_DIR, { recursive: true });
	const rel = path.relative(cwd, targetFilePath);
	const safeName = rel.split(path.sep).join("__");
	const backupFilePath = path.join(BACKUP_DIR, safeName);
	fs.copyFileSync(targetFilePath, backupFilePath);
	let manifest: BackupManifest = {
		createdAt: new Date().toISOString(),
		files: {},
	};
	if (fs.existsSync(MANIFEST_PATH)) {
		try {
			manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
		} catch {}
	}
	const relKey = toPosixPath(rel);
	const relBackup = toPosixPath(path.relative(cwd, backupFilePath));
	manifest.files[relKey] = relBackup;
	fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
}

export async function runRevert(): Promise<void> {
	p.intro(pc.bgMagenta(pc.black(" Theme Studio Revert / Uninstall ")));
	if (!fs.existsSync(MANIFEST_PATH)) {
		p.cancel(
			"No Theme Studio backup manifest found at .theme-studio/backup/manifest.json",
		);
		return;
	}
	try {
		const manifest: BackupManifest = JSON.parse(
			fs.readFileSync(MANIFEST_PATH, "utf8"),
		);
		const entries = Object.entries(manifest.files);
		if (entries.length === 0) {
			p.cancel("Backup manifest is empty.");
			return;
		}
		const confirmed = await p.confirm({
			message: `Revert ${entries.length} file(s) to original state before Theme Studio was installed?`,
			initialValue: true,
		});
		if (!confirmed || p.isCancel(confirmed)) return;
		for (const [relKey, relBackup] of entries) {
			const origPath = path.resolve(cwd, relKey);
			const backupPath = path.resolve(cwd, relBackup);
			if (fs.existsSync(backupPath)) {
				fs.copyFileSync(backupPath, origPath);
				p.log.success(
					`Restored: ${pc.green(toPosixPath(path.relative(cwd, origPath)))}`,
				);
			}
		}
		fs.rmSync(path.join(cwd, ".theme-studio"), {
			recursive: true,
			force: true,
		});
		p.outro(pc.green("✔ Revert complete! All original files restored."));
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		p.cancel(`Failed to revert: ${msg}`);
	}
}
