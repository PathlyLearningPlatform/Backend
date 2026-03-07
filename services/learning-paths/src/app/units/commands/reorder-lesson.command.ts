import {
	ICommandHandler,
	UnitNotFoundException,
	LessonNotFoundException,
} from '@/app/common';
import { IUnitRepository } from '@/domain/units/interfaces';
import { ILessonRepository } from '@/domain/lessons/interfaces';
import { LessonId } from '@/domain/lessons/value-objects/id.vo';
import { Order } from '@/domain/common';

type ReorderLessonCommand = {
	lessonId: string;
	order: number;
};

export class ReorderLessonHandler
	implements ICommandHandler<ReorderLessonCommand, void>
{
	constructor(
		private readonly unitRepository: IUnitRepository,
		private readonly lessonRepository: ILessonRepository,
	) {}

	async execute(command: ReorderLessonCommand): Promise<void> {
		const lessonId = LessonId.create(command.lessonId);
		const lesson = await this.lessonRepository.load(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(command.lessonId);
		}

		const unit = await this.unitRepository.load(lesson.unitId);

		// never going to happen
		// only for type safety
		if (!unit) {
			throw new UnitNotFoundException(lesson.unitId.value);
		}

		const order = Order.create(command.order);
		const newOrder = unit.reorderLesson(lessonId, order);

		// never going to happen
		// only for type safety
		if (!newOrder) {
			throw new LessonNotFoundException(lesson.id.value);
		}

		lesson.update(new Date(), { order: newOrder });
		unit.update(new Date());

		await this.lessonRepository.save(lesson);
		await this.unitRepository.save(unit);
	}
}
