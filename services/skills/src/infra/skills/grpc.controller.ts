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
	type AddAlternativeSkillResponse,
	type AddChildSkillResponse,
	type AddCommonSkillResponse,
	type AddPrerequisiteSkillResponse,
	type CreateSkillResponse,
	type FindSkillByIdResponse,
	type FindSkillBySlugResponse,
	type ListSkillAlternativesResponse,
	type ListSkillChildrenResponse,
	type ListCommonSkillsResponse,
	type ListSkillPrerequisitiesResponse,
	type RemoveSkillResponse,
	SKILLS_SERVICE_NAME,
	type UpdateSkillResponse,
} from '@pathly-backend/contracts/skills/v1/skills.js';
import { SkillsApiErrorCodes } from '@pathly-backend/contracts/skills/v1/api.js';
import type z from 'zod';
import type {
	AddAlternativeSkillHandler,
	AddChildSkillHandler,
	AddCommonSkillHandler,
	AddPrerequisiteSkillHandler,
	CreateSkillHandler,
	FindSkillByIdHandler,
	FindSkillBySlugHandler,
	ListCommonSkillsHandler,
	ListSkillAlternativesHandler,
	ListSkillChildrenHandler,
	ListSkillPrerequisitiesHandler,
	RemoveSkillHandler,
	UpdateSkillHandler,
} from '@/app/skills';
import { DiToken, ExceptionMessage } from '../common';
import {
	addAlternativeSkillSchema,
	addChildSkillSchema,
	addCommonSkillSchema,
	addPrerequisiteSkillSchema,
	createSkillSchema,
	findSkillByIdSchema,
	findSkillBySlugSchema,
	listCommonSkillsSchema,
	listSkillAlternativesSchema,
	listSkillChildrenSchema,
	listSkillPrerequisitiesSchema,
	removeSkillSchema,
	updateSkillSchema,
} from './schemas';

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
		@Inject(DiToken.ADD_PREREQUISITE_SKILL_HANDLER)
		private readonly addPrerequisiteHandler: AddPrerequisiteSkillHandler,
		@Inject(DiToken.ADD_CHILD_SKILL_HANDLER)
		private readonly addChildHandler: AddChildSkillHandler,
		@Inject(DiToken.ADD_COMMON_SKILL_HANDLER)
		private readonly addCommonHandler: AddCommonSkillHandler,
		@Inject(DiToken.ADD_ALTERNATIVE_SKILL_HANDLER)
		private readonly addAlternativeHandler: AddAlternativeSkillHandler,
		@Inject(DiToken.FIND_SKILL_BY_ID_HANDLER)
		private readonly findByIdHandler: FindSkillByIdHandler,
		@Inject(DiToken.FIND_SKILL_BY_SLUG_HANDLER)
		private readonly findBySlugHandler: FindSkillBySlugHandler,
		@Inject(DiToken.LIST_SKILL_PREREQUISITIES_HANDLER)
		private readonly listPrerequisitiesHandler: ListSkillPrerequisitiesHandler,
		@Inject(DiToken.LIST_SKILL_CHILDREN_HANDLER)
		private readonly listChildrenHandler: ListSkillChildrenHandler,
		@Inject(DiToken.LIST_COMMON_SKILLS_HANDLER)
		private readonly listCommonHandler: ListCommonSkillsHandler,
		@Inject(DiToken.LIST_SKILL_ALTERNATIVES_HANDLER)
		private readonly listAlternativesHandler: ListSkillAlternativesHandler,
	) {}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createSkillSchema))
		payload: z.infer<typeof createSkillSchema>,
	): Promise<CreateSkillResponse> {
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
	): Promise<UpdateSkillResponse> {
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
	): Promise<RemoveSkillResponse> {
		try {
			await this.removeHandler.execute({ id: payload.id });

			return {};
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async addPrerequisite(
		@Payload(new RpcValidationPipe(addPrerequisiteSkillSchema))
		payload: z.infer<typeof addPrerequisiteSkillSchema>,
	): Promise<AddPrerequisiteSkillResponse> {
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
	async addChild(
		@Payload(new RpcValidationPipe(addChildSkillSchema))
		payload: z.infer<typeof addChildSkillSchema>,
	): Promise<AddChildSkillResponse> {
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
	async addCommon(
		@Payload(new RpcValidationPipe(addCommonSkillSchema))
		payload: z.infer<typeof addCommonSkillSchema>,
	): Promise<AddCommonSkillResponse> {
		try {
			await this.addCommonHandler.execute({
				firstSkillId: payload.firstSkillId,
				secondSkillId: payload.secondSkillId,
			});

			return {};
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async addAlternative(
		@Payload(new RpcValidationPipe(addAlternativeSkillSchema))
		payload: z.infer<typeof addAlternativeSkillSchema>,
	): Promise<AddAlternativeSkillResponse> {
		try {
			await this.addAlternativeHandler.execute({
				firstSkillId: payload.firstSkillId,
				secondSkillId: payload.secondSkillId,
			});

			return {};
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findSkillByIdSchema))
		payload: z.infer<typeof findSkillByIdSchema>,
	): Promise<FindSkillByIdResponse> {
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
	): Promise<FindSkillBySlugResponse> {
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
	async listPrerequisities(
		@Payload(new RpcValidationPipe(listSkillPrerequisitiesSchema))
		payload: z.infer<typeof listSkillPrerequisitiesSchema>,
	): Promise<ListSkillPrerequisitiesResponse> {
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
	async listChildren(
		@Payload(new RpcValidationPipe(listSkillChildrenSchema))
		payload: z.infer<typeof listSkillChildrenSchema>,
	): Promise<ListSkillChildrenResponse> {
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
	async listCommon(
		@Payload(new RpcValidationPipe(listCommonSkillsSchema))
		payload: z.infer<typeof listCommonSkillsSchema>,
	): Promise<ListCommonSkillsResponse> {
		try {
			const skills = await this.listCommonHandler.execute({
				skillId: payload.skillId,
			});

			return { skills };
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILLS_SERVICE_NAME)
	async listAlternatives(
		@Payload(new RpcValidationPipe(listSkillAlternativesSchema))
		payload: z.infer<typeof listSkillAlternativesSchema>,
	): Promise<ListSkillAlternativesResponse> {
		try {
			const skills = await this.listAlternativesHandler.execute({
				skillId: payload.skillId,
			});

			return { skills };
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
