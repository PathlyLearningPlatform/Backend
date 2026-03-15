import { IQueryHandler } from '@/app/common';
import { ActivityProgressDto } from '../dtos';
import { IActivityProgressReadRepository } from '../interfaces';
import { ActivityProgressNotFoundException } from '../exceptions';

export type FindActivityProgressByIdQuery = {
	id: string;
};
export type FindActivityProgressByIdResult = ActivityProgressDto;

export class FindActivityProgressByIdHandler
	implements
		IQueryHandler<FindActivityProgressByIdQuery, FindActivityProgressByIdResult>
{
	constructor(
		private readonly activityProgressReadRepository: IActivityProgressReadRepository,
	) {}

	async execute(
		query: FindActivityProgressByIdQuery,
	): Promise<ActivityProgressDto> {
		const activityProgress = await this.activityProgressReadRepository.findById(
			query.id,
		);

		if (!activityProgress) {
			throw new ActivityProgressNotFoundException(query.id);
		}

		return activityProgress;
	}
}
