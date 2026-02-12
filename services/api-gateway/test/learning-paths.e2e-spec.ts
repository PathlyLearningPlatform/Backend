import { randomUUID } from 'node:crypto'
import type { Server } from 'node:http'
import { VersioningType, type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import type {
	CreateLearningPathBodyDto,
	CreateLearningPathResponseDto,
	UpdateLearningPathResponseDto,
} from '@/learning-paths/dtos'
import type { CreateSectionResponseDto } from '@/sections/dtos'
import { LearningPathsModule } from '../src/learning-paths/learning-paths.module'
import {
	LearningPathsApi,
	SectionsApi,
	clearLearningPathsServiceDb,
	mockedConfigService,
} from './helpers'
import { SectionsModule } from '@/sections/sections.module'

describe('LearningPaths', () => {
	let app: INestApplication
	let httpServer: Server
	let learningPathsApi: LearningPathsApi
	let sectionsApi: SectionsApi
	let api: {
		learningPaths: LearningPathsApi
		sections: SectionsApi
	}

	beforeAll(async () => {
		await clearLearningPathsServiceDb()

		const moduleRef = await Test.createTestingModule({
			imports: [LearningPathsModule, SectionsModule],
		})
			.overrideProvider(ConfigService)
			.useValue(mockedConfigService)
			.compile()

		app = moduleRef.createNestApplication()
		httpServer = app.getHttpServer()
		app.enableVersioning({
			type: VersioningType.URI,
		})
		await app.init()

		learningPathsApi = new LearningPathsApi(httpServer)
		sectionsApi = new SectionsApi(httpServer)

		api = {
			learningPaths: learningPathsApi,
			sections: sectionsApi,
		}
	})

	describe('GET /learning-paths (find)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.learningPaths.create({
				name: 'learning-path',
			} as CreateLearningPathBodyDto)
			const createResBody = createRes.body as CreateLearningPathResponseDto

			// act
			const findRes = await api.learningPaths.find()

			// cleanup
			await api.learningPaths.remove(createResBody.path.id)

			// assert
			expect(findRes.statusCode).toBe(200)
			expect(findRes.body).toEqual({ paths: [createResBody.path] })
		})

		it('Bad request (400)', async () => {
			// act
			const findRes = await api.learningPaths.find({
				limit: 'badValue',
			} as any)

			// assert
			expect(findRes.statusCode).toBe(400)
		})
	})

	describe('GET /learning-paths/:id (findOne)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.learningPaths.create({
				name: 'learning-path',
			} as CreateLearningPathBodyDto)
			const createResBody = createRes.body as CreateLearningPathResponseDto

			// act
			const findOneRes = await api.learningPaths.findOne(createResBody.path.id)

			// cleanup
			await api.learningPaths.remove(createResBody.path.id)

			// assert
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ path: createResBody.path })
		})

		it('Bad request (400)', async () => {
			// act
			const findOneRes = await api.learningPaths.findOne('invalid id')

			// assert
			expect(findOneRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const findOneRes = await api.learningPaths.findOne(
				randomUUID() /* non-existent learning path id */,
			)

			// assert
			expect(findOneRes.statusCode).toBe(404)
		})
	})

	describe('POST /learning-paths (create)', () => {
		it('Created (201)', async () => {
			// act
			const createRes = await api.learningPaths.create({
				name: 'learning-path',
			} as CreateLearningPathBodyDto)
			const createResBody = createRes.body as CreateLearningPathResponseDto

			const findOneRes = await api.learningPaths.findOne(createResBody.path.id)

			// cleanup
			await api.learningPaths.remove(createResBody.path.id)

			// assert
			expect(createRes.statusCode).toBe(201)

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ path: createResBody.path })
		})

		it('Bad request (400)', async () => {
			// act
			const createRes = await api.learningPaths.create({} as any)

			// assert
			expect(createRes.statusCode).toBe(400)
		})
	})

	describe('PATCH /learning-paths/:id (update)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.learningPaths.create({
				name: 'learning-path',
			})
			const createResBody = createRes.body as CreateLearningPathResponseDto

			// act
			const updateRes = await api.learningPaths.update(createResBody.path.id, {
				name: 'updated-learning-path',
			})
			const updateResBody = updateRes.body as UpdateLearningPathResponseDto

			const findOneRes = await api.learningPaths.findOne(createResBody.path.id)

			// cleanup
			await api.learningPaths.remove(createResBody.path.id)

			// assert
			expect(updateRes.statusCode).toBe(200)
			expect(updateRes.body).toEqual({ path: updateResBody.path })

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ path: updateResBody.path })
		})

		it('Bad request (400)', async () => {
			// act
			const updateRes = await api.learningPaths.update('invalid id')

			// assert
			expect(updateRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const updateRes = await api.learningPaths.update(
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
			const createRes = await api.learningPaths.create({
				name: 'learning-path',
			})
			const createResBody = createRes.body as CreateLearningPathResponseDto

			// act
			const removeRes = await api.learningPaths.remove(createResBody.path.id)
			const findOneRes = await api.learningPaths.findOne(createResBody.path.id)

			// assert
			expect(removeRes.statusCode).toBe(200)

			expect(findOneRes.statusCode).toBe(404)
		})

		it('Bad request (400)', async () => {
			// act
			const removeRes = await api.learningPaths.remove('invalid id')

			// assert
			expect(removeRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const removeRes = await api.learningPaths.remove(
				randomUUID() /* non-existent learning path id */,
			)

			// assert
			expect(removeRes.statusCode).toBe(404)
		})

		it('Conflict (409)', async () => {
			// arrange
			const createRes = await api.learningPaths.create({
				name: 'learning-path',
			})
			const createResBody = createRes.body as CreateLearningPathResponseDto

			const createSectionRes = await api.sections.create({
				name: 'section',
				order: 0,
				learningPathId: createResBody.path.id,
			})
			const createSectionResBody =
				createSectionRes.body as CreateSectionResponseDto

			// act
			const removeRes = await api.learningPaths.remove(createResBody.path.id)
			const findOneRes = await api.learningPaths.findOne(createResBody.path.id)

			// cleanup
			await api.sections.remove(createSectionResBody.section.id)
			await api.learningPaths.remove(createResBody.path.id)

			// assert
			expect(removeRes.statusCode).toBe(409)
			expect(findOneRes.statusCode).toBe(200)
		})
	})
})
