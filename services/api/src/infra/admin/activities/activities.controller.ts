import {
	Body,
	Controller,
	Delete,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
	CreateActivityDto,
	CreateActivityResponseDto,
	UpdateActivityDto,
	UpdateActivityResponseDto,
} from './dtos';
import {
	DiToken,
	ExceptionMessage,
	HttpErrorDto,
	HttpValidationPipe,
} from '@/infra/common';
import { createActivitySchema, updateActivitySchema } from './schemas';
import { AddActivityHandler } from '@/app/lessons/commands';
import { clientActivityToResponseDto } from '@/infra/activities/helpers';
import {
	RemoveActivityHandler,
	UpdateActivityHandler,
} from '@/app/activities/commands';
import { ActivityNotFoundException } from '@/app/common';

@ApiTags('admin/activities')
@Controller({
	path: 'admin/activities',
	version: '1',
})
export class ActivityAdminController {
	constructor(
		@Inject(DiToken.ADD_ACTIVITY_HANDLER)
		private readonly createHandler: AddActivityHandler,
		@Inject(DiToken.UPDATE_ACTIVITY_HANDLER)
		private readonly updateHandler: UpdateActivityHandler,
		@Inject(DiToken.REMOVE_ACTIVITY_HANDLER)
		private readonly removeHandler: RemoveActivityHandler,
	) {}

	@ApiOkResponse({ type: CreateActivityResponseDto })
	@Post()
	async create(
		@Body(new HttpValidationPipe(createActivitySchema))
		body: CreateActivityDto,
	): Promise<CreateActivityResponseDto> {
		try {
			const activity = await this.createHandler.execute({
				lessonId: body.lessonId,
				name: body.name,
				type: body.type,
				description: body.description,
			});

			return { data: clientActivityToResponseDto(activity) };
		} catch (err) {
			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: UpdateActivityResponseDto })
	@Patch(':id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(new HttpValidationPipe(updateActivitySchema))
		body: UpdateActivityDto,
	): Promise<UpdateActivityResponseDto> {
		try {
			const activity = await this.updateHandler.execute({
				where: { id },
				fields: { name: body.name, description: body.description },
			});

			return { data: clientActivityToResponseDto(activity) };
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}

	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse()
	@Delete(':id')
	async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		try {
			await this.removeHandler.execute({ activityId: id });
		} catch (err) {
			if (err instanceof ActivityNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.ACTIVITY_NOT_FOUND),
				);
			}

			throw new InternalServerErrorException(
				new HttpErrorDto(ExceptionMessage.INTERNAL_ERROR),
				{ cause: err },
			);
		}
	}
}
