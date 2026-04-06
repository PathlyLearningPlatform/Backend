import {
	BadRequestException,
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
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
} from '@pathly-backend/common/index.js'
import { SkillsApiErrorCodes } from '@pathly-backend/contracts/skills/v1/api.js'
import type { Skill as ClientSkill } from '@pathly-backend/contracts/skills/v1/skills.js'
import { exceptionCodeToMessage } from '../common/helpers'
import {
	type SkillResponseDto,
	AddChildBodyDto,
	AddNextStepBodyDto,
	CreateSkillBodyDto,
	CreateSkillResponseDto,
	FindOneSkillResponseDto,
	FindSkillBySlugQueryDto,
	FindSkillsGraphQueryDto,
	FindSkillsResponseDto,
	GetPrerequisiteGraphResponseDto,
	UpdateSkillBodyDto,
	UpdateSkillResponseDto,
} from './dtos'
import {
	clientSkillGraphToResponseDto,
	clientSkillToResponseDto,
} from './helpers'
import {
	addChildBodySchema,
	addNextStepBodySchema,
	createSkillBodySchema,
	findSkillBySlugQuerySchema,
	getPrerequisiteGraphQuerySchema,
	updateSkillBodySchema,
} from './schemas'
import { SkillsService } from './skills.service'

@Controller({
	path: 'skills',
	version: '1',
})
export class SkillsController {
	constructor(
		@Inject(SkillsService) private readonly skillsService: SkillsService,
	) {}

	@ApiQuery({ type: FindSkillBySlugQueryDto })
	@ApiOkResponse({ type: FindOneSkillResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get('by-slug')
	async findBySlug(
		@Query(new HttpValidationPipe(findSkillBySlugQuerySchema))
		query: FindSkillBySlugQueryDto,
	): Promise<FindOneSkillResponseDto> {
		try {
			const result = await this.skillsService.findBySlug({ slug: query.slug })

			return {
				skill: this.skillOrThrow(result.skill),
			}
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiQuery({ type: FindSkillsGraphQueryDto })
	@ApiOkResponse({ type: GetPrerequisiteGraphResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get('prerequisite-graph')
	async getPrerequisiteGraph(
		@Query(new HttpValidationPipe(getPrerequisiteGraphQuerySchema))
		query: FindSkillsGraphQueryDto,
	): Promise<GetPrerequisiteGraphResponseDto> {
		try {
			const result = await this.skillsService.getPrerequisiteGraph({
				parentSkillId: query.parentSkillId,
			})

			if (!result.graph) {
				return {}
			}

			return {
				graph: clientSkillGraphToResponseDto(result.graph),
			}
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiOkResponse({ type: FindSkillsResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id/prerequisities')
	async listPrerequisities(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindSkillsResponseDto> {
		try {
			const result = await this.skillsService.listPrerequisities({
				skillId: id,
			})

			return {
				skills: Array.from(result.skills).map(clientSkillToResponseDto),
			}
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiOkResponse({ type: FindSkillsResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id/next-steps')
	async listNextSteps(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindSkillsResponseDto> {
		try {
			const result = await this.skillsService.listNextSteps({ skillId: id })

			return {
				skills: Array.from(result.skills).map(clientSkillToResponseDto),
			}
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiOkResponse({ type: FindSkillsResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id/children')
	async listChildren(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindSkillsResponseDto> {
		try {
			const result = await this.skillsService.listChildren({ skillId: id })

			return {
				skills: Array.from(result.skills).map(clientSkillToResponseDto),
			}
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiOkResponse({ type: FindOneSkillResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneSkillResponseDto> {
		try {
			const result = await this.skillsService.findById({ id })

			return {
				skill: this.skillOrThrow(result.skill),
			}
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiBody({ type: CreateSkillBodyDto })
	@ApiCreatedResponse({ type: CreateSkillResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createSkillBodySchema))
		body: CreateSkillBodyDto,
	): Promise<CreateSkillResponseDto> {
		try {
			const result = await this.skillsService.create({
				name: body.name,
				parentId: body.parentId ?? undefined,
			})

			return {
				skill: this.skillOrThrow(result.skill),
			}
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiBody({ type: UpdateSkillBodyDto })
	@ApiOkResponse({ type: UpdateSkillResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateSkillBodySchema))
		body: UpdateSkillBodyDto,
	): Promise<UpdateSkillResponseDto> {
		try {
			const result = await this.skillsService.update({
				where: { id },
				fields: {
					name: body.name,
				},
			})

			return {
				skill: this.skillOrThrow(result.skill),
			}
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.skillsService.remove({ id })
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiBody({ type: AddNextStepBodyDto })
	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@ApiBadRequestResponse({ type: HttpErrorResponse })
	@Post('next-steps')
	async addNextStep(
		@Body(new HttpValidationPipe(addNextStepBodySchema))
		body: AddNextStepBodyDto,
	): Promise<void> {
		try {
			await this.skillsService.addNextStep({
				prerequisiteSkillId: body.prerequisiteSkillId,
				targetSkillId: body.targetSkillId,
			})
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	@ApiBody({ type: AddChildBodyDto })
	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@ApiBadRequestResponse({ type: HttpErrorResponse })
	@Post('children')
	async addChild(
		@Body(new HttpValidationPipe(addChildBodySchema))
		body: AddChildBodyDto,
	): Promise<void> {
		try {
			await this.skillsService.addChild({
				parentSkillId: body.parentSkillId,
				childSkillId: body.childSkillId,
			})
		} catch (err) {
			this.throwMappedException(err)
		}
	}

	private skillOrThrow(skill: ClientSkill | undefined): SkillResponseDto {
		if (skill) {
			return clientSkillToResponseDto(skill)
		}

		throw new InternalServerErrorException(
			new HttpErrorDto(
				exceptionCodeToMessage[SkillsApiErrorCodes.INTERNAL_ERROR],
			),
		)
	}

	private throwMappedException(err: unknown): never {
		const grpcErr = err as GrpcException
		const errRes = grpcErr.getGrpcError()

		switch (errRes.apiCode) {
			case SkillsApiErrorCodes.SKILL_NOT_FOUND:
				throw new NotFoundException(
					new HttpErrorDto(
						exceptionCodeToMessage[SkillsApiErrorCodes.SKILL_NOT_FOUND],
					),
				)
			case SkillsApiErrorCodes.SKILL_CANNOT_REFERENCE_ITSELF:
			case SkillsApiErrorCodes.ROOT_SKILL_PARENT:
				throw new ConflictException(
					new HttpErrorDto(exceptionCodeToMessage[errRes.apiCode]),
				)
			case SkillsApiErrorCodes.VALIDATION_ERROR:
				throw new BadRequestException(
					new HttpErrorDto(
						exceptionCodeToMessage[SkillsApiErrorCodes.VALIDATION_ERROR],
					),
				)
			default:
				throw new InternalServerErrorException(
					new HttpErrorDto(
						exceptionCodeToMessage[SkillsApiErrorCodes.INTERNAL_ERROR],
					),
					{
						cause: err,
					},
				)
		}
	}
}
