import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { SectionsModule } from '@/sections/sections.module'
import { mockedConfigService } from './helpers'

describe('Sections', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [SectionsModule],
		})
			.overrideProvider(ConfigService)
			.useValue(mockedConfigService)
			.compile()

		app = moduleRef.createNestApplication()
		await app.init()
	})

	it('should be true', () => {
		expect(true).toBeTruthy()
	})
})
