#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import semver from "semver";

// Check if running in GitHub Actions
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

// Read environment variables
const workingDir = process.env.VITE_WORKING_DIR || "work";
const javadocDir = process.env.VITE_JAVADOC_DIR;
const projectName = process.env.VITE_PROJECT_NAME;
const projectDescription = process.env.VITE_PROJECT_DESCRIPTION;
const projectGithub = process.env.VITE_PROJECT_GITHUB;

// Validate required environment variables
if (!javadocDir) {
	console.error("Error: VITE_JAVADOC_DIR environment variable is not set");
	process.exit(1);
}

// Create working directory if it doesn't exist
console.log(`Creating working directory: ${workingDir}`);
if (!fs.existsSync(workingDir)) {
	fs.mkdirSync(workingDir, { recursive: true });
}

// Get version directories from VITE_JAVADOC_DIR
console.log(`Getting version directories from: ${javadocDir}`);
let versionDirs;
try {
	versionDirs = fs
		.readdirSync(javadocDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)
		.filter((name) => semver.valid(name)); // Only include valid semver versions
} catch (error) {
	console.error(`Error reading javadoc directory: ${error.message}`);
	process.exit(1);
}

if (versionDirs.length === 0) {
	console.warn("Warning: No version directories found");
}

// Sort versions by semver (latest first)
versionDirs.sort((a, b) => semver.rcompare(a, b));
console.log(`Found versions: ${versionDirs.join(", ")}`);

// Create versions.json
const versionsJson = {
	versions: versionDirs,
};
const versionsJsonPath = path.join(workingDir, "versions.json");
console.log(`Creating versions.json at: ${versionsJsonPath}`);
fs.writeFileSync(versionsJsonPath, JSON.stringify(versionsJson, null, 2));

// Create project.json
const projectJson = {
	name: projectName || "No project name provided",
	description: projectDescription || "No description provided",
	github: projectGithub || "",
};
const projectJsonPath = path.join(workingDir, "project.json");
console.log(`Creating project.json at: ${projectJsonPath}`);
fs.writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, 2));

// Copy/move version directories to working directory
console.log(
	`${isGitHubActions ? "Moving" : "Copying"} version directories to: ${workingDir}`,
);

for (const version of versionDirs) {
	const sourceDir = path.join(javadocDir, version);
	const targetDir = path.join(workingDir, version);

	// Remove target directory if it exists
	if (fs.existsSync(targetDir)) {
		console.log(`Removing existing directory: ${targetDir}`);
		fs.rmSync(targetDir, { recursive: true, force: true });
	}

	if (isGitHubActions) {
		// Move directory in GitHub Actions
		console.log(`Moving ${sourceDir} to ${targetDir}`);
		fs.renameSync(sourceDir, targetDir);
	} else {
		// Copy directory otherwise
		console.log(`Copying ${sourceDir} to ${targetDir}`);
		fs.mkdirSync(targetDir, { recursive: true });
		execSync(`cp -R ${sourceDir}/* ${targetDir}`);
	}
}

// Copy the latest version to "latest" directory
if (versionDirs.length > 0) {
	const latestVersion = versionDirs[0]; // First version is the latest due to semver.rcompare sorting
	const latestSourceDir = path.join(workingDir, latestVersion);
	const latestTargetDir = path.join(workingDir, "latest");

	console.log(
		`Copying latest version (${latestVersion}) to "latest" directory`,
	);

	// Remove latest directory if it exists
	if (fs.existsSync(latestTargetDir)) {
		console.log(`Removing existing directory: ${latestTargetDir}`);
		fs.rmSync(latestTargetDir, { recursive: true, force: true });
	}

	// Copy the latest version to "latest" directory
	fs.mkdirSync(latestTargetDir, { recursive: true });
	execSync(`cp -R ${latestSourceDir}/* ${latestTargetDir}`);
}

console.log("Setup completed successfully");
