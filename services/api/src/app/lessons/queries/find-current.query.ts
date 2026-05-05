import type { IQueryHandler } from '@/app/common';
import type { LessonProgressDto } from '../dtos';
import { LessonProgressNotFoundException } from '../exceptions';
import { ILessonProgressRepository } from '@/domain/lessons';
import { UnitId } from '@/domain/units';
import { UserId, UUID } from '@/domain/common';
import { progressAggregateToDto } from '../helpers';

export type FindCurrentLessonQuery = {
	unitId: string;
	userId: string;
};

export class FindCurrentLessonHandler
	implements IQueryHandler<FindCurrentLessonQuery, LessonProgressDto>
{
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
	) {}

	async execute(command: FindCurrentLessonQuery): Promise<LessonProgressDto> {
		const unitId = UnitId.create(command.unitId);
		const userId = UserId.create(UUID.create(command.userId));

		const current = await this.lessonProgressRepository.findCurrent(
			unitId,
			userId,
		);

		if (!current) {
			throw new LessonProgressNotFoundException('');
		}

		return progressAggregateToDto(current);
	}
}
