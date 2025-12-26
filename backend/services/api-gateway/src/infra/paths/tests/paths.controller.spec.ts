import { Test, type TestingModule } from '@nestjs/testing'
import { PathsController } from '../paths.controller'

describe('PathsController', () => {
	let controller: PathsController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PathsController],
		}).compile()

		controller = module.get<PathsController>(PathsController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
