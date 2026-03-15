import { ICommandHandler } from '@/app/common';
import { UUID } from '@/domain/common';
import {
	ILessonProgressRepository,
	LessonProgressId,
} from '@/domain/lesson-progress';
import { LessonProgressNotFoundException } from '../exceptions';

type RemoveLessonProgressCommand = {
	id: string;
};

export class RemoveLessonProgressHandler
	implements ICommandHandler<RemoveLessonProgressCommand, void>
{
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
	) {}

	async execute(command: RemoveLessonProgressCommand): Promise<void> {
		const wasRemoved = await this.lessonProgressRepository.remove(
			LessonProgressId.create(UUID.create(command.id)),
		);

		if (!wasRemoved) {
			throw new LessonProgressNotFoundException('');
		}
	}
}
