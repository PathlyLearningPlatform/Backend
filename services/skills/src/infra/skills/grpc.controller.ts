import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { ValidationException } from '@/domain/common';
import { SkillNotFoundException } from '@/domain/exceptions';
import {
	RootSkillParentException,
	SkillCannotReferenceItselfException,
} from '@/domain/skills';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common';
import {
	type SkillsServiceAddChildResponse,
	type SkillsServiceAddNextStepResponse,
	type SkillsServiceCreateResponse,
	type SkillsServiceFindByIdResponse,
	type SkillsServiceFindBySlugResponse,
	type SkillsServiceListChildrenResponse,
	type SkillsServiceListPrerequisitiesResponse,
	type SkillsServiceListNextStepsResponse,
	type SkillsServiceRemoveResponse,
	SKILLS_SERVICE_NAME,
	type SkillsServiceUpdateResponse,
	SkillsServiceGetPrerequisiteGraphResponse,
} from '@pathly-backend/contracts/skills/v1/skills.js';
import { SkillsApiErrorCodes } from '@pathly-backend/contracts/skills/v1/api.js';
import type z from 'zod';
import type {
	AddChildSkillHandler,
	AddNextStepSkillHandler,
	CreateSkillHandler,
	FindSkillByIdHandler,
	FindSkillBySlugHandler,
	GetPrerequisiteGraphHandler,
	ListSkillNextStepsHandler,
	ListSkillChildrenHandler,
	ListSkillPrerequisitiesHandler,
	RemoveSkillHandler,
	UpdateSkillHandler,
} from '@/app/skills';
import { DiToken, ExceptionMessage } from '../common';
import {
	addChildSkillSchema,
	addNextStepSkillSchema,
	createSkillSchema,
	findSkillByIdSchema,
	findSkillBySlugSchema,
	getPrerequisiteGraphSchema,
	listSkillChildrenSchema,
	listSkillPrerequisitiesSchema,
	removeSkillSchema,
	updateSkillSchema,
	listSkillNextStepsSchema,
} from './schemas';
import { skillRelationshipTypeToClient } from './helpers/relationship-type-to-client.helper';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcSkillsController {
	constructor(
		@Inject(DiToken.CREATE_SKILL_HANDLER)
		private readonly createHandler: CreateSkillHandler,
		@Inject(DiToken.UPDATE_SKILL_HANDLER)
		private readonly updateHandler: UpdateSkillHandler,
		@Inject(DiToken.REMOVE_SKILL_HANDLER)
		private readonly removeHandler: RemoveSkillHandler,
		@Inject(DiToken.ADD_NEXT_STEP_SKILL_HANDLER)
		private readonly addPrerequisiteHandler: AddNextStepSkillHandler,
		@Inject(DiToken.ADD_CHILD_SKILL_HANDLER)
		private readonly addChildHandler: AddChildSkillHandler,
		@Inject(DiToken.FIND_SKILL_BY_ID_HANDLER)
		private readonly findByIdHandler: FindSkillByIdHandler,
		@Inject(DiToken.FIND_SKILL_BY_SLUG_HANDLER)
		private readonly findBySlugHandler: FindSkillBySlugHandler,
		@Inject(DiToken.LIST_SKILL_PREREQUISITIES_HANDLER)
		private readonly listPrerequisitiesHandler: ListSkillPrerequisitiesHandler,
		@Inject(DiToken.LIST_SKILL_NEXT_STEPS_HANDLER)
		private readonly listNextStepsHandler: ListSkillPrerequisitiesHandler,
		@Inject(DiToken.LIST_SKILL_CHILDREN_HANDLER)
		private readonly listChildrenHandler: ListSkillChildrenHandler,
		@Inject(DiToken.GET_PREREQUISITE_GRAPH_HANDLER)
		private readonly getPrerequisiteGraphHandler: GetPrerequisiteGraphHandler,
	) {}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createSkillSchema))
		payload: z.infer<typeof createSkillSchema>,
	): Promise<SkillsServiceCreateResponse> {
		try {
			const skill = await this.createHandler.execute({
				name: payload.name,
				parentId: payload.parentId,
			});

			return { skill };
		} catch (err) {
			this.mapAndThrow(err);
		}
	}
	@GrpcMethod(SKILLS_SERVICE_NAME)
	async update(
		@Payload(new RpcValidationPipe(updateSkillSchema))
		payload: z.infer<typeof updateSkillSchema>,
	): Promise<SkillsServiceUpdateResponse> {
		try {
			const skill = await this.updateHandler.execute({
				where: {
					id: payload.where.id,
				},
				fields: {
					name: payload.fields.name,
				},
			});

			return { skill };
		} catch (err) {
			this.mapAndThrow(err);
		}
	}
	@GrpcMethod(SKILLS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeSkillSchema))
		payload: z.infer<typeof removeSkillSchema>,
	): Promise<SkillsServiceRemoveResponse> {
		try {
			await this.removeHandler.execute({ id: payload.id });

			return {};
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findSkillByIdSchema))
		payload: z.infer<typeof findSkillByIdSchema>,
	): Promise<SkillsServiceFindByIdResponse> {
		try {
			const skill = await this.findByIdHandler.execute({
				id: payload.id,
			});

			return { skill };
		} catch (err) {
			this.mapAndThrow(err);
		}
	}
	@GrpcMethod(SKILLS_SERVICE_NAME)
	async findBySlug(
		@Payload(new RpcValidationPipe(findSkillBySlugSchema))
		payload: z.infer<typeof findSkillBySlugSchema>,
	): Promise<SkillsServiceFindBySlugResponse> {
		try {
			const skill = await this.findBySlugHandler.execute({
				slug: payload.slug,
			});

			return { skill };
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async addNextStep(
		@Payload(new RpcValidationPipe(addNextStepSkillSchema))
		payload: z.infer<typeof addNextStepSkillSchema>,
	): Promise<SkillsServiceAddNextStepResponse> {
		try {
			await this.addPrerequisiteHandler.execute({
				prerequisiteSkillId: payload.prerequisiteSkillId,
				targetSkillId: payload.targetSkillId,
			});

			return {};
		} catch (err) {
			this.mapAndThrow(err);
		}
	}
	@GrpcMethod(SKILLS_SERVICE_NAME)
	async listPrerequisities(
		@Payload(new RpcValidationPipe(listSkillPrerequisitiesSchema))
		payload: z.infer<typeof listSkillPrerequisitiesSchema>,
	): Promise<SkillsServiceListPrerequisitiesResponse> {
		try {
			const skills = await this.listPrerequisitiesHandler.execute({
				skillId: payload.skillId,
			});

			return { skills };
		} catch (err) {
			this.mapAndThrow(err);
		}
	}
	@GrpcMethod(SKILLS_SERVICE_NAME)
	async listNextSteps(
		@Payload(new RpcValidationPipe(listSkillNextStepsSchema))
		payload: z.infer<typeof listSkillNextStepsSchema>,
	): Promise<SkillsServiceListNextStepsResponse> {
		try {
			const skills = await this.listNextStepsHandler.execute({
				skillId: payload.skillId,
			});

			return { skills };
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async addChild(
		@Payload(new RpcValidationPipe(addChildSkillSchema))
		payload: z.infer<typeof addChildSkillSchema>,
	): Promise<SkillsServiceAddChildResponse> {
		try {
			await this.addChildHandler.execute({
				parentSkillId: payload.parentSkillId,
				childSkillId: payload.childSkillId,
			});

			return {};
		} catch (err) {
			this.mapAndThrow(err);
		}
	}
	@GrpcMethod(SKILLS_SERVICE_NAME)
	async listChildren(
		@Payload(new RpcValidationPipe(listSkillChildrenSchema))
		payload: z.infer<typeof listSkillChildrenSchema>,
	): Promise<SkillsServiceListChildrenResponse> {
		try {
			const skills = await this.listChildrenHandler.execute({
				skillId: payload.skillId,
			});

			return { skills };
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async getPrerequisiteGraph(
		@Payload(new RpcValidationPipe(getPrerequisiteGraphSchema))
		payload: z.infer<typeof getPrerequisiteGraphSchema>,
	): Promise<SkillsServiceGetPrerequisiteGraphResponse> {
		try {
			const result = await this.getPrerequisiteGraphHandler.execute({
				parentSkillId: payload.parentSkillId,
			});

			return {
				graph: {
					edges: result.edges.map((edge) => ({
						fromId: edge.fromId,
						toId: edge.toId,
						type: skillRelationshipTypeToClient(edge.type),
					})),
					nodes: result.nodes,
				},
			};
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	private mapAndThrow(err: unknown): never {
		if (err instanceof SkillNotFoundException) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.SKILL_NOT_FOUND,
					GrpcStatus.NOT_FOUND,
					SkillsApiErrorCodes.SKILL_NOT_FOUND,
				),
				err,
			);
		}

		if (err instanceof RootSkillParentException) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.ROOT_SKILL_PARENT,
					GrpcStatus.FAILED_PRECONDITION,
					SkillsApiErrorCodes.ROOT_SKILL_PARENT,
				),
				err,
			);
		}

		if (err instanceof SkillCannotReferenceItselfException) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.SKILL_CANNOT_REFERENCE_ITSELF,
					GrpcStatus.FAILED_PRECONDITION,
					SkillsApiErrorCodes.SKILL_CANNOT_REFERENCE_ITSELF,
				),
				err,
			);
		}

		if (err instanceof ValidationException) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.VALIDATION_ERROR,
					GrpcStatus.INVALID_ARGUMENT,
					SkillsApiErrorCodes.VALIDATION_ERROR,
				),
				err,
			);
		}

		throw new GrpcException(
			new GrpcErrorDto(
				ExceptionMessage.INTERNAL_ERROR,
				GrpcStatus.INTERNAL,
				SkillsApiErrorCodes.INTERNAL_ERROR,
			),
			err,
		);
	}
}
