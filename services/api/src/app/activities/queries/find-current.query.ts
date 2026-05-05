import type { IQueryHandler } from '@/app/common';
import type { ActivityProgressDto } from '../dtos';
import { ActivityProgressNotFoundException } from '../exceptions';
import { IActivityProgressRepository } from '@/domain/activities';
import { LessonId } from '@/domain/lessons';
import { UserId, UUID } from '@/domain/common';
import { progressAggregateToDto } from '../helpers';

export type FindCurrentActivityQuery = {
	lessonId: string;
	userId: string;
};

export class FindCurrentActivityHandler
	implements IQueryHandler<FindCurrentActivityQuery, ActivityProgressDto>
{
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
	) {}

	async execute(
		command: FindCurrentActivityQuery,
	): Promise<ActivityProgressDto> {
		const lessonId = LessonId.create(command.lessonId);
		const userId = UserId.create(UUID.create(command.userId));

		const current = await this.activityProgressRepository.findCurrent(
			lessonId,
			userId,
		);

		if (!current) {
			throw new ActivityProgressNotFoundException('');
		}

		return progressAggregateToDto(current);
	}
}
