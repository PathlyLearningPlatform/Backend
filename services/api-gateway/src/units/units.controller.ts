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
	ApiBody,
	ApiConflictResponse,
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
import { LearningPathsApiErrorCodes } from '@pathly-backend/contracts/learning-paths/v1/api.js'
import { exceptionCodeToMessage } from '../common/helpers'
import {
	CreateUnitBodyDto,
	CreateUnitResponseDto,
	FindOneUnitResponseDto,
	FindUnitsQueryDto,
	FindUnitsResponseDto,
	UpdateUnitBodyDto,
	UpdateUnitResponseDto,
} from './dtos'
import { clientUnitToResponseDto } from './helpers'
import {
	createUnitBodySchema,
	findUnitsQuerySchema,
	updateUnitBodySchema,
} from './schemas'
import { UnitsService } from './units.service'

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
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
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
				case LearningPathsApiErrorCodes.UNIT_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.UNIT_NOT_FOUND],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiBody({ type: CreateUnitBodyDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
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
				case LearningPathsApiErrorCodes.UNIT_DUPLICATE_ORDER:
					throw new ConflictException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.UNIT_DUPLICATE_ORDER
							],
						),
					)
				case LearningPathsApiErrorCodes.SECTION_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.SECTION_NOT_FOUND
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
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
	@ApiConflictResponse({ type: HttpErrorResponse })
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
				case LearningPathsApiErrorCodes.UNIT_DUPLICATE_ORDER:
					throw new ConflictException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.UNIT_DUPLICATE_ORDER
							],
						),
					)
				case LearningPathsApiErrorCodes.UNIT_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.UNIT_NOT_FOUND],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.unitsService.remove({ where: { id } })
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case LearningPathsApiErrorCodes.UNIT_NOT_FOUND:
					throw new NotFoundException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.UNIT_NOT_FOUND],
						),
					)
				case LearningPathsApiErrorCodes.UNIT_CANNOT_BE_REMOVED:
					throw new ConflictException(
						new HttpErrorDto(
							exceptionCodeToMessage[
								LearningPathsApiErrorCodes.UNIT_CANNOT_BE_REMOVED
							],
						),
					)
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto(
							exceptionCodeToMessage[LearningPathsApiErrorCodes.INTERNAL_ERROR],
						),
						{
							cause: err,
						},
					)
			}
		}
	}
}
