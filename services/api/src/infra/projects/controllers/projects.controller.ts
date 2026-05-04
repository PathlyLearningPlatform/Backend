import {
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import {
	FindProjectByIdResponseDto,
	ListProjectsDto,
	ListProjectsResponseDto,
} from '../dtos';
import { dtoToClient } from '../helpers';
import { listProjectsQuerySchema } from '../schemas/list-query.schema';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@/infra/common';
import type {
	FindProjectByIdHandler,
	ListProjectsHandler,
} from '@/app/projects';
import { ProjectNotFoundException } from '@/app/projects';

@ApiTags('projects')
@Controller({
	path: 'projects',
	version: '1',
})
export class ProjectController {
	constructor(
		@Inject(DiToken.LIST_PROJECTS_HANDLER)
		private readonly listHandler: ListProjectsHandler,
		@Inject(DiToken.FIND_PROJECT_BY_ID_HANDLER)
		private readonly findByIdHandler: FindProjectByIdHandler,
	) {}

	@ApiQuery({ type: ListProjectsDto })
	@ApiOkResponse({ type: ListProjectsResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listProjectsQuerySchema))
		query: ListProjectsDto,
	): Promise<ListProjectsResponseDto> {
		try {
			const projects = await this.listHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
			});

			return {
				projects: projects.map(dtoToClient),
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

	@ApiOkResponse({ type: FindProjectByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindProjectByIdResponseDto> {
		try {
			const project = await this.findByIdHandler.execute({ id });

			return {
				project: dtoToClient(project),
			};
		} catch (err) {
			if (err instanceof ProjectNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.PROJECT_NOT_FOUND),
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
