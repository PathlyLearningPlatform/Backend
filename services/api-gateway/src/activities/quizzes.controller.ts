import {
	Body,
	Controller,
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
import { CreateQuizDto, UpdateQuizDto } from './dtos'
import {
	CreateQuizResponseDto,
	FindOneQuizResponseDto,
	UpdateQuizResponseDto,
} from './dtos/responses'
import { clientQuizToResponseDto } from './helpers'
import { createQuizSchema, updateQuizPropsSchema } from './schemas'

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
	async findOne(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneQuizResponseDto> {
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

	@ApiBody({ type: CreateQuizResponseDto })
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
}
