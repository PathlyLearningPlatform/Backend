import {
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import {
	FindOneProjectProgressForUserResponseDto,
	ListProjectProgressQueryDto,
	ListProjectProgressResponseDto,
} from '../dtos';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@/infra/common';
import type {
	FindOneProjectProgressForUserHandler,
	ListProjectProgressHandler,
} from '@/app/projects';
import { ProjectProgressNotFoundException } from '@/app/projects';
import { progressDtoToClient } from '../helpers';
import { listProjectProgressQuerySchema } from '../schemas/list-progress-query.schema';
import { User } from '@/infra/auth/decorators';
import { JwtGuard } from '@/infra/auth/jwt.guard';
import type { UserInfo } from '@/infra/auth/types';

@ApiTags('progress/projects')
@UseGuards(JwtGuard)
@Controller({
	path: 'progress/projects',
	version: '1',
})
export class ProjectProgressController {
	constructor(
		@Inject(DiToken.LIST_PROJECT_PROGRESS_HANDLER)
		private readonly listHandler: ListProjectProgressHandler,
		@Inject(DiToken.FIND_ONE_PROJECT_PROGRESS_FOR_USER_HANDLER)
		private readonly findOneForUserHandler: FindOneProjectProgressForUserHandler,
	) {}

	@ApiQuery({ type: ListProjectProgressQueryDto })
	@ApiOkResponse({ type: ListProjectProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listProjectProgressQuerySchema))
		query: ListProjectProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListProjectProgressResponseDto> {
		try {
			const projectProgress = await this.listHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					status: query.status,
					userId: user.id,
				},
			});

			return {
				projectProgress: projectProgress.map(progressDtoToClient),
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
	@ApiOkResponse({ type: FindOneProjectProgressForUserResponseDto })
	@Get(':projectId')
	async findOne(
		@Param('projectId', ParseUUIDPipe) projectId: string,
		@User() user: UserInfo,
	): Promise<FindOneProjectProgressForUserResponseDto> {
		try {
			const projectProgress = await this.findOneForUserHandler.execute({
				projectId,
				userId: user.id,
			});

			return {
				projectProgress: progressDtoToClient(projectProgress),
			};
		} catch (err) {
			if (err instanceof ProjectProgressNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.PROJECT_NOT_STARTED),
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
