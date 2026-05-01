export function extractBearerToken(authorizationHeader: string): string | null {
	const parts = authorizationHeader.split(' ');

	const tokenType = parts[0];
	const token = parts[1];

	if (tokenType !== 'Bearer') {
		return null;
	}

	if (!token) {
		return null;
	}

	return token;
}
