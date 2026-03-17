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
import { SectionProgressService } from './sections.service'
import {
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiNotImplementedResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger'
import { ListSectionProgressQueryDto } from './dtos/list.dto'
import { FindSectionProgressForUserResponseDto } from './dtos/responses/find-for-user.dto'
import { ListSectionProgressResponseDto } from './dtos/responses/list.dto'
import { RemoveSectionProgressResponseDto } from './dtos/responses/remove.dto'
import { StartSectionResponseDto } from './dtos/responses/start.dto'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
} from '@pathly-backend/common/index.js'
import { listSectionProgressSchema } from './schemas'
import { User } from '@/common/auth/user.decorator'
import type { UserInfo } from '@/common/auth/user-info.type'
import { ExceptionMessage } from '@/common/enums'
import { clientSectionProgressToResponseDto } from './helpers'
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js'
import { JwtGuard } from '@/common/auth/jwt.guard'

@UseGuards(JwtGuard)
@Controller({
	path: 'sections',
})
export class SectionProgressController {
	constructor(
		@Inject(SectionProgressService)
		private readonly sectionProgressService: SectionProgressService,
	) {}

	@ApiQuery({ type: ListSectionProgressQueryDto })
	@ApiOkResponse({ type: ListSectionProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listSectionProgressSchema))
		query: ListSectionProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListSectionProgressResponseDto> {
		try {
			const result = await this.sectionProgressService.list({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			})

			return {
				sectionProgress: Array.from(result.sectionProgress).map(
					clientSectionProgressToResponseDto,
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
	@ApiOkResponse({ type: FindSectionProgressForUserResponseDto })
	@Get(':sectionId')
	async findForUser(
		@Param('sectionId', ParseUUIDPipe) sectionId: string,
		@User() user: UserInfo,
	): Promise<FindSectionProgressForUserResponseDto> {
		try {
			const result = await this.sectionProgressService.findForUser({
				sectionId,
				userId: user.id,
			})

			return {
				sectionProgress: clientSectionProgressToResponseDto(result.sectionProgress!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.SECTION_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.SECTION_NOT_FOUND),
					)
				case ProgressApiErrorCodes.SECTION_PROGRESS_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.SECTION_PROGRESS_NOT_FOUND),
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
	@ApiOkResponse({ type: StartSectionResponseDto })
	@Patch(':sectionId/start')
	async start(
		@Param('sectionId', ParseUUIDPipe) sectionId: string,
		@User() user: UserInfo,
	): Promise<StartSectionResponseDto> {
		try {
			const result = await this.sectionProgressService.start({
				sectionId,
				userId: user.id,
			})

			return {
				sectionProgress: clientSectionProgressToResponseDto(result.sectionProgress!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.SECTION_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.SECTION_NOT_FOUND),
					)
				case ProgressApiErrorCodes.LEARNING_PATH_NOT_STARTED:
					throw new ConflictException(
						new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_STARTED),
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
	@ApiOkResponse({ type: RemoveSectionProgressResponseDto })
	@Delete(':sectionId')
	async remove(
		@Param('sectionId', ParseUUIDPipe) sectionId: string,
		@User() user: UserInfo,
	): Promise<RemoveSectionProgressResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		)
	}
}
