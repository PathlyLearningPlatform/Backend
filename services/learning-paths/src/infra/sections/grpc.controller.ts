import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	AppLogger,
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import {
	type CreateSectionResponse,
	type FindOneSectionResponse,
	type FindSectionsResponse,
	type RemoveSectionResponse,
	SECTIONS_SERVICE_NAME,
	type UpdateSectionResponse,
} from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import type z from 'zod';
import type {
	CreateSectionUseCase,
	FindOneSectionUseCase,
	FindSectionsUseCase,
	RemoveSectionUseCase,
	UpdateSectionUseCase,
} from '@/app/sections/use-cases';
import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';
import {
	SectionCannotBeRemovedException,
	SectionNotFoundException,
} from '@/domain/sections/exceptions';
import { DiToken } from '../common/enums';
import { sectionEntityToClient } from './helpers';
import {
	createSectionSchema,
	findOneSectionSchema,
	findSectionsSchema,
	removeSectionSchema,
	updateSectionSchema,
} from './schemas';
import { errorCodeToMessage } from '../common/helpers/error-code-to-message.helper';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcSectionsController {
	constructor(
		@Inject(DiToken.FIND_SECTIONS_USE_CASE)
		private readonly findSectionsUseCase: FindSectionsUseCase,
		@Inject(DiToken.FIND_ONE_SECTION_USE_CASE)
		private readonly findOneSectionUseCase: FindOneSectionUseCase,
		@Inject(DiToken.CREATE_SECTION_USE_CASE)
		private readonly createSectionUseCase: CreateSectionUseCase,
		@Inject(DiToken.UPDATE_SECTION_USE_CASE)
		private readonly updateSectionUseCase: UpdateSectionUseCase,
		@Inject(DiToken.REMOVE_SECTION_USE_CASE)
		private readonly removeSectionUseCase: RemoveSectionUseCase,
		@Inject(AppLogger)
		private readonly appLogger: AppLogger,
	) {}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async find(
		@Payload(new RpcValidationPipe(findSectionsSchema)) payload: z.infer<
			typeof findSectionsSchema
		>,
	): Promise<FindSectionsResponse> {
		try {
			const sections = await this.findSectionsUseCase.execute(payload);

			return {
				sections: sections.map(sectionEntityToClient),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async findOne(
		@Payload(new RpcValidationPipe(findOneSectionSchema))
		payload: z.infer<typeof findOneSectionSchema>,
	): Promise<FindOneSectionResponse> {
		try {
			const section = await this.findOneSectionUseCase.execute(payload);

			return { section: sectionEntityToClient(section) };
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.SECTION_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createSectionSchema)) payload: z.infer<
			typeof createSectionSchema
		>,
	): Promise<CreateSectionResponse> {
		try {
			const section = await this.createSectionUseCase.execute(payload);

			return { section: sectionEntityToClient(section) };
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[
							LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND
						],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.LEARNING_PATH_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async update(
		@Payload(new RpcValidationPipe(updateSectionSchema)) payload: z.infer<
			typeof updateSectionSchema
		>,
	): Promise<UpdateSectionResponse> {
		try {
			const section = await this.updateSectionUseCase.execute(payload);

			return { section: sectionEntityToClient(section) };
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.SECTION_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTIONS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeSectionSchema)) payload: z.infer<
			typeof removeSectionSchema
		>,
	): Promise<RemoveSectionResponse> {
		try {
			const section = await this.removeSectionUseCase.execute(payload);

			return {
				section: sectionEntityToClient(section),
			};
		} catch (err) {
			if (err instanceof SectionCannotBeRemovedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[
							LearningPathsApiErrorCodes.SECTION_CANNOT_BE_REMOVED
						],
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.SECTION_CANNOT_BE_REMOVED,
					),
				);
			}

			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.SECTION_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					errorCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
					GrpcStatus.INTERNAL,
					LearningPathsApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}
}
