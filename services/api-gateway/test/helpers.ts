export const learningPaths = {
	async find() {
		const res = await fetch(
			`${process.env.LEARNING_PATHS_SERVICE_URL}/v1/learning-paths`,
		)

		const jsonBody = res.json()

		return {
			body: jsonBody,
			headers: res.headers,
			statusCode: res.status,
		}
	},
}
