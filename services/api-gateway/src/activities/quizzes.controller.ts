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
} from '@nestjs/common'
import {
	ApiBody,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
} from '@nestjs/swagger'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
	nullToEmptyString,
} from '@pathly-backend/common/index.js'
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js'
import { exceptionCodeToMessage } from '../common/helpers'
import { ActivitiesService } from './activities.service'
import {
	CreateQuestionDto,
	CreateQuizDto,
	UpdateQuestionDto,
	UpdateQuizDto,
} from './dtos'
import {
	CreateQuestionResponseDto,
	CreateQuizResponseDto,
	FindOneQuestionResponseDto,
	FindOneQuizResponseDto,
	FindQuestionsResponseDto,
	RemoveQuestionResponseDto,
	UpdateQuestionResponseDto,
	UpdateQuizResponseDto,
} from './dtos/responses'
import { clientQuestionToResponseDto, clientQuizToResponseDto } from './helpers'
import {
	createQuestionSchema,
	createQuizSchema,
	updateQuestionSchema,
	updateQuizPropsSchema,
} from './schemas'

@Controller({
	path: 'quizzes',
	version: '1',
})
export class QuizzesController {
	constructor(
		@Inject(ActivitiesService)
		private readonly activitiesService: ActivitiesService,
	) {}

	@ApiOkResponse({ type: FindOneQuizResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneQuizResponseDto> {
		try {
			const result = await this.activitiesService.findQuizById({
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

	@ApiBody({ type: CreateQuizDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: CreateQuizResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createQuizSchema))
		body: CreateQuizDto,
	): Promise<CreateQuizResponseDto> {
		try {
			const result = await this.activitiesService.createQuiz({
				name: body.name,
				description: nullToEmptyString(body.description),
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

	@ApiBody({ type: UpdateQuizDto })
	@ApiOkResponse({ type: UpdateQuizResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateQuizPropsSchema))
		body: UpdateQuizDto,
	): Promise<UpdateQuizResponseDto> {
		try {
			const result = await this.activitiesService.updateQuiz({
				where: { activityId: id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
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
				case LearningPathsApiErrorCodes.LESSON_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LESSON_NOT_FOUND
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

	@ApiOkResponse({
		type: FindQuestionsResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Get(':id/questions')
	async listQuestions(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindQuestionsResponseDto> {
		try {
			const result = await this.activitiesService.findQuizById({
				where: { id },
			})

			return {
				questions: Array.from(result.quiz!.questions).map(
					clientQuestionToResponseDto,
				),
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

	@ApiOkResponse({
		type: FindOneQuestionResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Get(':id/questions/:questionId')
	async findQuestionById(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('questionId', ParseUUIDPipe) questionId: string,
	): Promise<FindOneQuestionResponseDto> {
		try {
			const result = await this.activitiesService.findQuestionById({
				where: {
					quizId: id,
					id: questionId,
				},
			})

			return {
				question: clientQuestionToResponseDto(result.question!),
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
				case LearningPathsApiErrorCodes.QUESTION_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.QUESTION_NOT_FOUND
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

	@ApiCreatedResponse({
		type: CreateQuestionResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Post(':id/questions')
	async createQuestion(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(createQuestionSchema))
		body: CreateQuestionDto,
	): Promise<CreateQuestionResponseDto> {
		try {
			const result = await this.activitiesService.createQuestion({
				content: body.content,
				correctAnswer: body.correctAnswer,
				quizId: id,
			})

			return {
				question: clientQuestionToResponseDto(result.question!),
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

	@ApiOkResponse({
		type: UpdateQuestionResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Patch(':id/questions/:questionId')
	async updateQuestion(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('questionId', ParseUUIDPipe) questionId: string,
		@Body(new HttpValidationPipe(updateQuestionSchema))
		body: UpdateQuestionDto,
	): Promise<UpdateQuestionResponseDto> {
		try {
			const result = await this.activitiesService.updateQuestion({
				fields: {
					content: body.content,
					correctAnswer: body.correctAnswer,
				},
				where: {
					id: questionId,
					quizId: id,
				},
			})

			return {
				question: clientQuestionToResponseDto(result.question!),
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
				case LearningPathsApiErrorCodes.QUESTION_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.QUESTION_NOT_FOUND
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

	@ApiOkResponse({
		type: RemoveQuestionResponseDto,
	})
	@ApiNotFoundResponse({
		type: HttpErrorDto,
	})
	@Delete(':id/questions/:questionId')
	async removeQuestion(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('questionId', ParseUUIDPipe) questionId: string,
	): Promise<RemoveQuestionResponseDto> {
		try {
			await this.activitiesService.removeQuestion({
				where: {
					id: questionId,
					quizId: id,
				},
			})

			return {}
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
				case LearningPathsApiErrorCodes.QUESTION_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.QUESTION_NOT_FOUND
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
