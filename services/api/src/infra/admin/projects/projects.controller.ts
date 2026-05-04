import {
	CreateProjectHandler,
	ProjectNotFoundException,
	UpdateProjectHandler,
} from '@/app/projects';
import { Roles } from '@/infra/auth/decorators';
import { UserRole } from '@/infra/auth/enums';
import { JwtGuard } from '@/infra/auth/jwt.guard';
import { RoleGuard } from '@/infra/auth/role.guard';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@/infra/common';
import {
	Body,
	Controller,
	Delete,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import {
	CreateProjectDto,
	CreateProjectResponseDto,
	UpdateProjectDto,
	UpdateProjectResponseDto,
} from './dtos';
import { createProjectSchema, updateProjectSchema } from './schemas';
import { dtoToClient } from '@/infra/projects/helpers';
import {
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { RemoveProjectHandler } from '@/app/projects/commands/remove.command';

@ApiTags('admin/projects')
@UseGuards(JwtGuard, RoleGuard)
@Controller({
	path: 'admin/projects',
	version: '1',
})
export class ProjectAdminController {
	constructor(
		@Inject(DiToken.CREATE_PROJECT_HANDLER)
		private readonly createHandler: CreateProjectHandler,
		@Inject(DiToken.UPDATE_PROJECT_HANDLER)
		private readonly updateHandler: UpdateProjectHandler,
		@Inject(DiToken.REMOVE_PROJECT_HANDLER)
		private readonly removeHandler: RemoveProjectHandler,
	) {}

	@Roles([UserRole.ADMIN])
	@Post()
	@ApiCreatedResponse({ type: CreateProjectResponseDto })
	async create(
		@Body(new HttpValidationPipe(createProjectSchema)) body: CreateProjectDto,
	): Promise<CreateProjectResponseDto> {
		try {
			const project = await this.createHandler.execute({
				acceptUrl: body.acceptUrl,
				name: body.name,
				repositoryId: body.repositoryId,
				description: body.description,
			});

			return { data: dtoToClient(project) };
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@Roles([UserRole.ADMIN])
	@Patch(':id')
	@ApiOkResponse({ type: UpdateProjectResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateProjectSchema)) body: UpdateProjectDto,
	): Promise<UpdateProjectResponseDto> {
		try {
			const project = await this.updateHandler.execute({
				where: {
					id,
				},
				fields: {
					description: body.description,
					name: body.name,
				},
			});

			return { data: dtoToClient(project) };
		} catch (err) {
			if (err instanceof ProjectNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.PROJECT_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@Roles([UserRole.ADMIN])
	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.removeHandler.execute({ id });
		} catch (err) {
			if (err instanceof ProjectNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.PROJECT_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}
}
