import type { IQueryHandler } from '@/app/common';
import {
	ActivityId,
	ActivityProgressId,
	IActivityProgressRepository,
} from '@/domain/activities';
import { UserId, UUID } from '@/domain/common';
import type { ActivityProgressDto } from '../dtos';
import { ActivityProgressNotFoundException } from '../exceptions';
import { progressAggregateToDto } from '../helpers';

export type FindActivityProgressForUserQuery = {
	activityId: string;
	userId: string;
};
export type FindActivityProgressForUserResult = ActivityProgressDto;

export class FindActivityProgressForUserHandler
	implements
		IQueryHandler<
			FindActivityProgressForUserQuery,
			FindActivityProgressForUserResult
		>
{
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
	) {}

	async execute(
		query: FindActivityProgressForUserQuery,
	): Promise<ActivityProgressDto> {
		const progressId = ActivityProgressId.create(
			ActivityId.create(query.activityId),
			UserId.create(UUID.create(query.userId)),
		);
		const activityProgress =
			await this.activityProgressRepository.findById(progressId);

		if (!activityProgress) {
			throw new ActivityProgressNotFoundException('');
		}

		return progressAggregateToDto(activityProgress);
	}
}
