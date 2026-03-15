import { ActivityProgressDto, ListActivityProgressDto } from '../dtos';

export interface IActivityProgressReadRepository {
	list(dto: ListActivityProgressDto): Promise<ActivityProgressDto[]>;

	findById(id: string): Promise<ActivityProgressDto | null>;

	findForUser(
		activityId: string,
		userId: string,
	): Promise<ActivityProgressDto | null>;
}
