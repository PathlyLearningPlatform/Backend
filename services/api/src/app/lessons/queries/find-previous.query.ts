import { IQueryHandler, LessonNotFoundException } from '@/app/common';
import { LessonDto } from '../dtos';
import { ILessonRepository, LessonId } from '@/domain/lessons';
import { Order } from '@/domain/common';
import { aggregateToDto } from '../helpers';

export type FindPreviousLessonQuery = {
	id: string;
};

export class FindPreviousLessonHandler
	implements IQueryHandler<FindPreviousLessonQuery, LessonDto>
{
	constructor(private readonly lessonRepository: ILessonRepository) {}

	async execute(command: FindPreviousLessonQuery): Promise<LessonDto> {
		const id = LessonId.create(command.id);
		const lesson = await this.lessonRepository.findById(id);

		if (!lesson) {
			throw new LessonNotFoundException(command.id);
		}

		const previousOrder = Order.create(lesson.order.value - 1);
		const previous = await this.lessonRepository.findByUnitIdAndOrder(
			lesson.unitId,
			previousOrder,
		);

		if (!previous) {
			throw new LessonNotFoundException('');
		}

		return aggregateToDto(previous);
	}
}
