import {
	Body,
	ConflictException,
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
	ApiConflictResponse,
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
	CreateLessonBodyDto,
	CreateLessonResponseDto,
	FindOneLessonResponseDto,
	FindLessonsQueryDto,
	FindLessonsResponseDto,
	RemoveLessonResponseDto,
	UpdateLessonBodyDto,
	UpdateLessonResponseDto,
} from './dtos'
import { clientLessonToResponseDto } from './helpers'
import {
	createLessonBodySchema,
	findLessonsQuerySchema,
	updateLessonBodySchema,
} from './schemas'
import { LessonsService } from './lessons.service'
import { exceptionCodeToMessage } from '../common/helpers'

@Controller({
	path: 'lessons',
	version: '1',
})
export class LessonsController {
	constructor(
		@Inject(LessonsService) private readonly lessonsService: LessonsService,
	) {}

	@ApiQuery({ type: FindLessonsQueryDto })
	@ApiOkResponse({ type: FindLessonsResponseDto })
	@Get()
	async find(
		@Query(new HttpValidationPipe(findLessonsQuerySchema))
		query: FindLessonsQueryDto,
	): Promise<FindLessonsResponseDto> {
		try {
			const result = await this.lessonsService.find({
				options: query,
			})

			return {
				lessons: Array.from(result.lessons).map(clientLessonToResponseDto),
			}
		} catch (err) {
			console.log(err)

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

	@ApiOkResponse({ type: FindOneLessonResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findOne(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneLessonResponseDto> {
		try {
			const result = await this.lessonsService.findOne({ where: { id } })

			return {
				lesson: clientLessonToResponseDto(result.lesson!),
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

	@ApiBody({ type: CreateLessonBodyDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: CreateLessonResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createLessonBodySchema))
		body: CreateLessonBodyDto,
	): Promise<CreateLessonResponseDto> {
		try {
			const result = await this.lessonsService.create({
				name: body.name,
				description: nullToEmptyString(body.description),
				order: body.order,
				unitId: body.unitId,
			})

			return {
				lesson: clientLessonToResponseDto(result.lesson!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.UNIT_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.UNIT_NOT_FOUND],
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

	@ApiBody({ type: UpdateLessonBodyDto })
	@ApiOkResponse({ type: UpdateLessonResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateLessonBodySchema))
		body: UpdateLessonBodyDto,
	): Promise<UpdateLessonResponseDto> {
		try {
			const result = await this.lessonsService.update({
				where: { id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
					order: body.order,
				},
			})

			return {
				lesson: clientLessonToResponseDto(result.lesson!),
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

	@ApiOkResponse({
		type: RemoveLessonResponseDto,
	})
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<RemoveLessonResponseDto> {
		try {
			const result = await this.lessonsService.remove({ where: { id } })

			return {
				lesson: clientLessonToResponseDto(result.lesson!),
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
				case LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED:
					throw new ConflictException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LESSON_CANNOT_BE_REMOVED
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
