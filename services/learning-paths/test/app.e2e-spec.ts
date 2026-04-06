import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

process.env.HOSTNAME ??= 'localhost';
process.env.PROTO_DIR ??= '/tmp';
process.env.DB_HOST ??= 'localhost';
process.env.DB_NAME ??= 'learning_paths';
process.env.DB_USER ??= 'postgres';
process.env.DB_PASSWORD ??= 'postgres';

import { AppModule } from '../src/app.module';

describe('App bootstrap (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	it('initializes Nest application', () => {
		expect(app).toBeDefined();
	});
});
