import {
	type ICommandHandler,
	type IEventBus,
	LessonNotFoundException,
} from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import {
	type ILessonProgressRepository,
	type ILessonRepository,
	LessonId,
	LessonProgress,
	LessonProgressId,
} from '@/domain/lessons';
import type { LessonProgressDto } from '../dtos';
import { progressAggregateToDto } from '../helpers';

export type StartLessonCommand = {
	lessonId: string;
	userId: string;
};
export type StartLessonResult = LessonProgressDto;

export class StartLessonHandler
	implements ICommandHandler<StartLessonCommand, StartLessonResult>
{
	constructor(
		private readonly lessonProgressRepository: ILessonProgressRepository,
		private readonly lessonRepository: ILessonRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartLessonCommand): Promise<StartLessonResult> {
		const lessonId = LessonId.create(command.lessonId);
		const lesson = await this.lessonRepository.findById(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(command.lessonId);
		}

		const userId = UserId.create(UUID.create(command.userId));
		const id = LessonProgressId.create(lessonId, userId);
		const lessonProgress = LessonProgress.create(id, {
			unitId: lesson.unitId,
			totalActivityCount: lesson.activityCount,
		});

		await this.lessonProgressRepository.save(lessonProgress);

		const events = lessonProgress.pullEvents();
		await this.eventBus.publish(events);

		return progressAggregateToDto(lessonProgress);
	}
}
