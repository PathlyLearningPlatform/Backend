import { randomUUID } from 'crypto';
import type { CreateLessonCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@domain/lessons/interfaces';
import type { IUnitsRepository } from '@/domain/units/interfaces';
import { Lesson } from '@/domain/lessons/entities';
import { UnitNotFoundException } from '@/domain/units/exceptions';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';
import { LessonOrderException } from '@/domain/lessons/exceptions';

export class CreateLessonUseCase {
	constructor(
		private readonly lessonsRepository: ILessonsRepository,
		private readonly unitsRepository: IUnitsRepository,
	) {}

	async execute(command: CreateLessonCommand): Promise<Lesson> {
		try {
			const unit = await this.unitsRepository.findOne(command.unitId);
			if (!unit) {
				throw new UnitNotFoundException(command.unitId);
			}

			const lesson = new Lesson({
				id: randomUUID(),
				unitId: unit.id,
				createdAt: new Date(),
				updatedAt: new Date(),
				description: command.description ?? null,
				name: command.name,
				order: command.order,
			});

			await this.lessonsRepository.save(lesson);

			unit.update({
				lessonCount: unit.lessonCount + 1,
			});

			await this.unitsRepository.save(unit);

			return lesson;
		} catch (err) {
			if (err instanceof UniqueConstraintException) {
				const uniqueOrderViolation =
					err.fields.includes('order') && err.fields.includes('unitId');
				if (uniqueOrderViolation) {
					throw new LessonOrderException();
				}
			}
			throw err;
		}
	}
}
