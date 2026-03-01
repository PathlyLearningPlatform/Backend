import { InvalidReferenceException } from '@pathly-backend/core/index.js';
import type { ILessonsRepository } from '@domain/lessons/interfaces';
import {
	LessonCannotBeRemovedException,
	LessonNotFoundException,
} from '@/domain/lessons/exceptions';
import { IUnitsRepository } from '@/domain/units/interfaces';
import { Unit } from '@/domain/units/entities';

export class RemoveLessonUseCase {
	constructor(
		private readonly lessonsRepository: ILessonsRepository,
		private readonly unitsRepository: IUnitsRepository,
	) {}

	async execute(id: string): Promise<void> {
		try {
			const lesson = await this.lessonsRepository.remove(id);

			if (!lesson) {
				throw new LessonNotFoundException(id);
			}

			// unit will never be null, because lesson cannot be created with unitId that doesnt exist
			const unit = (await this.unitsRepository.findOne(lesson.unitId)) as Unit;

			unit.update({ lessonCount: unit.lessonCount - 1 });

			await this.unitsRepository.save(unit);
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new LessonCannotBeRemovedException(id);
			}

			throw err;
		}
	}
}
