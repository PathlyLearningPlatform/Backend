import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { LearningPathsModule } from '../src/infra/learning-paths/learning-paths.module'
import { INestApplication } from '@nestjs/common'
import { learningPaths } from './helpers'

describe('LearningPaths', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [LearningPathsModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()
	})

	it('test', async () => {
		const test = await learningPaths.find()

		console.log(test)

		expect(true).toBeTruthy()
	})
})
