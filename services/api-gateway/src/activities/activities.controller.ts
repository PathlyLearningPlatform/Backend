import {
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
} from '@pathly-backend/common/index.js'
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js'
import { exceptionCodeToMessage } from '../common/helpers'
import { ActivitiesService } from './activities.service'
import { FindActivitiesQueryDto } from './dtos'
import {
	FindActivitiesResponseDto,
	FindOneActivityResponseDto,
} from './dtos/responses'
import { clientActivityToResponseDto } from './helpers'
import { findActivitiesSchema } from './schemas'

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
	@ApiOkResponse({ type: FindActivitiesResponseDto })
	@Get()
	async find(
		@Query(new HttpValidationPipe(findActivitiesSchema))
		query: FindActivitiesQueryDto,
	): Promise<FindActivitiesResponseDto> {
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

	@ApiOkResponse({ type: FindOneActivityResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findOne(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneActivityResponseDto> {
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
