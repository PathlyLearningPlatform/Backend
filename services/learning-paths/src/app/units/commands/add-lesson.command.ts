import { ICommandHandler, UnitNotFoundException } from '@/app/common';
import { IUnitRepository } from '@/domain/units/interfaces';
import { ILessonRepository } from '@/domain/lessons/interfaces';
import { UnitId } from '@/domain/units/value-objects/id.vo';
import { Lesson } from '@/domain/lessons/lesson.aggregate';
import { LessonId } from '@/domain/lessons/value-objects/id.vo';
import { LessonDescription, LessonName } from '@/domain/lessons/value-objects';
import { randomUUID } from 'node:crypto';
import { LessonDto } from '@/app/lessons/dtos';

type AddLessonCommand = {
	unitId: string;
	name: string;
	description?: string | null;
};
type AddLessonResult = LessonDto;

export class AddLessonHandler
	implements ICommandHandler<AddLessonCommand, AddLessonResult>
{
	constructor(
		private readonly unitRepository: IUnitRepository,
		private readonly lessonRepository: ILessonRepository,
	) {}

	async execute(command: AddLessonCommand): Promise<AddLessonResult> {
		const unitId = UnitId.create(command.unitId);
		const unit = await this.unitRepository.load(unitId);

		if (!unit) {
			throw new UnitNotFoundException(unitId.value);
		}

		const lessonId = LessonId.create(randomUUID());
		const lessonRef = unit.addLesson(lessonId);
		const lessonName = LessonName.create(command.name);
		const lessonDescription =
			command.description != null
				? LessonDescription.create(command.description)
				: null;

		const lesson = Lesson.create(lessonRef.lessonId, {
			createdAt: new Date(),
			unitId: unitId,
			name: lessonName,
			description: lessonDescription,
			order: lessonRef.order,
		});

		unit.update(new Date());

		await this.lessonRepository.save(lesson);
		await this.unitRepository.save(unit);

		return {
			id: lesson.id.value,
			unitId: lesson.unitId.value,
			name: lesson.name.value,
			description: lesson.description?.value ?? null,
			createdAt: lesson.createdAt,
			updatedAt: lesson.updatedAt ?? null,
			order: lesson.order.value,
			activityCount: lesson.activityCount,
		};
	}
}
