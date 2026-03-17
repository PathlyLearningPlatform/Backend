import { Controller, Inject } from '@nestjs/common';
import { DiToken, ExceptionMessage } from '../common';
import { SectionNotFoundException } from '@/app/common';
import {
	LearningPathNotStartedException,
	SectionProgressNotFoundException,
} from '@/app/section-progress';
import type {
	FindSectionProgressByIdHandler,
	FindSectionProgressForUserHandler,
	ListSectionProgressHandler,
	RemoveSectionProgressHandler,
	StartSectionHandler,
} from '@/app/section-progress';
import {
	SECTION_PROGRESS_SERVICE_NAME,
	type FindSectionProgressByIdResponse,
	type FindSectionProgressForUserResponse,
	type ListSectionProgressResponse,
	type RemoveSectionProgressResponse,
	type StartSectionResponse,
} from '@pathly-backend/contracts/progress/v1/sections.js';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	RpcValidationPipe,
} from '@pathly-backend/common/index.js';
import {
	findSectionProgressByIdSchema,
	findSectionProgressForUserSchema,
	listSectionProgressSchema,
	removeSectionProgressSchema,
	startSectionSchema,
} from './schemas';
import type z from 'zod';
import { sectionProgressDtoToClient } from './helpers';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js';

@Controller()
export class GrpcSectionProgressController {
	constructor(
		@Inject(DiToken.LIST_SECTION_PROGRESS_HANDLER)
		private readonly listHandler: ListSectionProgressHandler,
		@Inject(DiToken.FIND_SECTION_PROGRESS_BY_ID_HANDLER)
		private readonly findByIdHandler: FindSectionProgressByIdHandler,
		@Inject(DiToken.FIND_SECTION_PROGRESS_FOR_USER_HANDLER)
		private readonly findForUserHandler: FindSectionProgressForUserHandler,
		@Inject(DiToken.START_SECTION_HANDLER)
		private readonly startHandler: StartSectionHandler,
		@Inject(DiToken.REMOVE_SECTION_PROGRESS_HANDLER)
		private readonly removeHandler: RemoveSectionProgressHandler,
	) {}

	@GrpcMethod(SECTION_PROGRESS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listSectionProgressSchema))
		payload: z.infer<typeof listSectionProgressSchema>,
	): Promise<ListSectionProgressResponse> {
		try {
			const result = await this.listHandler.execute({
				options: {
					limit: payload?.options?.limit,
					page: payload?.options?.page,
				},
				where: {
					learningPathId: payload?.where?.learningPathId,
					userId: payload?.where?.userId,
				},
			});

			return {
				sectionProgress: result.map(sectionProgressDtoToClient),
			};
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTION_PROGRESS_SERVICE_NAME)
	async findForUser(
		@Payload(new RpcValidationPipe(findSectionProgressForUserSchema))
		payload: z.infer<typeof findSectionProgressForUserSchema>,
	): Promise<FindSectionProgressForUserResponse> {
		try {
			const result = await this.findForUserHandler.execute({
				sectionId: payload.sectionId,
				userId: payload.userId,
			});

			return {
				sectionProgress: sectionProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof SectionProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.SECTION_PROGRESS_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTION_PROGRESS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findSectionProgressByIdSchema))
		payload: z.infer<typeof findSectionProgressByIdSchema>,
	): Promise<FindSectionProgressByIdResponse> {
		try {
			const result = await this.findByIdHandler.execute({
				id: payload.id,
			});

			return {
				sectionProgress: sectionProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof SectionProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.SECTION_PROGRESS_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTION_PROGRESS_SERVICE_NAME)
	async start(
		@Payload(new RpcValidationPipe(startSectionSchema))
		payload: z.infer<typeof startSectionSchema>,
	): Promise<StartSectionResponse> {
		try {
			const result = await this.startHandler.execute({
				sectionId: payload.sectionId,
				userId: payload.userId,
			});

			return {
				sectionProgress: sectionProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.SECTION_NOT_FOUND,
					),
					err,
				);
			}

			if (err instanceof LearningPathNotStartedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.LEARNING_PATH_NOT_STARTED,
						GrpcStatus.FAILED_PRECONDITION,
						ProgressApiErrorCodes.LEARNING_PATH_NOT_STARTED,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}

	@GrpcMethod(SECTION_PROGRESS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeSectionProgressSchema))
		payload: z.infer<typeof removeSectionProgressSchema>,
	): Promise<RemoveSectionProgressResponse> {
		try {
			await this.removeHandler.execute({
				id: payload.id,
			});

			return {};
		} catch (err) {
			if (err instanceof SectionProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.SECTION_PROGRESS_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.INTERNAL_ERROR,
					GrpcStatus.INTERNAL,
					ProgressApiErrorCodes.INTERNAL_ERROR,
				),
				err,
			);
		}
	}
}
