import { ConfigService } from '@nestjs/config'
import { parseIntOrReturn } from '@pathly-backend/common/index.js'
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

export const mockedConfigService = new ConfigService({
	app: {
		port: parseIntOrReturn(process.env.PORT),
		hostname: process.env.HOSTNAME,
		learningPathsServiceUrl: process.env.LEARNING_PATHS_SERVICE_URL,
		protoDir: process.env.PROTO_DIR,
	},
})

export const learningPaths = {
	async find(
		app: App,
		query?: FindLearningPathsQueryDto,
		version: string = 'v1',
	) {
		const response = await request(app)
			.get(`/learning-paths`)
			.query(query ?? {})
			.set('Content-Type', 'application/json')

		return response
	},

	async findOne(app: App, id: string, version: string = 'v1') {
		const response = await request(app)
			.get(`/learning-paths/${id}`)
			.set('Content-Type', 'application/json')
		return response
	},

	async create(
		app: App,
		body: CreateLearningPathBodyDto,
		version: string = 'v1',
	) {
		const response = await request(app)
			.post(`/learning-paths`)
			.set('Content-Type', 'application/json')
			.send(body)
		return response
	},

	async update(
		app: App,
		id: string,
		body?: UpdateLearningPathBodyDto,
		version: string = 'v1',
	) {
		const response = await request(app)
			.patch(`/learning-paths/${id}`)
			.set('Content-Type', 'application/json')
			.send(body)
		return response
	},

	async remove(app: App, id: string, version: string = 'v1') {
		const response = await request(app)
			.delete(`/learning-paths/${id}`)
			.set('Content-Type', 'application/json')
		return response
	},
}

export const sections = {
	async find(
		app: App,
		query?: Record<string, unknown>,
		version: string = 'v1',
	) {
		const response = await request(app)
			.get(`/sections`)
			.set('Content-Type', 'application/json')
			.query(query ?? {})

		return response
	},

	async findOne(app: App, id: string, version: string = 'v1') {
		const response = await request(app)
			.get(`/sections/${id}`)
			.set('Content-Type', 'application/json')

		return response
	},

	async create(app: App, body: CreateSectionBodyDto, version: string = 'v1') {
		const response = await request(app)
			.post(`/sections`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	},

	async update(
		app: App,
		id: string,
		body?: UpdateSectionBodyDto,
		version: string = 'v1',
	) {
		const response = await request(app)
			.patch(`/sections/${id}`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	},

	async remove(app: App, id: string, version: string = 'v1') {
		const response = await request(app)
			.delete(`/sections/${id}`)
			.set('Content-Type', 'application/json')

		return response
	},
}

export const units = {
	async find(
		app: App,
		query?: Record<string, unknown>,
		version: string = 'v1',
	) {
		const response = await request(app)
			.get('/units')
			.set('Content-Type', 'application/json')
			.query(query ?? {})

		return response
	},

	async findOne(app: App, id: string, version: string = 'v1') {
		const response = await request(app)
			.get(`/units/${id}`)
			.set('Content-Type', 'application/json')

		return response
	},

	async create(app: App, body: CreateUnitBodyDto, version: string = 'v1') {
		const response = await request(app)
			.post('/units')
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	},

	async update(
		app: App,
		id: string,
		body?: UpdateUnitBodyDto,
		version: string = 'v1',
	) {
		const response = await request(app)
			.patch(`/units/${id}`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	},

	async remove(app: App, id: string, version: string = 'v1') {
		const response = await request(app)
			.delete(`/units/${id}`)
			.set('Content-Type', 'application/json')

		return response
	},
}

export const lessons = {
	async find(
		app: App,
		query?: Record<string, unknown>,
		version: string = 'v1',
	) {
		const response = await request(app)
			.get('/lessons')
			.set('Content-Type', 'application/json')
			.query(query ?? {})

		return response
	},

	async findOne(app: App, id: string, version: string = 'v1') {
		const response = await request(app)
			.get(`/lessons/${id}`)
			.set('Content-Type', 'application/json')

		return response
	},

	async create(app: App, body: CreateLessonBodyDto, version: string = 'v1') {
		const response = await request(app)
			.post('/lessons')
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	},

	async update(
		app: App,
		id: string,
		body?: UpdateLessonBodyDto,
		version: string = 'v1',
	) {
		const response = await request(app)
			.patch(`/lessons/${id}`)
			.set('Content-Type', 'application/json')
			.send(body)

		return response
	},

	async remove(app: App, id: string, version: string = 'v1') {
		const response = await request(app)
			.delete(`/lessons/${id}`)
			.set('Content-Type', 'application/json')

		return response
	},
}
