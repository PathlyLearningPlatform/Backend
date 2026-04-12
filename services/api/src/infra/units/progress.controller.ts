import {
	ConflictException,
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	NotFoundException,
	NotImplementedException,
	Param,
	ParseUUIDPipe,
	Patch,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiNotImplementedResponse,
	ApiOkResponse,
	ApiQuery,
} from '@nestjs/swagger';
import { HttpErrorDto, HttpValidationPipe } from '@infra/common';
import type { StartUnitHandler } from '@/app/units/commands';
import type {
	FindUnitProgressForUserHandler,
	ListUnitProgressHandler,
} from '@/app/units/queries';
import { UnitProgressNotFoundException } from '@/app/units/exceptions';
import { SectionProgressNotFoundException } from '@/app/sections/exceptions';
import { UnitNotFoundException } from '@/app/common';
import { DiToken } from '@infra/common';
import { User } from '@infra/auth/user.decorator';
import { JwtGuard } from '@infra/auth/jwt.guard';
import type { UserInfo } from '@infra/auth/user-info.type';
import { ExceptionMessage } from '@infra/common';
import {
	ListUnitProgressQueryDto,
	FindUnitProgressForUserResponseDto,
	ListUnitProgressResponseDto,
	RemoveUnitProgressResponseDto,
	StartUnitResponseDto,
} from './dtos';
import { clientUnitProgressToResponseDto } from './helpers';
import { listUnitProgressQuerySchema } from './schemas';

@UseGuards(JwtGuard)
@Controller({
	path: 'progress/units',
	version: '1',
})
export class UnitProgressController {
	constructor(
		@Inject(DiToken.START_UNIT_HANDLER)
		private readonly startUnitHandler: StartUnitHandler,
		@Inject(DiToken.FIND_UNIT_PROGRESS_FOR_USER_HANDLER)
		private readonly findUnitProgressForUserHandler: FindUnitProgressForUserHandler,
		@Inject(DiToken.LIST_UNIT_PROGRESS_HANDLER)
		private readonly listUnitProgressHandler: ListUnitProgressHandler,
	) {}

	@ApiQuery({ type: ListUnitProgressQueryDto })
	@ApiOkResponse({ type: ListUnitProgressResponseDto })
	@Get()
	async list(
		@Query(new HttpValidationPipe(listUnitProgressQuerySchema))
		query: ListUnitProgressQueryDto,
		@User() user: UserInfo,
	): Promise<ListUnitProgressResponseDto> {
		try {
			const result = await this.listUnitProgressHandler.execute({
				options: {
					limit: query.limit,
					page: query.page,
				},
				where: {
					userId: user.id,
				},
			});

			return {
				unitProgress: result.map(clientUnitProgressToResponseDto),
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

	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: FindUnitProgressForUserResponseDto })
	@Get(':unitId')
	async findForUser(
		@Param('unitId', ParseUUIDPipe) unitId: string,
		@User() user: UserInfo,
	): Promise<FindUnitProgressForUserResponseDto> {
		try {
			const result = await this.findUnitProgressForUserHandler.execute({
				unitId,
				userId: user.id,
			});

			return {
				unitProgress: clientUnitProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.UNIT_NOT_FOUND),
				);
			}

			if (err instanceof UnitProgressNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.UNIT_NOT_STARTED),
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

	@ApiConflictResponse({ type: HttpErrorDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: StartUnitResponseDto })
	@Patch(':unitId/start')
	async start(
		@Param('unitId', ParseUUIDPipe) unitId: string,
		@User() user: UserInfo,
	): Promise<StartUnitResponseDto> {
		try {
			const result = await this.startUnitHandler.execute({
				unitId,
				userId: user.id,
			});

			return {
				unitProgress: clientUnitProgressToResponseDto(result),
			};
		} catch (err) {
			if (err instanceof UnitNotFoundException) {
				throw new NotFoundException(
					new HttpErrorDto(ExceptionMessage.UNIT_NOT_FOUND),
				);
			}

			if (err instanceof SectionProgressNotFoundException) {
				throw new ConflictException(
					new HttpErrorDto(ExceptionMessage.SECTION_NOT_STARTED),
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

	@ApiNotImplementedResponse({ type: HttpErrorDto })
	@ApiNotFoundResponse({ type: HttpErrorDto })
	@ApiOkResponse({ type: RemoveUnitProgressResponseDto })
	@Delete(':unitId')
	async remove(
		@Param('unitId', ParseUUIDPipe) _unitId: string,
		@User() _user: UserInfo,
	): Promise<RemoveUnitProgressResponseDto> {
		throw new NotImplementedException(
			new HttpErrorDto('endpoint not implemented'),
		);
	}
}
