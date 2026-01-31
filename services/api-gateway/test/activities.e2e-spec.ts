import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { ActivitiesModule } from '@/infra/activities/activities.module'
import { INestApplication } from '@nestjs/common'

describe('Activities', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [ActivitiesModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()
	})
})
