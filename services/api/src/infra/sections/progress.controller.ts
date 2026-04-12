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
} from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiNotImplementedResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger';
import { HttpErrorDto, HttpValidationPipe } from '@infra/common';
import type { StartSectionHandler } from '@/app/sections/commands';
import type {
	FindSectionProgressForUserHandler,
	ListSectionProgressHandler,
} from '@/app/sections/queries';
import { SectionProgressNotFoundException } from '@/app/sections/exceptions';
import { LearningPathProgressNotFoundException } from '@/app/learning-paths/exceptions';
import { SectionNotFoundException } from '@/app/common';
import { DiToken } from '@infra/common';
import { User } from '@infra/auth/user.decorator';
import { JwtGuard } from '@infra/auth/jwt.guard';
import type { UserInfo } from '@infra/auth/user-info.type';
import { ExceptionMessage } from '@infra/common';
import {
	ListSectionProgressQueryDto,
	FindSectionProgressForUserResponseDto,
	ListSectionProgressResponseDto,
	RemoveSectionProgressResponseDto,
	StartSectionResponseDto,
} from './dtos';
import { clientSectionProgressToResponseDto } from './helpers';
import { listSectionProgressQuerySchema } from './schemas';

@UseGuards(JwtGuard)
@Controller({
	path: 'progress/sections',
	version: '1',
})
export class SectionProgressController {
	constructor(
		@Inject(DiToken.START_SECTION_HANDLER)
		private readonly startSectionHandler: StartSectionHandler,
		@Inject(DiToken.FIND_SECTION_PROGRESS_FOR_USER_HANDLER)
		private readonly findSectionProgressForUserHandler: FindSectionProgressForUserHandler,
		@Inject(DiToken.LIST_SECTION_PROGRESS_HANDLER)
		private readonly listSectionProgressHandler: ListSectionProgressHandler,
	) {}

	@ApiQuery({ type: ListSectionProgressQueryDto })
	@ApiOkResponse({ type: ListSectionProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listSectionProgressQuerySchema))
		query: ListSectionProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListSectionProgressResponseDto> {
		try {
			const result = await this.listSectionProgressHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			});

			return {
				sectionProgress: result.map(clientSectionProgressToResponseDto),
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
	@ApiOkResponse({ type: FindSectionProgressForUserResponseDto })
	@Get(':sectionId')
	async findForUser(
		@Param('sectionId', ParseUUIDPipe) sectionId: string,
		@User() user: UserInfo,
	): Promise<FindSectionProgressForUserResponseDto> {
		try {
			const result = await this.findSectionProgressForUserHandler.execute({
				sectionId,
				userId: user.id,
			});

			return {
				sectionProgress: clientSectionProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SECTION_NOT_FOUND),
				);
			}

			if (err instanceof SectionProgressNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SECTION_NOT_STARTED),
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

	@ApiConflictResponse({ type: HttpErrorDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: StartSectionResponseDto })
	@Patch(':sectionId/start')
	async start(
		@Param('sectionId', ParseUUIDPipe) sectionId: string,
		@User() user: UserInfo,
	): Promise<StartSectionResponseDto> {
		try {
			const result = await this.startSectionHandler.execute({
				sectionId,
				userId: user.id,
			});

			return {
				sectionProgress: clientSectionProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SECTION_NOT_FOUND),
				);
			}

			if (err instanceof LearningPathProgressNotFoundException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_STARTED),
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

	@ApiNotImplementedResponse({ type: HttpErrorDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: RemoveSectionProgressResponseDto })
	@Delete(':sectionId')
	async remove(
		@Param('sectionId', ParseUUIDPipe) _sectionId: string,
		@User() _user: UserInfo,
	): Promise<RemoveSectionProgressResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		);
	}
}
