import { status as GrpcStatus } from '@grpc/grpc-js';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { ValidationException } from '@/domain/common';
import {
	SkillNotFoundException,
	SkillProgressNotFoundException,
} from '@/domain/exceptions';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import {
	GrpcErrorDto,
	GrpcException,
	GrpcExceptionFilter,
	RpcValidationPipe,
} from '@pathly-backend/common';
import {
	SKILL_PROGRESS_SERVICE_NAME,
	type SkillProgressServiceUnlockResponse,
	type SkillProgressServiceFindForUserResponse,
	type SkillProgressServiceFindOneForUserResponse,
} from '@pathly-backend/contracts/skills/v1/skill_progress.js';
import { SkillsApiErrorCodes } from '@pathly-backend/contracts/skills/v1/api.js';
import type z from 'zod';
import type { UnlockSkillHandler } from '@/app/skill-progress/commands';
import type {
	FindSkillProgressForUserHandler,
	FindOneSkillProgressForUserHandler,
} from '@/app/skill-progress/queries';
import { DiToken, ExceptionMessage } from '../common';
import {
	unlockSkillSchema,
	findSkillProgressForUserSchema,
	findOneSkillProgressForUserSchema,
} from './schemas';

@UseFilters(GrpcExceptionFilter)
@Controller()
export class GrpcSkillProgressController {
	constructor(
		@Inject(DiToken.UNLOCK_SKILL_HANDLER)
		private readonly unlockHandler: UnlockSkillHandler,
		@Inject(DiToken.FIND_SKILL_PROGRESS_FOR_USER_HANDLER)
		private readonly findForUserHandler: FindSkillProgressForUserHandler,
		@Inject(DiToken.FIND_ONE_SKILL_PROGRESS_FOR_USER_HANDLER)
		private readonly findOneForUserHandler: FindOneSkillProgressForUserHandler,
	) {}

	@GrpcMethod(SKILL_PROGRESS_SERVICE_NAME)
	async unlock(
		@Payload(new RpcValidationPipe(unlockSkillSchema))
		payload: z.infer<typeof unlockSkillSchema>,
	): Promise<SkillProgressServiceUnlockResponse> {
		try {
			await this.unlockHandler.execute({
				skillId: payload.skillId,
				userId: payload.userId,
			});

			return {};
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILL_PROGRESS_SERVICE_NAME)
	async findForUser(
		@Payload(new RpcValidationPipe(findSkillProgressForUserSchema))
		payload: z.infer<typeof findSkillProgressForUserSchema>,
	): Promise<SkillProgressServiceFindForUserResponse> {
		try {
			const items = await this.findForUserHandler.execute({
				userId: payload.userId,
			});

			console.log(items);

			return {
				skillProgress: items.map((item) => ({
					skillId: item.skillId,
					unlockedAt: item.unlockedAt.toISOString(),
					userId: item.userId,
				})),
			};
		} catch (err) {
			this.mapAndThrow(err);
		}
	}

	@GrpcMethod(SKILL_PROGRESS_SERVICE_NAME)
	async findOneForUser(
		@Payload(new RpcValidationPipe(findOneSkillProgressForUserSchema))
		payload: z.infer<typeof findOneSkillProgressForUserSchema>,
	): Promise<SkillProgressServiceFindOneForUserResponse> {
		try {
			const item = await this.findOneForUserHandler.execute({
				userId: payload.userId,
				skillId: payload.skillId,
			});

			return {
				skillProgress: {
					skillId: item.skillId,
					userId: item.userId,
					unlockedAt: item.unlockedAt.toISOString(),
				},
			};
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

		if (err instanceof SkillProgressNotFoundException) {
			throw new GrpcException(
				new GrpcErrorDto(
					ExceptionMessage.SKILL_PROGRESS_NOT_FOUND,
					GrpcStatus.NOT_FOUND,
					SkillsApiErrorCodes.SKILL_PROGRESS_NOT_FOUND,
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
