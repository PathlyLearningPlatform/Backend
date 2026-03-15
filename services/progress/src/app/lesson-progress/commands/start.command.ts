import { ICommandHandler, LessonNotFoundException } from '@/app/common';
import { LessonProgressDto } from '../dtos';
import {
	ILessonProgressRepository,
	LessonId,
	LessonProgress,
	LessonProgressId,
} from '@/domain/lesson-progress';
import { IEventBus, ILearningPathsService } from '@/app/common/interfaces';
import { UserId, UUID } from '@/domain/common';
import { UnitId } from '@/domain/unit-progress';
import { IUnitProgressReadRepository } from '@/app/unit-progress/interfaces';
import { UnitNotStartedException } from '../exceptions';

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
		private readonly unitProgressReadRepository: IUnitProgressReadRepository,
		private readonly learningPathsService: ILearningPathsService,
		private readonly eventBus: IEventBus,
	) {}

	async execute(command: StartLessonCommand): Promise<LessonProgressDto> {
		// TODO: check if user exists

		const lesson = await this.learningPathsService.findLessonById(
			command.lessonId,
		);

		if (!lesson) {
			throw new LessonNotFoundException(command.lessonId);
		}

		const unitProgressDto = await this.unitProgressReadRepository.findForUser(
			lesson.unitId,
			command.userId,
		);

		if (!unitProgressDto) {
			throw new UnitNotStartedException(lesson.unitId, command.userId);
		}
		// TODO: check if previous lesson has been completed

		const id = LessonProgressId.create(UUID.create(lesson.id));
		const lessonProgress = LessonProgress.create(id, {
			lessonId: LessonId.create(UUID.create(command.lessonId)),
			userId: UserId.create(UUID.create(command.userId)),
			totalActivityCount: lesson.activityCount,
			unitId: UnitId.create(UUID.create(lesson.unitId)),
		});

		await this.lessonProgressRepository.save(lessonProgress);

		const events = lessonProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			id: lessonProgress.id.toString(),
			completedAt: lessonProgress.completedAt,
			lessonId: lessonProgress.lessonId.toString(),
			unitId: lessonProgress.unitId.toString(),
			userId: lessonProgress.userId.toString(),
			totalActivityCount: lessonProgress.totalActivityCount,
			completedActivityCount: lessonProgress.completedActivityCount,
		};
	}
}
