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
	type CreateUnitResponse,
	type FindOneUnitResponse,
	type FindUnitsResponse,
	type RemoveUnitResponse,
	UNITS_SERVICE_NAME,
	type UpdateUnitResponse,
} from '@pathly-backend/contracts/learning-paths/v1/units.js';
import type z from 'zod';
import type {
	CreateUnitUseCase,
	FindOneUnitUseCase,
	FindUnitsUseCase,
	RemoveUnitUseCase,
	UpdateUnitUseCase,
} from '@/app/units/use-cases';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import {
	UnitCannotBeRemovedException,
	UnitNotFoundException,
} from '@/domain/units/exceptions';
import { DiToken } from '../common/enums';
import { errorCodeToMessage } from '../common/helpers/error-code-to-message.helper';
import { unitEntityToClient } from './helpers';
import {
	createUnitSchema,
	findOneUnitSchema,
	findUnitsSchema,
	removeUnitSchema,
	updateUnitSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcUnitsController {
	constructor(
		@Inject(DiToken.FIND_UNITS_USE_CASE)
		private readonly findUnitsUseCase: FindUnitsUseCase,
		@Inject(DiToken.FIND_ONE_UNIT_USE_CASE)
		private readonly findOneUnitUseCase: FindOneUnitUseCase,
		@Inject(DiToken.CREATE_UNIT_USE_CASE)
		private readonly createUnitUseCase: CreateUnitUseCase,
		@Inject(DiToken.UPDATE_UNIT_USE_CASE)
		private readonly updateUnitUseCase: UpdateUnitUseCase,
		@Inject(DiToken.REMOVE_UNIT_USE_CASE)
		private readonly removeUnitUseCase: RemoveUnitUseCase,
		@Inject(AppLogger)
		private readonly appLogger: AppLogger,
	) {}

	@GrpcMethod(UNITS_SERVICE_NAME)
	async find(
		@Payload(new RpcValidationPipe(findUnitsSchema)) payload: z.infer<
			typeof findUnitsSchema
		>,
	): Promise<FindUnitsResponse> {
		try {
			const units = await this.findUnitsUseCase.execute(payload);

			return {
				units: units.map(unitEntityToClient),
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async findOne(
		@Payload(new RpcValidationPipe(findOneUnitSchema))
		payload: z.infer<typeof findOneUnitSchema>,
	): Promise<FindOneUnitResponse> {
		try {
			const unit = await this.findOneUnitUseCase.execute(payload.where.id);

			return { unit: unitEntityToClient(unit) };
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.UNIT_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createUnitSchema)) payload: z.infer<
			typeof createUnitSchema
		>,
	): Promise<CreateUnitResponse> {
		try {
			const unit = await this.createUnitUseCase.execute(payload);

			return { unit: unitEntityToClient(unit) };
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.SECTION_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.SECTION_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async update(
		@Payload(new RpcValidationPipe(updateUnitSchema)) payload: z.infer<
			typeof updateUnitSchema
		>,
	): Promise<UpdateUnitResponse> {
		try {
			const unit = await this.updateUnitUseCase.execute(payload);

			return { unit: unitEntityToClient(unit) };
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.UNIT_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeUnitSchema)) payload: z.infer<
			typeof removeUnitSchema
		>,
	): Promise<void> {
		try {
			await this.removeUnitUseCase.execute(payload.where.id);
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[LearningPathsApiErrorCodes.UNIT_NOT_FOUND],
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
					),
				);
			}

			if (err instanceof UnitCannotBeRemovedException) {
				throw new GrpcException(
					new GrpcErrorDto(
						errorCodeToMessage[
							LearningPathsApiErrorCodes.UNIT_CANNOT_BE_REMOVED
						],
						GrpcStatus.FAILED_PRECONDITION,
						LearningPathsApiErrorCodes.UNIT_CANNOT_BE_REMOVED,
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
