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
} from '@nestjs/common';
import {
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger';
import { HttpErrorResponse } from '@infra/swagger';
import {
	HttpErrorDto,
	HttpValidationPipe,
	nullToEmptyString,
} from '@infra/common';
import type { AddSectionHandler } from '@/app/learning-paths/commands';
import {
	LearningPathNotFoundException,
	SectionNotFoundException,
} from '@/app/common';
import type {
	UpdateSectionHandler,
	RemoveSectionHandler,
} from '@/app/sections/commands';
import type {
	FindSectionByIdHandler,
	ListSectionsHandler,
} from '@/app/sections/queries';
import { SectionCannotBeRemovedException } from '@/domain/sections/exceptions';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import {
	CreateSectionBodyDto,
	CreateSectionResponseDto,
	FindSectionByIdResponseDto,
	FindSectionsQueryDto,
	FindSectionsResponseDto,
	UpdateSectionBodyDto,
	UpdateSectionResponseDto,
} from './dtos';
import { clientSectionToResponseDto } from './helpers';
import {
	createSectionBodySchema,
	findSectionsQuerySchema,
	updateSectionBodySchema,
} from './schemas';

@Controller({
	path: 'sections',
	version: '1',
})
export class SectionsController {
	constructor(
		@Inject(DiToken.LIST_SECTIONS_HANDLER)
		private readonly listSectionsHandler: ListSectionsHandler,
		@Inject(DiToken.FIND_SECTION_BY_ID_HANDLER)
		private readonly findSectionByIdHandler: FindSectionByIdHandler,
		@Inject(DiToken.ADD_SECTION_HANDLER)
		private readonly addSectionHandler: AddSectionHandler,
		@Inject(DiToken.UPDATE_SECTION_HANDLER)
		private readonly updateSectionHandler: UpdateSectionHandler,
		@Inject(DiToken.REMOVE_SECTION_HANDLER)
		private readonly removeSectionHandler: RemoveSectionHandler,
	) {}

	@ApiQuery({ type: FindSectionsQueryDto })
	@ApiOkResponse({ type: FindSectionsResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(findSectionsQuerySchema))
		query: FindSectionsQueryDto,
	): Promise<FindSectionsResponseDto> {
		try {
			const result = await this.listSectionsHandler.execute({
				options: query,
			});

			return {
				sections: result.map(clientSectionToResponseDto),
			};
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiOkResponse({ type: FindSectionByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindSectionByIdResponseDto> {
		try {
			const result = await this.findSectionByIdHandler.execute({
				where: { id },
			});

			return {
				section: clientSectionToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SECTION_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiBody({ type: CreateSectionBodyDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@ApiCreatedResponse({ type: CreateSectionResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createSectionBodySchema))
		body: CreateSectionBodyDto,
	): Promise<CreateSectionResponseDto> {
		try {
			const result = await this.addSectionHandler.execute({
				name: body.name,
				description: nullToEmptyString(body.description),
				learningPathId: body.learningPathId,
			});

			return {
				section: clientSectionToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof LearningPathNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.LEARNING_PATH_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiBody({ type: UpdateSectionBodyDto })
	@ApiOkResponse({ type: UpdateSectionResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateSectionBodySchema))
		body: UpdateSectionBodyDto,
	): Promise<UpdateSectionResponseDto> {
		try {
			const result = await this.updateSectionHandler.execute({
				where: { id },
				props: {
					name: body.name,
					description: nullToEmptyString(body.description),
				},
			});

			return {
				section: clientSectionToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SECTION_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorResponse })
	@ApiConflictResponse({ type: HttpErrorResponse })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.removeSectionHandler.execute({
				sectionId: id,
			});
		} catch (err) {
			if (err instanceof SectionNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.SECTION_NOT_FOUND),
				);
			}

			if (err instanceof SectionCannotBeRemovedException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.SECTION_CANNOT_BE_REMOVED),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}
}
