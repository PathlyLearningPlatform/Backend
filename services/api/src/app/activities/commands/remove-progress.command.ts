import type { ICommandHandler } from "@/app/common";
import {
	ActivityId,
	ActivityProgressId,
	type IActivityProgressRepository,
} from "@/domain/activities";
import { UserId, UUID } from "@/domain/common";
import { ActivityProgressNotFoundException } from "../exceptions";

export type RemoveActivityProgressCommand = {
	activityId: string;
	userId: string;
};

export class RemoveActivityProgressHandler
	implements ICommandHandler<RemoveActivityProgressCommand, void>
{
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
	) {}

	async execute(command: RemoveActivityProgressCommand): Promise<void> {
		const activityId = ActivityId.create(command.activityId);
		const userId = UserId.create(UUID.create(command.userId));
		const id = ActivityProgressId.create(activityId, userId);

		const wasRemoved = await this.activityProgressRepository.remove(id);

		if (!wasRemoved) {
			throw new ActivityProgressNotFoundException("");
		}
	}
}
