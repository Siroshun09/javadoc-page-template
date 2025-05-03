import { useEffect, useState } from "react";
import type { Project } from "../data/project";
import type { VersionListFile } from "../data/version";

interface ProjectDataState {
	project: Project | null;
	versions: string[];
	loading: boolean;
	error: string | null;
}

export function useProjectData(): ProjectDataState {
	const [project, setProject] = useState<Project | null>(null);
	const [versions, setVersions] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		Promise.all([
			fetch("/project.json")
				.then((response) => {
					if (!response.ok) {
						throw new Error(
							`Failed to load project.json: ${response.status} ${response.statusText}`,
						);
					}
					return response.json();
				})
				.then((data) => {
					setProject(data as Project);
				}),
			fetch("/versions.json")
				.then((response) => {
					if (!response.ok) {
						throw new Error(
							`Failed to load versions.json: ${response.status} ${response.statusText}`,
						);
					}
					return response.json();
				})
				.then((data) => {
					const versionData = data as VersionListFile;
					setVersions(versionData.versions);
				}),
		])
			.then(() => {
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error loading data:", err);
				setError(err.message);
				setLoading(false);
			});
	}, []);

	return { project, versions, loading, error };
}
