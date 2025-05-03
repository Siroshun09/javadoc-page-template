import { useEffect, useState } from "react";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Footer } from "./components/Footer";
import { NoDataMessage } from "./components/NoDataMessage";
import { ProjectHeader } from "./components/ProjectHeader";
import { VersionList } from "./components/VersionList";
import { useProjectData } from "./hooks/useProjectData";

export function App() {
	const { project, versions, loading, error } = useProjectData();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!loading && project) {
			// Set visible to true after loading is complete
			const timer = setTimeout(() => {
				setVisible(true);
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [loading, project]);

	if (loading) {
		return null; // Show nothing during loading
	}

	if (error) {
		return <ErrorDisplay error={error} />;
	}

	if (!project) {
		return <NoDataMessage />;
	}

	return (
		<>
			<div className={`app-container ${visible ? "fade-in" : ""}`}>
				<ProjectHeader project={project} />
				<VersionList versions={versions} project={project} />
			</div>
			<Footer />
		</>
	);
}
