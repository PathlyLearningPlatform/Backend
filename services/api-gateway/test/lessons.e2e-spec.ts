import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { LessonsModule } from '@/infra/lessons/lessons.module'
import { INestApplication } from '@nestjs/common'

describe('Lessons', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [LessonsModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()
	})
})
