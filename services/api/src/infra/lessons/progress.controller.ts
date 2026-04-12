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
import type { StartLessonHandler } from '@/app/lessons/commands';
import type {
	FindLessonProgressForUserHandler,
	ListLessonProgressHandler,
} from '@/app/lessons/queries';
import { LessonProgressNotFoundException } from '@/app/lessons/exceptions';
import { UnitProgressNotFoundException } from '@/app/units/exceptions';
import { LessonNotFoundException } from '@/app/common';
import { DiToken } from '@infra/common';
import { User } from '@infra/auth/user.decorator';
import { JwtGuard } from '@infra/auth/jwt.guard';
import type { UserInfo } from '@infra/auth/user-info.type';
import { ExceptionMessage } from '@infra/common';
import {
	ListLessonProgressQueryDto,
	FindLessonProgressForUserResponseDto,
	ListLessonProgressResponseDto,
	RemoveLessonProgressResponseDto,
	StartLessonResponseDto,
} from './dtos';
import { clientLessonProgressToResponseDto } from './helpers';
import { listLessonProgressQuerySchema } from './schemas';

@UseGuards(JwtGuard)
@Controller({
	path: 'progress/lessons',
	version: '1',
})
export class LessonProgressController {
	constructor(
		@Inject(DiToken.START_LESSON_HANDLER)
		private readonly startLessonHandler: StartLessonHandler,
		@Inject(DiToken.FIND_LESSON_PROGRESS_FOR_USER_HANDLER)
		private readonly findLessonProgressForUserHandler: FindLessonProgressForUserHandler,
		@Inject(DiToken.LIST_LESSON_PROGRESS_HANDLER)
		private readonly listLessonProgressHandler: ListLessonProgressHandler,
	) {}

	@ApiQuery({ type: ListLessonProgressQueryDto })
	@ApiOkResponse({ type: ListLessonProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listLessonProgressQuerySchema))
		query: ListLessonProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListLessonProgressResponseDto> {
		try {
			const result = await this.listLessonProgressHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			});

			return {
				lessonProgress: result.map(clientLessonProgressToResponseDto),
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
	@ApiOkResponse({ type: FindLessonProgressForUserResponseDto })
	@Get(':lessonId')
	async findForUser(
		@Param('lessonId', ParseUUIDPipe) lessonId: string,
		@User() user: UserInfo,
	): Promise<FindLessonProgressForUserResponseDto> {
		try {
			const result = await this.findLessonProgressForUserHandler.execute({
				lessonId,
				userId: user.id,
			});

			return {
				lessonProgress: clientLessonProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LESSON_NOT_FOUND),
				);
			}

			if (err instanceof LessonProgressNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LESSON_NOT_STARTED),
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
	@ApiOkResponse({ type: StartLessonResponseDto })
	@Patch(':lessonId/start')
	async start(
		@Param('lessonId', ParseUUIDPipe) lessonId: string,
		@User() user: UserInfo,
	): Promise<StartLessonResponseDto> {
		try {
			const result = await this.startLessonHandler.execute({
				lessonId,
				userId: user.id,
			});

			return {
				lessonProgress: clientLessonProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LessonNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LESSON_NOT_FOUND),
				);
			}

			if (err instanceof UnitProgressNotFoundException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.UNIT_NOT_STARTED),
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
	@ApiOkResponse({ type: RemoveLessonProgressResponseDto })
	@Delete(':lessonId')
	async remove(
		@Param('lessonId', ParseUUIDPipe) _lessonId: string,
		@User() _user: UserInfo,
	): Promise<RemoveLessonProgressResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		);
	}
}
