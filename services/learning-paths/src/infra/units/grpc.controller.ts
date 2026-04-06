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
	UnitsServiceFindOneProgressForUserResponse,
	UnitsServiceListProgressResponse,
	UnitsServiceRemoveProgressResponse,
	UnitsServiceStartResponse,
} from '@pathly-backend/contracts/learning_paths/v1/units.js';
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js';
import {
	type CreateUnitResponse,
	type FindUnitByIdResponse,
	type ListUnitsResponse,
	UNITS_SERVICE_NAME,
	type UpdateUnitResponse,
} from '@pathly-backend/contracts/learning-paths/v1/units.js';
import type z from 'zod';
import { SectionNotFoundException, UnitNotFoundException } from '@/app/common';
import type {
	AddUnitHandler,
	ReorderUnitHandler,
} from '@/app/sections/commands';
import type {
	RemoveUnitHandler,
	RemoveUnitProgressHandler,
	StartUnitHandler,
	UpdateUnitHandler,
} from '@/app/units/commands';
import { UnitProgressNotFoundException } from '@/app/units/exceptions';
import type {
	FindUnitByIdHandler,
	FindUnitProgressForUserHandler,
	ListUnitProgressHandler,
	ListUnitsHandler,
} from '@/app/units/queries';
import { DiToken, ExceptionMessage } from '../common/enums';
import { unitDtoToClient, unitProgressDtoToClient } from './helpers';
import {
	createUnitSchema,
	findUnitByIdSchema,
	findUnitProgressForUserSchema,
	listUnitProgressSchema,
	listUnitsSchema,
	removeUnitProgressSchema,
	removeUnitSchema,
	reorderUnitSchema,
	startUnitSchema,
	updateUnitSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcUnitsController {
	constructor(
		@Inject(DiToken.LIST_UNITS_HANDLER)
		private readonly listUnitsHandler: ListUnitsHandler,
		@Inject(DiToken.FIND_UNIT_BY_ID_HANDLER)
		private readonly findUnitByIdHandler: FindUnitByIdHandler,
		@Inject(DiToken.ADD_UNIT_HANDLER)
		private readonly addUnitHandler: AddUnitHandler,
		@Inject(DiToken.UPDATE_UNIT_HANDLER)
		private readonly updateUnitHandler: UpdateUnitHandler,
		@Inject(DiToken.REORDER_UNIT_HANDLER)
		private readonly reorderUnitHandler: ReorderUnitHandler,
		@Inject(DiToken.REMOVE_UNIT_HANDLER)
		private readonly removeUnitHandler: RemoveUnitHandler,
		@Inject(DiToken.START_UNIT_HANDLER)
		private readonly startUnitHandler: StartUnitHandler,
		@Inject(DiToken.REMOVE_UNIT_PROGRESS_HANDLER)
		private readonly removeUnitProgressHandler: RemoveUnitProgressHandler,
		@Inject(DiToken.FIND_UNIT_PROGRESS_FOR_USER_HANDLER)
		private readonly findUnitProgressForUserHandler: FindUnitProgressForUserHandler,
		@Inject(DiToken.LIST_UNIT_PROGRESS_HANDLER)
		private readonly listUnitProgressHandler: ListUnitProgressHandler,
	) {}

	@GrpcMethod(UNITS_SERVICE_NAME)
	async list(
		@Payload(new RpcValidationPipe(listUnitsSchema)) payload: z.infer<
			typeof listUnitsSchema
		>,
	): Promise<ListUnitsResponse> {
		try {
			const units = await this.listUnitsHandler.execute({
				where: {
					sectionId: payload.where?.sectionId,
				},
				options: payload.options,
			});

			return {
				units: units.map(unitDtoToClient),
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async findById(
		@Payload(new RpcValidationPipe(findUnitByIdSchema))
		payload: z.infer<typeof findUnitByIdSchema>,
	): Promise<FindUnitByIdResponse> {
		try {
			const unit = await this.findUnitByIdHandler.execute({
				where: { id: payload.where.id },
			});

			return { unit: unitDtoToClient(unit) };
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async create(
		@Payload(new RpcValidationPipe(createUnitSchema))
		payload: z.infer<typeof createUnitSchema>,
	): Promise<CreateUnitResponse> {
		try {
			const unit = await this.addUnitHandler.execute({
				sectionId: payload.sectionId,
				name: payload.name,
				description: payload.description,
			});

			return { unit: unitDtoToClient(unit) };
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async update(
		@Payload(new RpcValidationPipe(updateUnitSchema))
		payload: z.infer<typeof updateUnitSchema>,
	): Promise<UpdateUnitResponse> {
		try {
			const unit = await this.updateUnitHandler.execute({
				where: { id: payload.where.id },
				props: payload.fields,
			});

			return { unit: unitDtoToClient(unit) };
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async reorder(
		@Payload(new RpcValidationPipe(reorderUnitSchema))
		payload: z.infer<typeof reorderUnitSchema>,
	): Promise<void> {
		try {
			await this.reorderUnitHandler.execute({
				unitId: payload.unitId,
				order: payload.order,
			});
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async remove(
		@Payload(new RpcValidationPipe(removeUnitSchema))
		payload: z.infer<typeof removeUnitSchema>,
	): Promise<void> {
		try {
			await this.removeUnitHandler.execute({
				unitId: payload.where.id,
			});
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async start(
		@Payload(new RpcValidationPipe(startUnitSchema))
		payload: z.infer<typeof startUnitSchema>,
	): Promise<UnitsServiceStartResponse> {
		try {
			const progress = await this.startUnitHandler.execute({
				unitId: payload.unitId,
				userId: payload.userId,
			});

			return {
				progress: unitProgressDtoToClient(progress),
			};
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async removeProgress(
		@Payload(new RpcValidationPipe(removeUnitProgressSchema))
		payload: z.infer<typeof removeUnitProgressSchema>,
	): Promise<UnitsServiceRemoveProgressResponse> {
		try {
			await this.removeUnitProgressHandler.execute({
				unitId: payload.unitId,
				userId: payload.userId,
			});

			return {};
		} catch (err) {
			if (err instanceof UnitProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async findOneProgressForUser(
		@Payload(new RpcValidationPipe(findUnitProgressForUserSchema))
		payload: z.infer<typeof findUnitProgressForUserSchema>,
	): Promise<UnitsServiceFindOneProgressForUserResponse> {
		try {
			const progress = await this.findUnitProgressForUserHandler.execute({
				unitId: payload.unitId,
				userId: payload.userId,
			});

			return {
				progress: unitProgressDtoToClient(progress),
			};
		} catch (err) {
			if (err instanceof UnitProgressNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto(
						ExceptionMessage.UNIT_PROGRESS_NOT_FOUND,
						GrpcStatus.NOT_FOUND,
						LearningPathsApiErrorCodes.UNIT_NOT_FOUND,
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

	@GrpcMethod(UNITS_SERVICE_NAME)
	async listProgress(
		@Payload(new RpcValidationPipe(listUnitProgressSchema))
		payload: z.infer<typeof listUnitProgressSchema>,
	): Promise<UnitsServiceListProgressResponse> {
		try {
			const progress = await this.listUnitProgressHandler.execute({
				options: payload.options,
				where: {
					sectionId: payload.where?.sectionId,
					userId: payload.where?.userId,
				},
			});

			return {
				progress: progress.map(unitProgressDtoToClient),
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
