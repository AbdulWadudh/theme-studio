import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";

async function main() {
	const pkgPath = path.resolve("package.json");
	const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
	const currentVersion: string = pkg.version;

	p.intro(
		pc.cyan(`🚀 Theme Studio Release Wizard (Current: v${currentVersion})`),
	);

	const bumpType = await p.select({
		message: "Select release bump type:",
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
				label: "Major (breaking API changes)",
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

	const releaseTitle = await p.text({
		message: "Short release title (kebab-case or summary):",
		placeholder: "tactile-physics-refactor",
		validate: (val) => (!val?.trim() ? "Title is required" : undefined),
	});

	if (p.isCancel(releaseTitle)) {
		p.cancel("Release cancelled.");
		process.exit(0);
	}

	const summaryNotes = await p.text({
		message: "Key change summary (for CHANGELOG.md):",
		placeholder:
			"Optimized in-memory font catalog search and project key scoping",
		validate: (val) => (!val?.trim() ? "Summary is required" : undefined),
	});

	if (p.isCancel(summaryNotes)) {
		p.cancel("Release cancelled.");
		process.exit(0);
	}

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

	// 1. Update package.json version
	pkg.version = nextVersion;
	fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, "\t")}\n`);

	// 2. Compute date and slug
	const now = new Date();
	const yyyy = now.getFullYear();
	const mm = String(now.getMonth() + 1).padStart(2, "0");
	const dd = String(now.getDate()).padStart(2, "0");
	const dateStr = `${yyyy}-${mm}-${dd}`;
	const slug = releaseTitle
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	// 3. Create long-form changelog directory record: changelog/<year>/<month>/<YYYY-MM-DD>-<short-title>.md
	const changelogDir = path.resolve(`changelog/${yyyy}/${mm}`);
	fs.mkdirSync(changelogDir, { recursive: true });
	const longFormFile = path.join(changelogDir, `${dateStr}-${slug}.md`);

	const longFormContent = `# ${releaseTitle}

**Date:** ${dateStr}
**Version:** v${nextVersion}
**Scope:** packages/theme-studio, cli

## What changed
- ${summaryNotes}

## Why
- 

## Evidence
- 

## Follow-ups
- 
`;

	if (!fs.existsSync(longFormFile)) {
		fs.writeFileSync(longFormFile, longFormContent, "utf8");
	}

	// 4. Update root CHANGELOG.md
	const rootChangelogPath = path.resolve("CHANGELOG.md");
	let rootChangelog = "";
	if (fs.existsSync(rootChangelogPath)) {
		rootChangelog = fs.readFileSync(rootChangelogPath, "utf8");
	}

	const newEntry = `
## [${nextVersion}] - ${dateStr}

### Added / Changed
- ${summaryNotes}
`;

	const marker = "## [";
	if (rootChangelog.includes(marker)) {
		const idx = rootChangelog.indexOf(marker);
		rootChangelog =
			rootChangelog.slice(0, idx) +
			newEntry.trim() +
			"\n\n" +
			rootChangelog.slice(idx);
	} else {
		rootChangelog += `\n${newEntry}`;
	}
	fs.writeFileSync(rootChangelogPath, rootChangelog, "utf8");

	// 5. Git Commit and Tag
	try {
		execSync("git add package.json CHANGELOG.md changelog/", {
			stdio: "inherit",
		});
		execSync(
			`git commit -m "chore(release): v${nextVersion} - ${releaseTitle}"`,
			{ stdio: "inherit" },
		);
		execSync(`git tag -a v${nextVersion} -m "Release v${nextVersion}"`, {
			stdio: "inherit",
		});
	} catch (gitErr: unknown) {
		p.cancel("Git commit or tagging failed.");
		console.error(gitErr);
		process.exit(1);
	}

	p.outro(
		pc.green(
			`🎉 Successfully bumped to v${nextVersion} and tagged v${nextVersion}!\n\n` +
				`To publish to NPM via GitHub Actions, push your branch and tags:\n` +
				pc.bold(pc.cyan(`  git push origin main --tags\n`)),
		),
	);
}

main().catch(console.error);
