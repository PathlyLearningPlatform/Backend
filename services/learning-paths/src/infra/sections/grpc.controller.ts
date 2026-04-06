import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common';
import type {
	SectionsServiceFindOneProgressForUserResponse,
	SectionsServiceListProgressResponse,
	SectionsServiceRemoveProgressResponse,
	SectionsServiceStartResponse,
} from '@pathly-backend/contracts/learning_paths/v1/sections.js';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import {
	type CreateSectionResponse,
	type FindSectionByIdResponse,
	type ListSectionsResponse,
	SECTIONS_SERVICE_NAME,
	type UpdateSectionResponse,
} from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import type z from 'zod';
import {
	LearningPathNotFoundException,
	SectionNotFoundException,
} from '@/app/common';
import type {
	AddSectionHandler,
	ReorderSectionHandler,
} from '@/app/learning-paths/commands';
import type {
	RemoveSectionHandler,
	RemoveSectionProgressHandler,
	StartSectionHandler,
	UpdateSectionHandler,
} from '@/app/sections/commands';
import { SectionProgressNotFoundException } from '@/app/sections/exceptions';
import type {
	FindSectionByIdHandler,
	FindSectionProgressForUserHandler,
	ListSectionProgressHandler,
	ListSectionsHandler,
} from '@/app/sections/queries';
import { DiToken, ExceptionMessage } from '../common/enums';
import { sectionDtoToClient, sectionProgressDtoToClient } from './helpers';
import {
	createSectionSchema,
	findSectionByIdSchema,
	findSectionProgressForUserSchema,
	listSectionProgressSchema,
	listSectionsSchema,
	removeSectionProgressSchema,
	removeSectionSchema,
	reorderSectionSchema,
	startSectionSchema,
	updateSectionSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcSectionsController {
	constructor(
		@Inject(DiToken.LIST_SECTIONS_HANDLER)
		private readonly listSectionsHandler: ListSectionsHandler,
		@Inject(DiToken.FIND_SECTION_BY_ID_HANDLER)
		private readonly findSectionByIdHandler: FindSectionByIdHandler,
		@Inject(DiToken.ADD_SECTION_HANDLER)
		private readonly addSectionHandler: AddSectionHandler,
		@Inject(DiToken.UPDATE_SECTION_HANDLER)
		private readonly updateSectionHandler: UpdateSectionHandler,
		@Inject(DiToken.REORDER_SECTION_HANDLER)
		private readonly reorderSectionHandler: ReorderSectionHandler,
		@Inject(DiToken.REMOVE_SECTION_HANDLER)
		private readonly removeSectionHandler: RemoveSectionHandler,
		@Inject(DiToken.START_SECTION_HANDLER)
		private readonly startSectionHandler: StartSectionHandler,
		@Inject(DiToken.REMOVE_SECTION_PROGRESS_HANDLER)
		private readonly removeSectionProgressHandler: RemoveSectionProgressHandler,
		@Inject(DiToken.FIND_SECTION_PROGRESS_FOR_USER_HANDLER)
		private readonly findSectionProgressForUserHandler: FindSectionProgressForUserHandler,
		@Inject(DiToken.LIST_SECTION_PROGRESS_HANDLER)
		private readonly listSectionProgressHandler: ListSectionProgressHandler,
	) {}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listSectionsSchema)) payload: z.infer<
			typeof listSectionsSchema
		>,
	): Promise<ListSectionsResponse> {
		try {
			const sections = await this.listSectionsHandler.execute({
				where: {
					learningPathId: payload.where?.learningPathId,
				},
				options: payload.options,
			});

			return {
				sections: sections.map(sectionDtoToClient),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findSectionByIdSchema))
		payload: z.infer<typeof findSectionByIdSchema>,
	): Promise<FindSectionByIdResponse> {
		try {
			const section = await this.findSectionByIdHandler.execute({
				where: { id: payload.where.id },
			});

			return { section: sectionDtoToClient(section) };
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createSectionSchema))
		payload: z.infer<typeof createSectionSchema>,
	): Promise<CreateSectionResponse> {
		try {
			const section = await this.addSectionHandler.execute({
				learningPathId: payload.learningPathId,
				name: payload.name,
				description: payload.description,
			});

			return { section: sectionDtoToClient(section) };
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async update(
		@Payload(new RpcValidationPipe(updateSectionSchema))
		payload: z.infer<typeof updateSectionSchema>,
	): Promise<UpdateSectionResponse> {
		try {
			const section = await this.updateSectionHandler.execute({
				where: { id: payload.where.id },
				props: payload.fields,
			});

			return { section: sectionDtoToClient(section) };
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async reorder(
		@Payload(new RpcValidationPipe(reorderSectionSchema))
		payload: z.infer<typeof reorderSectionSchema>,
	): Promise<void> {
		try {
			await this.reorderSectionHandler.execute({
				sectionId: payload.sectionId,
				order: payload.order,
			});
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeSectionSchema))
		payload: z.infer<typeof removeSectionSchema>,
	): Promise<void> {
		try {
			await this.removeSectionHandler.execute({
				sectionId: payload.where.id,
			});
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async start(
		@Payload(new RpcValidationPipe(startSectionSchema))
		payload: z.infer<typeof startSectionSchema>,
	): Promise<SectionsServiceStartResponse> {
		try {
			const progress = await this.startSectionHandler.execute({
				sectionId: payload.sectionId,
				userId: payload.userId,
			});

			return {
				progress: sectionProgressDtoToClient(progress),
			};
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async removeProgress(
		@Payload(new RpcValidationPipe(removeSectionProgressSchema))
		payload: z.infer<typeof removeSectionProgressSchema>,
	): Promise<SectionsServiceRemoveProgressResponse> {
		try {
			await this.removeSectionProgressHandler.execute({
				sectionId: payload.sectionId,
				userId: payload.userId,
			});

			return {};
		} catch (err) {
			if (err instanceof SectionProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async findOneProgressForUser(
		@Payload(new RpcValidationPipe(findSectionProgressForUserSchema))
		payload: z.infer<typeof findSectionProgressForUserSchema>,
	): Promise<SectionsServiceFindOneProgressForUserResponse> {
		try {
			const progress = await this.findSectionProgressForUserHandler.execute({
				sectionId: payload.sectionId,
				userId: payload.userId,
			});

			return {
				progress: sectionProgressDtoToClient(progress),
			};
		} catch (err) {
			if (err instanceof SectionProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async listProgress(
		@Payload(new RpcValidationPipe(listSectionProgressSchema))
		payload: z.infer<typeof listSectionProgressSchema>,
	): Promise<SectionsServiceListProgressResponse> {
		try {
			const progress = await this.listSectionProgressHandler.execute({
				options: payload.options,
				where: {
					learningPathId: payload.where?.learningPathId,
					userId: payload.where?.userId,
				},
			});

			return {
				progress: progress.map(sectionProgressDtoToClient),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}
}
