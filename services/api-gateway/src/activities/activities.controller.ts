import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import {
	ApiBody,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
	nullToEmptyString,
} from '@pathly-backend/common/index.js'
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js'
import {
	FindActivitiesQueryDto,
	CreateArticleDto,
	UpdateArticleDto,
	CreateExerciseDto,
	CreateQuizDto,
	UpdateExerciseDto,
	UpdateQuizDto,
} from './dtos'
import {
	clientActivityToResponseDto,
	clientArticleToResponseDto,
	clientExerciseToResponseDto,
	clientQuizToResponseDto,
} from './helpers'
import {
	createArticleSchema,
	createExerciseSchema,
	createQuizSchema,
	findActivitiesSchema,
	updateArticlePropsSchema,
	updateExercisePropsSchema,
	updateQuizPropsSchema,
} from './schemas'
import { ActivitiesService } from './activities.service'
import { exceptionCodeToMessage } from '../common/helpers'
import {
	ActivitiesResponse,
	ActivityResponse,
	ArticleResponse,
	ExerciseResponse,
	QuizResponse,
} from './dtos/responses'

@Controller({
	path: 'activities',
	version: '1',
})
export class ActivitiesController {
	constructor(
		@Inject(ActivitiesService)
		private readonly activitiesService: ActivitiesService,
	) {}

	@ApiQuery({ type: FindActivitiesQueryDto })
	@ApiOkResponse({ type: ActivitiesResponse })
	@Get()
	async find(
		@Query(new HttpValidationPipe(findActivitiesSchema))
		query: FindActivitiesQueryDto,
	): Promise<ActivitiesResponse> {
		try {
			const result = await this.activitiesService.find({
				options: { limit: query.limit, page: query.page },
			})

			return {
				activities: Array.from(result.activities).map(
					clientActivityToResponseDto,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({ type: ActivityResponse })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findOne(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<ActivityResponse> {
		try {
			const result = await this.activitiesService.findOne({ where: { id } })

			return {
				activity: clientActivityToResponseDto(result.activity!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
	@ApiOkResponse({ type: ArticleResponse })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id/article')
	async findOneArticle(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<ArticleResponse> {
		try {
			const result = await this.activitiesService.findOneArticle({
				where: { id },
			})

			return {
				article: clientArticleToResponseDto(result.article!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
	@ApiOkResponse({ type: ExerciseResponse })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id/exercise')
	async findOneExercise(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<ExerciseResponse> {
		try {
			const result = await this.activitiesService.findOneExercise({
				where: { id },
			})

			return {
				exercise: clientExerciseToResponseDto(result.exercise!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
	@ApiOkResponse({ type: QuizResponse })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id/quiz')
	async findOneQuiz(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<QuizResponse> {
		try {
			const result = await this.activitiesService.findOneQuiz({
				where: { id },
			})

			return {
				quiz: clientQuizToResponseDto(result.quiz!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiBody({ type: CreateArticleDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: ArticleResponse })
	@Post('article')
	async createArticle(
		@Body(new HttpValidationPipe(createArticleSchema))
		body: CreateArticleDto,
	): Promise<ArticleResponse> {
		try {
			const result = await this.activitiesService.createArticle({
				name: body.name,
				description: nullToEmptyString(body.description),
				order: body.order,
				lessonId: body.lessonId,
				ref: body.ref,
			})

			return {
				article: clientArticleToResponseDto(result.article!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LESSON_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LESSON_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
	@ApiBody({ type: CreateQuizDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: QuizResponse })
	@Post('quiz')
	async createQuiz(
		@Body(new HttpValidationPipe(createQuizSchema))
		body: CreateQuizDto,
	): Promise<QuizResponse> {
		try {
			const result = await this.activitiesService.createQuiz({
				name: body.name,
				description: nullToEmptyString(body.description),
				order: body.order,
				lessonId: body.lessonId,
			})

			return {
				quiz: clientQuizToResponseDto(result.quiz!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LESSON_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LESSON_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
	@ApiBody({ type: CreateExerciseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: ExerciseResponse })
	@Post('exercise')
	async createExercise(
		@Body(new HttpValidationPipe(createExerciseSchema))
		body: CreateExerciseDto,
	): Promise<ExerciseResponse> {
		try {
			const result = await this.activitiesService.createExercise({
				name: body.name,
				description: nullToEmptyString(body.description),
				order: body.order,
				lessonId: body.lessonId,
				difficulty: body.difficulty,
			})

			return {
				exercise: clientExerciseToResponseDto(result.exercise!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LESSON_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LESSON_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiBody({ type: UpdateArticleDto })
	@ApiOkResponse({ type: ArticleResponse })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id/article')
	async updateArticle(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateArticlePropsSchema))
		body: UpdateArticleDto,
	): Promise<ArticleResponse> {
		try {
			const result = await this.activitiesService.updateArticle({
				where: { activityId: id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
					order: body.order,
					ref: body.ref,
					lessonId: body.lessonId,
				},
			})

			return {
				article: clientArticleToResponseDto(result.article!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED
							],
						),
					)
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
	@ApiBody({ type: UpdateExerciseDto })
	@ApiOkResponse({ type: ExerciseResponse })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id/exercise')
	async updateExercise(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateExercisePropsSchema))
		body: UpdateExerciseDto,
	): Promise<ExerciseResponse> {
		try {
			const result = await this.activitiesService.updateExercise({
				where: { activityId: id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
					order: body.order,
					lessonId: body.lessonId,
					difficulty: body.difficulty,
				},
			})

			return {
				exercise: clientExerciseToResponseDto(result.exercise!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED
							],
						),
					)
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
	@ApiBody({ type: UpdateQuizDto })
	@ApiOkResponse({ type: QuizResponse })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id/quiz')
	async updateQuiz(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateQuizPropsSchema))
		body: UpdateQuizDto,
	): Promise<QuizResponse> {
		try {
			const result = await this.activitiesService.updateQuiz({
				where: { activityId: id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
					order: body.order,
					lessonId: body.lessonId,
				},
			})

			return {
				quiz: clientQuizToResponseDto(result.quiz!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED
							],
						),
					)
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.activitiesService.remove({ where: { id } })
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
}
