import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { PathsService } from './paths.service'
import {
	HttpErrorDto,
	nullToEmptyString,
	HttpValidationPipe,
	HttpErrorResponse,
} from '@pathly-backend/common/index.js'
import {
	CreatePathBodyDto,
	CreatePathResponseDto,
	FindOnePathResponseDto,
	FindPathsQueryDto,
	FindPathsResponseDto,
	RemovePathResponseDto,
	UpdatePathBodyDto,
	UpdatePathResponseDto,
} from './dtos'
import {
	PathCannotBeRemovedException,
	PathNotFoundException,
} from './exceptions'
import {
	createPathBodySchema,
	findPathsQuerySchema,
	updatePathBodySchema,
} from './schemas'
import { clientPathToResponseDto } from './helpers'
import { domainPathsOrderByFieldsToClient } from './helpers/domain-order-by-fields-to-client.helper'
import { domainSortTypeToClient } from '../common/helpers'
import {
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
} from '@nestjs/swagger'

@Controller({
	path: 'paths',
	version: '1',
})
export class PathsController {
	constructor(private readonly pathsService: PathsService) {}

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
			throw new InternalServerErrorException(
				new HttpErrorDto('failed to find paths'),
				{
					cause: err,
				},
			)
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
			if (err instanceof PathNotFoundException) {
				throw new NotFoundException(new HttpErrorDto('path not found'))
			}

			throw new InternalServerErrorException(
				new HttpErrorDto('failed to find one path'),
				{
					cause: err,
				},
			)
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
			throw new InternalServerErrorException(
				new HttpErrorDto('failed to create path'),
				{
					cause: err,
				},
			)
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
			if (err instanceof PathNotFoundException) {
				throw new NotFoundException(new HttpErrorDto('path not found'))
			}

			throw new InternalServerErrorException(
				new HttpErrorDto('failed to update path'),
				{
					cause: err,
				},
			)
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
			if (err instanceof PathCannotBeRemovedException) {
				throw new ConflictException(
					new HttpErrorDto('path cannot be removed because it has sections'),
				)
			}

			if (err instanceof PathNotFoundException) {
				throw new NotFoundException(new HttpErrorDto('path not found'))
			}

			throw new InternalServerErrorException(
				new HttpErrorDto('failed to remove path'),
				{
					cause: err,
				},
			)
		}
	}
}
