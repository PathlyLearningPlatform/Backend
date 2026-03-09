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
import { CreateArticleDto, UpdateArticleDto } from './dtos'
import {
	CreateArticleResponseDto,
	FindOneArticleResponseDto,
	UpdateArticleResponseDto,
} from './dtos/responses'
import { clientArticleToResponseDto } from './helpers'
import { createArticleSchema, updateArticlePropsSchema } from './schemas'

@Controller({
	path: 'articles',
	version: '1',
})
export class ArticlesController {
	constructor(
		@Inject(ActivitiesService)
		private readonly activitiesService: ActivitiesService,
	) {}

	@ApiOkResponse({ type: FindOneArticleResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneArticleResponseDto> {
		try {
			const result = await this.activitiesService.findArticleById({
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

	@ApiBody({ type: CreateArticleDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: CreateArticleResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createArticleSchema))
		body: CreateArticleDto,
	): Promise<CreateArticleResponseDto> {
		try {
			const result = await this.activitiesService.createArticle({
				name: body.name,
				description: nullToEmptyString(body.description),
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

	@ApiBody({ type: UpdateArticleDto })
	@ApiOkResponse({ type: UpdateArticleResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateArticlePropsSchema))
		body: UpdateArticleDto,
	): Promise<UpdateArticleResponseDto> {
		try {
			const result = await this.activitiesService.updateArticle({
				where: { activityId: id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
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
