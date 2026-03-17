import {
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
import { LearningPathProgressService } from './learning-paths.service'
import {
	ApiNotFoundResponse,
	ApiNotImplementedResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger'
import { ListLearningPathProgressQueryDto } from './dtos/list.dto'
import { FindLearningPathProgressForUserResponseDto } from './dtos/responses/find-for-user.dto'
import { ListLearningPathProgressResponseDto } from './dtos/responses/list.dto'
import { RemoveLearningPathProgressResponseDto } from './dtos/responses/remove.dto'
import { StartLearningPathResponseDto } from './dtos/responses/start.dto'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
} from '@pathly-backend/common/index.js'
import { listLearningPathProgressSchema } from './schemas'
import { User } from '@/common/auth/user.decorator'
import type { UserInfo } from '@/common/auth/user-info.type'
import { ExceptionMessage } from '@/common/enums'
import { clientLearningPathProgressToResponseDto } from './helpers'
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js'
import { JwtGuard } from '@/common/auth/jwt.guard'

@UseGuards(JwtGuard)
@Controller({
	path: 'learning-paths',
})
export class LearningPathProgressController {
	constructor(
		@Inject(LearningPathProgressService)
		private readonly learningPathProgressService: LearningPathProgressService,
	) {}

	@ApiQuery({ type: ListLearningPathProgressQueryDto })
	@ApiOkResponse({ type: ListLearningPathProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listLearningPathProgressSchema))
		query: ListLearningPathProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListLearningPathProgressResponseDto> {
		try {
			const result = await this.learningPathProgressService.list({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			})

			return {
				learningPathProgress: Array.from(result.learningPathProgress).map(
					clientLearningPathProgressToResponseDto,
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
	@ApiOkResponse({ type: FindLearningPathProgressForUserResponseDto })
	@Get(':learningPathId')
	async findForUser(
		@Param('learningPathId', ParseUUIDPipe) learningPathId: string,
		@User() user: UserInfo,
	): Promise<FindLearningPathProgressForUserResponseDto> {
		try {
			const result = await this.learningPathProgressService.findForUser({
				learningPathId,
				userId: user.id,
			})

			return {
				learningPathProgress: clientLearningPathProgressToResponseDto(
					result.learningPathProgress!,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.LEARNING_PATH_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_FOUND),
					)
				case ProgressApiErrorCodes.LEARNING_PATH_PROGRESS_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.LEARNING_PATH_PROGRESS_NOT_FOUND),
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
	@ApiOkResponse({ type: StartLearningPathResponseDto })
	@Patch(':learningPathId/start')
	async start(
		@Param('learningPathId', ParseUUIDPipe) learningPathId: string,
		@User() user: UserInfo,
	): Promise<StartLearningPathResponseDto> {
		try {
			const result = await this.learningPathProgressService.start({
				learningPathId,
				userId: user.id,
			})

			return {
				learningPathProgress: clientLearningPathProgressToResponseDto(
					result.learningPathProgress!,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.LEARNING_PATH_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_FOUND),
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
	@ApiOkResponse({ type: RemoveLearningPathProgressResponseDto })
	@Delete(':learningPathId')
	async remove(
		@Param('learningPathId', ParseUUIDPipe) learningPathId: string,
		@User() user: UserInfo,
	): Promise<RemoveLearningPathProgressResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		)
	}
}
