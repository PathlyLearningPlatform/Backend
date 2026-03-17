import { Controller, Inject } from '@nestjs/common';
import { DiToken, ExceptionMessage } from '../common';
import { UnitNotFoundException } from '@/app/common';
import {
	SectionNotStartedException,
	UnitProgressNotFoundException,
} from '@/app/unit-progress';
import type {
	FindUnitProgressByIdHandler,
	FindUnitProgressForUserHandler,
	ListUnitProgressHandler,
	RemoveUnitProgressHandler,
	StartUnitHandler,
} from '@/app/unit-progress';
import {
	UNIT_PROGRESS_SERVICE_NAME,
	type FindUnitProgressByIdResponse,
	type FindUnitProgressForUserResponse,
	type ListUnitProgressResponse,
	type RemoveUnitProgressResponse,
	type StartUnitResponse,
} from '@pathly-backend/contracts/progress/v1/units.js';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	RpcValidationPipe,
} from '@pathly-backend/common/index.js';
import {
	findUnitProgressByIdSchema,
	findUnitProgressForUserSchema,
	listUnitProgressSchema,
	removeUnitProgressSchema,
	startUnitSchema,
} from './schemas';
import type z from 'zod';
import { unitProgressDtoToClient } from './helpers';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { ProgressApiErrorCodes } from '@pathly-backend/contracts/progress/v1/api.js';

@Controller()
export class GrpcUnitProgressController {
	constructor(
		@Inject(DiToken.LIST_UNIT_PROGRESS_HANDLER)
		private readonly listHandler: ListUnitProgressHandler,
		@Inject(DiToken.FIND_UNIT_PROGRESS_BY_ID_HANDLER)
		private readonly findByIdHandler: FindUnitProgressByIdHandler,
		@Inject(DiToken.FIND_UNIT_PROGRESS_FOR_USER_HANDLER)
		private readonly findForUserHandler: FindUnitProgressForUserHandler,
		@Inject(DiToken.START_UNIT_HANDLER)
		private readonly startHandler: StartUnitHandler,
		@Inject(DiToken.REMOVE_UNIT_PROGRESS_HANDLER)
		private readonly removeHandler: RemoveUnitProgressHandler,
	) {}

	@GrpcMethod(UNIT_PROGRESS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listUnitProgressSchema))
		payload: z.infer<typeof listUnitProgressSchema>,
	): Promise<ListUnitProgressResponse> {
		try {
			const result = await this.listHandler.execute({
				options: {
					limit: payload?.options?.limit,
					page: payload?.options?.page,
				},
				where: {
					sectionId: payload?.where?.sectionId,
					userId: payload?.where?.userId,
				},
			});

			return {
				unitProgress: result.map(unitProgressDtoToClient),
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

	@GrpcMethod(UNIT_PROGRESS_SERVICE_NAME)
	async findForUser(
		@Payload(new RpcValidationPipe(findUnitProgressForUserSchema))
		payload: z.infer<typeof findUnitProgressForUserSchema>,
	): Promise<FindUnitProgressForUserResponse> {
		try {
			const result = await this.findForUserHandler.execute({
				unitId: payload.unitId,
				userId: payload.userId,
			});

			return {
				unitProgress: unitProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof UnitProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.UNIT_PROGRESS_NOT_FOUND,
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

	@GrpcMethod(UNIT_PROGRESS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findUnitProgressByIdSchema))
		payload: z.infer<typeof findUnitProgressByIdSchema>,
	): Promise<FindUnitProgressByIdResponse> {
		try {
			const result = await this.findByIdHandler.execute({
				id: payload.id,
			});

			return {
				unitProgress: unitProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof UnitProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.UNIT_PROGRESS_NOT_FOUND,
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

	@GrpcMethod(UNIT_PROGRESS_SERVICE_NAME)
	async start(
		@Payload(new RpcValidationPipe(startUnitSchema))
		payload: z.infer<typeof startUnitSchema>,
	): Promise<StartUnitResponse> {
		try {
			const result = await this.startHandler.execute({
				unitId: payload.unitId,
				userId: payload.userId,
			});

			return {
				unitProgress: unitProgressDtoToClient(result),
			};
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.UNIT_NOT_FOUND,
					),
					err,
				);
			}

			if (err instanceof SectionNotStartedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.SECTION_NOT_STARTED,
						GrpcStatus.FAILED_PRECONDITION,
						ProgressApiErrorCodes.SECTION_NOT_STARTED,
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

	@GrpcMethod(UNIT_PROGRESS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeUnitProgressSchema))
		payload: z.infer<typeof removeUnitProgressSchema>,
	): Promise<RemoveUnitProgressResponse> {
		try {
			await this.removeHandler.execute({
				id: payload.id,
			});

			return {};
		} catch (err) {
			if (err instanceof UnitProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						ProgressApiErrorCodes.UNIT_PROGRESS_NOT_FOUND,
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
