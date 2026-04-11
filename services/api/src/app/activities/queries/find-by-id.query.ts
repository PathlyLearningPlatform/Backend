import { ActivityNotFoundException, type IQueryHandler } from "@/app/common";
import type { ActivityDto } from "../dtos";
import type { IActivityReadRepository } from "../interfaces";

type FindActivityByIdQuery = {
	where: {
		id: string;
	};
};
type FindActivityByIdResult = ActivityDto;

export class FindActivityByIdHandler
	implements IQueryHandler<FindActivityByIdQuery, FindActivityByIdResult>
{
	constructor(
		private readonly activityReadRepository: IActivityReadRepository,
	) {}

	async execute(query: FindActivityByIdQuery): Promise<FindActivityByIdResult> {
		const activity = await this.activityReadRepository.findById(query.where.id);

		if (!activity) {
			throw new ActivityNotFoundException(query.where.id);
		}

		return activity;
	}
}
