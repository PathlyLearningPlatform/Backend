import { Client } from 'pg'

export async function clearLearningPathsServiceDb() {
	const client = new Client({
		host: 'learning-paths-db',
		user: 'admin',
		password: 'admin',
		database: 'learning-paths',
		ssl: false,
	})

	await client.connect()

	await client.query(`
		TRUNCATE TABLE learning_paths CASCADE;
	`)

	await client.end()
}
