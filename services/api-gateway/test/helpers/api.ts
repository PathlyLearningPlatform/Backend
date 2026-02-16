import request from 'supertest'
import type { App } from 'supertest/types'
import type {
	CreateLearningPathBodyDto,
	FindLearningPathsQueryDto,
	UpdateLearningPathBodyDto,
} from '@/learning-paths/dtos'
import type { CreateLessonBodyDto, UpdateLessonBodyDto } from '@/lessons/dtos'
import type {
	CreateSectionBodyDto,
	UpdateSectionBodyDto,
} from '@/sections/dtos'
import type { CreateUnitBodyDto, UpdateUnitBodyDto } from '@/units/dtos'
import {
	CreateArticleDto,
	CreateExerciseDto,
	CreateQuizDto,
	FindActivitiesQueryDto,
	UpdateArticleDto,
	UpdateExerciseDto,
	UpdateQuizDto,
} from '@/activities/dtos'

class Api {
	constructor(protected readonly app: App) {}

	request() {
		return request(this.app)
	}
}

export class LearningPathsApi extends Api {
	async find(query?: FindLearningPathsQueryDto, version: string = 'v1') {
		const response = await this.request()
			.get(`/${version}/learning-paths`)
			.query(query ?? {})

		return response
	}

	async findOne(id: string, version: string = 'v1') {
		const response = await request(this.app).get(
			`/${version}/learning-paths/${id}`,
		)
		return response
	}

	async create(body: CreateLearningPathBodyDto, version: string = 'v1') {
		const response = await request(this.app)
			.post(`/${version}/learning-paths`)
			.set('Content-Type', 'application/json')
			.send(body)
		return response
	}

	async update(
		id: string,
		body?: UpdateLearningPathBodyDto,
		version: string = 'v1',
	) {
		const response = await request(this.app)
			.patch(`/${version}/learning-paths/${id}`)
			.set('Content-Type', 'application/json')
			.send(body)
		return response
	}

	async remove(id: string, version: string = 'v1') {
		const response = await request(this.app).delete(
			`/${version}/learning-paths/${id}`,
		)
		return response
	}
}

export class SectionsApi extends Api {
	async find(query?: Record<string, unknown>, version: string = 'v1') {
		const response = await this.request()
			.get(`/${version}/sections`)
			.query(query ?? {})

		return response
	}

	async findOne(id: string, version: string = 'v1') {
		const response = await request(this.app).get(`/${version}/sections/${id}`)

		return response
	}

	async create(body: CreateSectionBodyDto, version: string = 'v1') {
		const response = await request(this.app)
			.post(`/${version}/sections`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	}

	async update(
		id: string,
		body?: UpdateSectionBodyDto,
		version: string = 'v1',
	) {
		const response = await request(this.app)
			.patch(`/${version}/sections/${id}`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	}

	async remove(id: string, version: string = 'v1') {
		const response = await request(this.app).delete(
			`/${version}/sections/${id}`,
		)

		return response
	}
}

export class UnitsApi extends Api {
	async find(query?: Record<string, unknown>, version: string = 'v1') {
		const response = await this.request()
			.get(`/${version}/units`)
			.query(query ?? {})

		return response
	}

	async findOne(id: string, version: string = 'v1') {
		const response = await request(this.app).get(`/${version}/units/${id}`)

		return response
	}

	async create(body: CreateUnitBodyDto, version: string = 'v1') {
		const response = await request(this.app)
			.post(`/${version}/units`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	}

	async update(id: string, body?: UpdateUnitBodyDto, version: string = 'v1') {
		const response = await request(this.app)
			.patch(`/${version}/units/${id}`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	}

	async remove(id: string, version: string = 'v1') {
		const response = await request(this.app).delete(`/${version}/units/${id}`)

		return response
	}
}

export class LessonsApi extends Api {
	async find(query?: Record<string, unknown>, version: string = 'v1') {
		const response = await this.request()
			.get(`/${version}/lessons`)
			.query(query ?? {})

		return response
	}

	async findOne(id: string, version: string = 'v1') {
		const response = await request(this.app).get(`/${version}/lessons/${id}`)

		return response
	}

	async create(body: CreateLessonBodyDto, version: string = 'v1') {
		const response = await request(this.app)
			.post(`/${version}/lessons`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	}

	async update(id: string, body?: UpdateLessonBodyDto, version: string = 'v1') {
		const response = await request(this.app)
			.patch(`/${version}/lessons/${id}`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	}

	async remove(id: string, version: string = 'v1') {
		const response = await request(this.app).delete(`/${version}/lessons/${id}`)

		return response
	}
}

export class ActivitiesApi extends Api {
	async find(version: string = 'v1', query?: FindActivitiesQueryDto) {
		const response = await request(this.app)
			.get(`/${version}/activities`)
			.query(query ?? {})

		return response
	}

	async findOne(id: string, version: string = 'v1') {
		const response = await request(this.app).get(`/${version}/activities/${id}`)

		return response
	}

	async remove(id: string, version: string = 'v1') {
		const response = await request(this.app).delete(
			`/${version}/activities/${id}`,
		)

		return response
	}
}

export class ArticlesApi extends Api {
	async findOne(id: string, version: string = 'v1') {
		const response = await request(this.app).get(`/${version}/articles/${id}`)

		return response
	}

	async create(body: CreateArticleDto, version: string = 'v1') {
		const response = await request(this.app)
			.post(`/${version}/articles`)
			.send(body)
			.set('Content-Type', 'application/json')

		return response
	}

	async update(id: string, body: UpdateArticleDto, version: string = 'v1') {
		const response = await request(this.app)
			.patch(`/${version}/articles/${id}`)
			.send(body)
			.set('Content-Type', 'application/json')

		return response
	}
}

export class QuizzesApi extends Api {
	async findOne(id: string, version: string = 'v1') {
		const response = await request(this.app).get(`/${version}/quizzes/${id}`)

		return response
	}

	async create(body: CreateQuizDto, version: string = 'v1') {
		const response = await request(this.app)
			.post(`/${version}/quizzes`)
			.send(body)
			.set('Content-Type', 'application/json')

		return response
	}

	async update(id: string, body: UpdateQuizDto, version: string = 'v1') {
		const response = await request(this.app)
			.patch(`/${version}/quizzes/${id}`)
			.send(body)
			.set('Content-Type', 'application/json')

		return response
	}

	async findQuestions(quizId: string, version: string = 'v1') {}

	async findOneQuestion(
		quizId: string,
		questionId: number,
		version: string = 'v1',
	) {}

	async createQuestion(quizId: string, version: string = 'v1') {}

	async updateQuestion(
		quizId: string,
		questionId: number,
		version: string = 'v1',
	) {}

	async removeQuestion(
		quizId: string,
		questionId: number,
		version: string = 'v1',
	) {}
}

export class ExercisesApi extends Api {
	async findOne(id: string, version: string = 'v1') {
		const response = await request(this.app).get(`/${version}/exercises/${id}`)

		return response
	}

	async create(body: CreateExerciseDto, version: string = 'v1') {
		const response = await request(this.app)
			.post(`/${version}/exercises`)
			.send(body)
			.set('Content-Type', 'application/json')

		return response
	}

	async update(id: string, body: UpdateExerciseDto, version: string = 'v1') {
		const response = await request(this.app)
			.patch(`/${version}/exercises/${id}`)
			.send(body)
			.set('Content-Type', 'application/json')

		return response
	}
}
