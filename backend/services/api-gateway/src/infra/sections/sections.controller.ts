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
	GrpcException,
	HttpErrorDto,
	HttpErrorResponse,
	HttpValidationPipe,
	nullToEmptyString,
} from '@pathly-backend/common/index.js'
import {
	type CreateSectionBodyDto,
	CreateSectionResponseDto,
	FindOneSectionResponseDto,
	type FindSectionsQueryDto,
	FindSectionsResponseDto,
	RemoveSectionResponseDto,
	type UpdateSectionBodyDto,
	UpdateSectionResponseDto,
} from './dtos'
import { clientSectionToResponseDto } from './helpers'
import {
	createSectionBodySchema,
	findSectionsQuerySchema,
	updateSectionBodySchema,
} from './schemas'
import { SectionsService } from './sections.service'
import { PathsApiErrorCodes } from '@pathly-backend/contracts/paths/v1/api.js'

@Controller({
	path: 'sections',
	version: '1',
})
export class SectionsController {
	constructor(
		@Inject(SectionsService) private readonly sectionsService: SectionsService,
	) {}

	@ApiOkResponse({ type: FindSectionsResponseDto })
	@Get()
	async find(
		@Query(new HttpValidationPipe(findSectionsQuerySchema))
		query: FindSectionsQueryDto,
	): Promise<FindSectionsResponseDto> {
		try {
			const result = await this.sectionsService.find({
				options: query,
			})

			return {
				sections: Array.from(result.sections).map(clientSectionToResponseDto),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find sections'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({ type: FindOneSectionResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findOne(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindOneSectionResponseDto> {
		try {
			const result = await this.sectionsService.findOne({ where: { id } })

			return {
				section: clientSectionToResponseDto(result.section!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.SECTION_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('section not found'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find one section'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiCreatedResponse({ type: CreateSectionResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createSectionBodySchema))
		body: CreateSectionBodyDto,
	): Promise<CreateSectionResponseDto> {
		try {
			const result = await this.sectionsService.create({
				name: body.name,
				description: nullToEmptyString(body.description),
				order: body.order,
				pathId: body.pathId,
			})

			return {
				section: clientSectionToResponseDto(result.section!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.PATH_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('path not found'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find sections'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({ type: UpdateSectionResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateSectionBodySchema))
		body: UpdateSectionBodyDto,
	): Promise<UpdateSectionResponseDto> {
		try {
			const result = await this.sectionsService.update({
				where: { id },
				fields: {
					name: body.name,
					description: nullToEmptyString(body.description),
					order: body.order,
				},
			})

			return {
				section: clientSectionToResponseDto(result.section!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.SECTION_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('section not found'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find sections'),
						{
							cause: err,
						},
					)
			}
		}
	}

	@ApiOkResponse({
		type: RemoveSectionResponseDto,
	})
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<RemoveSectionResponseDto> {
		try {
			const result = await this.sectionsService.remove({ where: { id } })

			return {
				section: clientSectionToResponseDto(result.section!),
			}
		} catch (err) {
			const grpcErr = err as GrpcException
			const errRes = grpcErr.getGrpcError()

			switch (errRes.apiCode) {
				case PathsApiErrorCodes.SECTION_NOT_FOUND:
					throw new NotFoundException(new HttpErrorDto('section not found'))
				case PathsApiErrorCodes.SECTION_CANNOT_BE_REMOVED:
					throw new ConflictException(new HttpErrorDto('cannot remove section'))
				default:
					throw new InternalServerErrorException(
						new HttpErrorDto('failed to find sections'),
						{
							cause: err,
						},
					)
			}
		}
	}
}
