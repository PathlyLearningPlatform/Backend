import type { IQueryHandler } from '@/app/common';
import type { UnitProgressDto } from '../dtos';
import { UnitProgressNotFoundException } from '../exceptions';
import {
	IUnitProgressRepository,
	UnitId,
	UnitProgressId,
} from '@/domain/units';
import { UserId, UUID } from '@/domain/common';
import { progressAggregateToDto } from '../helpers';

export type FindUnitProgressForUserQuery = {
	unitId: string;
	userId: string;
};
export type FindUnitProgressForUserResult = UnitProgressDto;

export class FindUnitProgressForUserHandler
	implements
		IQueryHandler<FindUnitProgressForUserQuery, FindUnitProgressForUserResult>
{
	constructor(
		private readonly unitProgressRepository: IUnitProgressRepository,
	) {}

	async execute(query: FindUnitProgressForUserQuery): Promise<UnitProgressDto> {
		const progressId = UnitProgressId.create(
			UnitId.create(query.unitId),
			UserId.create(UUID.create(query.userId)),
		);
		const unitProgress = await this.unitProgressRepository.findById(progressId);

		if (!unitProgress) {
			throw new UnitProgressNotFoundException('');
		}

		return progressAggregateToDto(unitProgress);
	}
}
