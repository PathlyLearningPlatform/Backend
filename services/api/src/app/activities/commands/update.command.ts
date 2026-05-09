import { ActivityNotFoundException, ICommandHandler } from '@/app/common';
import { ActivityDto } from '../dtos';
import {
	ActivityDescription,
	ActivityId,
	ActivityName,
	IActivityRepository,
} from '@/domain/activities';
import { aggregateToDto } from '../helpers';

export type UpdateActivityCommand = {
	where: { id: string };
	fields?: {
		name?: string;
		description?: string | null;
	};
};

export class UpdateActivityHandler
	implements ICommandHandler<UpdateActivityCommand, ActivityDto>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(command: UpdateActivityCommand): Promise<ActivityDto> {
		const activityId = ActivityId.create(command.where.id);
		const activity = await this.activityRepository.findById(activityId);

		if (!activity) {
			throw new ActivityNotFoundException(command.where.id);
		}

		activity.update(new Date(), {
			name: command.fields?.name
				? ActivityName.create(command.fields.name)
				: undefined,
			description: command.fields?.description
				? ActivityDescription.create(command.fields.description)
				: command.fields?.description === null
					? null
					: undefined,
		});

		await this.activityRepository.save(activity);

		return aggregateToDto(activity);
	}
}
