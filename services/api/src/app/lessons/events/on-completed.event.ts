import type { IEventBus, IEventHandler } from '@/app/common';
import { Order, UserId, UUID } from '@/domain/common';
import {
	LessonId,
	LessonProgress,
	LessonProgressId,
	type ILessonProgressRepository,
	type ILessonRepository,
	type LessonCompletedEvent,
} from '@/domain/lessons';
import {
	type IUnitProgressRepository,
	UnitId,
	UnitProgressId,
} from '@/domain/units';

export class OnLessonCompletedHandler
	implements IEventHandler<LessonCompletedEvent>
{
	constructor(
		private readonly unitProgressRepository: IUnitProgressRepository,
		private readonly lessonProgressRepository: ILessonProgressRepository,
		private readonly lessonRepository: ILessonRepository,
		private readonly eventBus: IEventBus,
	) {}

	async handle(event: LessonCompletedEvent): Promise<void> {
		const unitId = UnitId.create(event.payload.unitId);
		const userId = UserId.create(UUID.create(event.userId));

		const unitProgress = await this.unitProgressRepository.findById(
			UnitProgressId.create(unitId, userId),
		);

		if (!unitProgress) {
			return;
		}

		unitProgress.completeLesson(event.occuredAt);

		await this.unitProgressRepository.save(unitProgress);
		await this.eventBus.publish(unitProgress.pullEvents());

		const lessonId = LessonId.create(event.payload.lessonId);
		const lesson = await this.lessonRepository.findById(lessonId);

		if (!lesson) {
			return;
		}

		const nextLesson = await this.lessonRepository.findByUnitIdAndOrder(
			unitId,
			Order.create(lesson.order.value + 1),
		);

		if (!nextLesson) {
			console.info(
				`Lesson ${lesson.id.value} is the last in unit ${unitId.value}`,
			);
			return;
		}

		const nextLessonProgressId = LessonProgressId.create(nextLesson.id, userId);
		const nextLessonProgress = LessonProgress.create(nextLessonProgressId, {
			createdAt: event.occuredAt,
			totalActivityCount: nextLesson.activityCount,
			unitId: unitId,
		});

		await this.lessonProgressRepository.save(nextLessonProgress);
		await this.eventBus.publish(nextLessonProgress.pullEvents());
	}
}
