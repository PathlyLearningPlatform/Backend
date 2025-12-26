import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import {
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
} from '@nestjs/swagger'
import {
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
	nullToEmptyString,
} from '@pathly-backend/common/index.js'
import { domainSortTypeToClient } from '../common/helpers'
import {
	type CreatePathBodyDto,
	CreatePathResponseDto,
	FindOnePathResponseDto,
	type FindPathsQueryDto,
	FindPathsResponseDto,
	RemovePathResponseDto,
	type UpdatePathBodyDto,
	UpdatePathResponseDto,
} from './dtos'
import { clientPathToResponseDto } from './helpers'
import { domainPathsOrderByFieldsToClient } from './helpers/domain-order-by-fields-to-client.helper'
import { PathsService } from './paths.service'
import {
	createPathBodySchema,
	findPathsQuerySchema,
	updatePathBodySchema,
} from './schemas'
import { GrpcException } from '@pathly-backend/common/index.js'
import { PathsApiErrorCodes } from '@pathly-backend/contracts/paths/v1/api.js'

@Controller({
	path: 'paths',
	version: '1',
})
export class PathsController {
	constructor(
		@Inject(PathsService) private readonly pathsService: PathsService,
	) {}

	@ApiOkResponse({ type: FindPathsResponseDto })
	@Get()
	async find(
		@Query(new HttpValidationPipe(findPathsQuerySchema))
		query: FindPathsQueryDto,
	): Promise<FindPathsResponseDto> {
		try {
			const result = await this.pathsService.find({
				options: {
					...query,
					orderBy: query.orderBy
						? domainPathsOrderByFieldsToClient(query.orderBy)
						: undefined,
					sortType: query.sortType
						? domainSortTypeToClient(query.sortType)
						: undefined,
				},
			})

			return {
				paths: Array.from(result.paths).map(clientPathToResponseDto),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find paths'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({ type: FindOnePathResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findOne(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOnePathResponseDto> {
		try {
			const result = await this.pathsService.findOne({ where: { id } })

			return {
				path: clientPathToResponseDto(result.path!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.PATH_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('path not found'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find paths'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiCreatedResponse({ type: CreatePathResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createPathBodySchema))
		body: CreatePathBodyDto,
	): Promise<CreatePathResponseDto> {
		try {
			const result = await this.pathsService.create({
				name: body.name,
				description: nullToEmptyString(body.description),
			})

			return {
				path: clientPathToResponseDto(result.path!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to create path'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({ type: UpdatePathResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updatePathBodySchema))
		body: UpdatePathBodyDto,
	): Promise<UpdatePathResponseDto> {
		try {
			const result = await this.pathsService.update({
				where: { id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
				},
			})

			return {
				path: clientPathToResponseDto(result.path!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.PATH_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('path not found'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find paths'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({
		type: RemovePathResponseDto,
	})
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<RemovePathResponseDto> {
		try {
			const result = await this.pathsService.remove({ where: { id } })

			return {
				path: clientPathToResponseDto(result.path!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.PATH_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('path not found'))
				case PathsApiErrorCodes.PATH_CANNOT_BE_REMOVED:
					throw new ConflictException(
						new HttpErrorDto('path cannot be removed'),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find paths'),
						{
							cause: err,
						},
					)
			}
		}
	}
}
