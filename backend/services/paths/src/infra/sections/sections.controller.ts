import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	AppLogger,
	GrpcErrorDto,
	GrpcException,
	RpcValidationPipe,
} from '@pathly-backend/common';
import type {
	CreateSectionResponse,
	FindOneSectionResponse,
	FindSectionsResponse,
	RemoveSectionResponse,
	UpdateSectionResponse,
} from '@pathly-backend/contracts/paths/v1/sections.js';
import type z from 'zod';
import type {
	CreateSectionUseCase,
	FindOneSectionUseCase,
	FindSectionsUseCase,
	RemoveSectionUseCase,
	UpdateSectionUseCase,
} from '@/app/sections/use-cases';
import { SectionNotFoundException } from '@/domain/sections/exceptions';
import { DiToken } from '../common/enums';
import { sectionEntityToClient } from './helpers';
import {
	createSectionSchema,
	findOneSectionSchema,
	findSectionsSchema,
	removeSectionSchema,
	updateSectionSchema,
} from './schemas';

@Controller()
export class SectionsController {
	constructor(
		@Inject(DiToken.FIND_PATHS_USE_CASE)
		private readonly findSectionsUseCase: FindSectionsUseCase,
		@Inject(DiToken.FIND_ONE_PATH_USE_CASE)
		private readonly findOneSectionUseCase: FindOneSectionUseCase,
		@Inject(DiToken.CREATE_PATH_USE_CASE)
		private readonly createSectionUseCase: CreateSectionUseCase,
		@Inject(DiToken.UPDATE_PATH_USE_CASE)
		private readonly updateSectionUseCase: UpdateSectionUseCase,
		@Inject(DiToken.REMOVE_PATH_USE_CASE)
		private readonly removeSectionUseCase: RemoveSectionUseCase,
		@Inject(AppLogger)
		private readonly appLogger: AppLogger,
	) {}

	@GrpcMethod('SectionsService')
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
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('SectionsService')
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
					new GrpcErrorDto('section not found', GrpcStatus.NOT_FOUND),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('SectionsService')
	async create(
		@Payload(new RpcValidationPipe(createSectionSchema)) payload: z.infer<
			typeof createSectionSchema
		>,
	): Promise<CreateSectionResponse> {
		try {
			const section = await this.createSectionUseCase.execute(payload);

			return { section: sectionEntityToClient(section) };
		} catch (err) {
			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('SectionsService')
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
					new GrpcErrorDto('section not found', GrpcStatus.NOT_FOUND),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}

	@GrpcMethod('SectionsService')
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
			if (err instanceof SectionNotFoundException) {
				throw new GrpcException(
					new GrpcErrorDto('section not found', GrpcStatus.NOT_FOUND),
				);
			}

			throw new GrpcException(
				new GrpcErrorDto('internal server error', GrpcStatus.INTERNAL),
				err,
			);
		}
	}
}
