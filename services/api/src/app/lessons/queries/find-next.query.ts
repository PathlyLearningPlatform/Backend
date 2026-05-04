import { IQueryHandler, LessonNotFoundException } from '@/app/common';
import { LessonDto } from '../dtos';
import { ILessonRepository, LessonId } from '@/domain/lessons';
import { Order } from '@/domain/common';
import { aggregateToDto } from '../helpers';

export type FindNextLessonQuery = {
	id: string;
};

export class FindNextLessonHandler
	implements IQueryHandler<FindNextLessonQuery, LessonDto>
{
	constructor(private readonly lessonRepository: ILessonRepository) {}

	async execute(command: FindNextLessonQuery): Promise<LessonDto> {
		const id = LessonId.create(command.id);
		const lesson = await this.lessonRepository.findById(id);

		if (!lesson) {
			throw new LessonNotFoundException(command.id);
		}

		const nextOrder = Order.create(lesson.order.value + 1);
		const next = await this.lessonRepository.findByUnitIdAndOrder(
			lesson.unitId,
			nextOrder,
		);

		if (!next) {
			throw new LessonNotFoundException('');
		}

		return aggregateToDto(next);
	}
}
