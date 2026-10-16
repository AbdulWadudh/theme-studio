import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";

interface ChangelogMeta {
	filePath: string;
	relativePath: string;
	title: string;
	date: string;
	scope: string;
	version?: string;
	bullets: string[];
	whatChangedRaw: string;
}

function walkDir(dir: string): string[] {
	let results: string[] = [];
	if (!fs.existsSync(dir)) return results;
	const list = fs.readdirSync(dir);
	for (const file of list) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		if (stat?.isDirectory()) {
			results = results.concat(walkDir(fullPath));
		} else if (file.endsWith(".md")) {
			results.push(fullPath);
		}
	}
	return results;
}

function parseChangelog(filePath: string): ChangelogMeta {
	const content = fs.readFileSync(filePath, "utf8");
	const titleMatch = content.match(/^#\s+(.+)$/m);
	const title = titleMatch
		? titleMatch[1].trim()
		: path.basename(filePath, ".md");

	const dateMatch = content.match(/\*\*Date:\*\*\s*([^\n\r]+)/);
	const date = dateMatch ? dateMatch[1].trim() : "";

	const scopeMatch = content.match(/\*\*Scope:\*\*\s*([^\n\r]+)/);
	const scope = scopeMatch ? scopeMatch[1].trim() : "";

	const versionMatch = content.match(/\*\*Version:\*\*\s*([^\n\r]+)/);
	const version = versionMatch ? versionMatch[1].trim() : undefined;

	const whatChangedMatch = content.match(/## What changed([\s\S]*?)(?=##|$)/);
	const whatChangedRaw = whatChangedMatch ? whatChangedMatch[1].trim() : "";
	const bullets = whatChangedRaw
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l.startsWith("-") || l.startsWith("*"))
		.map((l) => l.replace(/^[-*]\s*/, ""));

	const relativePath = path
		.relative(process.cwd(), filePath)
		.replace(/\\/g, "/");

	return {
		filePath,
		relativePath,
		title,
		date,
		scope,
		version,
		bullets,
		whatChangedRaw,
	};
}

function getCurrentBranch(): string {
	try {
		return (
			execSync("git branch --show-current", { stdio: "pipe" })
				.toString()
				.trim() || "main"
		);
	} catch {
		return "main";
	}
}

async function main() {
	const pkgPath = path.resolve("package.json");
	const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
	const currentVersion: string = pkg.version;
	const currentBranch = getCurrentBranch();

	p.intro(
		pc.cyan(
			`🚀 Theme Studio All-In-One Release Pipeline (Current: v${currentVersion} on ${currentBranch})`,
		),
	);

	// 1. Scan changelog directory
	const changelogDir = path.resolve("changelog");
	const changelogFiles = walkDir(changelogDir);
	const parsedLogs = changelogFiles.map(parseChangelog);

	// Find unreleased logs
	const unreleasedLogs = parsedLogs.filter(
		(l) => !l.version || l.version.toLowerCase().includes("unreleased"),
	);

	let selectedLogs: ChangelogMeta[] = [];

	if (unreleasedLogs.length === 1) {
		selectedLogs = [unreleasedLogs[0]];
		p.log.info(
			`Found unreleased changelog: ${pc.bold(selectedLogs[0].relativePath)}`,
		);
	} else if (unreleasedLogs.length > 1) {
		const choices = await p.multiselect({
			message: "Select unreleased changelog entries for this release:",
			options: unreleasedLogs.map((l) => ({
				value: l.filePath,
				label: l.title,
				hint: `${l.relativePath} (${l.date})`,
			})),
		});
		if (p.isCancel(choices)) {
			p.cancel("Release cancelled.");
			process.exit(0);
		}
		selectedLogs = parsedLogs.filter((l) =>
			(choices as string[]).includes(l.filePath),
		);
	} else {
		p.log.warn(pc.yellow("No unreleased changelog entry found in changelog/"));
		const createNow = await p.confirm({
			message: "Would you like to draft a new changelog entry now?",
			initialValue: true,
		});

		if (p.isCancel(createNow) || !createNow) {
			p.cancel("Release cancelled. Create a changelog entry before releasing.");
			process.exit(0);
		}

		const title = await p.text({
			message: "Changelog Short Title:",
			placeholder: "Fix Neobrutalism tactile button physics",
			validate: (v) => (!v?.trim() ? "Title is required" : undefined),
		});
		if (p.isCancel(title)) process.exit(0);

		const scope = await p.text({
			message: "Scope (e.g. core, react, tailwind, cli):",
			placeholder: "packages/theme-studio, react",
			initialValue: "packages/theme-studio",
		});
		if (p.isCancel(scope)) process.exit(0);

		const changes = await p.text({
			message: "What changed (bullet summary):",
			placeholder:
				"Fixed dynamic tactile toggle state sync; Corrected radius inheritance",
			validate: (v) => (!v?.trim() ? "Summary is required" : undefined),
		});
		if (p.isCancel(changes)) process.exit(0);

		const now = new Date();
		const yyyy = now.getFullYear();
		const mm = String(now.getMonth() + 1).padStart(2, "0");
		const dd = String(now.getDate()).padStart(2, "0");
		const dateStr = `${yyyy}-${mm}-${dd}`;
		const slug = title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		const targetDir = path.resolve(`changelog/${yyyy}/${mm}`);
		fs.mkdirSync(targetDir, { recursive: true });
		const targetFile = path.join(targetDir, `${dateStr}-${slug}.md`);

		const bulletList = changes
			.split(";")
			.map((c) => `- ${c.trim()}`)
			.join("\n");

		const draftContent = `# ${title}

**Date:** ${dateStr}
**Scope:** ${scope}

## What changed
${bulletList}

## Why
-

## Evidence
-

## Follow-ups
-
`;
		fs.writeFileSync(targetFile, draftContent, "utf8");
		p.log.success(`Created ${path.relative(process.cwd(), targetFile)}`);

		const newMeta = parseChangelog(targetFile);
		selectedLogs = [newMeta];
	}

	if (selectedLogs.length === 0) {
		p.cancel("No changelogs selected for release.");
		process.exit(1);
	}

	// 2. Display summary extracted directly from changelog
	p.log.step(pc.bold("Changelog Summary for Release:"));
	for (const log of selectedLogs) {
		console.log(`  ${pc.cyan("Title:")} ${log.title}`);
		if (log.scope) console.log(`  ${pc.dim("Scope:")} ${log.scope}`);
		console.log(`  ${pc.dim("Changes:")}`);
		for (const bullet of log.bullets) {
			console.log(`    • ${bullet}`);
		}
	}

	// 3. Choose version bump
	const bumpType = await p.select({
		message: "Select release version bump:",
		options: [
			{
				value: "patch",
				label: "Patch (bug fixes, small refinements)",
				hint: "e.g. 1.0.0 -> 1.0.1",
			},
			{
				value: "minor",
				label: "Minor (new features, backward-compatible)",
				hint: "e.g. 1.0.0 -> 1.1.0",
			},
			{
				value: "major",
				label: "Major (breaking changes)",
				hint: "e.g. 1.0.0 -> 2.0.0",
			},
		],
	});

	if (p.isCancel(bumpType)) {
		p.cancel("Release cancelled.");
		process.exit(0);
	}

	const parts = currentVersion.split(".").map(Number);
	let nextVersion = currentVersion;
	if (bumpType === "patch")
		nextVersion = `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
	if (bumpType === "minor") nextVersion = `${parts[0]}.${parts[1] + 1}.0`;
	if (bumpType === "major") nextVersion = `${parts[0] + 1}.0.0`;

	// 4. Run verification checks
	const s = p.spinner();
	s.start("Running lint, test suite, and bundle verification...");
	try {
		execSync("bun run lint", { stdio: "pipe" });
		execSync("bun test", { stdio: "pipe" });
		execSync("bun run build", { stdio: "pipe" });
		s.stop(pc.green("✔ All verification checks passed"));
	} catch (err: unknown) {
		s.stop(pc.red("❌ Verification failed. Aborting release."));
		const errorObj = err as {
			stdout?: Buffer;
			stderr?: Buffer;
			message?: string;
		};
		console.error(
			errorObj.stdout?.toString() ||
				errorObj.stderr?.toString() ||
				errorObj.message,
		);
		process.exit(1);
	}

	// 5. Update package.json version
	pkg.version = nextVersion;
	fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, "\t")}\n`);

	// 6. Update Version field in the changelog file(s)
	const now = new Date();
	const yyyy = now.getFullYear();
	const mm = String(now.getMonth() + 1).padStart(2, "0");
	const dd = String(now.getDate()).padStart(2, "0");
	const releaseDateStr = `${yyyy}-${mm}-${dd}`;

	for (const log of selectedLogs) {
		let content = fs.readFileSync(log.filePath, "utf8");
		if (content.includes("**Version:**")) {
			content = content.replace(
				/\*\*Version:\*\*[^\r\n]+/,
				`**Version:** v${nextVersion}`,
			);
		} else {
			content = content.replace(
				/(\*\*Date:\*\*[^\r\n]+)/,
				`$1\n**Version:** v${nextVersion}`,
			);
		}
		fs.writeFileSync(log.filePath, content, "utf8");
	}

	// 7. Update root CHANGELOG.md directly with changelog contents
	const rootChangelogPath = path.resolve("CHANGELOG.md");
	let rootChangelog = "";
	if (fs.existsSync(rootChangelogPath)) {
		rootChangelog = fs.readFileSync(rootChangelogPath, "utf8");
	}

	let releaseEntry = `## [${nextVersion}] - ${releaseDateStr}\n\n`;
	for (const log of selectedLogs) {
		const scopeLabel = log.scope ? ` (${log.scope})` : "";
		releaseEntry += `### ${log.title}${scopeLabel}\n`;
		for (const bullet of log.bullets) {
			releaseEntry += `- ${bullet}\n`;
		}
		releaseEntry += "\n";
	}

	const marker = "## [";
	if (rootChangelog.includes(marker)) {
		const idx = rootChangelog.indexOf(marker);
		rootChangelog = `${rootChangelog.slice(0, idx)}${releaseEntry.trim()}\n\n${rootChangelog.slice(idx)}`;
	} else {
		rootChangelog += `\n${releaseEntry}`;
	}
	fs.writeFileSync(rootChangelogPath, rootChangelog, "utf8");

	// 8. Automated Git Commit, Tag, and Push
	const primaryTitle = selectedLogs[0].title;
	const gitSpinner = p.spinner();
	gitSpinner.start(
		`Committing, tagging v${nextVersion}, and pushing to GitHub...`,
	);

	try {
		execSync("git add package.json CHANGELOG.md changelog/", { stdio: "pipe" });
		execSync(
			`git commit -m "chore(release): v${nextVersion} - ${primaryTitle}"`,
			{ stdio: "pipe" },
		);
		execSync(
			`git tag -a v${nextVersion} -m "Release v${nextVersion}: ${primaryTitle}"`,
			{ stdio: "pipe" },
		);
		execSync(`git push origin ${currentBranch} --tags`, { stdio: "pipe" });
		gitSpinner.stop(
			pc.green(
				`✔ Successfully committed, tagged v${nextVersion}, and pushed to GitHub!`,
			),
		);
	} catch (gitErr: unknown) {
		gitSpinner.stop(pc.red("❌ Git push failed."));
		const errorObj = gitErr as {
			stdout?: Buffer;
			stderr?: Buffer;
			message?: string;
		};
		console.error(
			errorObj.stdout?.toString() ||
				errorObj.stderr?.toString() ||
				errorObj.message,
		);
		p.log.warn(
			pc.yellow(
				`You can push manually when connected: git push origin ${currentBranch} --tags`,
			),
		);
	}

	p.outro(
		pc.green(
			`🚀 Complete! Release v${nextVersion} is dispatched.\n\n` +
				`GitHub Actions is now running automated tests, publishing @k79/theme-studio to NPM,\n` +
				`and generating the GitHub Release with your changelog notes!\n`,
		),
	);
}

main().catch(console.error);
