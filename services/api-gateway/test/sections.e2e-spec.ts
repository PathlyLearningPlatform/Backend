import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { SectionsModule } from '@/sections/sections.module'
import { INestApplication } from '@nestjs/common'
import { mockedConfigService } from './helpers'
import { ConfigService } from '@nestjs/config'

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
