import type { Project } from "../data/project";

interface ProjectHeaderProps {
	project: Project;
}

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
	return (
		<div>
			<title>{`${project.name} Javadoc`}</title>
			<h1>{project.name}</h1>
			<p>{project.description}</p>
			{project.github && (
				<p>
					<a href={project.github} target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
				</p>
			)}
		</div>
	);
};
