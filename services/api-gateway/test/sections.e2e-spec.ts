import { randomUUID } from 'node:crypto'
import type { Server } from 'node:http'
import { VersioningType, type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import type {
	CreateSectionResponseDto,
	UpdateSectionResponseDto,
} from '@/sections/dtos'
import { SectionsModule } from '../src/sections/sections.module'
import { UnitsModule } from '@/units/units.module'
import {
	LearningPathsApi,
	SectionsApi,
	UnitsApi,
	clearLearningPathsServiceDb,
	mockedConfigService,
} from './helpers'
import { CreateUnitResponseDto } from '@/units/dtos'
import {
	CreateLearningPathResponseDto,
	LearningPathResponseDto,
} from '@/learning-paths/dtos'
import { LearningPathsModule } from '@/learning-paths/learning-paths.module'

describe('Sections', () => {
	let app: INestApplication
	let httpServer: Server

	let learningPathsApi: LearningPathsApi
	let sectionsApi: SectionsApi
	let unitsApi: UnitsApi

	let api: {
		sections: SectionsApi
		units: UnitsApi
	}

	let learningPath: LearningPathResponseDto

	beforeAll(async () => {
		await clearLearningPathsServiceDb()

		const moduleRef = await Test.createTestingModule({
			imports: [SectionsModule, UnitsModule, LearningPathsModule],
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
		unitsApi = new UnitsApi(httpServer)

		api = {
			sections: sectionsApi,
			units: unitsApi,
		}

		const createResBody = (
			await learningPathsApi.create({
				name: 'learning-path',
			})
		).body as CreateLearningPathResponseDto

		learningPath = createResBody.path
	})

	afterAll(async () => {
		learningPathsApi.remove(learningPath.id)
	})

	describe('GET /sections (find)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.sections.create({
				name: 'section',
				order: 0,
				learningPathId: learningPath.id,
			})
			const createResBody = createRes.body as CreateSectionResponseDto

			// act
			const findRes = await api.sections.find()

			// cleanup
			await api.sections.remove(createResBody.section.id)

			// assert
			expect(findRes.statusCode).toBe(200)
			expect(findRes.body).toEqual({ sections: [createResBody.section] })
		})

		it('Bad request (400)', async () => {
			// act
			const findRes = await api.sections.find({
				limit: 'badValue',
			} as any)

			// assert
			expect(findRes.statusCode).toBe(400)
		})
	})

	describe('GET /sections/:id (findOne)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.sections.create({
				name: 'section',
				order: 0,
				learningPathId: learningPath.id,
			})
			const createResBody = createRes.body as CreateSectionResponseDto

			// act
			const findOneRes = await api.sections.findOne(createResBody.section.id)

			// cleanup
			await api.sections.remove(createResBody.section.id)

			// assert
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ section: createResBody.section })
		})

		it('Bad request (400)', async () => {
			// act
			const findOneRes = await api.sections.findOne('invalid id')

			// assert
			expect(findOneRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const findOneRes = await api.sections.findOne(
				randomUUID() /* non-existent section id */,
			)

			// assert
			expect(findOneRes.statusCode).toBe(404)
		})
	})

	describe('POST /sections (create)', () => {
		it('Created (201)', async () => {
			// act
			const createRes = await api.sections.create({
				name: 'section',
				order: 0,
				learningPathId: learningPath.id,
			})
			const createResBody = createRes.body as CreateSectionResponseDto

			const findOneRes = await api.sections.findOne(createResBody.section.id)

			// cleanup
			await api.sections.remove(createResBody.section.id)

			// assert
			expect(createRes.statusCode).toBe(201)

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ section: createResBody.section })
		})

		it('Bad request (400)', async () => {
			// act
			const createRes = await api.sections.create({} as any)

			// assert
			expect(createRes.statusCode).toBe(400)
		})
	})

	describe('PATCH /sections/:id (update)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.sections.create({
				name: 'section',
				order: 0,
				learningPathId: learningPath.id,
			})
			const createResBody = createRes.body as CreateSectionResponseDto

			// act
			const updateRes = await api.sections.update(createResBody.section.id, {
				name: 'updated-section',
			})
			const updateResBody = updateRes.body as UpdateSectionResponseDto

			const findOneRes = await api.sections.findOne(createResBody.section.id)

			// cleanup
			await api.sections.remove(createResBody.section.id)

			// assert
			expect(updateRes.statusCode).toBe(200)
			expect(updateRes.body).toEqual({ section: updateResBody.section })

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ section: updateResBody.section })
		})

		it('Bad request (400)', async () => {
			// act
			const updateRes = await api.sections.update('invalid id')

			// assert
			expect(updateRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const updateRes = await api.sections.update(
				randomUUID() /* non-existent section id */,
				{ name: 'updated-learning-section' },
			)

			// assert
			expect(updateRes.statusCode).toBe(404)
		})
	})

	describe('DELETE /sections/:id (remove)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.sections.create({
				name: 'section',
				order: 0,
				learningPathId: learningPath.id,
			})
			const createResBody = createRes.body as CreateSectionResponseDto

			// act
			const removeRes = await api.sections.remove(createResBody.section.id)
			const findOneRes = await api.sections.findOne(createResBody.section.id)

			// assert
			expect(removeRes.statusCode).toBe(200)

			expect(findOneRes.statusCode).toBe(404)
		})

		it('Bad request (400)', async () => {
			// act
			const removeRes = await api.sections.remove('invalid id')

			// assert
			expect(removeRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const removeRes = await api.sections.remove(
				randomUUID() /* non-existent learning section id */,
			)

			// assert
			expect(removeRes.statusCode).toBe(404)
		})

		it('Conflict (409)', async () => {
			// arrange
			const createRes = await api.sections.create({
				name: 'section',
				order: 0,
				learningPathId: learningPath.id,
			})
			const createResBody = createRes.body as CreateSectionResponseDto

			const createUnitRes = await api.units.create({
				name: 'section',
				order: 0,
				sectionId: createResBody.section.id,
			})
			const createUnitResBody = createUnitRes.body as CreateUnitResponseDto

			// act
			const removeRes = await api.sections.remove(createResBody.section.id)
			const findOneRes = await api.sections.findOne(createResBody.section.id)

			// cleanup
			await api.units.remove(createUnitResBody.unit.id)
			await api.sections.remove(createResBody.section.id)

			// assert
			expect(removeRes.statusCode).toBe(409)
			expect(findOneRes.statusCode).toBe(200)
		})
	})
})
