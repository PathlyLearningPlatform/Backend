import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { LearningPathsModule } from '@/infra/learning-paths/learning-paths.module'
import { INestApplication } from '@nestjs/common'

describe('LearningPaths', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [LearningPathsModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()
	})
})
