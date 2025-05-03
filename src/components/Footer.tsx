export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="footer">
			<div className="footer-content">
				<p>
					© {currentYear}{" "}
					<a
						href="https://github.com/Siroshun09"
						target="_blank"
						rel="noopener noreferrer"
					>
						Siroshun
					</a>
					{" | "}
					This page is licensed under{" "}
					<a
						href="https://creativecommons.org/licenses/by-sa/4.0/"
						target="_blank"
						rel="noopener noreferrer"
					>
						CC BY-SA 4.0
					</a>
				</p>
			</div>
		</footer>
	);
}
