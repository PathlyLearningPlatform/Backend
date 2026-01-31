import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { UnitsModule } from '@/infra/units/units.module'
import { INestApplication } from '@nestjs/common'

describe('Units', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [UnitsModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()
	})
})
