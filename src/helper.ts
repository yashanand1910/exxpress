export function getPiecesFromURL(URL: string): string[] {
	if (URL === '/' || !URL) {
		return [''];
	}
	return URL.split('/');
}
