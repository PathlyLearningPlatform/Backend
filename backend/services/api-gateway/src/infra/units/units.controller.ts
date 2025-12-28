import {
	Body,
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
	ApiBody,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger'
import {
	type GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
	nullToEmptyString,
} from '@pathly-backend/common/index.js'
import { PathsApiErrorCodes } from '@pathly-backend/contracts/paths/v1/api.js'
import {
	CreateUnitBodyDto,
	CreateUnitResponseDto,
	FindOneUnitResponseDto,
	FindUnitsQueryDto,
	FindUnitsResponseDto,
	RemoveUnitResponseDto,
	UpdateUnitBodyDto,
	UpdateUnitResponseDto,
} from './dtos'
import { UnitsService } from './units.service'
import { clientUnitToResponseDto } from './helpers'
import {
	createUnitBodySchema,
	findUnitsQuerySchema,
	updateUnitBodySchema,
} from './schemas'

@Controller({
	path: 'units',
	version: '1',
})
export class UnitsController {
	constructor(
		@Inject(UnitsService) private readonly unitsService: UnitsService,
	) {}

	@ApiQuery({ type: FindUnitsQueryDto })
	@ApiOkResponse({ type: FindUnitsResponseDto })
	@Get()
	async find(
		@Query(new HttpValidationPipe(findUnitsQuerySchema))
		query: FindUnitsQueryDto,
	): Promise<FindUnitsResponseDto> {
		try {
			const result = await this.unitsService.find({
				options: query,
			})

			return {
				units: Array.from(result.units).map(clientUnitToResponseDto),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find one unit'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({ type: FindOneUnitResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findOne(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneUnitResponseDto> {
		try {
			const result = await this.unitsService.findOne({ where: { id } })

			return {
				unit: clientUnitToResponseDto(result.unit!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.UNIT_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('unit not found'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find one unit'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiBody({ type: CreateUnitBodyDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: CreateUnitResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createUnitBodySchema))
		body: CreateUnitBodyDto,
	): Promise<CreateUnitResponseDto> {
		try {
			const result = await this.unitsService.create({
				name: body.name,
				description: nullToEmptyString(body.description),
				order: body.order,
				sectionId: body.sectionId,
			})

			return {
				unit: clientUnitToResponseDto(result.unit!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.SECTION_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('section not found'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find one unit'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiBody({ type: UpdateUnitBodyDto })
	@ApiOkResponse({ type: UpdateUnitResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateUnitBodySchema))
		body: UpdateUnitBodyDto,
	): Promise<UpdateUnitResponseDto> {
		try {
			const result = await this.unitsService.update({
				where: { id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
					order: body.order,
				},
			})

			return {
				unit: clientUnitToResponseDto(result.unit!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.UNIT_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('unit not found'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find one unit'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({
		type: RemoveUnitResponseDto,
	})
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<RemoveUnitResponseDto> {
		try {
			const result = await this.unitsService.remove({ where: { id } })

			return {
				unit: clientUnitToResponseDto(result.unit!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.UNIT_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('unit not found'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find one unit'),
						{
							cause: err,
						},
					)
			}
		}
	}
}
