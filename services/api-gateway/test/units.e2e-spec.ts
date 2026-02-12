import { randomUUID } from 'node:crypto'
import type { Server } from 'node:http'
import { VersioningType, type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import type { CreateUnitResponseDto, UpdateUnitResponseDto } from '@/units/dtos'
import { UnitsModule } from '@/units/units.module'
import { LearningPathsModule } from '@/learning-paths/learning-paths.module'
import {
	LearningPathsApi,
	UnitsApi,
	LessonsApi,
	SectionsApi,
	mockedConfigService,
	clearLearningPathsServiceDb,
} from './helpers'
import {
	CreateLearningPathResponseDto,
	LearningPathResponseDto,
} from '@/learning-paths/dtos'
import { CreateSectionResponseDto, SectionResponseDto } from '@/sections/dtos'
import { SectionsModule } from '@/sections/sections.module'
import { LessonsModule } from '@/lessons/lessons.module'
import { CreateLessonResponseDto } from '@/lessons/dtos'

describe('Units', () => {
	let app: INestApplication
	let httpServer: Server

	let learningPathsApi: LearningPathsApi
	let sectionsApi: SectionsApi
	let unitsApi: UnitsApi
	let lessonsApi: LessonsApi

	let api: {
		units: UnitsApi
		lessons: LessonsApi
	}

	let learningPath: LearningPathResponseDto
	let section: SectionResponseDto

	beforeAll(async () => {
		await clearLearningPathsServiceDb()

		const moduleRef = await Test.createTestingModule({
			imports: [
				SectionsModule,
				UnitsModule,
				LearningPathsModule,
				LessonsModule,
			],
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
		lessonsApi = new LessonsApi(httpServer)

		api = {
			units: unitsApi,
			lessons: lessonsApi,
		}

		const createResBody = (
			await learningPathsApi.create({
				name: 'learning-path',
			})
		).body as CreateLearningPathResponseDto
		const createSectionResBody = (
			await sectionsApi.create({
				name: 'section',
				order: 0,
				learningPathId: createResBody.path.id,
			})
		).body as CreateSectionResponseDto

		learningPath = createResBody.path
		section = createSectionResBody.section
	})

	afterAll(async () => {
		await sectionsApi.remove(section.id)
		await learningPathsApi.remove(learningPath.id)
	})

	describe('GET /units (find)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.units.create({
				name: 'unit',
				order: 0,
				sectionId: section.id,
			})
			const createResBody = createRes.body as CreateUnitResponseDto

			// act
			const findRes = await api.units.find()

			// cleanup
			await api.units.remove(createResBody.unit.id)

			// assert
			expect(findRes.statusCode).toBe(200)
			expect(findRes.body).toEqual({ units: [createResBody.unit] })
		})

		it('Bad request (400)', async () => {
			// act
			const findRes = await api.units.find({
				limit: 'badValue',
			} as any)

			// assert
			expect(findRes.statusCode).toBe(400)
		})
	})

	describe('GET /units/:id (findOne)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.units.create({
				name: 'unit',
				order: 0,
				sectionId: section.id,
			})
			const createResBody = createRes.body as CreateUnitResponseDto

			// act
			const findOneRes = await api.units.findOne(createResBody.unit.id)

			// cleanup
			await api.units.remove(createResBody.unit.id)

			// assert
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ unit: createResBody.unit })
		})

		it('Bad request (400)', async () => {
			// act
			const findOneRes = await api.units.findOne('invalid id')

			// assert
			expect(findOneRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const findOneRes = await api.units.findOne(
				randomUUID() /* non-existent unit id */,
			)

			// assert
			expect(findOneRes.statusCode).toBe(404)
		})
	})

	describe('POST /units (create)', () => {
		it('Created (201)', async () => {
			// act
			const createRes = await api.units.create({
				name: 'unit',
				order: 0,
				sectionId: section.id,
			})
			const createResBody = createRes.body as CreateUnitResponseDto

			const findOneRes = await api.units.findOne(createResBody.unit.id)

			// cleanup
			await api.units.remove(createResBody.unit.id)

			// assert
			expect(createRes.statusCode).toBe(201)

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ unit: createResBody.unit })
		})

		it('Bad request (400)', async () => {
			// act
			const createRes = await api.units.create({} as any)

			// assert
			expect(createRes.statusCode).toBe(400)
		})
	})

	describe('PATCH /units/:id (update)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.units.create({
				name: 'unit',
				order: 0,
				sectionId: section.id,
			})
			const createResBody = createRes.body as CreateUnitResponseDto

			// act
			const updateRes = await api.units.update(createResBody.unit.id, {
				name: 'updated-unit',
			})
			const updateResBody = updateRes.body as UpdateUnitResponseDto

			const findOneRes = await api.units.findOne(createResBody.unit.id)

			// cleanup
			await api.units.remove(createResBody.unit.id)

			// assert
			expect(updateRes.statusCode).toBe(200)
			expect(updateRes.body).toEqual({ unit: updateResBody.unit })

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ unit: updateResBody.unit })
		})

		it('Bad request (400)', async () => {
			// act
			const updateRes = await api.units.update('invalid id')

			// assert
			expect(updateRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const updateRes = await api.units.update(
				randomUUID() /* non-existent unit id */,
				{ name: 'updated-learning-unit' },
			)

			// assert
			expect(updateRes.statusCode).toBe(404)
		})
	})

	describe('DELETE /units/:id (remove)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.units.create({
				name: 'unit',
				order: 0,
				sectionId: section.id,
			})

			const createResBody = createRes.body as CreateUnitResponseDto

			// act
			const removeRes = await api.units.remove(createResBody.unit.id)
			const findOneRes = await api.units.findOne(createResBody.unit.id)

			// assert
			expect(removeRes.statusCode).toBe(200)

			expect(findOneRes.statusCode).toBe(404)
		})

		it('Bad request (400)', async () => {
			// act
			const removeRes = await api.units.remove('invalid id')

			// assert
			expect(removeRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const removeRes = await api.units.remove(
				randomUUID() /* non-existent learning unit id */,
			)

			// assert
			expect(removeRes.statusCode).toBe(404)
		})

		it('Conflict (409)', async () => {
			// arrange
			const createRes = await api.units.create({
				name: 'unit',
				order: 0,
				sectionId: section.id,
			})
			const createResBody = createRes.body as CreateUnitResponseDto

			const createLessonRes = await api.lessons.create({
				name: 'lesson',
				order: 0,
				unitId: createResBody.unit.id,
			})
			const createLessonResBody =
				createLessonRes.body as CreateLessonResponseDto

			// act
			const removeRes = await api.units.remove(createResBody.unit.id)
			const findOneRes = await api.units.findOne(createResBody.unit.id)

			// cleanup
			await api.lessons.remove(createLessonResBody.lesson.id)
			await api.units.remove(createResBody.unit.id)

			// assert
			expect(removeRes.statusCode).toBe(409)
			expect(findOneRes.statusCode).toBe(200)
		})
	})
})
