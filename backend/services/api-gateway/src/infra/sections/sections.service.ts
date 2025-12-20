import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { DiToken } from '../common/enums'
import type { ClientGrpc } from '@nestjs/microservices'
import {
	CreateSectionRequest,
	CreateSectionResponse,
	FindSectionsRequest,
	FindSectionsResponse,
	SECTIONS_SERVICE_NAME,
	SectionsServiceClient,
	RemoveSectionRequest,
	RemoveSectionResponse,
	UpdateSectionRequest,
	UpdateSectionResponse,
	FindOneSectionRequest,
	FindOneSectionResponse,
} from '@pathly-backend/contracts/paths/v1/sections.js'
import { catchError, firstValueFrom, from, of } from 'rxjs'
import {
	AppException,
	GrpcErrorDto,
	GrpcException,
} from '@pathly-backend/common'
import { SectionNotFoundException } from './exceptions'
import { PathsApiErrorCodes } from '@pathly-backend/contracts/paths/v1/api.js'
import { PathNotFoundException } from '../paths/exceptions'
import { ServiceError } from '@grpc/grpc-js'
import { throwGrpcException } from '@pathly-backend/common/nestjs/helpers/throw-grpc-exception.helper.js'

@Injectable()
export class SectionsService implements OnModuleInit {
	private sectionsServiceClient: SectionsServiceClient

	constructor(@Inject(DiToken.SECTIONS_PACKAGE) private client: ClientGrpc) { }

	onModuleInit() {
		this.sectionsServiceClient = this.client.getService<SectionsServiceClient>(
			SECTIONS_SERVICE_NAME,
		)
	}

	async find(request: FindSectionsRequest): Promise<FindSectionsResponse> {
		try {
			const result = await firstValueFrom(
				this.sectionsServiceClient.find(request).pipe(
					catchError((err: ServiceError) => throwGrpcException(err)),
				),
			)

			return result
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				default:
					throw new AppException('failed to find sections', true, err)
			}
		}
	}

	async findOne(
		request: FindOneSectionRequest,
	): Promise<FindOneSectionResponse> {
		try {
			const result = await firstValueFrom(
				this.sectionsServiceClient.findOne(request).pipe(
					catchError((err: ServiceError) => throwGrpcException(err)),
				),
			)

			return result
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.SECTION_NOT_FOUND:
					throw new SectionNotFoundException(request.where!.id)
				default:
					throw new AppException('failed to find one section', true, err)
			}
		}
	}

	async create(request: CreateSectionRequest): Promise<CreateSectionResponse> {
		try {
			const result = await firstValueFrom(
				this.sectionsServiceClient.create(request).pipe(
					catchError((err: ServiceError) => throwGrpcException(err)),
				),
			)

			return result
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.PATH_NOT_FOUND:
					throw new PathNotFoundException(request.pathId)
				default:
					throw new AppException('failed to create section', true, err)
			}
		}
	}

	async update(request: UpdateSectionRequest): Promise<UpdateSectionResponse> {
		try {
			const result = await firstValueFrom(
				this.sectionsServiceClient.update(request).pipe(
					catchError((err: ServiceError) => throwGrpcException(err)),
				),
			)

			return result
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.SECTION_NOT_FOUND:
					throw new SectionNotFoundException(request.where!.id)
				default:
					throw new AppException('failed to update section', true, err)
			}
		}
	}

	async remove(request: RemoveSectionRequest): Promise<RemoveSectionResponse> {
		try {
			const result = await firstValueFrom(
				this.sectionsServiceClient.remove(request).pipe(
					catchError((err: ServiceError) => throwGrpcException(err)),
				),
			)

			return result
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.SECTION_NOT_FOUND:
					throw new SectionNotFoundException(request.where!.id)
				default:
					throw new AppException('failed to remove section', true, err)
			}
		}
	}
}
