import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger';
import type {
	AddChildSkillHandler,
	AddNextStepSkillHandler,
	CreateSkillHandler,
	RemoveSkillHandler,
	UpdateSkillHandler,
} from '@/app/skills/commands';
import type {
	FindSkillByIdHandler,
	GetPrerequisiteGraphHandler,
	ListSkillChildrenHandler,
	ListSkillNextStepsHandler,
	ListSkillPrerequisitiesHandler,
} from '@/app/skills/queries';
import { SkillNotFoundException } from '@/domain/skills';
import {
	RootSkillParentException,
	SkillCannotReferenceItselfException,
} from '@/domain/skills';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@infra/common';
import {
	AddChildBodyDto,
	AddSkillNextStepBodyDto,
	CreateSkillBodyDto,
	CreateSkillResponseDto,
	FindOneSkillResponseDto,
	GetPrerequisiteGraphQueryDto,
	GetPrerequisiteGraphResponseDto,
	ListSkillChildrenResponseDto,
	ListSkillNextStepsResponseDto,
	ListSkillPrerequisitiesResponseDto,
	UpdateSkillBodyDto,
	UpdateSkillResponseDto,
} from './dtos';
import {
	addChildBodySchema,
	addNextStepBodySchema,
	createSkillBodySchema,
	getPrerequisiteGraphQuerySchema,
	updateSkillBodySchema,
} from './schemas';
import {
	clientSkillGraphToResponseDto,
	clientSkillToResponseDto,
} from './helpers';

@Controller({
	path: 'skills',
	version: '1',
})
export class SkillsController {
	constructor(
		@Inject(DiToken.CREATE_SKILL_HANDLER)
		private readonly createSkillHandler: CreateSkillHandler,
		@Inject(DiToken.UPDATE_SKILL_HANDLER)
		private readonly updateSkillHandler: UpdateSkillHandler,
		@Inject(DiToken.REMOVE_SKILL_HANDLER)
		private readonly removeSkillHandler: RemoveSkillHandler,
		@Inject(DiToken.ADD_NEXT_STEP_SKILL_HANDLER)
		private readonly addNextStepSkillHandler: AddNextStepSkillHandler,
		@Inject(DiToken.ADD_CHILD_SKILL_HANDLER)
		private readonly addChildSkillHandler: AddChildSkillHandler,
		@Inject(DiToken.FIND_SKILL_BY_ID_HANDLER)
		private readonly findSkillByIdHandler: FindSkillByIdHandler,
		@Inject(DiToken.LIST_SKILL_PREREQUISITIES_HANDLER)
		private readonly listSkillPrerequisitiesHandler: ListSkillPrerequisitiesHandler,
		@Inject(DiToken.LIST_SKILL_NEXT_STEPS_HANDLER)
		private readonly listSkillNextStepsHandler: ListSkillNextStepsHandler,
		@Inject(DiToken.LIST_SKILL_CHILDREN_HANDLER)
		private readonly listSkillChildrenHandler: ListSkillChildrenHandler,
		@Inject(DiToken.GET_PREREQUISITE_GRAPH_HANDLER)
		private readonly getPrerequisiteGraphHandler: GetPrerequisiteGraphHandler,
	) {}

	@ApiQuery({ type: GetPrerequisiteGraphQueryDto })
	@ApiOkResponse({ type: GetPrerequisiteGraphResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get('prerequisite-graph')
	async getPrerequisiteGraph(
		@Query(new HttpValidationPipe(getPrerequisiteGraphQuerySchema))
		query: GetPrerequisiteGraphQueryDto,
	): Promise<GetPrerequisiteGraphResponseDto> {
		try {
			const result = await this.getPrerequisiteGraphHandler.execute({
				parentSkillId: query.parentSkillId,
			});

			return {
				graph: clientSkillGraphToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SkillNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
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

	@ApiOkResponse({ type: FindOneSkillResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneSkillResponseDto> {
		try {
			const result = await this.findSkillByIdHandler.execute({ id });

			return {
				skill: clientSkillToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SkillNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
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

	@ApiBody({ type: CreateSkillBodyDto })
	@ApiCreatedResponse({ type: CreateSkillResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiConflictResponse({ type: HttpErrorDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createSkillBodySchema))
		body: CreateSkillBodyDto,
	): Promise<CreateSkillResponseDto> {
		try {
			const result = await this.createSkillHandler.execute({
				name: body.name,
				parentId: body.parentId ?? undefined,
			});

			return {
				skill: clientSkillToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SkillNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
				);
			}

			if (err instanceof RootSkillParentException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.ROOT_SKILL_PARENT),
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

	@ApiBody({ type: UpdateSkillBodyDto })
	@ApiOkResponse({ type: UpdateSkillResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateSkillBodySchema))
		body: UpdateSkillBodyDto,
	): Promise<UpdateSkillResponseDto> {
		try {
			const result = await this.updateSkillHandler.execute({
				where: { id },
				fields: {
					name: body.name,
				},
			});

			return {
				skill: clientSkillToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SkillNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
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

	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.removeSkillHandler.execute({ id });
		} catch (err) {
			if (err instanceof SkillNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
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

	@ApiOkResponse({ type: ListSkillPrerequisitiesResponseDto })
	@Get(':id/prerequisities')
	async listPrerequisities(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<ListSkillPrerequisitiesResponseDto> {
		try {
			const result = await this.listSkillPrerequisitiesHandler.execute({
				skillId: id,
			});

			return {
				skills: result.map(clientSkillToResponseDto),
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

	@ApiOkResponse({ type: ListSkillNextStepsResponseDto })
	@Get(':id/next-steps')
	async listNextSteps(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<ListSkillNextStepsResponseDto> {
		try {
			const result = await this.listSkillNextStepsHandler.execute({
				skillId: id,
			});

			return {
				skills: result.map(clientSkillToResponseDto),
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

	@ApiBody({ type: AddSkillNextStepBodyDto })
	@ApiOkResponse()
	@ApiConflictResponse({ type: HttpErrorDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Post('next-steps')
	async addNextStep(
		@Body(new HttpValidationPipe(addNextStepBodySchema))
		body: AddSkillNextStepBodyDto,
	): Promise<void> {
		try {
			await this.addNextStepSkillHandler.execute({
				prerequisiteSkillId: body.prerequisiteSkillId,
				targetSkillId: body.targetSkillId,
			});
		} catch (err) {
			if (err instanceof SkillNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
				);
			}

			if (err instanceof SkillCannotReferenceItselfException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.SKILL_CANNOT_REFERENCE_ITSELF),
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

	@ApiOkResponse({ type: ListSkillChildrenResponseDto })
	@Get(':id/children')
	async listChildren(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<ListSkillChildrenResponseDto> {
		try {
			const result = await this.listSkillChildrenHandler.execute({
				skillId: id,
			});

			return {
				skills: result.map(clientSkillToResponseDto),
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

	@ApiBody({ type: AddChildBodyDto })
	@ApiOkResponse()
	@ApiConflictResponse({ type: HttpErrorDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Post('children')
	async addChild(
		@Body(new HttpValidationPipe(addChildBodySchema))
		body: AddChildBodyDto,
	): Promise<void> {
		try {
			await this.addChildSkillHandler.execute({
				parentSkillId: body.parentSkillId,
				childSkillId: body.childSkillId,
			});
		} catch (err) {
			if (err instanceof SkillNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SKILL_NOT_FOUND),
				);
			}

			if (err instanceof SkillCannotReferenceItselfException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.SKILL_CANNOT_REFERENCE_ITSELF),
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
