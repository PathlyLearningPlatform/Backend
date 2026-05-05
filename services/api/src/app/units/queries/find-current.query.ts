import type { IQueryHandler } from '@/app/common';
import type { UnitProgressDto } from '../dtos';
import { UnitProgressNotFoundException } from '../exceptions';
import { IUnitProgressRepository } from '@/domain/units';
import { SectionId } from '@/domain/sections';
import { UserId, UUID } from '@/domain/common';
import { progressAggregateToDto } from '../helpers';

export type FindCurrentUnitQuery = {
	sectionId: string;
	userId: string;
};

export class FindCurrentUnitHandler
	implements IQueryHandler<FindCurrentUnitQuery, UnitProgressDto>
{
	constructor(
		private readonly unitProgressRepository: IUnitProgressRepository,
	) {}

	async execute(command: FindCurrentUnitQuery): Promise<UnitProgressDto> {
		const sectionId = SectionId.create(command.sectionId);
		const userId = UserId.create(UUID.create(command.userId));

		const current = await this.unitProgressRepository.findCurrent(
			sectionId,
			userId,
		);

		if (!current) {
			throw new UnitProgressNotFoundException('');
		}

		return progressAggregateToDto(current);
	}
}
