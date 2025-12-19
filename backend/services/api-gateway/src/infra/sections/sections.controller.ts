import {
	Body,
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
import { SectionsService } from './sections.service'
import {
	HttpErrorDto,
	nullToEmptyString,
	HttpValidationPipe,
	HttpErrorResponse,
} from '@pathly-backend/common/index.js'
import {
	CreateSectionBodyDto,
	CreateSectionResponseDto,
	FindOneSectionResponseDto,
	FindSectionsQueryDto,
	FindSectionsResponseDto,
	RemoveSectionResponseDto,
	UpdateSectionBodyDto,
	UpdateSectionResponseDto,
} from './dtos'
import { SectionNotFoundException } from './exceptions'
import {
	createSectionBodySchema,
	findSectionsQuerySchema,
	updateSectionBodySchema,
} from './schemas'
import { clientSectionToResponseDto } from './helpers'
import { domainSortTypeToClient } from '../common/helpers'
import {
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
} from '@nestjs/swagger'
import { PathNotFoundException } from '../paths/exceptions'

@Controller({
	path: 'sections',
	version: '1',
})
export class SectionsController {
	constructor(private readonly sectionsService: SectionsService) {}

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
			throw new InternalServerErrorException(
				new HttpErrorDto('failed to find sections'),
				{
					cause: err,
				},
			)
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
			if (err instanceof SectionNotFoundException) {
				throw new NotFoundException(new HttpErrorDto('section not found'))
			}

			throw new InternalServerErrorException(
				new HttpErrorDto('failed to find one section'),
				{
					cause: err,
				},
			)
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
			if (err instanceof PathNotFoundException) {
				throw new NotFoundException(new HttpErrorDto('path not found'))
			}

			throw new InternalServerErrorException(
				new HttpErrorDto('failed to create section'),
				{
					cause: err,
				},
			)
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
			if (err instanceof SectionNotFoundException) {
				throw new NotFoundException(new HttpErrorDto('section not found'))
			}

			throw new InternalServerErrorException(
				new HttpErrorDto('failed to update section'),
				{
					cause: err,
				},
			)
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
			if (err instanceof SectionNotFoundException) {
				throw new NotFoundException(new HttpErrorDto('section not found'))
			}

			throw new InternalServerErrorException(
				new HttpErrorDto('failed to remove section'),
				{
					cause: err,
				},
			)
		}
	}
}
