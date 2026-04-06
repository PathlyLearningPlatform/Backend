import {
	BadRequestException,
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
	UseGuards,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiNotImplementedResponse,
	ApiOkResponse,
} from '@nestjs/swagger'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
} from '@pathly-backend/common/index.js'
import { SkillsApiErrorCodes } from '@pathly-backend/contracts/skills/v1/api.js'
import { JwtGuard } from '@/common/auth/jwt.guard'
import { User } from '@/common/auth/user.decorator'
import type { UserInfo } from '@/common/auth/user-info.type'
import { ExceptionMessage } from '@/common/enums'
import {
	FindSkillProgressForUserResponseDto,
	ListSkillProgressResponseDto,
	RemoveSkillProgressResponseDto,
	UnlockSkillResponseDto,
} from './dtos'
import { clientSkillProgressToResponseDto } from './helpers'
import { SkillProgressService } from './skills.service'

const ZERO_UUID = '00000000-0000-0000-0000-000000000000'

@UseGuards(JwtGuard)
@Controller({
	path: 'skills',
})
export class SkillProgressController {
	constructor(
		@Inject(SkillProgressService)
		private readonly skillProgressService: SkillProgressService,
	) {}

	@ApiOkResponse({ type: ListSkillProgressResponseDto })
	@Get()
	async list(@User() user: UserInfo): Promise<ListSkillProgressResponseDto> {
		try {
			const result = await this.skillProgressService.findForUser({
				skillId: ZERO_UUID,
				userId: user.id,
			})

			return {
				skillProgress: Array.from(result.skillProgress).map(
					clientSkillProgressToResponseDto,
				),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case SkillsApiErrorCodes.VALIDATION_ERROR:
					throw new BadRequestException(
						new HttpErrorDto(ExceptionMessage.VALIDATION_ERROR),
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
	@ApiOkResponse({ type: FindSkillProgressForUserResponseDto })
	@Get(':skillId')
	async findForUser(
		@Param('skillId', ParseUUIDPipe) skillId: string,
		@User() user: UserInfo,
	): Promise<FindSkillProgressForUserResponseDto> {
		try {
			const result = await this.skillProgressService.findOneForUser({
				skillId,
				userId: user.id,
			})

			if (!result.skillProgress) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_PROGRESS_NOT_FOUND),
				)
			}

			return {
				skillProgress: clientSkillProgressToResponseDto(result.skillProgress),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case SkillsApiErrorCodes.SKILL_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
					)
				case SkillsApiErrorCodes.SKILL_PROGRESS_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.SKILL_PROGRESS_NOT_FOUND),
					)
				case SkillsApiErrorCodes.VALIDATION_ERROR:
					throw new BadRequestException(
						new HttpErrorDto(ExceptionMessage.VALIDATION_ERROR),
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
	@ApiBadRequestResponse({ type: HttpErrorResponse })
	@ApiOkResponse({ type: UnlockSkillResponseDto })
	@Patch(':skillId/unlock')
	async unlock(
		@Param('skillId', ParseUUIDPipe) skillId: string,
		@User() user: UserInfo,
	): Promise<UnlockSkillResponseDto> {
		try {
			await this.skillProgressService.unlock({
				skillId,
				userId: user.id,
			})

			const result = await this.skillProgressService.findOneForUser({
				skillId,
				userId: user.id,
			})

			if (!result.skillProgress) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_PROGRESS_NOT_FOUND),
				)
			}

			return {
				skillProgress: clientSkillProgressToResponseDto(result.skillProgress),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case SkillsApiErrorCodes.SKILL_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
					)
				case SkillsApiErrorCodes.SKILL_PROGRESS_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(ExceptionMessage.SKILL_PROGRESS_NOT_FOUND),
					)
				case SkillsApiErrorCodes.VALIDATION_ERROR:
					throw new BadRequestException(
						new HttpErrorDto(ExceptionMessage.VALIDATION_ERROR),
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
	@ApiOkResponse({ type: RemoveSkillProgressResponseDto })
	@Delete(':skillId')
	async remove(
		@Param('skillId', ParseUUIDPipe) _skillId: string,
		@User() _user: UserInfo,
	): Promise<RemoveSkillProgressResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		)
	}
}
