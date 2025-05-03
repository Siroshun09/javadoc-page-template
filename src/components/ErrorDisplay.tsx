interface ErrorDisplayProps {
	error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
	return <div className="error-display">Error: {error}</div>;
};
