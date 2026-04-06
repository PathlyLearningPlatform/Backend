import type { ICommandHandler } from "@/app/common";
import { UserId, UUID } from "@/domain/common";
import {
	type ILessonProgressRepository,
	LessonId,
	LessonProgressId,
} from "@/domain/lessons";
import { LessonProgressNotFoundException } from "../exceptions";

type RemoveLessonProgressCommand = {
	lessonId: string;
	userId: string;
};

export class RemoveLessonProgressHandler
	implements ICommandHandler<RemoveLessonProgressCommand, void>
{
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
	) {}

	async execute(command: RemoveLessonProgressCommand): Promise<void> {
		const lessonId = LessonId.create(command.lessonId);
		const userId = UserId.create(UUID.create(command.userId));
		const id = LessonProgressId.create(lessonId, userId);

		const wasRemoved = await this.lessonProgressRepository.remove(id);

		if (!wasRemoved) {
			throw new LessonProgressNotFoundException("");
		}
	}
}
