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
import { HttpErrorDto, HttpValidationPipe } from '@infra/common';
import { SectionNotFoundException, UnitNotFoundException } from '@/app/common';
import type { AddUnitHandler } from '@/app/sections/commands';
import type {
	RemoveUnitHandler,
	UpdateUnitHandler,
} from '@/app/units/commands';
import type {
	FindUnitByIdHandler,
	ListUnitsHandler,
} from '@/app/units/queries';
import { UnitCannotBeRemovedException } from '@/domain/units/exceptions';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import {
	CreateUnitBodyDto,
	CreateUnitResponseDto,
	FindUnitByIdResponseDto,
	ListUnitsQueryDto,
	ListUnitsResponseDto,
	UpdateUnitBodyDto,
	UpdateUnitResponseDto,
} from './dtos';
import { clientUnitToResponseDto } from './helpers';
import {
	createUnitBodySchema,
	listUnitsQuerySchema,
	updateUnitBodySchema,
} from './schemas';

@Controller({
	path: 'units',
	version: '1',
})
export class UnitsController {
	constructor(
		@Inject(DiToken.LIST_UNITS_HANDLER)
		private readonly listUnitsHandler: ListUnitsHandler,
		@Inject(DiToken.FIND_UNIT_BY_ID_HANDLER)
		private readonly findUnitByIdHandler: FindUnitByIdHandler,
		@Inject(DiToken.ADD_UNIT_HANDLER)
		private readonly addUnitHandler: AddUnitHandler,
		@Inject(DiToken.UPDATE_UNIT_HANDLER)
		private readonly updateUnitHandler: UpdateUnitHandler,
		@Inject(DiToken.REMOVE_UNIT_HANDLER)
		private readonly removeUnitHandler: RemoveUnitHandler,
	) {}

	@ApiQuery({ type: ListUnitsQueryDto })
	@ApiOkResponse({ type: ListUnitsResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listUnitsQuerySchema))
		query: ListUnitsQueryDto,
	): Promise<ListUnitsResponseDto> {
		try {
			const result = await this.listUnitsHandler.execute({
				options: query,
			});

			return {
				units: result.map(clientUnitToResponseDto),
			};
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiOkResponse({ type: FindUnitByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindUnitByIdResponseDto> {
		try {
			const result = await this.findUnitByIdHandler.execute({ where: { id } });

			return {
				unit: clientUnitToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.UNIT_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiBody({ type: CreateUnitBodyDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiConflictResponse({ type: HttpErrorDto })
	@ApiCreatedResponse({ type: CreateUnitResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createUnitBodySchema))
		body: CreateUnitBodyDto,
	): Promise<CreateUnitResponseDto> {
		try {
			const result = await this.addUnitHandler.execute({
				name: body.name,
				description: body.description,
				sectionId: body.sectionId,
			});

			return {
				unit: clientUnitToResponseDto(result),
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

	@ApiBody({ type: UpdateUnitBodyDto })
	@ApiOkResponse({ type: UpdateUnitResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiConflictResponse({ type: HttpErrorDto })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateUnitBodySchema))
		body: UpdateUnitBodyDto,
	): Promise<UpdateUnitResponseDto> {
		try {
			const result = await this.updateUnitHandler.execute({
				where: { id },
				props: {
					name: body.name,
					description: body.description,
				},
			});

			return {
				unit: clientUnitToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.UNIT_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiOkResponse()
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiConflictResponse({ type: HttpErrorDto })
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.removeUnitHandler.execute({
				unitId: id,
			});
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.UNIT_NOT_FOUND),
				);
			}

			if (err instanceof UnitCannotBeRemovedException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.UNIT_CANNOT_BE_REMOVED),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}
}
