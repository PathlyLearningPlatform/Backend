import {
	Body,
	ConflictException,
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
	ApiConflictResponse,
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
import { CreateExerciseDto, UpdateExerciseDto } from './dtos'
import {
	CreateExerciseResponseDto,
	FindOneExerciseResponseDto,
	UpdateExerciseResponseDto,
} from './dtos/responses'
import { clientExerciseToResponseDto } from './helpers'
import { createExerciseSchema, updateExercisePropsSchema } from './schemas'

@Controller({
	path: 'exercises',
	version: '1',
})
export class ExercisesController {
	constructor(
		@Inject(ActivitiesService)
		private readonly activitiesService: ActivitiesService,
	) {}

	@ApiOkResponse({ type: FindOneExerciseResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findOne(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneExerciseResponseDto> {
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

	@ApiBody({ type: CreateExerciseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: CreateExerciseResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createExerciseSchema))
		body: CreateExerciseDto,
	): Promise<CreateExerciseResponseDto> {
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
				case LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER:
					throw new ConflictException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER
							],
						),
					)
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

	@ApiBody({ type: UpdateExerciseDto })
	@ApiOkResponse({ type: UpdateExerciseResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateExercisePropsSchema))
		body: UpdateExerciseDto,
	): Promise<UpdateExerciseResponseDto> {
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
				case LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER:
					throw new ConflictException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.ACTIVITY_DUPLICATE_ORDER
							],
						),
					)
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
}
