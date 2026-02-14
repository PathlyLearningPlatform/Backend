import { randomUUID } from 'node:crypto'
import type { Server } from 'node:http'
import { VersioningType, type INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import type {
	CreateUnitResponseDto,
	UnitResponseDto,
	UpdateUnitResponseDto,
} from '@/units/dtos'
import { UnitsModule } from '@/units/units.module'
import { LearningPathsModule } from '@/learning-paths/learning-paths.module'
import {
	LearningPathsApi,
	UnitsApi,
	LessonsApi,
	SectionsApi,
	mockedConfigService,
	clearLearningPathsServiceDb,
	ActivitiesApi,
	ArticlesApi,
} from './helpers'
import {
	CreateLearningPathResponseDto,
	LearningPathResponseDto,
} from '@/learning-paths/dtos'
import { CreateSectionResponseDto, SectionResponseDto } from '@/sections/dtos'
import { SectionsModule } from '@/sections/sections.module'
import { LessonsModule } from '@/lessons/lessons.module'
import {
	CreateLessonResponseDto,
	UpdateLessonResponseDto,
} from '@/lessons/dtos'
import { ActivitiesModule } from '@/activities/activities.module'
import { CreateArticleResponseDto } from '@/activities/dtos'
import { UpdateLessonResponse } from '@pathly-backend/contracts/learning-paths/v1/lessons.js'

describe('Lessons', () => {
	let app: INestApplication
	let httpServer: Server

	let learningPathsApi: LearningPathsApi
	let sectionsApi: SectionsApi
	let unitsApi: UnitsApi
	let lessonsApi: LessonsApi
	let activitiesApi: ActivitiesApi
	let articlesApi: ArticlesApi

	let api: {
		lessons: LessonsApi
		activities: ActivitiesApi
		articles: ArticlesApi
	}

	let learningPath: LearningPathResponseDto
	let section: SectionResponseDto
	let unit: UnitResponseDto

	beforeAll(async () => {
		await clearLearningPathsServiceDb()

		const moduleRef = await Test.createTestingModule({
			imports: [
				SectionsModule,
				UnitsModule,
				LearningPathsModule,
				LessonsModule,
				ActivitiesModule,
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
		activitiesApi = new ActivitiesApi(httpServer)
		articlesApi = new ArticlesApi(httpServer)

		api = {
			lessons: lessonsApi,
			activities: activitiesApi,
			articles: articlesApi,
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

		const createUnitResBody = (
			await unitsApi.create({
				name: 'unit',
				order: 0,
				sectionId: createSectionResBody.section.id,
			})
		).body as CreateUnitResponseDto

		learningPath = createResBody.path
		section = createSectionResBody.section
		unit = createUnitResBody.unit
	})

	afterAll(async () => {
		await unitsApi.remove(unit.id)
		await sectionsApi.remove(section.id)
		await learningPathsApi.remove(learningPath.id)
	})

	describe('GET /lessons (find)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.lessons.create({
				name: 'lesson',
				order: 0,
				unitId: unit.id,
			})
			const createResBody = createRes.body as CreateLessonResponseDto

			// act
			const findRes = await api.lessons.find()

			// cleanup
			await api.lessons.remove(createResBody.lesson.id)

			// assert
			expect(findRes.statusCode).toBe(200)
			expect(findRes.body).toEqual({ lessons: [createResBody.lesson] })
		})

		it('Bad request (400)', async () => {
			// act
			const findRes = await api.lessons.find({
				limit: 'badValue',
			} as any)

			// assert
			expect(findRes.statusCode).toBe(400)
		})
	})

	describe('GET /lessons/:id (findOne)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.lessons.create({
				name: 'unit',
				order: 0,
				unitId: unit.id,
			})
			const createResBody = createRes.body as CreateLessonResponseDto

			// act
			const findOneRes = await api.lessons.findOne(createResBody.lesson.id)

			// cleanup
			await api.lessons.remove(createResBody.lesson.id)

			// assert
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ lesson: createResBody.lesson })
		})

		it('Bad request (400)', async () => {
			// act
			const findOneRes = await api.lessons.findOne('invalid id')

			// assert
			expect(findOneRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const findOneRes = await api.lessons.findOne(
				randomUUID() /* non-existent unit id */,
			)

			// assert
			expect(findOneRes.statusCode).toBe(404)
		})
	})

	describe('POST /lessons (create)', () => {
		it('Created (201)', async () => {
			// act
			const createRes = await api.lessons.create({
				name: 'lesson',
				order: 0,
				unitId: unit.id,
			})
			const createResBody = createRes.body as CreateLessonResponseDto

			const findOneRes = await api.lessons.findOne(createResBody.lesson.id)

			// cleanup
			await api.lessons.remove(createResBody.lesson.id)

			// assert
			expect(createRes.statusCode).toBe(201)

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ lesson: createResBody.lesson })
		})

		it('Bad request (400)', async () => {
			// act
			const createRes = await api.lessons.create({} as any)

			// assert
			expect(createRes.statusCode).toBe(400)
		})

		it('Conflict (409) - Duplicate Order', async () => {
			// arrange
			const createRes1 = await api.lessons.create({
				name: 'lesson1',
				order: 1,
				unitId: unit.id,
			})
			const createRes1Body = createRes1.body as CreateLessonResponseDto

			// act
			const createRes2 = await api.lessons.create({
				name: 'lesson2',
				order: 1,
				unitId: unit.id,
			})

			// cleanup
			await api.lessons.remove(createRes1Body.lesson.id)

			// assert
			expect(createRes2.statusCode).toBe(409)
		})
	})

	describe('PATCH /lessons/:id (update)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.lessons.create({
				name: 'unit',
				order: 0,
				unitId: unit.id,
			})
			const createResBody = createRes.body as CreateLessonResponseDto

			// act
			const updateRes = await api.lessons.update(createResBody.lesson.id, {
				name: 'updated-lesson',
			})
			const updateResBody = updateRes.body as UpdateLessonResponseDto

			const findOneRes = await api.lessons.findOne(createResBody.lesson.id)

			// cleanup
			await api.lessons.remove(createResBody.lesson.id)

			// assert
			expect(updateRes.statusCode).toBe(200)
			expect(updateRes.body).toEqual({ lesson: updateResBody.lesson })

			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ lesson: updateResBody.lesson })
		})

		it('Bad request (400)', async () => {
			// act
			const updateRes = await api.lessons.update('invalid id')

			// assert
			expect(updateRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const updateRes = await api.lessons.update(
				randomUUID() /* non-existent lesson id */,
				{ name: 'updated-learning-lesson' },
			)

			// assert
			expect(updateRes.statusCode).toBe(404)
		})
	})

	describe('DELETE /lessons/:id (remove)', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.lessons.create({
				name: 'unit',
				order: 0,
				unitId: unit.id,
			})

			const createResBody = createRes.body as CreateLessonResponseDto

			// act
			const removeRes = await api.lessons.remove(createResBody.lesson.id)
			const findOneRes = await api.lessons.findOne(createResBody.lesson.id)

			// assert
			expect(removeRes.statusCode).toBe(200)

			expect(findOneRes.statusCode).toBe(404)
		})

		it('Bad request (400)', async () => {
			// act
			const removeRes = await api.lessons.remove('invalid id')

			// assert
			expect(removeRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const removeRes = await api.lessons.remove(
				randomUUID() /* non-existent learning unit id */,
			)

			// assert
			expect(removeRes.statusCode).toBe(404)
		})

		it('Conflict (409)', async () => {
			// arrange
			const createRes = await api.lessons.create({
				name: 'unit',
				order: 0,
				unitId: unit.id,
			})
			const createResBody = createRes.body as CreateLessonResponseDto

			const createArticleRes = await api.articles.create({
				name: 'article',
				order: 0,
				lessonId: createResBody.lesson.id,
				ref: 'https://someref.com',
			})
			const createArticleResBody =
				createArticleRes.body as CreateArticleResponseDto

			// act
			const removeRes = await api.lessons.remove(createResBody.lesson.id)
			const findOneRes = await api.lessons.findOne(createResBody.lesson.id)

			// cleanup
			await api.activities.remove(createArticleResBody.article.id)
			await api.lessons.remove(createResBody.lesson.id)

			// assert
			expect(removeRes.statusCode).toBe(409)
			expect(findOneRes.statusCode).toBe(200)
		})
	})
})
