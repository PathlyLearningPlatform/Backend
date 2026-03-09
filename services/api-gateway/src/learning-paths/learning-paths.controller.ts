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
import { ExceptionMessage } from '../common/enums'
import {
	domainSortTypeToClient,
	exceptionCodeToMessage,
} from '../common/helpers'
import {
	CreateLearningPathBodyDto,
	CreateLearningPathResponseDto,
	FindLearningPathsQueryDto,
	FindLearningPathsResponseDto,
	FindOneLearningPathResponseDto,
	UpdateLearningPathBodyDto,
	UpdateLearningPathResponseDto,
} from './dtos'
import { clientLearningPathToResponseDto } from './helpers'
import { LearningPathsService } from './learning-paths.service'
import {
	createLearningPathBodySchema,
	findLearningPathsQuerySchema,
	updateLearningPathBodySchema,
} from './schemas'

@Controller({
	path: 'learning-paths',
	version: '1',
})
export class LearningPathsController {
	constructor(
		@Inject(LearningPathsService)
		private readonly learningPathsService: LearningPathsService,
	) {}

	@ApiQuery({ type: FindLearningPathsQueryDto })
	@ApiOkResponse({ type: FindLearningPathsResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(findLearningPathsQuerySchema))
		query: FindLearningPathsQueryDto,
	): Promise<FindLearningPathsResponseDto> {
		try {
			const result = await this.learningPathsService.list({
				options: {
					limit: query.limit,
					page: query.page
				},
			})

			return {
				paths: Array.from(result.learningPaths).map(
					clientLearningPathToResponseDto,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[ExceptionMessage.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({ type: FindOneLearningPathResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneLearningPathResponseDto> {
		try {
			const result = await this.learningPathsService.findById({ where: { id } })

			return {
				path: clientLearningPathToResponseDto(result.learningPath!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[ExceptionMessage.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiBody({ type: CreateLearningPathBodyDto })
	@ApiCreatedResponse({ type: CreateLearningPathResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createLearningPathBodySchema))
		body: CreateLearningPathBodyDto,
	): Promise<CreateLearningPathResponseDto> {
		try {
			const result = await this.learningPathsService.create({
				name: body.name,
				description: nullToEmptyString(body.description),
			})

			return {
				path: clientLearningPathToResponseDto(result.learningPath!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[ExceptionMessage.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiBody({ type: UpdateLearningPathBodyDto })
	@ApiOkResponse({ type: UpdateLearningPathResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateLearningPathBodySchema))
		body: UpdateLearningPathBodyDto,
	): Promise<UpdateLearningPathResponseDto> {
		try {
			const result = await this.learningPathsService.update({
				where: { id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
				},
			})

			return {
				path: clientLearningPathToResponseDto(result.learningPath!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[ExceptionMessage.INTERNAL_ERROR],
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
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.learningPathsService.remove({ where: { id } })
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND
							],
						),
					)
				case LearningPathsApiErrorCodes.LEARNING_PATH_CANNOT_BE_REMOVED:
					throw new ConflictException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.LEARNING_PATH_CANNOT_BE_REMOVED
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[ExceptionMessage.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
}
