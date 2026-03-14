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
import { LessonProgressService } from './lessons.service'
import {
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiNotImplementedResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger'
import { ListLessonProgressQueryDto } from './dtos/list.dto.js'
import { FindOneLessonProgressResponseDto } from './dtos/responses/find-one.dto.js'
import { ListLessonProgressResponseDto } from './dtos/responses/list.dto.js'
import { RemoveLessonProgressByIdResponseDto } from './dtos/responses/remove-by-id.dto.js'
import { StartLessonResponseDto } from './dtos/responses/start.dto.js'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
} from '@pathly-backend/common/index.js'
import { listLessonProgressSchema } from './schemas/index.js'
import { User } from '@/common/decorators'
import type { UserInfo } from '@/common/types'
import { ExceptionMessage } from '@/common/enums'
import { clientLessonProgressToResponseDto } from './helpers/index.js'
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js'
import { JwtGuard } from '@/common/modules/auth/jwt.guard'

@UseGuards(JwtGuard)
@Controller({
	path: 'lessons',
})
export class LessonProgressController {
	constructor(
		@Inject(LessonProgressService)
		private readonly lessonProgressService: LessonProgressService,
	) {}

	@ApiQuery({ type: ListLessonProgressQueryDto })
	@ApiOkResponse({ type: ListLessonProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listLessonProgressSchema))
		query: ListLessonProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListLessonProgressResponseDto> {
		try {
			const result = await this.lessonProgressService.list({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			})

			return {
				lessonProgress: Array.from(result.lessonProgress).map(
					clientLessonProgressToResponseDto,
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
	@ApiOkResponse({ type: FindOneLessonProgressResponseDto })
	@Get(':lessonId')
	async findOne(
		@Param('lessonId', ParseUUIDPipe) lessonId: string,
		@User() user: UserInfo,
	): Promise<FindOneLessonProgressResponseDto> {
		try {
			const result = await this.lessonProgressService.findOneForUser({
				lessonId,
				userId: user.id,
			})

			return {
				lessonProgress: clientLessonProgressToResponseDto(
					result.lessonProgress!,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.LESSON_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.LESSON_NOT_FOUND),
					)
				case ProgressApiErrorCodes.LESSON_PROGRESS_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.LESSON_PROGRESS_NOT_FOUND),
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
	@ApiOkResponse({ type: StartLessonResponseDto })
	@Patch(':lessonId/start')
	async start(
		@Param('lessonId', ParseUUIDPipe) lessonId: string,
		@User() user: UserInfo,
	): Promise<StartLessonResponseDto> {
		try {
			const result = await this.lessonProgressService.start({
				lessonId,
				userId: user.id,
			})

			return {
				lessonProgress: clientLessonProgressToResponseDto(
					result.lessonProgress!,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.LESSON_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.LESSON_NOT_FOUND),
					)
				case ProgressApiErrorCodes.LESSON_ALREADY_COMPLETED:
					throw new ConflictException(
						new HttpErrorDto(ExceptionMessage.LESSON_ALREADY_COMPLETED),
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
	@ApiOkResponse({ type: RemoveLessonProgressByIdResponseDto })
	@Delete(':lessonId')
	async removeById(
		@Param('lessonId', ParseUUIDPipe) _lessonId: string,
		@User() _user: UserInfo,
	): Promise<RemoveLessonProgressByIdResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		)
	}
}
