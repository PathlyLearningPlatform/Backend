import {
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import type { UnlockSkillHandler } from '@/app/skills/commands';
import type {
	FindOneSkillProgressForUserHandler,
	ListSkillProgressForUserHandler,
} from '@/app/skills/queries';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@infra/common';
import { User } from '@infra/auth/user.decorator';
import { JwtGuard } from '@infra/auth/jwt.guard';
import type { UserInfo } from '@infra/auth/user-info.type';
import {
	FindSkillProgressForUserResponseDto,
	ListSkillProgressQueryDto,
	ListSkillProgressResponseDto,
	UnlockSkillResponseDto,
} from './dtos';
import {
	clientSkillProgressToResponseDto,
	clientSkillProgressesToResponseDto,
} from './helpers';
import { listSkillProgressQuerySchema } from './schemas';
import {
	SkillNotFoundException,
	SkillProgressNotFoundException,
} from '@/domain/skills';

@UseGuards(JwtGuard)
@Controller({
	path: 'progress/skills',
	version: '1',
})
export class SkillProgressController {
	constructor(
		@Inject(DiToken.UNLOCK_SKILL_HANDLER)
		private readonly unlockSkillHandler: UnlockSkillHandler,
		@Inject(DiToken.LIST_SKILL_PROGRESS_FOR_USER_HANDLER)
		private readonly listSkillProgressForUserHandler: ListSkillProgressForUserHandler,
		@Inject(DiToken.FIND_ONE_SKILL_PROGRESS_FOR_USER_HANDLER)
		private readonly findOneSkillProgressForUserHandler: FindOneSkillProgressForUserHandler,
	) {}

	@ApiQuery({ type: ListSkillProgressQueryDto })
	@ApiOkResponse({ type: ListSkillProgressResponseDto })
	@Get()
	async listForUser(
		@Query(new HttpValidationPipe(listSkillProgressQuerySchema))
		_query: ListSkillProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListSkillProgressResponseDto> {
		try {
			const result = await this.listSkillProgressForUserHandler.execute({
				userId: user.id,
			});

			return {
				skillProgress: clientSkillProgressesToResponseDto(result),
			};
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: FindSkillProgressForUserResponseDto })
	@Get(':skillId')
	async findOneForUser(
		@Param('skillId', ParseUUIDPipe) skillId: string,
		@User() user: UserInfo,
	): Promise<FindSkillProgressForUserResponseDto> {
		try {
			const result = await this.findOneSkillProgressForUserHandler.execute({
				skillId,
				userId: user.id,
			});

			return {
				skillProgress: clientSkillProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SkillNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
				);
			}

			if (err instanceof SkillProgressNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_PROGRESS_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: UnlockSkillResponseDto })
	@Patch(':skillId/unlock')
	async unlock(
		@Param('skillId', ParseUUIDPipe) skillId: string,
		@User() user: UserInfo,
	): Promise<UnlockSkillResponseDto> {
		try {
			await this.unlockSkillHandler.execute({
				skillId,
				userId: user.id,
			});

			const result = await this.findOneSkillProgressForUserHandler.execute({
				skillId,
				userId: user.id,
			});

			return {
				skillProgress: clientSkillProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SkillNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
				);
			}

			if (err instanceof SkillProgressNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_PROGRESS_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}
}
