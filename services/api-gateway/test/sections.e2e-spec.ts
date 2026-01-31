import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { SectionsModule } from '@/infra/sections/sections.module'
import { INestApplication } from '@nestjs/common'

describe('Sections', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [SectionsModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()
	})
})
