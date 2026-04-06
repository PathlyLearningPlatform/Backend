import { DiToken } from '@/common/enums'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common/index.js'
import {
	SKILL_PROGRESS_SERVICE_NAME,
	type SkillProgressServiceClient,
	type SkillProgressServiceFindForUserRequest,
	type SkillProgressServiceFindForUserResponse,
	type SkillProgressServiceFindOneForUserRequest,
	type SkillProgressServiceFindOneForUserResponse,
	type SkillProgressServiceUnlockRequest,
	type SkillProgressServiceUnlockResponse,
} from '@pathly-backend/contracts/skills/v1/skill_progress.js'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class SkillProgressService implements OnModuleInit {
	private skillProgressServiceClient!: SkillProgressServiceClient

	constructor(
		@Inject(DiToken.SKILL_PROGRESS_PACKAGE) private client: ClientGrpc,
	) {}

	onModuleInit() {
		this.skillProgressServiceClient =
			this.client.getService<SkillProgressServiceClient>(
				SKILL_PROGRESS_SERVICE_NAME,
			)
	}

	async unlock(
		request: SkillProgressServiceUnlockRequest,
	): Promise<SkillProgressServiceUnlockResponse> {
		const result = await firstValueFrom(
			this.skillProgressServiceClient
				.unlock(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findForUser(
		request: SkillProgressServiceFindForUserRequest,
	): Promise<SkillProgressServiceFindForUserResponse> {
		const result = await firstValueFrom(
			this.skillProgressServiceClient
				.findForUser(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}

	async findOneForUser(
		request: SkillProgressServiceFindOneForUserRequest,
	): Promise<SkillProgressServiceFindOneForUserResponse> {
		const result = await firstValueFrom(
			this.skillProgressServiceClient
				.findOneForUser(request)
				.pipe(catchError(throwGrpcException)),
		)

		return result
	}
}
