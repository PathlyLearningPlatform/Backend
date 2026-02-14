import { INestApplication, VersioningType } from '@nestjs/common'
import { Server } from 'node:http'
import {
	ActivitiesApi,
	ArticlesApi,
	clearLearningPathsServiceDb,
	ExercisesApi,
	LearningPathsApi,
	LessonsApi,
	mockedConfigService,
	QuizzesApi,
	SectionsApi,
	UnitsApi,
} from './helpers'
import {
	CreateLearningPathResponseDto,
	LearningPathResponseDto,
} from '@/learning-paths/dtos'
import { CreateSectionResponseDto, SectionResponseDto } from '@/sections/dtos'
import { CreateUnitResponseDto, UnitResponseDto } from '@/units/dtos'
import { CreateLessonResponseDto, LessonResponseDto } from '@/lessons/dtos'
import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import {
	ActivityResponseDto,
	CreateArticleResponseDto,
	UpdateArticleResponseDto,
} from '@/activities/dtos'
import { ActivitiesModule } from '@/activities/activities.module'
import { LessonsModule } from '@/lessons/lessons.module'
import { UnitsModule } from '@/units/units.module'
import { SectionsModule } from '@/sections/sections.module'
import { LearningPathsModule } from '@/learning-paths/learning-paths.module'
import { randomUUID } from 'node:crypto'
import {
	CreateQuizResponseDto,
	UpdateQuizResponseDto,
} from '@/activities/dtos/responses'
import {
	CreateExerciseResponseDto,
	UpdateExerciseResponseDto,
} from '@/activities/dtos/responses'
import { ExerciseDifficulty } from '@pathly-backend/contracts/learning-paths/v1/activities.js'

describe('Activities', () => {
	let app: INestApplication
	let httpServer: Server

	let learningPathsApi: LearningPathsApi
	let sectionsApi: SectionsApi
	let unitsApi: UnitsApi
	let lessonsApi: LessonsApi
	let activitiesApi: ActivitiesApi
	let articlesApi: ArticlesApi
	let quizzesApi: QuizzesApi
	let exercisesApi: ExercisesApi

	let api: {
		activities: ActivitiesApi
		articles: ArticlesApi
		exercises: ExercisesApi
		quizzes: QuizzesApi
	}

	let learningPath: LearningPathResponseDto
	let section: SectionResponseDto
	let unit: UnitResponseDto
	let lesson: LessonResponseDto

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

		app.enableVersioning({ type: VersioningType.URI })

		await app.init()

		learningPathsApi = new LearningPathsApi(httpServer)
		sectionsApi = new SectionsApi(httpServer)
		unitsApi = new UnitsApi(httpServer)
		lessonsApi = new LessonsApi(httpServer)
		activitiesApi = new ActivitiesApi(httpServer)
		articlesApi = new ArticlesApi(httpServer)
		exercisesApi = new ExercisesApi(httpServer)
		quizzesApi = new QuizzesApi(httpServer)

		api = {
			activities: activitiesApi,
			articles: articlesApi,
			quizzes: quizzesApi,
			exercises: exercisesApi,
		}

		const createLearningPathResBody = (
			await learningPathsApi.create({
				name: 'learning-path',
			})
		).body as CreateLearningPathResponseDto

		const createSectionResBody = (
			await sectionsApi.create({
				name: 'section',
				order: 0,
				learningPathId: createLearningPathResBody.path.id,
			})
		).body as CreateSectionResponseDto

		const createUnitResBody = (
			await unitsApi.create({
				name: 'unit',
				order: 0,
				sectionId: createSectionResBody.section.id,
			})
		).body as CreateUnitResponseDto

		const createLessonResBody = (
			await lessonsApi.create({
				name: 'lesson',
				order: 0,
				unitId: createUnitResBody.unit.id,
			})
		).body as CreateLessonResponseDto

		learningPath = createLearningPathResBody.path
		section = createSectionResBody.section
		unit = createUnitResBody.unit
		lesson = createLessonResBody.lesson
	})

	afterAll(async () => {
		await lessonsApi.remove(lesson.id)
		await unitsApi.remove(unit.id)
		await sectionsApi.remove(section.id)
		await learningPathsApi.remove(learningPath.id)
	})

	describe('GET /activities', () => {
		test('200 (Success)', async () => {
			// arrange
			const createArticleResBody = (
				await api.articles.create({
					name: 'article',
					lessonId: lesson.id,
					order: 0,
					ref: 'http://example.com',
				})
			).body as CreateArticleResponseDto

			// act
			const findActivitiesRes = await api.activities.find()

			// cleanup
			await api.activities.remove(createArticleResBody.article.id)

			// assert
			expect(findActivitiesRes.statusCode).toBe(200)
			expect(findActivitiesRes.body).toMatchObject({
				activities: [
					{
						id: createArticleResBody.article.id,
						lessonId: createArticleResBody.article.lessonId,
						createdAt: createArticleResBody.article.createdAt,
						updatedAt: createArticleResBody.article.updatedAt,
						name: createArticleResBody.article.name,
						description: createArticleResBody.article.description,
						order: createArticleResBody.article.order,
					} as ActivityResponseDto,
				],
			})
		})

		test('400 (Bad Request)', async () => {
			// act
			const findActivitiesRes = await api.activities.find('v1', {
				limit: 'badValue',
			} as any)

			// assert
			expect(findActivitiesRes.statusCode).toBe(400)
		})
	})

	describe('GET /activities/:id', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.articles.create({
				name: 'article',
				lessonId: lesson.id,
				order: 0,
				ref: 'http://example.com',
			})
			const createResBody = createRes.body as CreateArticleResponseDto

			// act
			const findOneRes = await api.activities.findOne(createResBody.article.id)

			// cleanup
			await api.activities.remove(createResBody.article.id)

			// assert
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({
				activity: {
					id: createResBody.article.id,
					lessonId: createResBody.article.lessonId,
					createdAt: createResBody.article.createdAt,
					updatedAt: createResBody.article.updatedAt,
					name: createResBody.article.name,
					description: createResBody.article.description,
					type: createResBody.article.type,
					order: createResBody.article.order,
				} as ActivityResponseDto,
			})
		})

		it('Bad request (400)', async () => {
			// act
			const findOneRes = await api.activities.findOne('invalid-id')

			// assert
			expect(findOneRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const findOneRes = await api.activities.findOne(randomUUID())

			// assert
			expect(findOneRes.statusCode).toBe(404)
		})
	})

	describe('DELETE /activities/:id', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.articles.create({
				name: 'article',
				lessonId: lesson.id,
				order: 0,
				ref: 'http://example.com',
			})
			const createResBody = createRes.body as CreateArticleResponseDto

			// act
			const removeRes = await api.activities.remove(createResBody.article.id)
			const findOneRes = await api.activities.findOne(createResBody.article.id)

			// assert
			expect(removeRes.statusCode).toBe(200)
			expect(findOneRes.statusCode).toBe(404)
		})

		it('Bad request (400)', async () => {
			// act
			const removeRes = await api.activities.remove('invalid-id')

			// assert
			expect(removeRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const removeRes = await api.activities.remove(randomUUID())

			// assert
			expect(removeRes.statusCode).toBe(404)
		})
	})

	describe('GET /articles/:id', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.articles.create({
				name: 'article',
				lessonId: lesson.id,
				order: 0,
				ref: 'http://example.com',
			})
			const createResBody = createRes.body as CreateArticleResponseDto

			// act
			const findOneRes = await api.articles.findOne(createResBody.article.id)

			// cleanup
			await api.activities.remove(createResBody.article.id)

			// assert
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ article: createResBody.article })
		})

		it('Bad request (400)', async () => {
			// act
			const findOneRes = await api.articles.findOne('invalid-id')

			// assert
			expect(findOneRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const findOneRes = await api.articles.findOne(randomUUID())

			// assert
			expect(findOneRes.statusCode).toBe(404)
		})
	})

	describe('POST /articles', () => {
		it('Created (201)', async () => {
			// act
			const createRes = await api.articles.create({
				name: 'article',
				lessonId: lesson.id,
				order: 0,
				ref: 'http://example.com',
			})
			const createResBody = createRes.body as CreateArticleResponseDto

			const findOneRes = await api.articles.findOne(createResBody.article.id)

			// cleanup
			await api.activities.remove(createResBody.article.id)

			// assert
			expect(createRes.statusCode).toBe(201)
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ article: createResBody.article })
		})

		it('Bad request (400)', async () => {
			// act
			const createRes = await api.articles.create({} as any)

			// assert
			expect(createRes.statusCode).toBe(400)
		})

		it('Conflict (409) - Duplicate Order', async () => {
			// arrange
			const createRes1 = await api.articles.create({
				name: 'article1',
				lessonId: lesson.id,
				order: 1,
				ref: 'http://example.com',
			})
			const createRes1Body = createRes1.body as CreateArticleResponseDto

			// act
			const createRes2 = await api.articles.create({
				name: 'article2',
				lessonId: lesson.id,
				order: 1,
				ref: 'http://example.com',
			})

			// cleanup
			await api.activities.remove(createRes1Body.article.id)

			// assert
			expect(createRes2.statusCode).toBe(409)
		})

		it('Not found (404) - Lesson not found', async () => {
			// act
			const createRes = await api.articles.create({
				name: 'article',
				lessonId: randomUUID(),
				order: 0,
				ref: 'http://example.com',
			})

			// assert
			expect(createRes.statusCode).toBe(404)
		})
	})

	describe('PATCH /articles/:id', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.articles.create({
				name: 'article',
				lessonId: lesson.id,
				order: 0,
				ref: 'http://example.com',
			})
			const createResBody = createRes.body as CreateArticleResponseDto

			// act
			const updateRes = await api.articles.update(createResBody.article.id, {
				name: 'updated-article',
			})
			const updateResBody = updateRes.body as UpdateArticleResponseDto

			const findOneRes = await api.articles.findOne(createResBody.article.id)

			// cleanup
			await api.activities.remove(createResBody.article.id)

			// assert
			expect(updateRes.statusCode).toBe(200)
			expect(updateRes.body).toEqual({ article: updateResBody.article })
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ article: updateResBody.article })
		})

		it('Bad request (400)', async () => {
			// act
			const updateRes = await api.articles.update('invalid id', {})

			// assert
			expect(updateRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const updateRes = await api.articles.update(randomUUID(), {
				name: 'updated-article',
			})

			// assert
			expect(updateRes.statusCode).toBe(404)
		})

		it('Conflict (409) - Duplicate Order', async () => {
			// arrange
			const createRes1 = await api.articles.create({
				name: 'article1',
				lessonId: lesson.id,
				order: 1,
				ref: 'http://example.com',
			})
			const createRes1Body = createRes1.body as CreateArticleResponseDto

			const createRes2 = await api.articles.create({
				name: 'article2',
				lessonId: lesson.id,
				order: 2,
				ref: 'http://example.com',
			})
			const createRes2Body = createRes2.body as CreateArticleResponseDto

			// act
			const updateRes = await api.articles.update(createRes2Body.article.id, {
				order: 1,
			})

			// cleanup
			await api.activities.remove(createRes1Body.article.id)
			await api.activities.remove(createRes2Body.article.id)

			// assert
			expect(updateRes.statusCode).toBe(409)
		})

		it('Not found (404) - Lesson not found', async () => {
			// arrange
			const createRes = await api.articles.create({
				name: 'article',
				lessonId: lesson.id,
				order: 0,
				ref: 'http://example.com',
			})
			const createResBody = createRes.body as CreateArticleResponseDto

			// act
			const updateRes = await api.articles.update(createResBody.article.id, {
				lessonId: randomUUID(),
			})

			// cleanup
			await api.activities.remove(createResBody.article.id)

			// assert
			expect(updateRes.statusCode).toBe(404)
		})
	})

	describe('GET /quizzes/:id', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.quizzes.create({
				name: 'quiz',
				lessonId: lesson.id,
				order: 0,
			})
			const createResBody = createRes.body as CreateQuizResponseDto

			// act
			const findOneRes = await api.quizzes.findOne(createResBody.quiz.id)

			// cleanup
			await api.activities.remove(createResBody.quiz.id)

			// assert
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ quiz: createResBody.quiz })
		})

		it('Bad request (400)', async () => {
			// act
			const findOneRes = await api.quizzes.findOne('invalid-id')

			// assert
			expect(findOneRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const findOneRes = await api.quizzes.findOne(randomUUID())

			// assert
			expect(findOneRes.statusCode).toBe(404)
		})
	})

	describe('POST /quizzes', () => {
		it('Created (201)', async () => {
			// act
			const createRes = await api.quizzes.create({
				name: 'quiz',
				lessonId: lesson.id,
				order: 0,
			})
			const createResBody = createRes.body as CreateQuizResponseDto

			const findOneRes = await api.quizzes.findOne(createResBody.quiz.id)

			// cleanup
			await api.activities.remove(createResBody.quiz.id)

			// assert
			expect(createRes.statusCode).toBe(201)
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ quiz: createResBody.quiz })
		})

		it('Bad request (400)', async () => {
			// act
			const createRes = await api.quizzes.create({} as any)

			// assert
			expect(createRes.statusCode).toBe(400)
		})

		it('Conflict (409) - Duplicate Order', async () => {
			// arrange
			const createRes1 = await api.quizzes.create({
				name: 'quiz1',
				lessonId: lesson.id,
				order: 1,
			})
			const createRes1Body = createRes1.body as CreateQuizResponseDto

			// act
			const createRes2 = await api.quizzes.create({
				name: 'quiz2',
				lessonId: lesson.id,
				order: 1,
			})

			// cleanup
			await api.activities.remove(createRes1Body.quiz.id)

			// assert
			expect(createRes2.statusCode).toBe(409)
		})

		it('Not found (404) - Lesson not found', async () => {
			// act
			const createRes = await api.quizzes.create({
				name: 'quiz',
				lessonId: randomUUID(),
				order: 0,
			})

			// assert
			expect(createRes.statusCode).toBe(404)
		})
	})

	describe('PATCH /quizzes/:id', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.quizzes.create({
				name: 'quiz',
				lessonId: lesson.id,
				order: 0,
			})
			const createResBody = createRes.body as CreateQuizResponseDto

			// act
			const updateRes = await api.quizzes.update(createResBody.quiz.id, {
				name: 'updated-quiz',
			})
			const updateResBody = updateRes.body as UpdateQuizResponseDto

			const findOneRes = await api.quizzes.findOne(createResBody.quiz.id)

			// cleanup
			await api.activities.remove(createResBody.quiz.id)

			// assert
			expect(updateRes.statusCode).toBe(200)
			expect(updateRes.body).toEqual({ quiz: updateResBody.quiz })
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ quiz: updateResBody.quiz })
		})

		it('Bad request (400)', async () => {
			// act
			const updateRes = await api.quizzes.update('invalid id', {})

			// assert
			expect(updateRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const updateRes = await api.quizzes.update(randomUUID(), {
				name: 'updated-quiz',
			})

			// assert
			expect(updateRes.statusCode).toBe(404)
		})

		it('Conflict (409) - Duplicate Order', async () => {
			// arrange
			const createRes1 = await api.quizzes.create({
				name: 'quiz1',
				lessonId: lesson.id,
				order: 1,
			})
			const createRes1Body = createRes1.body as CreateQuizResponseDto

			const createRes2 = await api.quizzes.create({
				name: 'quiz2',
				lessonId: lesson.id,
				order: 2,
			})
			const createRes2Body = createRes2.body as CreateQuizResponseDto

			// act
			const updateRes = await api.quizzes.update(createRes2Body.quiz.id, {
				order: 1,
			})

			// cleanup
			await api.activities.remove(createRes1Body.quiz.id)
			await api.activities.remove(createRes2Body.quiz.id)

			// assert
			expect(updateRes.statusCode).toBe(409)
		})

		it('Not found (404) - Lesson not found', async () => {
			// arrange
			const createRes = await api.quizzes.create({
				name: 'quiz',
				lessonId: lesson.id,
				order: 0,
			})
			const createResBody = createRes.body as CreateQuizResponseDto

			// act
			const updateRes = await api.quizzes.update(createResBody.quiz.id, {
				lessonId: randomUUID(),
			})

			// cleanup
			await api.activities.remove(createResBody.quiz.id)

			// assert
			expect(updateRes.statusCode).toBe(404)
		})
	})

	describe('GET /exercises/:id', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.exercises.create({
				name: 'exercise',
				lessonId: lesson.id,
				order: 0,
				difficulty: ExerciseDifficulty.EASY,
			})
			const createResBody = createRes.body as CreateExerciseResponseDto

			// act
			const findOneRes = await api.exercises.findOne(createResBody.exercise.id)

			// cleanup
			await api.activities.remove(createResBody.exercise.id)

			// assert
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ exercise: createResBody.exercise })
		})

		it('Bad request (400)', async () => {
			// act
			const findOneRes = await api.exercises.findOne('invalid-id')

			// assert
			expect(findOneRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const findOneRes = await api.exercises.findOne(randomUUID())

			// assert
			expect(findOneRes.statusCode).toBe(404)
		})
	})

	describe('POST /exercises', () => {
		it('Created (201)', async () => {
			// act
			const createRes = await api.exercises.create({
				name: 'exercise',
				lessonId: lesson.id,
				order: 0,
				difficulty: ExerciseDifficulty.EASY,
			})
			const createResBody = createRes.body as CreateExerciseResponseDto

			const findOneRes = await api.exercises.findOne(createResBody.exercise.id)

			// cleanup
			await api.activities.remove(createResBody.exercise.id)

			// assert
			expect(createRes.statusCode).toBe(201)
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ exercise: createResBody.exercise })
		})

		it('Bad request (400)', async () => {
			// act
			const createRes = await api.exercises.create({} as any)

			// assert
			expect(createRes.statusCode).toBe(400)
		})

		it('Conflict (409) - Duplicate Order', async () => {
			// arrange
			const createRes1 = await api.exercises.create({
				name: 'exercise1',
				lessonId: lesson.id,
				order: 1,
				difficulty: ExerciseDifficulty.EASY,
			})
			const createRes1Body = createRes1.body as CreateExerciseResponseDto

			// act
			const createRes2 = await api.exercises.create({
				name: 'exercise2',
				lessonId: lesson.id,
				order: 1,
				difficulty: ExerciseDifficulty.EASY,
			})

			// cleanup
			await api.activities.remove(createRes1Body.exercise.id)

			// assert
			expect(createRes2.statusCode).toBe(409)
		})

		it('Not found (404) - Lesson not found', async () => {
			// act
			const createRes = await api.exercises.create({
				name: 'exercise',
				lessonId: randomUUID(),
				order: 0,
				difficulty: ExerciseDifficulty.EASY,
			})

			// assert
			expect(createRes.statusCode).toBe(404)
		})
	})

	describe('PATCH /exercises/:id', () => {
		it('Success (200)', async () => {
			// arrange
			const createRes = await api.exercises.create({
				name: 'exercise',
				lessonId: lesson.id,
				order: 0,
				difficulty: ExerciseDifficulty.EASY,
			})
			const createResBody = createRes.body as CreateExerciseResponseDto

			// act
			const updateRes = await api.exercises.update(createResBody.exercise.id, {
				name: 'updated-exercise',
			})
			const updateResBody = updateRes.body as UpdateExerciseResponseDto

			const findOneRes = await api.exercises.findOne(createResBody.exercise.id)

			// cleanup
			await api.activities.remove(createResBody.exercise.id)

			// assert
			expect(updateRes.statusCode).toBe(200)
			expect(updateRes.body).toEqual({ exercise: updateResBody.exercise })
			expect(findOneRes.statusCode).toBe(200)
			expect(findOneRes.body).toEqual({ exercise: updateResBody.exercise })
		})

		it('Bad request (400)', async () => {
			// act
			const updateRes = await api.exercises.update('invalid id', {})

			// assert
			expect(updateRes.statusCode).toBe(400)
		})

		it('Not found (404)', async () => {
			// act
			const updateRes = await api.exercises.update(randomUUID(), {
				name: 'updated-exercise',
			})

			// assert
			expect(updateRes.statusCode).toBe(404)
		})

		it('Conflict (409) - Duplicate Order', async () => {
			// arrange
			const createRes1 = await api.exercises.create({
				name: 'exercise1',
				lessonId: lesson.id,
				order: 1,
				difficulty: ExerciseDifficulty.EASY,
			})
			const createRes1Body = createRes1.body as CreateExerciseResponseDto

			const createRes2 = await api.exercises.create({
				name: 'exercise2',
				lessonId: lesson.id,
				order: 2,
				difficulty: ExerciseDifficulty.EASY,
			})
			const createRes2Body = createRes2.body as CreateExerciseResponseDto

			// act
			const updateRes = await api.exercises.update(createRes2Body.exercise.id, {
				order: 1,
			})

			// cleanup
			await api.activities.remove(createRes1Body.exercise.id)
			await api.activities.remove(createRes2Body.exercise.id)

			// assert
			expect(updateRes.statusCode).toBe(409)
		})

		it('Not found (404) - Lesson not found', async () => {
			// arrange
			const createRes = await api.exercises.create({
				name: 'exercise',
				lessonId: lesson.id,
				order: 0,
				difficulty: ExerciseDifficulty.EASY,
			})
			const createResBody = createRes.body as CreateExerciseResponseDto

			// act
			const updateRes = await api.exercises.update(createResBody.exercise.id, {
				lessonId: randomUUID(),
			})

			// cleanup
			await api.activities.remove(createResBody.exercise.id)

			// assert
			expect(updateRes.statusCode).toBe(404)
		})
	})
})
