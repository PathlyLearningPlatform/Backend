import { randomUUID } from 'node:crypto'
import type { Server } from 'node:http'
import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import type {
	CreateLearningPathBodyDto,
	CreateLearningPathResponseDto,
	UpdateLearningPathResponseDto,
} from '@/learning-paths/dtos'
import type { CreateSectionResponseDto } from '@/sections/dtos'
import { LearningPathsModule } from '../src/learning-paths/learning-paths.module'
import { learningPaths, mockedConfigService, sections } from './helpers'

describe('LearningPaths', () => {
	let app: INestApplication
	let httpServer: Server

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [LearningPathsModule],
		})
			.overrideProvider(ConfigService)
			.useValue(mockedConfigService)
			.compile()

		app = moduleRef.createNestApplication()
		httpServer = app.getHttpServer()
		await app.init()
	})

	describe('GET /learning-paths (find)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await learningPaths.create(httpServer, {
				name: 'learning-path',
			} as CreateLearningPathBodyDto)
			const createResBody = createRes.body as CreateLearningPathResponseDto

			// act
			const findRes = await learningPaths.find(httpServer)

			// cleanup
			await learningPaths.remove(httpServer, createResBody.path.id)

			// assert
			expect(findRes.statusCode).toBe(200)
			expect(findRes.body).toEqual({ paths: [createResBody.path] })
		})

		it('Bad request (400)', async () => {
			// act
			const findRes = await learningPaths.find(httpServer, {
				limit: 'badValue',
			} as any)

			// assert
			expect(findRes.statusCode).toBe(400)
		})
	})

	describe('GET /learning-paths/:id (findOne)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await learningPaths.create(httpServer, {
				name: 'learning-path',
			} as CreateLearningPathBodyDto)
			const createResBody = createRes.body as CreateLearningPathResponseDto

			// act
			const findOneRes = await learningPaths.findOne(
				httpServer,
				createResBody.path.id,
			)

			// cleanup
			await learningPaths.remove(httpServer, createResBody.path.id)

			// assert
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ path: createResBody.path })
		})

		it('Bad request (400)', async () => {
			// act
			const findOneRes = await learningPaths.findOne(httpServer, 'invalid id')

			// assert
			expect(findOneRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const findOneRes = await learningPaths.findOne(
				httpServer,
				randomUUID() /* non-existent learning path id */,
			)

			// assert
			expect(findOneRes.statusCode).toBe(404)
		})
	})

	describe('POST /learning-paths (create)', () => {
		it('Created (201)', async () => {
			// act
			const createRes = await learningPaths.create(httpServer, {
				name: 'learning-path',
			} as CreateLearningPathBodyDto)
			const createResBody = createRes.body as CreateLearningPathResponseDto

			const findOneRes = await learningPaths.findOne(
				httpServer,
				createResBody.path.id,
			)

			// cleanup
			await learningPaths.remove(httpServer, createResBody.path.id)

			// assert
			expect(createRes.statusCode).toBe(201)

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ path: createResBody.path })
		})

		it('Bad request (400)', async () => {
			// act
			const createRes = await learningPaths.create(httpServer, {} as any)

			// assert
			expect(createRes.statusCode).toBe(400)
		})
	})

	describe('PATCH /learning-paths/:id (update)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await learningPaths.create(httpServer, {
				name: 'learning-path',
			})
			const createResBody = createRes.body as CreateLearningPathResponseDto

			// act
			const updateRes = await learningPaths.update(
				httpServer,
				createResBody.path.id,
				{ name: 'updated-learning-path' },
			)
			const updateResBody = updateRes.body as UpdateLearningPathResponseDto

			const findOneRes = await learningPaths.findOne(
				httpServer,
				createResBody.path.id,
			)

			// cleanup
			await learningPaths.remove(httpServer, createResBody.path.id)

			// assert
			expect(updateRes.statusCode).toBe(200)
			expect(updateRes.body).toEqual({ path: updateResBody.path })

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ path: updateResBody.path })
		})

		it('Bad request (400)', async () => {
			// act
			const updateRes = await learningPaths.update(httpServer, 'invalid id')

			// assert
			expect(updateRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const updateRes = await learningPaths.update(
				httpServer,
				randomUUID() /* non-existent path id */,
				{ name: 'updated-learning-path' },
			)

			// assert
			expect(updateRes.statusCode).toBe(404)
		})
	})

	describe('DELETE /learning-paths/:id (remove)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await learningPaths.create(httpServer, {
				name: 'learning-path',
			})
			const createResBody = createRes.body as CreateLearningPathResponseDto

			// act
			const removeRes = await learningPaths.remove(
				httpServer,
				createResBody.path.id,
			)
			const findOneRes = await learningPaths.findOne(
				httpServer,
				createResBody.path.id,
			)

			// assert
			expect(removeRes.statusCode).toBe(200)

			expect(findOneRes.statusCode).toBe(404)
		})

		it('Bad request (400)', async () => {
			// act
			const removeRes = await learningPaths.remove(httpServer, 'invalid id')

			// assert
			expect(removeRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const removeRes = await learningPaths.remove(
				httpServer,
				randomUUID() /* non-existent learning path id */,
			)

			// assert
			expect(removeRes.statusCode).toBe(404)
		})

		it('Conflict (409)', async () => {
			// arrange
			const createRes = await learningPaths.create(httpServer, {
				name: 'learning-path',
			})
			const createResBody = createRes.body as CreateLearningPathResponseDto

			const createSectionRes = await sections.create(httpServer, {
				name: 'section',
				order: 0,
				learningPathId: createResBody.path.id,
			})
			const createSectionResBody =
				createSectionRes.body as CreateSectionResponseDto

			console.log(createSectionResBody)

			// act
			const removeRes = await learningPaths.remove(
				httpServer,
				createResBody.path.id,
			)
			const findOneRes = await learningPaths.findOne(
				httpServer,
				createResBody.path.id,
			)

			// cleanup
			await sections.remove(httpServer, createSectionResBody.section.id)
			await learningPaths.remove(httpServer, createResBody.path.id)

			// assert
			expect(removeRes.statusCode).toBe(409)
			expect(findOneRes.statusCode).toBe(200)
		})
	})
})
