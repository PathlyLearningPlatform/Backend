import { DiToken } from '@/common/enums'
import type { ServiceError } from '@grpc/grpc-js'
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { throwGrpcException } from '@pathly-backend/common'
import {
	SKILLS_SERVICE_NAME,
	type SkillsServiceAddChildRequest,
	type SkillsServiceAddChildResponse,
	type SkillsServiceAddNextStepRequest,
	type SkillsServiceAddNextStepResponse,
	type SkillsServiceClient,
	type SkillsServiceCreateRequest,
	type SkillsServiceCreateResponse,
	type SkillsServiceFindByIdRequest,
	type SkillsServiceFindByIdResponse,
	type SkillsServiceFindBySlugRequest,
	type SkillsServiceFindBySlugResponse,
	type SkillsServiceGetPrerequisiteGraphRequest,
	type SkillsServiceGetPrerequisiteGraphResponse,
	type SkillsServiceListChildrenRequest,
	type SkillsServiceListChildrenResponse,
	type SkillsServiceListNextStepsRequest,
	type SkillsServiceListNextStepsResponse,
	type SkillsServiceListPrerequisitiesRequest,
	type SkillsServiceListPrerequisitiesResponse,
	type SkillsServiceRemoveRequest,
	type SkillsServiceRemoveResponse,
	type SkillsServiceUpdateRequest,
	type SkillsServiceUpdateResponse,
} from '@pathly-backend/contracts/skills/v1/skills.js'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class SkillsService implements OnModuleInit {
	private skillsServiceClient!: SkillsServiceClient

	constructor(@Inject(DiToken.SKILLS_PACKAGE) private client: ClientGrpc) {}

	onModuleInit() {
		this.skillsServiceClient =
			this.client.getService<SkillsServiceClient>(SKILLS_SERVICE_NAME)
	}

	async create(
		request: SkillsServiceCreateRequest,
	): Promise<SkillsServiceCreateResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.create(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async update(
		request: SkillsServiceUpdateRequest,
	): Promise<SkillsServiceUpdateResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.update(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async remove(
		request: SkillsServiceRemoveRequest,
	): Promise<SkillsServiceRemoveResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.remove(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findById(
		request: SkillsServiceFindByIdRequest,
	): Promise<SkillsServiceFindByIdResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.findById(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async findBySlug(
		request: SkillsServiceFindBySlugRequest,
	): Promise<SkillsServiceFindBySlugResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.findBySlug(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async addNextStep(
		request: SkillsServiceAddNextStepRequest,
	): Promise<SkillsServiceAddNextStepResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.addNextStep(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async listNextSteps(
		request: SkillsServiceListNextStepsRequest,
	): Promise<SkillsServiceListNextStepsResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.listNextSteps(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async listPrerequisities(
		request: SkillsServiceListPrerequisitiesRequest,
	): Promise<SkillsServiceListPrerequisitiesResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.listPrerequisities(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async addChild(
		request: SkillsServiceAddChildRequest,
	): Promise<SkillsServiceAddChildResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.addChild(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async listChildren(
		request: SkillsServiceListChildrenRequest,
	): Promise<SkillsServiceListChildrenResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.listChildren(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}

	async getPrerequisiteGraph(
		request: SkillsServiceGetPrerequisiteGraphRequest,
	): Promise<SkillsServiceGetPrerequisiteGraphResponse> {
		const result = await firstValueFrom(
			this.skillsServiceClient
				.getPrerequisiteGraph(request)
				.pipe(catchError((err: ServiceError) => throwGrpcException(err))),
		)

		return result
	}
}
