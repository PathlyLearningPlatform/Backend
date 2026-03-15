import { IQueryHandler } from '@/app/common';
import { ActivityProgressDto } from '../dtos';
import { IActivityProgressReadRepository } from '../interfaces';
import { ActivityProgressNotFoundException } from '../exceptions';

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
		private readonly activityProgressReadRepository: IActivityProgressReadRepository,
	) {}

	async execute(
		query: FindActivityProgressForUserQuery,
	): Promise<ActivityProgressDto> {
		const activityProgress =
			await this.activityProgressReadRepository.findForUser(
				query.activityId,
				query.userId,
			);

		if (!activityProgress) {
			throw new ActivityProgressNotFoundException('');
		}

		return activityProgress;
	}
}
