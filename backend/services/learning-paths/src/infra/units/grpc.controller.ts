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
import type {
	CreateUnitResponse,
	FindOneUnitResponse,
	FindUnitsResponse,
	RemoveUnitResponse,
	UpdateUnitResponse,
} from '@pathly-backend/contracts/paths/v1/units.js';
import type z from 'zod';
import type {
	CreateUnitUseCase,
	FindOneUnitUseCase,
	FindUnitsUseCase,
	RemoveUnitUseCase,
	UpdateUnitUseCase,
} from '@/app/units/use-cases';
import { UnitNotFoundException } from '@/domain/units/exceptions';
import { DiToken } from '../common/enums';
import { unitEntityToClient } from './helpers';
import {
	createUnitSchema,
	findOneUnitSchema,
	findUnitsSchema,
	removeUnitSchema,
	updateUnitSchema,
} from './schemas';
import { PathNotFoundException } from '@/domain/learning-paths/exceptions';
import { PathsApiErrorCodes } from '@pathly-backend/contracts/paths/v1/api.js';
import { SectionNotFoundException } from '@/domain/sections/exceptions';

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

	@GrpcMethod('UnitsService')
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
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('UnitsService')
	async findOne(
		@Payload(new RpcValidationPipe(findOneUnitSchema))
		payload: z.infer<typeof findOneUnitSchema>,
	): Promise<FindOneUnitResponse> {
		try {
			const unit = await this.findOneUnitUseCase.execute(payload);

			return { unit: unitEntityToClient(unit) };
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'unit not found',
						GrpcStatus.NOT_FOUND,
						PathsApiErrorCodes.UNIT_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('UnitsService')
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
						'path not found',
						GrpcStatus.NOT_FOUND,
						PathsApiErrorCodes.SECTION_NOT_FOUND,
					),
					err,
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('UnitsService')
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
						'unit not found',
						GrpcStatus.NOT_FOUND,
						PathsApiErrorCodes.UNIT_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('UnitsService')
	async remove(
		@Payload(new RpcValidationPipe(removeUnitSchema)) payload: z.infer<
			typeof removeUnitSchema
		>,
	): Promise<RemoveUnitResponse> {
		try {
			const unit = await this.removeUnitUseCase.execute(payload);

			return {
				unit: unitEntityToClient(unit),
			};
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						'unit not found',
						GrpcStatus.NOT_FOUND,
						PathsApiErrorCodes.UNIT_NOT_FOUND,
					),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}
}
