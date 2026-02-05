import type { INestApplication } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import request from 'supertest'
import type { App } from 'supertest/types'
import { AppModule } from './../src/app.module'
import { ConfigModule } from '@nestjs/config'
import { mockedConfigService } from './helpers'

describe('AppController (e2e)', () => {
	let app: INestApplication<App>

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(ConfigModule)
			.useValue(mockedConfigService)
			.compile()

		app = moduleFixture.createNestApplication()
		await app.init()
	})

	it('GET /healthcheck', () => {
		return request(app.getHttpServer()).get('/healthcheck').expect(204)
	})
})
