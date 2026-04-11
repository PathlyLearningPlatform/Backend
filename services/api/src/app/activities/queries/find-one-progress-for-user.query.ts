import type { IQueryHandler } from "@/app/common";
import type { ActivityProgressDto } from "../dtos";
import { ActivityProgressNotFoundException } from "../exceptions";
import type { IActivityProgressReadRepository } from "../interfaces";

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
			await this.activityProgressReadRepository.findOneForUser(
				query.activityId,
				query.userId,
			);

		if (!activityProgress) {
			throw new ActivityProgressNotFoundException("");
		}

		return activityProgress;
	}
}
