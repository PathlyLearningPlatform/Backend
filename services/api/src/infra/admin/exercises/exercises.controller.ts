import {
	CreateExerciseHandler,
	ExerciseNotFoundException,
	UpdateExerciseHandler,
} from '@/app/exercises';
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
	CreateExerciseDto,
	CreateExerciseResponseDto,
	UpdateExerciseDto,
	UpdateExerciseResponseDto,
} from './dtos';
import { createExerciseSchema, updateExerciseSchema } from './schemas';
import { dtoToClient } from '@/infra/exercises/helpers';
import {
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiTags,
} from '@nestjs/swagger';
import { RemoveExerciseHandler } from '@/app/exercises/commands/remove.command';

@ApiTags('admin/exercises')
@UseGuards(JwtGuard, RoleGuard)
@Controller({
	path: 'admin/exercises',
	version: '1',
})
export class ExerciseAdminController {
	constructor(
		@Inject(DiToken.CREATE_EXERCISE_HANDLER)
		private readonly createHandler: CreateExerciseHandler,
		@Inject(DiToken.UPDATE_EXERCISE_HANDLER)
		private readonly updateHandler: UpdateExerciseHandler,
		@Inject(DiToken.REMOVE_EXERCISE_HANDLER)
		private readonly removeHandler: RemoveExerciseHandler,
	) {}

	@Roles([UserRole.ADMIN])
	@Post()
	@ApiCreatedResponse({ type: CreateExerciseResponseDto })
	async create(
		@Body(new HttpValidationPipe(createExerciseSchema)) body: CreateExerciseDto,
	): Promise<CreateExerciseResponseDto> {
		try {
			const exercise = await this.createHandler.execute({
				acceptUrl: body.acceptUrl,
				name: body.name,
				repositoryId: body.repositoryId,
				description: body.description,
				difficulty: body.difficulty,
			});

			return { data: dtoToClient(exercise) };
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@Roles([UserRole.ADMIN])
	@Patch(':id')
	@ApiOkResponse({ type: UpdateExerciseResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateExerciseSchema)) body: UpdateExerciseDto,
	): Promise<UpdateExerciseResponseDto> {
		try {
			const exercise = await this.updateHandler.execute({
				where: {
					id,
				},
				props: {
					description: body.description,
					name: body.name,
					difficulty: body.difficulty,
				},
			});

			return { data: dtoToClient(exercise) };
		} catch (err) {
			if (err instanceof ExerciseNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.EXERCISE_NOT_FOUND),
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
			if (err instanceof ExerciseNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.EXERCISE_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}
}
