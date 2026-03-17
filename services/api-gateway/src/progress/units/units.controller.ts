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
import { UnitProgressService } from './units.service'
import {
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiNotImplementedResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger'
import { ListUnitProgressQueryDto } from './dtos/list.dto'
import { FindUnitProgressForUserResponseDto } from './dtos/responses/find-for-user.dto'
import { ListUnitProgressResponseDto } from './dtos/responses/list.dto'
import { RemoveUnitProgressResponseDto } from './dtos/responses/remove.dto'
import { StartUnitResponseDto } from './dtos/responses/start.dto'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
} from '@pathly-backend/common/index.js'
import { listUnitProgressSchema } from './schemas'
import { User } from '@/common/auth/user.decorator'
import type { UserInfo } from '@/common/auth/user-info.type'
import { ExceptionMessage } from '@/common/enums'
import { clientUnitProgressToResponseDto } from './helpers'
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js'
import { JwtGuard } from '@/common/auth/jwt.guard'

@UseGuards(JwtGuard)
@Controller({
	path: 'units',
})
export class UnitProgressController {
	constructor(
		@Inject(UnitProgressService)
		private readonly unitProgressService: UnitProgressService,
	) {}

	@ApiQuery({ type: ListUnitProgressQueryDto })
	@ApiOkResponse({ type: ListUnitProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listUnitProgressSchema))
		query: ListUnitProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListUnitProgressResponseDto> {
		try {
			const result = await this.unitProgressService.list({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			})

			return {
				unitProgress: Array.from(result.unitProgress).map(
					clientUnitProgressToResponseDto,
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
	@ApiOkResponse({ type: FindUnitProgressForUserResponseDto })
	@Get(':unitId')
	async findForUser(
		@Param('unitId', ParseUUIDPipe) unitId: string,
		@User() user: UserInfo,
	): Promise<FindUnitProgressForUserResponseDto> {
		try {
			const result = await this.unitProgressService.findForUser({
				unitId,
				userId: user.id,
			})

			return {
				unitProgress: clientUnitProgressToResponseDto(result.unitProgress!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.UNIT_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.UNIT_NOT_FOUND),
					)
				case ProgressApiErrorCodes.UNIT_PROGRESS_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.UNIT_PROGRESS_NOT_FOUND),
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
	@ApiOkResponse({ type: StartUnitResponseDto })
	@Patch(':unitId/start')
	async start(
		@Param('unitId', ParseUUIDPipe) unitId: string,
		@User() user: UserInfo,
	): Promise<StartUnitResponseDto> {
		try {
			const result = await this.unitProgressService.start({
				unitId,
				userId: user.id,
			})

			return {
				unitProgress: clientUnitProgressToResponseDto(result.unitProgress!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case ProgressApiErrorCodes.UNIT_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.UNIT_NOT_FOUND),
					)
				case ProgressApiErrorCodes.SECTION_NOT_STARTED:
					throw new ConflictException(
						new HttpErrorDto(ExceptionMessage.SECTION_NOT_STARTED),
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
	@ApiOkResponse({ type: RemoveUnitProgressResponseDto })
	@Delete(':unitId')
	async remove(
		@Param('unitId', ParseUUIDPipe) unitId: string,
		@User() user: UserInfo,
	): Promise<RemoveUnitProgressResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		)
	}
}
