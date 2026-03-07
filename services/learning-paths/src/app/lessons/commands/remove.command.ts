import {
	ICommandHandler,
	UnitNotFoundException,
	LessonNotFoundException,
} from '@/app/common';
import { IUnitRepository } from '@/domain/units/interfaces';
import { ILessonRepository } from '@/domain/lessons/interfaces';
import { LessonId } from '@/domain/lessons/value-objects/id.vo';

type RemoveLessonCommand = {
	lessonId: string;
};

export class RemoveLessonHandler
	implements ICommandHandler<RemoveLessonCommand, void>
{
	constructor(
		private readonly unitRepository: IUnitRepository,
		private readonly lessonRepository: ILessonRepository,
	) {}

	async execute(command: RemoveLessonCommand): Promise<void> {
		const lessonId = LessonId.create(command.lessonId);
		const lesson = await this.lessonRepository.load(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(lessonId.value);
		}

		const unit = await this.unitRepository.load(lesson.unitId);

		// never going to happen
		// only for type safety
		if (!unit) {
			throw new UnitNotFoundException(lesson.unitId.value);
		}

		lesson.ensureCanRemove();
		unit.removeLesson(lessonId);

		await this.lessonRepository.remove(lessonId);
		await this.unitRepository.save(unit);
	}
}
