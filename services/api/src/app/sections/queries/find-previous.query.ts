import { IQueryHandler, SectionNotFoundException } from '@/app/common';
import { SectionDto } from '../dtos';
import { ISectionRepository, SectionId } from '@/domain/sections';
import { Order } from '@/domain/common';
import { aggregateToDto } from '../helpers';

export type FindPreviousSectionQuery = {
	id: string;
};

export class FindPreviousSectionHandler
	implements IQueryHandler<FindPreviousSectionQuery, SectionDto>
{
	constructor(private readonly sectionRepository: ISectionRepository) {}

	async execute(command: FindPreviousSectionQuery): Promise<SectionDto> {
		const id = SectionId.create(command.id);
		const section = await this.sectionRepository.findById(id);

		if (!section) {
			throw new SectionNotFoundException(command.id);
		}

		const previousOrder = Order.create(section.order.value - 1);
		const previous = await this.sectionRepository.findByLearningPathIdAndOrder(
			section.learningPathId,
			previousOrder,
		);

		if (!previous) {
			throw new SectionNotFoundException('');
		}

		return aggregateToDto(previous);
	}
}
