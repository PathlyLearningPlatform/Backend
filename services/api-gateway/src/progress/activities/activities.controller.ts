import {
	ConflictException,
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	NotImplementedException,
	Param,
	ParseUUIDPipe,
	Patch,
	Query,
	UseGuards,
} from '@nestjs/common'
import { ActivityProgressService } from './activities.service'
import {
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiNotImplementedResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger'
import {
	CompleteActivityResponseDto,
	FindOneActivityProgressResponseDto,
	ListActivityProgressQueryDto,
	ListActivityProgressResponseDto,
	RemoveActivityProgressByIdResponseDto,
	StartActivityResponseDto,
} from './dtos'
import {
	GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
} from '@pathly-backend/common/index.js'
import { listActivityProgressSchema } from './schemas'
import { User } from '@/common/decorators'
import { type UserInfo } from '@/common/types'
import { ExceptionMessage } from '@/common/enums'
import { clientActivityProgressToResponseDto } from './helpers'
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js'
import { JwtGuard } from '@/common/modules/auth/jwt.guard'

@UseGuards(JwtGuard)
@Controller({
	path: 'activities',
})
export class ActivityProgressController {
	constructor(
		@Inject(ActivityProgressService)
		private readonly activityProgressService: ActivityProgressService,
	) {}

	@ApiQuery({ type: ListActivityProgressQueryDto })
	@ApiOkResponse({ type: ListActivityProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listActivityProgressSchema))
		query: ListActivityProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListActivityProgressResponseDto> {
		try {
			const result = await this.activityProgressService.list({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			})

			return {
				activityProgress: Array.from(result.activityProgress).map(
					clientActivityProgressToResponseDto,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiOkResponse({ type: FindOneActivityProgressResponseDto })
	@Get(':activityId')
	async findOne(
		@Param('activityId', ParseUUIDPipe) activityId: string,
		@User() user: UserInfo,
	): Promise<FindOneActivityProgressResponseDto> {
		try {
			const result = await this.activityProgressService.findOne({
				activityId: activityId,
				userId: user.id,
			})

			return {
				activityProgress: clientActivityProgressToResponseDto(
					result.activityProgress!,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
					)
				case ProgressApiErrorCodes.ACTIVITY_PROGRESS_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.ACTIVITY_PROGRESS_NOT_FOUND),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiConflictResponse({ type: HttpErrorResponse })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiOkResponse({ type: StartActivityResponseDto })
	@Patch(':activityId/start')
	async start(
		@Param('activityId', ParseUUIDPipe) activityId: string,
		@User() user: UserInfo,
	): Promise<StartActivityResponseDto> {
		try {
			const result = await this.activityProgressService.start({
				activityId: activityId,
				userId: user.id,
			})

			return {
				activityProgress: clientActivityProgressToResponseDto(
					result.activityProgress!,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
					)
				case ProgressApiErrorCodes.ACTIVITY_ALREADY_COMPLETED:
					throw new ConflictException(
						new HttpErrorDto(ExceptionMessage.ACTIVITY_ALREADY_COMPLETED),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiOkResponse({ type: CompleteActivityResponseDto })
	@Patch(':activityId/complete')
	async complete(
		@Param('activityId', ParseUUIDPipe) activityId: string,
		@User() user: UserInfo,
	): Promise<CompleteActivityResponseDto> {
		try {
			const result = await this.activityProgressService.complete({
				activityId: activityId,
				userId: user.id,
			})

			return {
				activityProgress: clientActivityProgressToResponseDto(
					result.activityProgress!,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.ACTIVITY_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
					)
				case ProgressApiErrorCodes.ACTIVITY_PROGRESS_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.ACTIVITY_PROGRESS_NOT_FOUND),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiNotImplementedResponse({ type: HttpErrorResponse })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiOkResponse({ type: RemoveActivityProgressByIdResponseDto })
	@Delete(':activityId')
	async removeById(
		@Param('activityId', ParseUUIDPipe) activityId: string,
		@User() user: UserInfo,
	): Promise<RemoveActivityProgressByIdResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		)
	}
}
