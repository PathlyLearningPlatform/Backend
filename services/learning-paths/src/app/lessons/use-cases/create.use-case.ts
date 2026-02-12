import { randomUUID } from 'crypto';
import type { CreateLessonCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@domain/lessons/interfaces';
import type { IUnitsRepository } from '@/domain/units/interfaces';
import { Lesson } from '@/domain/lessons/entities';
import { UnitNotFoundException } from '@/domain/units/exceptions';

export class CreateLessonUseCase {
	constructor(
		private readonly lessonsRepository: ILessonsRepository,
		private readonly unitsRepository: IUnitsRepository,
	) {}

	async execute(command: CreateLessonCommand): Promise<Lesson> {
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

		this.lessonsRepository.save(lesson);

		return lesson;
	}
}
