import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import {
	type CreateSectionResponse,
	type FindSectionByIdResponse,
	type ListSectionsResponse,
	type UpdateSectionResponse,
	SECTIONS_SERVICE_NAME,
} from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import type z from 'zod';
import type {
	AddSectionHandler,
	ReorderSectionHandler,
} from '@/app/learning-paths/commands';
import type {
	UpdateSectionHandler,
	RemoveSectionHandler,
} from '@/app/sections/commands';
import type {
	ListSectionsHandler,
	FindSectionByIdHandler,
} from '@/app/sections/queries';
import {
	LearningPathNotFoundException,
	SectionNotFoundException,
} from '@/app/common';
import { DiToken, ExceptionMessage } from '../common/enums';
import { sectionDtoToClient } from './helpers';
import {
	createSectionSchema,
	listSectionsSchema,
	findSectionByIdSchema,
	removeSectionSchema,
	updateSectionSchema,
	reorderSectionSchema,
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
}
