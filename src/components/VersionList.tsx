interface VersionListProps {
	versions: string[];
	project: {
		github: string;
	};
}

export const VersionList = ({ versions, project }: VersionListProps) => {
	if (versions.length === 0) {
		return null;
	}

	return (
		<div>
			<h2>Versions</h2>
			<table className="version-table">
				<thead>
					<tr>
						<th>Version</th>
						<th>Release Note</th>
						<th>Javadoc</th>
					</tr>
				</thead>
				<tbody>
					{versions.map((version) => (
						<tr key={version}>
							<td>{version}</td>
							<td>
								<a
									href={`${project.github}/releases/tag/${version}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									GitHub ↗
								</a>
							</td>
							<td>
								<a href={`/${version}/index.html`}>Javadoc ↗</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
