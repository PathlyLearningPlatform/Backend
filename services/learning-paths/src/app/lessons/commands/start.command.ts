import {
	type ICommandHandler,
	type IEventBus,
	LessonNotFoundException,
} from "@/app/common";
import { UserId, UUID } from "@/domain/common";
import {
	type ILessonProgressRepository,
	LessonId,
	LessonProgress,
	LessonProgressId,
} from "@/domain/lessons";
import { UnitId } from "@/domain/units";
import type { LessonProgressDto } from "../dtos";
import type { ILessonReadRepository } from "../interfaces";

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
		private readonly lessonReadRepository: ILessonReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartLessonCommand): Promise<StartLessonResult> {
		const lesson = await this.lessonReadRepository.findById(command.lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(command.lessonId);
		}

		const lessonId = LessonId.create(command.lessonId);
		const userId = UserId.create(UUID.create(command.userId));
		const id = LessonProgressId.create(lessonId, userId);
		const lessonProgress = LessonProgress.create(id, {
			unitId: UnitId.create(lesson.unitId),
			totalActivityCount: lesson.activityCount,
		});

		await this.lessonProgressRepository.save(lessonProgress);

		const events = lessonProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			id: lessonProgress.id.toString(),
			completedAt: lessonProgress.completedAt,
			lessonId: lessonProgress.lessonId.value,
			unitId: lessonProgress.unitId.value,
			userId: lessonProgress.userId.toString(),
			totalActivityCount: lessonProgress.totalActivityCount,
			completedActivityCount: lessonProgress.completedActivityCount,
		};
	}
}
