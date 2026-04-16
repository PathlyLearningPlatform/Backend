import {
	type ICommandHandler,
	type IEventBus,
	LessonNotFoundException,
} from '@/app/common';
import { Order, UserId, UUID } from '@/domain/common';
import {
	type ILessonProgressRepository,
	type ILessonRepository,
	LessonId,
	LessonProgress,
	LessonProgressId,
	PreviousLessonNotCompletedException,
} from '@/domain/lessons';
import type { LessonProgressDto } from '../dtos';
import { progressAggregateToDto } from '../helpers';
import { IUnitProgressRepository, UnitProgressId } from '@/domain/units';
import { UnitProgressNotFoundException } from '@/app/units/exceptions';

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
		private readonly unitProgressRepository: IUnitProgressRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartLessonCommand): Promise<StartLessonResult> {
		const lessonId = LessonId.create(command.lessonId);
		const lesson = await this.lessonRepository.findById(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(command.lessonId);
		}

		const userId = UserId.create(UUID.create(command.userId));
		const unitProgressId = UnitProgressId.create(lesson.unitId, userId);

		const unitProgress =
			await this.unitProgressRepository.findById(unitProgressId);

		if (!unitProgress) {
			throw new UnitProgressNotFoundException('');
		}

		if (!lesson.order.equals(Order.create(0))) {
			const previousLesson = await this.lessonRepository.findByUnitIdAndOrder(
				lesson.unitId,
				Order.create(lesson.order.value - 1),
			);

			const previousLessonProgress =
				await this.lessonProgressRepository.findById(
					LessonProgressId.create(previousLesson!.id, userId),
				);

			if (!previousLessonProgress?.completedAt) {
				throw new PreviousLessonNotCompletedException();
			}
		}

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
