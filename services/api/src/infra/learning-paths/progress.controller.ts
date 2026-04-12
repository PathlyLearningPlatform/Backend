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
import type { StartLearningPathHandler } from '@/app/learning-paths/commands';
import type {
	FindLearningPathProgressForUserHandler,
	ListLearningPathProgressHandler,
} from '@/app/learning-paths/queries';
import { LearningPathProgressNotFoundException } from '@/app/learning-paths/exceptions';
import { LearningPathNotFoundException } from '@/app/common';
import { DiToken } from '@infra/common';
import { User } from '@infra/auth/user.decorator';
import { JwtGuard } from '@infra/auth/jwt.guard';
import type { UserInfo } from '@infra/auth/user-info.type';
import { ExceptionMessage } from '@infra/common';
import {
	ListLearningPathProgressQueryDto,
	FindLearningPathProgressForUserResponseDto,
	ListLearningPathProgressResponseDto,
	RemoveLearningPathProgressResponseDto,
	StartLearningPathResponseDto,
} from './dtos';
import { clientLearningPathProgressToResponseDto } from './helpers';
import { listLearningPathProgressQuerySchema } from './schemas';

@UseGuards(JwtGuard)
@Controller({
	path: 'progress/learning-paths',
	version: '1',
})
export class LearningPathProgressController {
	constructor(
		@Inject(DiToken.START_LEARNING_PATH_HANDLER)
		private readonly startLearningPathHandler: StartLearningPathHandler,
		@Inject(DiToken.FIND_LEARNING_PATH_PROGRESS_FOR_USER_HANDLER)
		private readonly findLearningPathProgressForUserHandler: FindLearningPathProgressForUserHandler,
		@Inject(DiToken.LIST_LEARNING_PATH_PROGRESS_HANDLER)
		private readonly listLearningPathProgressHandler: ListLearningPathProgressHandler,
	) {}

	@ApiQuery({ type: ListLearningPathProgressQueryDto })
	@ApiOkResponse({ type: ListLearningPathProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listLearningPathProgressQuerySchema))
		query: ListLearningPathProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListLearningPathProgressResponseDto> {
		try {
			const result = await this.listLearningPathProgressHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			});

			return {
				learningPathProgress: result.map(
					clientLearningPathProgressToResponseDto,
				),
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
	@ApiOkResponse({ type: FindLearningPathProgressForUserResponseDto })
	@Get(':learningPathId')
	async findForUser(
		@Param('learningPathId', ParseUUIDPipe) learningPathId: string,
		@User() user: UserInfo,
	): Promise<FindLearningPathProgressForUserResponseDto> {
		try {
			const result = await this.findLearningPathProgressForUserHandler.execute({
				learningPathId,
				userId: user.id,
			});

			return {
				learningPathProgress: clientLearningPathProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_FOUND),
				);
			}

			if (err instanceof LearningPathProgressNotFoundException) {
				throw new NotFoundException(
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

	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: StartLearningPathResponseDto })
	@Patch(':learningPathId/start')
	async start(
		@Param('learningPathId', ParseUUIDPipe) learningPathId: string,
		@User() user: UserInfo,
	): Promise<StartLearningPathResponseDto> {
		try {
			const result = await this.startLearningPathHandler.execute({
				learningPathId,
				userId: user.id,
			});

			return {
				learningPathProgress: clientLearningPathProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_FOUND),
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
	@ApiOkResponse({ type: RemoveLearningPathProgressResponseDto })
	@Delete(':learningPathId')
	async remove(
		@Param('learningPathId', ParseUUIDPipe) _learningPathId: string,
		@User() _user: UserInfo,
	): Promise<RemoveLearningPathProgressResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		);
	}
}
