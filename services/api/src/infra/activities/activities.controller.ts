import {
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Query,
} from '@nestjs/common';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import { HttpErrorDto, HttpValidationPipe } from '@infra/common';
import type { RemoveActivityHandler } from '@/app/activities/commands';
import type {
	FindNextActivityHandler,
	FindPreviousActivityHandler,
	FindActivityByIdHandler,
	ListActivitiesHandler,
} from '@/app/activities/queries';
import { ActivityNotFoundException } from '@/app/common';
import { DiToken } from '@infra/common';
import { ExceptionMessage } from '@infra/common';
import { ListActivitiesQueryDto } from './dtos';
import {
	ListActivitiesResponseDto,
	FindActivityByIdResponseDto,
} from './dtos/responses';
import { clientActivityToResponseDto } from './helpers';
import { listActivitiesQuerySchema } from './schemas';

@ApiTags('activities')
@Controller({
	path: 'activities',
	version: '1',
})
export class ActivitiesController {
	constructor(
		@Inject(DiToken.LIST_ACTIVITIES_HANDLER)
		private readonly listActivitiesHandler: ListActivitiesHandler,
		@Inject(DiToken.FIND_ACTIVITY_BY_ID_HANDLER)
		private readonly findActivityByIdHandler: FindActivityByIdHandler,
		@Inject(DiToken.FIND_PREVIOUS_ACTIVITY_HANDLER)
		private readonly findPreviousActivityHandler: FindPreviousActivityHandler,
		@Inject(DiToken.FIND_NEXT_ACTIVITY_HANDLER)
		private readonly findNextActivityHandler: FindNextActivityHandler,
		@Inject(DiToken.REMOVE_ACTIVITY_HANDLER)
		private readonly removeActivityHandler: RemoveActivityHandler,
	) {}

	@ApiQuery({ type: ListActivitiesQueryDto })
	@ApiOkResponse({ type: ListActivitiesResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listActivitiesQuerySchema))
		query: ListActivitiesQueryDto,
	): Promise<ListActivitiesResponseDto> {
		try {
			const result = await this.listActivitiesHandler.execute({
				options: { limit: query.limit, page: query.page },
				where: { lessonId: query.lessonId },
			});

			return {
				activities: result.map(clientActivityToResponseDto),
			};
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiOkResponse({ type: FindActivityByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id')
	async findById(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindActivityByIdResponseDto> {
		try {
			const result = await this.findActivityByIdHandler.execute({
				where: { id },
			});

			return {
				activity: clientActivityToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiOkResponse({ type: FindActivityByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id/previous')
	async findPrevious(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindActivityByIdResponseDto> {
		try {
			const result = await this.findPreviousActivityHandler.execute({ id });

			return {
				activity: clientActivityToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}

	@ApiOkResponse({ type: FindActivityByIdResponseDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@Get(':id/next')
	async findNext(
		@Param('id', ParseUUIDPipe) id: string,
	): Promise<FindActivityByIdResponseDto> {
		try {
			const result = await this.findNextActivityHandler.execute({ id });

			return {
				activity: clientActivityToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{
					cause: err,
				},
			);
		}
	}
}
