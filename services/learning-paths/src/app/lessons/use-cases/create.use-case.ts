import type { CreateLessonCommand } from '@/app/lessons/commands';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { IUnitsRepository } from '@/app/units/interfaces';
import type { Lesson } from '@/domain/lessons/entities';
import { UnitNotFoundException } from '@/domain/units/exceptions';

/**
 * @description This class responsibility is to create a lesson. It uses lessons repository for saving lessons to a data source. lessonsRepository in injected to this class via dependency injection and dependency inversion techniques by using ILessonsRepository interface.
 */
export class CreateLessonUseCase {
	constructor(
		private readonly lessonsRepository: ILessonsRepository,
		private readonly unitsRepository: IUnitsRepository,
	) {}

	/**
	 * @param command object with data for lesson creation
	 * @returns created lesson
	 * @description this function saves lesson to a data source and returns it
	 * @throws {SectionNotFoundException}
	 */
	async execute(command: CreateLessonCommand): Promise<Lesson> {
		const unit = await this.unitsRepository.findOne({
			where: { id: command.unitId },
		});

		if (!unit) {
			throw new UnitNotFoundException(command.unitId);
		}

		const createdLesson = await this.lessonsRepository.create(command);

		return createdLesson;
	}
}
