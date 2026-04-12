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
} from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiNotImplementedResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger';
import { HttpErrorDto, HttpValidationPipe } from '@infra/common';
import type { CompleteActivityHandler } from '@/app/activities/commands';
import type {
	FindActivityProgressForUserHandler,
	ListActivityProgressHandler,
} from '@/app/activities/queries';
import { ActivityProgressNotFoundException } from '@/app/activities/exceptions';
import { LessonProgressNotFoundException } from '@/app/lessons/exceptions';
import { ActivityNotFoundException } from '@/app/common';
import { DiToken } from '@infra/common';
import { User } from '@infra/auth/user.decorator';
import { JwtGuard } from '@infra/auth/jwt.guard';
import type { UserInfo } from '@infra/auth/user-info.type';
import { ExceptionMessage } from '@infra/common';
import {
	CompleteActivityResponseDto,
	FindActivityProgressForUserResponseDto,
	ListActivityProgressQueryDto,
	ListActivityProgressResponseDto,
	RemoveActivityProgressResponseDto,
} from './dtos';
import { clientActivityProgressToResponseDto } from './helpers';
import { listActivityProgressQuerySchema } from './schemas';

@UseGuards(JwtGuard)
@Controller({
	path: 'progress/activities',
	version: '1',
})
export class ActivityProgressController {
	constructor(
		@Inject(DiToken.COMPLETE_ACTIVITY_HANDLER)
		private readonly completeActivityHandler: CompleteActivityHandler,
		@Inject(DiToken.FIND_ACTIVITY_PROGRESS_FOR_USER_HANDLER)
		private readonly findActivityProgressForUserHandler: FindActivityProgressForUserHandler,
		@Inject(DiToken.LIST_ACTIVITY_PROGRESS_HANDLER)
		private readonly listActivityProgressHandler: ListActivityProgressHandler,
	) {}

	@ApiQuery({ type: ListActivityProgressQueryDto })
	@ApiOkResponse({ type: ListActivityProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listActivityProgressQuerySchema))
		query: ListActivityProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListActivityProgressResponseDto> {
		try {
			const result = await this.listActivityProgressHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			});

			return {
				activityProgress: result.map(clientActivityProgressToResponseDto),
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
	@ApiOkResponse({ type: FindActivityProgressForUserResponseDto })
	@Get(':activityId')
	async findForUser(
		@Param('activityId', ParseUUIDPipe) activityId: string,
		@User() user: UserInfo,
	): Promise<FindActivityProgressForUserResponseDto> {
		try {
			const result = await this.findActivityProgressForUserHandler.execute({
				activityId,
				userId: user.id,
			});

			return {
				activityProgress: clientActivityProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			if (err instanceof ActivityProgressNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_STARTED),
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
	@ApiOkResponse({ type: CompleteActivityResponseDto })
	@Patch(':activityId/complete')
	async complete(
		@Param('activityId', ParseUUIDPipe) activityId: string,
		@User() user: UserInfo,
	): Promise<CompleteActivityResponseDto> {
		try {
			const result = await this.completeActivityHandler.execute({
				activityId,
				userId: user.id,
			});

			return {
				activityProgress: clientActivityProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
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

	@ApiNotImplementedResponse({ type: HttpErrorDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: RemoveActivityProgressResponseDto })
	@Delete(':activityId')
	async remove(
		@Param('activityId', ParseUUIDPipe) _activityId: string,
		@User() _user: UserInfo,
	): Promise<RemoveActivityProgressResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		);
	}
}
